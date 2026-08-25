import { Stack } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import { PersonRow } from "./components/PersonRow/PersonRow";

export function PersonList() {
  const people = useBillStore((state) => state.bill.people);
  return (
    <Stack gap="sm">
      {people.map(({ id }) => (
        <PersonRow key={id} personId={id} />
      ))}
    </Stack>
  );
}
