import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  mobile: z.string().min(10, 'Valid mobile number required'),
  email: z.string().email().optional().or(z.literal('')),
  businessName: z.string().min(2, 'Business name is required'),
  gstNumber: z.string().optional().or(z.literal('')),
  customerType: z.enum(['RETAIL', 'WHOLESALE', 'DISTRIBUTOR']),
  address: z.string().min(5, 'Address is required'),
  status: z.enum(['LEAD', 'ACTIVE', 'INACTIVE']).optional(),
  followUpDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export const updateCustomerSchema = createCustomerSchema.partial();