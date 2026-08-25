import { ActionIcon, TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useBillStore } from "@/features/bill/store/bill.store";
import styles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";

export function BillTitle() {
  const titleDraft = useBillStore((state) => state.titleDraft);
  const setTitleDraft = useBillStore((state) => state.setTitleDraft);
  const updateTitle = useBillStore((state) => state.updateTitle);
  const valid = Boolean(titleDraft.trim());
  return (
    <TextInput
      className={styles.title}
      variant="unstyled"
      value={titleDraft}
      onChange={(event) => setTitleDraft(event.currentTarget.value)}
      onBlur={() => {
        if (valid) updateTitle(titleDraft);
      }}
      error={valid ? undefined : "Enter a bill name"}
      rightSection={
        titleDraft ? (
          <ActionIcon
            variant="subtle"
            color="gray"
            aria-label="Clear bill name"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setTitleDraft("")}
          >
            <IconX size={18} />
          </ActionIcon>
        ) : null
      }
      aria-label="Bill name"
    />
  );
}
