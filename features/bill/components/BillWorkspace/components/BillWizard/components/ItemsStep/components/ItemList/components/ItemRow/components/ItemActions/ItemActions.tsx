import { ActionIcon, Menu } from "@mantine/core";
import { IconDots, IconEdit } from "@tabler/icons-react";
import { useBillStore } from "@/features/bill/store/bill.store";

const { Dropdown: MenuDropdown, Item: MenuItem, Target: MenuTarget } = Menu;

type Props = { itemId: string };

export function ItemActions({ itemId }: Props) {
  const itemName = useBillStore(
    (state) => state.bill.items.find(({ id }) => id === itemId)?.name,
  );
  const editItem = useBillStore((state) => state.editItem);
  return (
    <Menu position="bottom-end">
      <MenuTarget>
        <ActionIcon
          variant="subtle"
          color="party"
          aria-label={`Actions for ${itemName}`}
        >
          <IconDots size={18} />
        </ActionIcon>
      </MenuTarget>
      <MenuDropdown>
        <MenuItem
          leftSection={<IconEdit size={15} />}
          onClick={() => editItem(itemId)}
        >
          Edit item
        </MenuItem>
      </MenuDropdown>
    </Menu>
  );
}
