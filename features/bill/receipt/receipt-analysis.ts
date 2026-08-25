import { z } from "zod";
import { ParsedReceiptSchema, type ParsedReceipt } from "./receipt.schema";

const NOT_A_RECEIPT_THRESHOLD = 0.1;

/** Structured model result used to distinguish irrelevant images from receipts. */
export const ReceiptAnalysisSchema = z.object({
  receiptLikelihood: z.number().min(0).max(1),
  receipt: ParsedReceiptSchema.nullable(),
});

export type ReceiptAnalysis = z.infer<typeof ReceiptAnalysisSchema>;

export class NotAReceiptError extends Error {
  constructor() {
    super("The image is not a receipt.");
    this.name = "NotAReceiptError";
  }
}

/** Returns extracted data or rejects images confidently classified as irrelevant. */
export function getParsedReceipt(analysis: ReceiptAnalysis): ParsedReceipt {
  if (analysis.receiptLikelihood <= NOT_A_RECEIPT_THRESHOLD) {
    throw new NotAReceiptError();
  }

  if (!analysis.receipt) {
    throw new Error("The receipt could not be read clearly.");
  }

  return analysis.receipt;
}
