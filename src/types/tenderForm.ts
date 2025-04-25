
import { z } from 'zod';
import { TenderCategory } from './tender';

export const tenderFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  category: z.string() as z.ZodType<TenderCategory>,
  budget: z.coerce.number().positive({ message: "Budget must be a positive number" }),
  deadline: z.date().min(new Date(), { message: "Deadline must be in the future" }),
  status: z.enum(['draft', 'published', 'under_evaluation', 'awarded', 'closed']).default('draft')
});

export type TenderFormValues = z.infer<typeof tenderFormSchema>;
