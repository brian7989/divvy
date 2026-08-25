import { Group, Text } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import { formatMoney } from "@/features/bill/domain/money";

export function AssignmentHeader() {
  const itemId = useBillStore((state) => state.assigningItemId);
  const item = useBillStore((state) =>
    state.bill.items.find(({ id }) => id === itemId),
  );
  if (!item) return null;
  return (
    <Group justify="space-between">
      <div>
        <Text fw={800} size="lg">
          {item.name}
        </Text>
        <Text c="dimmed" size="sm">
          Who shared this?
        </Text>
      </div>
      <Text fw={800}>{formatMoney(item.unitPriceCents * item.quantity)}</Text>
    </Group>
  );
}
