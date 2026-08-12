import { z } from 'zod';

export const createChallanSchema = z.object({
  customerId: z.string().uuid('Invalid Customer ID'),
  items: z.array(z.object({
    productId: z.string().uuid('Invalid Product ID'),
    quantity: z.number().int().positive('Quantity must be greater than zero')
  })).min(1, 'At least one product item is required')
});