import { Modal, Stack } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import { AssigneeGrid } from "./components/AssigneeGrid/AssigneeGrid";
import { AssignmentFooter } from "./components/AssignmentFooter/AssignmentFooter";
import { AssignmentHeader } from "./components/AssignmentHeader/AssignmentHeader";
import { AssignEveryoneButton } from "./components/AssignEveryoneButton/AssignEveryoneButton";
import styles from "../BillModals.module.css";

export function AssignmentModal() {
  const itemId = useBillStore((state) => state.assigningItemId);
  const closeAssignment = useBillStore((state) => state.closeAssignment);
  const itemExists = useBillStore((state) =>
    state.bill.items.some(({ id }) => id === itemId),
  );
  if (!itemExists) return null;
  return (
    <Modal
      opened={Boolean(itemId)}
      onClose={closeAssignment}
      title="Assign item"
      centered
      classNames={{
        inner: styles.modalInner,
        content: styles.modalContent,
        header: styles.modalHeader,
        title: styles.modalTitle,
        body: styles.modalBody,
        close: styles.closeButton,
      }}
      transitionProps={{ transition: "slide-up", duration: 180 }}
    >
      <Stack className={styles.sheetLayout} gap={0}>
        <Stack className={styles.sheetBody}>
          <AssignmentHeader />
          <AssignEveryoneButton />
          <AssigneeGrid />
        </Stack>
        <div className={styles.sheetFooter}>
          <AssignmentFooter />
        </div>
      </Stack>
    </Modal>
  );
}
