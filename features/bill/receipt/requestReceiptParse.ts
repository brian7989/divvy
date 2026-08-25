import { prepareReceiptImage } from "./prepareReceiptImage";
import {
  ReceiptParseResponseSchema,
  type ParsedReceipt,
} from "./receipt.schema";

export type ReceiptParseResult = {
  receipt: ParsedReceipt;
  warnings: string[];
};

function getApiError(body: unknown): string {
  if (typeof body !== "object" || body === null || !("error" in body))
    return "We couldn't read that receipt.";
  return String(body.error);
}

/** Prepares and submits a receipt image, then validates the API response. */
export async function requestReceiptParse(
  sourceImage: File,
): Promise<ReceiptParseResult> {
  const receiptImage = await prepareReceiptImage(sourceImage);
  const formData = new FormData();
  formData.set("receipt", receiptImage);

  const response = await fetch("/api/receipts/parse", {
    method: "POST",
    body: formData,
  });
  const body: unknown = await response.json();
  if (!response.ok) throw new Error(getApiError(body));
  return ReceiptParseResponseSchema.parse(body);
}

