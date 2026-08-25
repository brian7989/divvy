import { Button } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import styles from "../../../BillModals.module.css";

export function AssignEveryoneButton() {
  const itemId = useBillStore((state) => state.assigningItemId);
  const people = useBillStore((state) => state.bill.people);
  const setOwners = useBillStore((state) => state.setOwners);
  if (!itemId) return null;
  return (
    <Button
      className={styles.assigneeButton}
      size="md"
      variant="light"
      onClick={() =>
        setOwners(
          itemId,
          people.map(({ id }) => id),
        )
      }
    >
      Everyone · split equally
    </Button>
  );
}
