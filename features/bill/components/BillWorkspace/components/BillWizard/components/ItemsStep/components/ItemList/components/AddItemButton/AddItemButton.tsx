import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useBillStore } from "@/features/bill/store/bill.store";

export function AddItemButton() {
  const addItem = useBillStore((state) => state.addItem);
  return (
    <Button
      variant="subtle"
      leftSection={<IconPlus size={16} />}
      onClick={addItem}
    >
      Add an item
    </Button>
  );
}
