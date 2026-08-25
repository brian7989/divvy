import { ActionIcon } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useBillStore } from "@/features/bill/store/bill.store";

type Props = { itemId: string };

export function ItemActions({ itemId }: Props) {
  const itemName = useBillStore(
    (state) => state.bill.items.find(({ id }) => id === itemId)?.name,
  );
  const editItem = useBillStore((state) => state.editItem);
  return (
    <ActionIcon
      variant="subtle"
      color="party"
      aria-label={`Edit ${itemName ?? "item"}`}
      onClick={() => editItem(itemId)}
    >
      <IconEdit size={18} />
    </ActionIcon>
  );
}
