import { z } from 'zod'
import { CATEGORIES } from '../types'

export const activitySchema = z.object({
  name: z.string().trim().min(1, 'Enter an activity name').max(80, 'Keep the name under 80 characters'),
  category: z.enum(CATEGORIES),
  date: z.string().min(1, 'Choose a date'),
  durationMinutes: z
    .string()
    .trim()
    .min(1, 'Enter duration in minutes')
    .regex(/^\d+$/, 'Use whole minutes')
    .refine((value) => Number(value) > 0, 'Duration must be greater than 0')
    .refine((value) => Number(value) <= 24 * 60, 'Duration cannot exceed 24 hours'),
  notes: z.string().max(280, 'Keep notes under 280 characters'),
})

export type ActivityFormValues = z.infer<typeof activitySchema>
