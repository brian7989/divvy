import type { Bill } from "@/features/bill/domain/bill.schema";
import { buildBillShareData } from "./buildBillShareData";
import { renderBillShareImage } from "./renderBillShareImage";

export type ShareBillImageResult = "shared" | "downloaded" | "cancelled";

function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function canShareFile(file: File): boolean {
  return (
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  );
}

/** Shares an itemized PNG when supported, otherwise downloads it locally. */
export async function shareBillImage(
  bill: Bill,
): Promise<ShareBillImageResult> {
  const file = await renderBillShareImage(buildBillShareData(bill));
  if (!canShareFile(file)) {
    downloadFile(file);
    return "downloaded";
  }

  try {
    await navigator.share({
      title: bill.title,
      text: `Itemized split for ${bill.title}`,
      files: [file],
    });
    return "shared";
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      return "cancelled";
    throw error;
  }
}
