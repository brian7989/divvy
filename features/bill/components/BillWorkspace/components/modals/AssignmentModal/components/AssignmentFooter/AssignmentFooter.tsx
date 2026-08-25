import { Button, Group, Stack, Text } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import { formatMoney } from "@/features/bill/domain/money";
import styles from "../../../BillModals.module.css";

export function AssignmentFooter() {
  const itemId = useBillStore((state) => state.assigningItemId);
  const item = useBillStore((state) =>
    state.bill.items.find(({ id }) => id === itemId),
  );
  const closeAssignment = useBillStore((state) => state.closeAssignment);
  const editAssignedItem = useBillStore((state) => state.editAssignedItem);
  if (!item) return null;
  const perPerson = item.ownerIds.length
    ? Math.floor((item.unitPriceCents * item.quantity) / item.ownerIds.length)
    : 0;
  return (
    <Stack className={styles.assignmentFooter}>
      <Text className={styles.assignmentSummary} ta="center" size="sm">
        {item.ownerIds.length
          ? `${formatMoney(perPerson)} each`
          : "Choose at least one person"}
      </Text>
      <Group grow>
        <Button
          size="md"
          variant="default"
          onClick={() => editAssignedItem(item.id)}
        >
          Edit item
        </Button>
        <Button
          size="md"
          disabled={!item.ownerIds.length}
          onClick={closeAssignment}
        >
          Done
        </Button>
      </Group>
    </Stack>
  );
}
