import { ActionIcon, Group, TextInput } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useBillStore } from "@/features/bill/store/bill.store";
import { PersonAvatar } from "@/features/bill/shared/components/PersonAvatar/PersonAvatar";
import styles from "../../../../../../BillWorkspace.module.css";

type Props = { personId: string };

export function PersonRow({ personId }: Props) {
  const person = useBillStore((state) =>
    state.bill.people.find(({ id }) => id === personId),
  );
  const peopleCount = useBillStore((state) => state.bill.people.length);
  const updatePersonName = useBillStore((state) => state.updatePersonName);
  const removePerson = useBillStore((state) => state.removePerson);
  if (!person) return null;
  return (
    <Group className={styles.personRow} justify="space-between">
      <Group className={styles.personName} wrap="nowrap">
        <PersonAvatar person={person} size="md" />
        <TextInput
          className={styles.personName}
          variant="unstyled"
          value={person.name}
          aria-label={`Name for ${person.name}`}
          onChange={(event) =>
            updatePersonName(person.id, event.currentTarget.value)
          }
          styles={{ input: { fontWeight: 600 } }}
        />
      </Group>
      {peopleCount > 1 && (
        <ActionIcon
          size={44}
          variant="subtle"
          color="red"
          aria-label={`Remove ${person.name}`}
          onClick={() => removePerson(person.id)}
        >
          <IconTrash size={17} />
        </ActionIcon>
      )}
    </Group>
  );
}
