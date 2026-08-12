import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name required'),
  sku: z.string().min(2, 'SKU required'),
  category: z.string().min(2, 'Category required'),
  unitPrice: z.number().positive('Unit price must be positive'),
  currentStock: z.number().int().nonnegative('Stock cannot be negative').default(0),
  minimumStock: z.number().int().nonnegative().default(5),
  warehouseLocation: z.string().min(1, 'Location required')
});

export const stockAdjustmentSchema = z.object({
  quantity: z.number().int().positive('Quantity must be greater than zero'),
  movementType: z.enum(['IN', 'OUT']),
  reason: z.string().min(3, 'Reason required')
});