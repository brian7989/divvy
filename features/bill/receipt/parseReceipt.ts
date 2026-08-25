import "server-only";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import {
  getParsedReceipt,
  ReceiptAnalysisSchema,
} from "./receipt-analysis";
import type { ParsedReceipt } from "./receipt.schema";

const RECEIPT_MODEL = "openai/gpt-5.4-mini";

/** Extracts bill-ready receipt data without retaining the uploaded image. */
export async function parseReceipt(
  image: Uint8Array,
  mediaType: string,
): Promise<ParsedReceipt> {
  try {
    const { output } = await generateText({
      model: RECEIPT_MODEL,
      output: Output.object({
        name: "receipt_analysis",
        description: "Receipt classification and extracted purchase data.",
        schema: ReceiptAnalysisSchema,
      }),
      system:
        "First decide whether the image is a purchase receipt. Set receiptLikelihood near 0 only when the image is clearly unrelated, such as a person, pet, landscape, screenshot, or document with no purchase transaction. Unusual, handwritten, foreign-language, partial, or blurry receipts should remain uncertain rather than being classified as unrelated. Set receipt to null when the image is not a receipt or no line item can be extracted. When extracting, use integer cents, never decimal dollars. Do not invent obscured values. Exclude subtotal, tax, tip, totals, payment, and change from line items. Only extract tipCents when a tip was actually charged and included in the receipt total. Ignore suggested tips, blank tip lines, and examples such as 18%, 20%, or 25%. Put item discounts on the item and order-level discounts or service charges in adjustments. Use 0 when an item has no discount. lineTotalCents must equal unitPriceCents times quantity minus discountCents. Use ISO 4217 currency codes. If quantity is absent, use 1. If a summary value is absent, return null.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract this receipt for an editable bill split. Preserve concise item names and verify the arithmetic before responding.",
            },
            { type: "image", image, mediaType },
          ],
        },
      ],
      maxOutputTokens: 2_000,
      experimental_include: { requestBody: false, responseBody: false },
    });

    return getParsedReceipt(output);
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error))
      throw new Error("The receipt could not be read clearly.");
    throw error;
  }
}
