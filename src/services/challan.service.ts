import { prisma } from '../utils/prisma';

export class ChallanService {
  private static async generateChallanNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.challan.count();
    const sequence = (count + 1).toString().padStart(4, '0');
    return `CH-${year}-${sequence}`;
  }

  static async createDraftChallan(userId: string, customerId: string, items: Array<{ productId: string; quantity: number }>) {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new Error('Customer not found');

    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    if (products.length !== productIds.length) {
      throw new Error('One or more selected products were not found');
    }

    const productMap = new Map(products.map(p => [p.id, p]));
    const challanNumber = await this.generateChallanNumber();
    let totalQuantity = 0;

    const challanItemsData = items.map(item => {
      const prod = productMap.get(item.productId)!;
      totalQuantity += item.quantity;
      return {
        productId: prod.id,
        productNameSnapshot: prod.name,
        skuSnapshot: prod.sku,
        unitPriceSnapshot: prod.unitPrice,
        quantity: item.quantity
      };
    });

    return await prisma.challan.create({
      data: {
        challanNumber,
        customerId,
        createdBy: userId,
        status: 'DRAFT',
        totalQuantity,
        items: {
          create: challanItemsData
        }
      },
      include: {
        customer: true,
        items: true
      }
    });
  }

  static async confirmChallan(challanId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const challan = await tx.challan.findUnique({
        where: { id: challanId },
        include: { items: true }
      });

      if (!challan) throw new Error('Challan not found');
      if (challan.status === 'CONFIRMED') throw new Error('Challan is already confirmed');
      if (challan.status === 'CANCELLED') throw new Error('Cancelled challan cannot be confirmed');

      for (const item of challan.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) {
          throw new Error(`Product ${item.productNameSnapshot} no longer exists`);
        }
        if (product.currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Required: ${item.quantity}, Available: ${product.currentStock}`);
        }
      }

      for (const item of challan.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { currentStock: { decrement: item.quantity } }
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            movementType: 'OUT',
            reason: `Sales Challan Confirmation #${challan.challanNumber}`,
            createdBy: userId
          }
        });
      }

      return await tx.challan.update({
        where: { id: challanId },
        data: { status: 'CONFIRMED' },
        include: { items: true, customer: true }
      });
    });
  }
}