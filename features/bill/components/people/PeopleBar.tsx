import { Button, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import type { Person } from "../../model/bill.schema";
import { PersonAvatar } from "../shared/PersonAvatar";

export function PeopleBar({
  people,
  onManage,
}: {
  people: Person[];
  onManage: () => void;
}) {
  return (
    <Group gap="xs">
      {people.map((person) => (
        <Button
          key={person.id}
          variant="default"
          radius="xl"
          size="sm"
          leftSection={<PersonAvatar person={person} />}
          onClick={onManage}
        >
          {person.name}
        </Button>
      ))}
      <Button
        variant="subtle"
        color="gray"
        size="sm"
        leftSection={<IconPlus size={15} />}
        onClick={onManage}
      >
        Add person
      </Button>
    </Group>
  );
}
