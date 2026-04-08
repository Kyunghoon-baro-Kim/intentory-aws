# Build Instructions

## Prerequisites
- **Node.js**: v22+
- **pnpm**: v10+
- **Docker**: PostgreSQL 14 컨테이너
- **Prisma CLI**: 5.20.0

## Environment Variables

```bash
# packages/api/.env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/inventrix"
JWT_SECRET="<your-secret>"
```

## Build Steps

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Database
```bash
# PostgreSQL 컨테이너 실행
docker run -d --name inventrix-db \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=inventrix \
  -p 5432:5432 postgres:14-alpine

# 스키마 적용 (SQL 직접 실행 — Prisma db push P1010 이슈 우회)
cd packages/api
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > /tmp/init.sql
docker cp /tmp/init.sql inventrix-db:/tmp/init.sql
docker exec inventrix-db psql -U postgres -d inventrix -f /tmp/init.sql
```

### 3. Generate Prisma Client
```bash
cd packages/api
npx prisma generate
```

### 4. Build API
```bash
pnpm --filter api run build
```

### 5. Verify Build
- **Expected**: `nest build` 성공, 에러 0개
- **Build Artifacts**: `packages/api/dist/`
- **Known Warning**: Vite CJS deprecation warning (무시 가능)

## Troubleshooting

### Prisma P1010 에러
- **원인**: Prisma schema-engine의 PostgreSQL 연결 권한 이슈
- **해결**: `prisma db push` 대신 SQL 직접 실행 (위 Step 2 참조)

### DTO TS2564 에러
- **원인**: class-validator DTO 프로퍼티에 `!` (definite assignment) 누락
- **해결**: 모든 required DTO 프로퍼티에 `!` 추가
