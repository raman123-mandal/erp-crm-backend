import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

export const getDashboardMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalCustomers, totalProducts, rawLowStock, totalChallans, confirmedChallans, recentMovements] = await Promise.all([
      prisma.customer.count(),
      prisma.product.count(),
      prisma.product.findMany({ select: { currentStock: true, minimumStock: true } }),
      prisma.challan.count(),
      prisma.challan.count({ where: { status: 'CONFIRMED' } }),
      prisma.stockMovement.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { name: true } } }
      })
    ]);

    const lowStockProducts = rawLowStock.filter(p => p.currentStock <= p.minimumStock).length;

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalProducts,
        lowStockProducts,
        totalChallans,
        confirmedChallans,
        recentMovements
      }
    });
  } catch (error) {
    next(error);
  }
};