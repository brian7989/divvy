import { z } from "zod";

export const PersonSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  color: z.string().min(1),
});

export const BillItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  unitPriceCents: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
  ownerIds: z.array(z.string()),
});

export const AdjustmentSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(1),
  amountCents: z.number().int().nonnegative(),
  kind: z.enum(["fee", "discount"]),
});

export const BillSchema = z.object({
  id: z.string().min(1),
  version: z.literal(2),
  title: z.string(),
  people: z.array(PersonSchema).min(1),
  items: z.array(BillItemSchema),
  taxCents: z.number().int().nonnegative(),
  tipPercent: z.number().min(0).max(100),
  adjustments: z.array(AdjustmentSchema),
  updatedAt: z.string(),
});

export type Bill = z.infer<typeof BillSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type BillItem = z.infer<typeof BillItemSchema>;
export type Adjustment = z.infer<typeof AdjustmentSchema>;
