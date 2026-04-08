import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);
  const influencerPassword = await bcrypt.hash('influencer123', 10);

  await prisma.user.upsert({ where: { email: 'admin@inventrix.com' }, update: {}, create: { email: 'admin@inventrix.com', password: adminPassword, name: 'Admin User', role: 'admin_a' } });
  await prisma.user.upsert({ where: { email: 'ops@inventrix.com' }, update: {}, create: { email: 'ops@inventrix.com', password: adminPassword, name: 'Ops Admin', role: 'admin_b' } });
  await prisma.user.upsert({ where: { email: 'customer@inventrix.com' }, update: {}, create: { email: 'customer@inventrix.com', password: customerPassword, name: 'Customer User', role: 'customer' } });
  await prisma.user.upsert({ where: { email: 'influencer@inventrix.com' }, update: {}, create: { email: 'influencer@inventrix.com', password: influencerPassword, name: 'Influencer User', role: 'influencer' } });

  const products = [
    { name: 'Laptop Pro 15"', description: 'High-performance laptop with 16GB RAM', price: 1299.99, stock: 25, imageUrl: '/images/laptop.png' },
    { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 29.99, stock: 150, imageUrl: '/images/wireless-mouse.png' },
    { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard', price: 89.99, stock: 75, imageUrl: '/images/mechanical-keyboard.png' },
    { name: 'USB-C Hub', description: '7-in-1 USB-C hub', price: 49.99, stock: 100, imageUrl: '/images/usb-hub.png' },
    { name: 'Monitor 27" 4K', description: 'Ultra HD 4K monitor', price: 449.99, stock: 40, imageUrl: '/images/monitor.png' },
    { name: 'Headphones Wireless', description: 'Noise-cancelling wireless headphones', price: 199.99, stock: 85, imageUrl: '/images/headphones.png' },
  ];

  for (const p of products) {
    await prisma.product.upsert({ where: { id: products.indexOf(p) + 1 }, update: {}, create: p });
  }

  // Create influencer profile
  const influencer = await prisma.user.findUnique({ where: { email: 'influencer@inventrix.com' } });
  if (influencer) {
    await prisma.influencerProfile.upsert({
      where: { userId: influencer.id },
      update: {},
      create: { userId: influencer.id, channelUrl: 'https://youtube.com/@inventrix-influencer', subscribers: 50000, category: 'tech', bio: 'Tech product reviewer' },
    });
  }

  console.log('Seed completed');
}

main().catch(console.error).finally(() => prisma.$disconnect());
