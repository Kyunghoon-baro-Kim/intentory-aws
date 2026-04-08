#!/bin/bash
set -e

echo "=== Inventrix AWS Deployment Script ==="
echo ""

# Get current public IP
echo "Detecting your public IP..."
MY_IP=$(curl -s https://checkip.amazonaws.com)
if [ -z "$MY_IP" ]; then
  echo "ERROR: Failed to detect public IP"
  exit 1
fi
echo "Your public IP: $MY_IP"
echo ""

# List available AWS profiles
echo "Available AWS Profiles:"
PROFILES=($(aws configure list-profiles 2>/dev/null))
if [[ ${#PROFILES[@]} -eq 0 ]]; then
  echo "No AWS profiles found. Using 'default'."
  AWS_PROFILE="default"
else
  for i in "${!PROFILES[@]}"; do
    echo "$((i+1)). ${PROFILES[$i]}"
  done
  echo ""
  read -p "Select profile number or enter profile name [default]: " PROFILE_INPUT
  
  if [[ "$PROFILE_INPUT" =~ ^[0-9]+$ ]]; then
    idx=$((PROFILE_INPUT-1))
    if [[ $idx -ge 0 && $idx -lt ${#PROFILES[@]} ]]; then
      AWS_PROFILE="${PROFILES[$idx]}"
    else
      echo "Invalid selection. Using 'default'."
      AWS_PROFILE="default"
    fi
  else
    AWS_PROFILE="${PROFILE_INPUT:-default}"
  fi
fi
echo "Selected profile: $AWS_PROFILE"
echo ""

read -p "AWS Region [ap-northeast-2]: " AWS_REGION
AWS_REGION="${AWS_REGION:-ap-northeast-2}"

AWS_OPTS="--profile $AWS_PROFILE --region $AWS_REGION"

read -p "Instance Type [t3.small]: " INSTANCE_TYPE
INSTANCE_TYPE="${INSTANCE_TYPE:-t3.small}"

read -p "Key Pair Name [inventrix-key]: " KEY_NAME
KEY_NAME="${KEY_NAME:-inventrix-key}"

read -p "Security Group Name [inventrix-sg]: " SECURITY_GROUP_NAME
SECURITY_GROUP_NAME="${SECURITY_GROUP_NAME:-inventrix-sg}"

read -p "Instance Name [inventrix-server]: " INSTANCE_NAME
INSTANCE_NAME="${INSTANCE_NAME:-inventrix-server}"

AMI_ID="resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"

# Display configuration
echo ""
echo "=== Deployment Configuration ==="
echo "AWS Profile:         $AWS_PROFILE"
echo "AWS Region:          $AWS_REGION"
echo "Instance Type:       $INSTANCE_TYPE"
echo "Key Pair Name:       $KEY_NAME"
echo "Security Group:      $SECURITY_GROUP_NAME"
echo "Instance Name:       $INSTANCE_NAME"
echo "AMI:                 Amazon Linux 2023 (latest)"
echo "SSH Access:          $MY_IP/32 only"
echo ""

# Confirm
read -p "Proceed with deployment? (yes/no): " CONFIRM
if [[ "$CONFIRM" != "yes" ]]; then
  echo "Deployment cancelled."
  exit 0
fi

echo ""

# Create security group
echo "Creating security group..."
if aws ec2 describe-security-groups $AWS_OPTS --group-names $SECURITY_GROUP_NAME &>/dev/null; then
  SG_ID=$(aws ec2 describe-security-groups $AWS_OPTS --group-names $SECURITY_GROUP_NAME --query 'SecurityGroups[0].GroupId' --output text)
  echo "Using existing security group: $SG_ID"
else
  SG_ID=$(aws ec2 create-security-group $AWS_OPTS \
    --group-name $SECURITY_GROUP_NAME \
    --description "Security group for Inventrix application" \
    --query 'GroupId' --output text)
  echo "Created security group: $SG_ID"
fi

# Add security group rules (only SSH, HTTP, HTTPS needed)
echo "Configuring security group rules..."
aws ec2 authorize-security-group-ingress $AWS_OPTS --group-id $SG_ID --protocol tcp --port 22 --cidr ${MY_IP}/32 &>/dev/null || true
aws ec2 authorize-security-group-ingress $AWS_OPTS --group-id $SG_ID --protocol tcp --port 80 --cidr ${MY_IP}/32 &>/dev/null || true
aws ec2 authorize-security-group-ingress $AWS_OPTS --group-id $SG_ID --protocol tcp --port 443 --cidr ${MY_IP}/32 &>/dev/null || true
echo "Security group rules configured."

# Create key pair if it doesn't exist
if aws ec2 describe-key-pairs $AWS_OPTS --key-names $KEY_NAME &>/dev/null; then
  if [ ! -f "${KEY_NAME}.pem" ]; then
    echo "ERROR: Key pair '$KEY_NAME' exists in AWS but ${KEY_NAME}.pem not found locally."
    echo "Please provide the key file or delete the key pair in AWS and re-run."
    exit 1
  fi
  echo "Using existing key pair: $KEY_NAME"
else
  echo "Creating key pair..."
  aws ec2 create-key-pair $AWS_OPTS --key-name $KEY_NAME --query 'KeyMaterial' --output text > ${KEY_NAME}.pem
  chmod 400 ${KEY_NAME}.pem
  echo "Key pair saved to ${KEY_NAME}.pem"
fi

# User data script — install Node.js 22, pnpm, pm2, nginx, PostgreSQL 16
USER_DATA=$(cat <<'EOF'
#!/bin/bash
set -e

# Install Node.js 22 from NodeSource
curl -fsSL https://rpm.nodesource.com/setup_22.x | bash -
yum install -y nodejs gcc gcc-c++ make git nginx

# Install pnpm and pm2
npm install -g pnpm pm2

# Install PostgreSQL 16
dnf install -y postgresql16-server postgresql16
postgresql-setup --initdb
systemctl enable postgresql
systemctl start postgresql

# Configure PostgreSQL: create inventrix DB and user
sudo -u postgres psql -c "CREATE USER inventrix WITH PASSWORD 'inventrix_prod';"
sudo -u postgres psql -c "CREATE DATABASE inventrix OWNER inventrix;"
sudo -u postgres psql -c "ALTER USER inventrix CREATEDB;"

# Allow local password auth
sed -i 's/ident$/md5/g' /var/lib/pgsql/data/pg_hba.conf
sed -i 's/peer$/md5/g' /var/lib/pgsql/data/pg_hba.conf
systemctl restart postgresql

systemctl enable nginx
EOF
)

# Launch EC2 instance
echo "Launching EC2 instance..."
INSTANCE_ID=$(aws ec2 run-instances $AWS_OPTS \
  --image-id $AMI_ID \
  --instance-type $INSTANCE_TYPE \
  --key-name $KEY_NAME \
  --security-group-ids $SG_ID \
  --user-data "$USER_DATA" \
  --metadata-options HttpTokens=required,HttpPutResponseHopLimit=1 \
  --block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"Encrypted":true}}]' \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME}]" \
  --query 'Instances[0].InstanceId' --output text)

echo "Instance ID: $INSTANCE_ID"
echo "Waiting for instance to be running..."
aws ec2 wait instance-running $AWS_OPTS --instance-ids $INSTANCE_ID

# Get public IP
PUBLIC_IP=$(aws ec2 describe-instances $AWS_OPTS --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
echo "Instance Public IP: $PUBLIC_IP"

echo "Waiting for instance initialization (this may take 2-3 minutes)..."
for i in {1..30}; do
  if ssh -i ${KEY_NAME}.pem -o StrictHostKeyChecking=no -o ConnectTimeout=10 ec2-user@$PUBLIC_IP "command -v pnpm >/dev/null 2>&1 && command -v pm2 >/dev/null 2>&1 && systemctl is-active postgresql >/dev/null 2>&1" 2>/dev/null; then
    echo "Instance ready!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "ERROR: Instance initialization timed out. Check user-data logs with:"
    echo "  ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP 'sudo cat /var/log/cloud-init-output.log'"
    exit 1
  fi
  echo "Still initializing... ($i/30)"
  sleep 20
done

# Upload application code
echo "Uploading application code..."
cd "$(dirname "$0")"
tar czf /tmp/inventrix.tar.gz --exclude=node_modules --exclude=dist --exclude=.git --exclude='*.pem' --exclude=inventrix.db .
scp -i ${KEY_NAME}.pem -o StrictHostKeyChecking=no /tmp/inventrix.tar.gz ec2-user@$PUBLIC_IP:~/
rm /tmp/inventrix.tar.gz

# Deploy application
echo "Deploying application..."
ssh -i ${KEY_NAME}.pem -o StrictHostKeyChecking=no ec2-user@$PUBLIC_IP << 'ENDSSH'
set -e
cd ~
tar xzf inventrix.tar.gz
rm inventrix.tar.gz

# Set production environment
cat > packages/api/.env << 'ENVFILE'
DATABASE_URL="postgresql://inventrix:inventrix_prod@localhost:5432/inventrix"
JWT_SECRET="$(openssl rand -base64 32)"
PORT=3000
ENVFILE

# Install dependencies and generate Prisma client
pnpm install
cd packages/api
npx prisma generate
npx prisma migrate deploy 2>/dev/null || npx prisma db push --accept-data-loss
npx ts-node prisma/seed.ts
cd ~

# Build
pnpm build

# Start API with PM2
cd packages/api
pm2 start dist/main.js --name inventrix-api --env production
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user | tail -1 | bash 2>/dev/null || true
ENDSSH

# Configure nginx with HTTPS
echo "Configuring nginx..."
ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP << 'ENDSSH'
chmod 711 /home/ec2-user
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/inventrix.key \
  -out /etc/nginx/ssl/inventrix.crt \
  -subj "/C=US/ST=State/L=City/O=Inventrix/CN=inventrix"
sudo tee /etc/nginx/conf.d/inventrix.conf > /dev/null <<'NGINX'
server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;
    server_name _;
    ssl_certificate /etc/nginx/ssl/inventrix.crt;
    ssl_certificate_key /etc/nginx/ssl/inventrix.key;
    location / {
        root /home/ec2-user/packages/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location /images {
        proxy_pass http://localhost:3000;
    }
}
NGINX
sudo systemctl restart nginx
ENDSSH

# Save deployment info
cat > setup_info.txt <<SETUP_INFO
AWS_PROFILE=$AWS_PROFILE
AWS_REGION=$AWS_REGION
INSTANCE_ID=$INSTANCE_ID
KEY_NAME=$KEY_NAME
SECURITY_GROUP_NAME=$SECURITY_GROUP_NAME
SECURITY_GROUP_ID=$SG_ID
SETUP_INFO

echo ""
echo "=== Deployment Complete ==="
echo "Instance ID: $INSTANCE_ID"
echo "Public IP: $PUBLIC_IP"
echo "Application URL: https://$PUBLIC_IP (self-signed certificate)"
echo "SSH Command: ssh -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP"
echo ""
echo "Note: Your browser will show a security warning due to the self-signed certificate."
echo ""
echo "Default credentials:"
echo "  Admin: admin@inventrix.com / admin123"
echo "  Customer: customer@inventrix.com / customer123"
echo "  Influencer: influencer@inventrix.com / influencer123"
echo ""
echo "Deployment info saved to setup_info.txt"
