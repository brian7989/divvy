import { Loader, UnstyledButton } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconReceipt } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { requestReceiptParse } from "@/features/bill/receipt/requestReceiptParse";
import { useBillStore } from "@/features/bill/store/bill.store";
import styles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";

const MAX_SOURCE_BYTES = 20 * 1024 * 1024;

function showFileTooLargeError() {
  notifications.show({
    color: "red",
    title: "Photo is too large",
    message: "Choose an image under 20 MB.",
  });
}

function showParseError(error: unknown) {
  notifications.show({
    color: "red",
    title: "Receipt scan failed",
    message:
      error instanceof Error ? error.message : "Try again with a clearer photo.",
  });
}

function showImportSuccess(itemCount: number, warnings: string[]) {
  notifications.show({
    color: "party",
    title: `${itemCount} items added`,
    message: warnings[0] ?? "Review the items, then assign everyone.",
  });
}

/** Uploads one receipt and imports validated results into the active bill. */
export function ReceiptUploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const importReceipt = useBillStore((state) => state.importReceipt);
  const goToStep = useBillStore((state) => state.goToStep);

  const selectReceipt = () => inputRef.current?.click();
  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = "";
  };
  const importSelectedReceipt = async (file: File) => {
    if (file.size > MAX_SOURCE_BYTES) {
      showFileTooLargeError();
      resetInput();
      return;
    }

    setParsing(true);
    try {
      const result = await requestReceiptParse(file);
      importReceipt(result.receipt);
      showImportSuccess(result.receipt.items.length, result.warnings);
      goToStep("assign");
    } catch (error) {
      showParseError(error);
    } finally {
      setParsing(false);
      resetInput();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) void importSelectedReceipt(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        className={styles.receiptInput}
        type="file"
        accept="image/*"
        aria-label="Choose a receipt image"
        onChange={handleFileChange}
      />
      <UnstyledButton
        className={styles.methodCard}
        onClick={selectReceipt}
        disabled={parsing}
      >
        <span className={styles.methodIcon}>
          {parsing ? (
            <Loader size={22} color="party" />
          ) : (
            <IconReceipt size={24} />
          )}
        </span>
        <strong>{parsing ? "Reading receipt" : "Upload receipt"}</strong>
        <span>
          {parsing ? "Finding your items…" : "Scan items automatically"}
        </span>
      </UnstyledButton>
    </>
  );
}
