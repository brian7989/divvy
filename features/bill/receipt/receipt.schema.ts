import { z } from "zod";

/** A line item extracted from a receipt, represented in integer cents. */
export const ReceiptItemSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    quantity: z.number().int().min(1).max(99),
    unitPriceCents: z.number().int().nonnegative(),
    discountCents: z.number().int().nonnegative(),
    lineTotalCents: z.number().int().nonnegative(),
  })
  .refine(
    (item) => item.discountCents <= item.unitPriceCents * item.quantity,
    { message: "Discount cannot exceed the item total", path: ["discountCents"] },
  );

/** A non-item charge or discount found on a receipt. */
export const ReceiptAdjustmentSchema = z.object({
  label: z.string().trim().min(1).max(80),
  amountCents: z.number().int().nonnegative(),
  kind: z.enum(["fee", "discount"]),
});

/** Strict output contract shared by the AI parser, API, and import UI. */
export const ParsedReceiptSchema = z.object({
  merchantName: z.string().trim().min(1).max(120).nullable(),
  currency: z.string().trim().length(3),
  items: z.array(ReceiptItemSchema).min(1).max(100),
  subtotalCents: z.number().int().nonnegative().nullable(),
  taxCents: z.number().int().nonnegative().nullable(),
  tipCents: z.number().int().nonnegative().nullable(),
  adjustments: z.array(ReceiptAdjustmentSchema).max(20),
  totalCents: z.number().int().nonnegative().nullable(),
});

/** Successful response returned by the receipt parsing endpoint. */
export const ReceiptParseResponseSchema = z.object({
  receipt: ParsedReceiptSchema,
  warnings: z.array(z.string()),
});

export type ParsedReceipt = z.infer<typeof ParsedReceiptSchema>;
