import { Button, Group } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";
import { useBillStore } from "@/features/bill/store/bill.store";
import { PersonAvatar } from "@/features/bill/shared/components/PersonAvatar/PersonAvatar";
import styles from "../../../../ItemList.module.css";

type Props = { itemId: string };

export function ItemOwners({ itemId }: Props) {
  const people = useBillStore((state) => state.bill.people);
  const ownerIds = useBillStore(
    (state) => state.bill.items.find(({ id }) => id === itemId)?.ownerIds,
  );
  const assignItem = useBillStore((state) => state.assignItem);
  const owners = people.filter(({ id }) => ownerIds?.includes(id));
  if (!owners.length) {
    return (
      <Button
        variant="subtle"
        color="party"
        size="compact-xs"
        leftSection={<IconUsers size={14} />}
        onClick={() => assignItem(itemId)}
      >
        Assign
      </Button>
    );
  }

  return (
    <Group gap={0} className={styles.avatars}>
      {owners.map((person) => (
        <PersonAvatar key={person.id} person={person} />
      ))}
    </Group>
  );
}
