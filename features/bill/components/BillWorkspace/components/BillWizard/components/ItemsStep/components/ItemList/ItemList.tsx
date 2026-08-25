import { Stack } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import { AddItemButton } from "./components/AddItemButton/AddItemButton";
import { EmptyItemList } from "./components/EmptyItemList/EmptyItemList";
import { ItemRow } from "./components/ItemRow/ItemRow";

export function ItemList() {
  const items = useBillStore((state) => state.bill.items);
  return (
    <Stack gap="xs">
      {items.map(({ id }) => (
        <ItemRow key={id} itemId={id} />
      ))}
      {!items.length && <EmptyItemList />}
      <AddItemButton />
    </Stack>
  );
}
