import { Avatar, Button } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import { PersonAvatar } from "@/features/bill/shared/components/PersonAvatar/PersonAvatar";
import styles from "../../../../../../BillWorkspace.module.css";

type Props = { personId: string };

export function AssigneeButton({ personId }: Props) {
  const itemId = useBillStore((state) => state.assigningItemId);
  const item = useBillStore((state) =>
    state.bill.items.find(({ id }) => id === itemId),
  );
  const person = useBillStore((state) =>
    state.bill.people.find(({ id }) => id === personId),
  );
  const setOwners = useBillStore((state) => state.setOwners);
  if (!item || !person) return null;
  const chosen = item.ownerIds.includes(personId);
  const toggle = () =>
    setOwners(
      item.id,
      chosen
        ? item.ownerIds.filter((id) => id !== personId)
        : [...item.ownerIds, personId],
    );
  return (
    <Button
      className={styles.assigneeButton}
      size="md"
      variant={chosen ? "light" : "default"}
      justify="flex-start"
      leftSection={<PersonAvatar person={person} />}
      rightSection={
        chosen ? (
          <Avatar size={20} color="party">
            ✓
          </Avatar>
        ) : undefined
      }
      onClick={toggle}
    >
      {person.name}
    </Button>
  );
}
