import { Stack } from "@mantine/core";
import { useBillTotals } from "@/features/bill/hooks/useBillTotals";
import { PersonShareRow } from "./components/PersonShareRow/PersonShareRow";

export function PersonShareList() {
  const totals = useBillTotals();
  return (
    <Stack gap={4}>
      {totals.shares.map(({ person }) => (
        <PersonShareRow key={person.id} personId={person.id} />
      ))}
    </Stack>
  );
}
