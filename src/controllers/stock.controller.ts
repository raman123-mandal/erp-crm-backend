import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

export const adjustStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { quantity, movementType, reason } = req.body;
    const userId = req.user!.id;

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id } });
      if (!product) throw new Error('Product not found');

      if (movementType === 'OUT' && product.currentStock < quantity) {
        throw new Error(`Insufficient stock. Current stock: ${product.currentStock}`);
      }

      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          currentStock: movementType === 'IN' 
            ? { increment: quantity } 
            : { decrement: quantity }
        }
      });

      const movement = await tx.stockMovement.create({
        data: {
          productId: id,
          quantity,
          movementType,
          reason,
          createdBy: userId
        }
      });

      return { product: updatedProduct, movement };
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Stock adjustment failed' });
  }
};

export const getStockMovements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    const skip = (page - 1) * limit;

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { name: true, sku: true } }, user: { select: { name: true } } }
      }),
      prisma.stockMovement.count()
    ]);

    res.json({
      success: true,
      data: movements,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};