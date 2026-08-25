import { Button, Modal, Stack } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import { AddPersonForm } from "./components/AddPersonForm/AddPersonForm";
import { PersonList } from "./components/PersonList/PersonList";
import styles from "../../BillWorkspace.module.css";

export function PeopleModal() {
  const opened = useBillStore((state) => state.peopleOpen);
  const closePeople = useBillStore((state) => state.closePeople);
  return (
    <Modal
      opened={opened}
      onClose={closePeople}
      title="People on this bill"
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
          <PersonList />
          <AddPersonForm />
        </Stack>
        <div className={styles.sheetFooter}>
          <Button size="md" fullWidth onClick={closePeople}>
            Done
          </Button>
        </div>
      </Stack>
    </Modal>
  );
}
