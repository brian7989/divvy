import { ActionIcon, TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { DEFAULT_BILL_TITLE } from "@/features/bill/domain/bill.factory";
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
      rightSection={
        title !== DEFAULT_BILL_TITLE ? (
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label="Clear bill name"
            onClick={() => updateTitle(DEFAULT_BILL_TITLE)}
          >
            <IconX size={18} />
          </ActionIcon>
        ) : null
      }
      aria-label="Bill name"
    />
  );
}
