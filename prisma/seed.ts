// Seed script placeholder
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.challanItem.deleteMany();
  await prisma.challan.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.create({
    data: { name: 'System Admin', email: 'admin@example.com', password: hashedPassword, role: 'ADMIN' }
  });
  const sales = await prisma.user.create({
    data: { name: 'Sales Executive', email: 'sales@example.com', password: hashedPassword, role: 'SALES' }
  });
  await prisma.user.create({
    data: { name: 'Warehouse Mgr', email: 'warehouse@example.com', password: hashedPassword, role: 'WAREHOUSE' }
  });
  await prisma.user.create({
    data: { name: 'Accounts Head', email: 'accounts@example.com', password: hashedPassword, role: 'ACCOUNTS' }
  });

  const c1 = await prisma.customer.create({
    data: {
      name: 'Rajesh Kumar',
      businessName: 'Apex Electronics Traders',
      mobile: '9876543210',
      email: 'apex@example.com',
      gstNumber: '24AAACA12341ZV',
      customerType: 'WHOLESALE',
      address: 'GIDC Phase 2, Industrial Area, Vadodara',
      status: 'ACTIVE'
    }
  });

  const c2 = await prisma.customer.create({
    data: {
      name: 'Amit Patel',
      businessName: 'Patel General Retail',
      mobile: '9123456789',
      customerType: 'RETAIL',
      address: 'Main Market Road, Anand',
      status: 'LEAD'
    }
  });

  const p1 = await prisma.product.create({
    data: {
      name: 'Industrial Cables 100m',
      sku: 'CAB-100M',
      category: 'Electrical',
      unitPrice: 1500,
      currentStock: 50,
      minimumStock: 10,
      warehouseLocation: 'Rack A-01'
    }
  });

  const p2 = await prisma.product.create({
    data: {
      name: 'Circuit Breaker 32A',
      sku: 'CB-32A',
      category: 'Electrical',
      unitPrice: 450,
      currentStock: 4,
      minimumStock: 15,
      warehouseLocation: 'Rack B-03'
    }
  });

  await prisma.stockMovement.create({
    data: {
      productId: p1.id,
      quantity: 50,
      movementType: 'IN',
      reason: 'Initial Vendor Supply',
      createdBy: admin.id
    }
  });

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });