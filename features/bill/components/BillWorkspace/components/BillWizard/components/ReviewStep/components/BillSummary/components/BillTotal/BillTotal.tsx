import { Group, Text } from "@mantine/core";
import { useBillTotals } from "@/features/bill/hooks/useBillTotals";
import { formatMoney } from "@/features/bill/domain/money";

export function BillTotal() {
  const totals = useBillTotals();
  return (
    <Group justify="space-between">
      <Text fw={800}>Total</Text>
      <Text fw={800} size="xl">
        {formatMoney(totals.totalCents)}
      </Text>
    </Group>
  );
}
