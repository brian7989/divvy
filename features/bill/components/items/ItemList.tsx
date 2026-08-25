import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { IconDots, IconEdit, IconPlus, IconUsers } from "@tabler/icons-react";
import type { BillItem, Person } from "../../model/bill.schema";
import { formatMoney } from "../../model/money";
import { PersonAvatar } from "../shared/PersonAvatar";
import styles from "./ItemList.module.css";

type Props = {
  items: BillItem[];
  people: Person[];
  onAssign: (id: string) => void;
  onEdit: (id: string) => void;
  onAdd: () => void;
};

export function ItemList({ items, people, onAssign, onEdit, onAdd }: Props) {
  return (
    <Stack gap="xs">
      {items.map((item) => {
        const owners = people.filter(({ id }) => item.ownerIds.includes(id));
        return (
          <Paper
            key={item.id}
            className={`${styles.item} ${owners.length ? "" : styles.unassigned}`}
          >
            <Group justify="space-between" wrap="nowrap">
              <button
                type="button"
                onClick={() => onAssign(item.id)}
                style={{
                  flex: 1,
                  border: 0,
                  padding: 0,
                  background: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <Text fw={700} size="sm">
                  {item.name}
                </Text>
                <Text c="dimmed" size="xs">
                  {item.quantity > 1 ? `${item.quantity} × ` : ""}
                  {formatMoney(item.unitPriceCents)}
                </Text>
              </button>
              <Group gap="xs" wrap="nowrap">
                {owners.length ? (
                  <Group gap={0} className={styles.avatars}>
                    {owners.map((person) => (
                      <PersonAvatar key={person.id} person={person} />
                    ))}
                  </Group>
                ) : (
                  <Button
                    variant="subtle"
                    color="orange"
                    size="compact-xs"
                    leftSection={<IconUsers size={14} />}
                    onClick={() => onAssign(item.id)}
                  >
                    Assign
                  </Button>
                )}
                <Menu position="bottom-end">
                  <Menu.Target>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      aria-label={`Actions for ${item.name}`}
                    >
                      <IconDots size={18} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconEdit size={15} />}
                      onClick={() => onEdit(item.id)}
                    >
                      Edit item
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Paper>
        );
      })}
      {!items.length && (
        <Paper withBorder p="xl" ta="center" radius="lg">
          <Text c="dimmed" size="sm">
            Add the first item from your receipt.
          </Text>
        </Paper>
      )}
      <Button
        variant="subtle"
        leftSection={<IconPlus size={16} />}
        onClick={onAdd}
      >
        Add an item
      </Button>
    </Stack>
  );
}
