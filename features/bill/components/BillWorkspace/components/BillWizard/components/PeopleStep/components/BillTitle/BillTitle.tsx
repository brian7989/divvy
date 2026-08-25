import { TextInput } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import styles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";

export function BillTitle() {
  const title = useBillStore((state) => state.bill.title);
  const updateTitle = useBillStore((state) => state.updateTitle);
  return (
    <TextInput
      className={styles.title}
      variant="unstyled"
      value={title}
      onChange={(event) => updateTitle(event.currentTarget.value)}
      aria-label="Bill name"
    />
  );
}
