import { z } from "zod";

/** Runtime contract for a person who can own part of a bill. */
export const PersonSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  color: z.string().min(1),
});

/** Runtime contract for a line item and the people who share it. */
export const BillItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  unitPriceCents: z.number().int().nonnegative(),
  discountCents: z.number().int().nonnegative().default(0),
  quantity: z.number().int().positive(),
  ownerIds: z.array(z.string()),
}).refine(
  (item) => item.discountCents <= item.unitPriceCents * item.quantity,
  { message: "Discount cannot exceed the item total", path: ["discountCents"] },
);

/** Runtime contract for a fee or discount applied to a bill. */
export const AdjustmentSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(1),
  amountCents: z.number().int().nonnegative(),
  kind: z.enum(["fee", "discount"]),
});

/** Validates persisted bills before they enter the store. */
export const BillSchema = z.object({
  id: z.string().min(1),
  version: z.literal(2),
  title: z.string().trim().min(1),
  people: z.array(PersonSchema),
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
