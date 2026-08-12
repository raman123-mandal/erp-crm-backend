import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    if (data.followUpDate) data.followUpDate = new Date(data.followUpDate);
    const customer = await prisma.customer.create({ data });
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { businessName: { contains: search, mode: 'insensitive' as const } },
        { mobile: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.customer.count({ where })
    ]);

    res.json({
      success: true,
      data: customers,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: { challans: { take: 5, orderBy: { createdAt: 'desc' } } }
    });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    if (data.followUpDate) data.followUpDate = new Date(data.followUpDate);
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data
    });
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.customer.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    next(error);
  }
};