import { SimpleGrid } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import { AssigneeButton } from "./components/AssigneeButton/AssigneeButton";

export function AssigneeGrid() {
  const people = useBillStore((state) => state.bill.people);
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }}>
      {people.map(({ id }) => (
        <AssigneeButton key={id} personId={id} />
      ))}
    </SimpleGrid>
  );
}
