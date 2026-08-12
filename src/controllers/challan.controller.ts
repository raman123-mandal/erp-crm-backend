import { Request, Response, NextFunction } from 'express';
import { ChallanService } from '../services/challan.service';
import { prisma } from '../utils/prisma';

export const createChallan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId, items } = req.body;
    const userId = req.user!.id;
    const challan = await ChallanService.createDraftChallan(userId, customerId, items);
    res.status(201).json({ success: true, data: challan });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getChallans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [challans, total] = await Promise.all([
      prisma.challan.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { name: true, businessName: true } }, user: { select: { name: true } } }
      }),
      prisma.challan.count()
    ]);

    res.json({
      success: true,
      data: challans,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const getChallanById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const challan = await prisma.challan.findUnique({
      where: { id: req.params.id },
      include: { customer: true, items: true, user: { select: { name: true, email: true } } }
    });
    if (!challan) return res.status(404).json({ success: false, message: 'Challan not found' });
    res.json({ success: true, data: challan });
  } catch (error) {
    next(error);
  }
};

export const confirmChallan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const confirmedChallan = await ChallanService.confirmChallan(id, userId);
    res.json({ success: true, message: 'Challan confirmed successfully', data: confirmedChallan });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const cancelChallan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const challan = await prisma.challan.findUnique({ where: { id } });
    if (!challan) return res.status(404).json({ success: false, message: 'Challan not found' });
    if (challan.status === 'CONFIRMED') {
      return res.status(400).json({ success: false, message: 'Confirmed challans cannot be cancelled' });
    }

    const updated = await prisma.challan.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};