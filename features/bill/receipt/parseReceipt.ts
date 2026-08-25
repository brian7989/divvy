import "server-only";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { ParsedReceiptSchema, type ParsedReceipt } from "./receipt.schema";

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
        name: "receipt",
        description: "Line items and totals visible on a purchase receipt.",
        schema: ParsedReceiptSchema,
      }),
      system:
        "You extract receipts accurately. Use integer cents, never decimal dollars. Do not invent obscured values. Exclude subtotal, tax, tip, totals, payment, and change from line items. Put service charges and discounts in adjustments. Use ISO 4217 currency codes. If quantity is absent, use 1. If a summary value is absent, return null.",
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

    return output;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error))
      throw new Error("The receipt could not be read clearly.");
    throw error;
  }
}
