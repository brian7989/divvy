import { NextResponse } from "next/server";
import { parseReceipt } from "@/features/bill/receipt/parseReceipt";
import { reconcileReceipt } from "@/features/bill/receipt/reconcileReceipt";

const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type ReceiptFileResult =
  | { ok: true; file: File }
  | { ok: false; error: string; status: number };

function getReceiptFile(formData: FormData): ReceiptFileResult {
  const file = formData.get("receipt");
  if (!(file instanceof File))
    return { ok: false, error: "Choose a receipt image.", status: 400 };
  if (!SUPPORTED_IMAGE_TYPES.has(file.type))
    return {
      ok: false,
      error: "Use a JPEG, PNG, or WebP image.",
      status: 415,
    };
  if (!file.size || file.size > MAX_IMAGE_BYTES)
    return {
      ok: false,
      error: "Keep the receipt image under 6 MB.",
      status: 413,
    };
  return { ok: true, file };
}

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

/** Parses one temporary receipt image and returns validated, bill-ready data. */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const receiptFile = getReceiptFile(formData);
    if (!receiptFile.ok)
      return errorResponse(receiptFile.error, receiptFile.status);

    const receipt = await parseReceipt(
      new Uint8Array(await receiptFile.file.arrayBuffer()),
      receiptFile.file.type,
    );
    return NextResponse.json({ receipt, warnings: reconcileReceipt(receipt) });
  } catch (error) {
    console.error("Receipt parsing failed", error);
    return errorResponse(
      "We couldn't read that receipt. Try a clearer photo.",
      502,
    );
  }
}
