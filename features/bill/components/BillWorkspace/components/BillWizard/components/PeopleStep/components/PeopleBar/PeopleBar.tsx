import { Button, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useBillStore } from "@/features/bill/store/bill.store";
import { PersonAvatar } from "@/features/bill/shared/components/PersonAvatar/PersonAvatar";
import styles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";

export function PeopleBar() {
  const people = useBillStore((state) => state.bill.people);
  const openPeople = useBillStore((state) => state.openPeople);
  return (
    <Group gap="xs">
      {people.map((person) => (
        <Button
          key={person.id}
          variant="default"
          className={styles.personButton}
          radius="xl"
          size="sm"
          leftSection={<PersonAvatar person={person} />}
          onClick={openPeople}
        >
          {person.name}
        </Button>
      ))}
      <Button
        variant="subtle"
        color="party"
        size="sm"
        leftSection={<IconPlus size={15} />}
        onClick={openPeople}
      >
        Add person
      </Button>
    </Group>
  );
}
