import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import { createId, PERSON_COLORS } from "../../../../model/bill.factory";
import { useBillStore } from "../../../../model/bill.store";
import { PersonAvatar } from "../../../../shared/components/PersonAvatar";

export function PeopleModal({
  opened,
  onClose,
}: {
  opened: boolean;
  onClose: () => void;
}) {
  const people = useBillStore((state) => state.bill.people);
  const addPerson = useBillStore((state) => state.addPerson);
  const removePerson = useBillStore((state) => state.removePerson);
  const form = useForm({
    initialValues: { name: "" },
    validate: { name: (value) => (value.trim() ? null : "Enter a name") },
  });
  const submit = form.onSubmit(({ name }) => {
    addPerson({
      id: createId(),
      name: name.trim(),
      color: PERSON_COLORS[people.length % PERSON_COLORS.length],
    });
    form.reset();
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="People on this bill"
      centered
    >
      <Stack>
        {people.map((person) => (
          <Group key={person.id} justify="space-between">
            <Group>
              <PersonAvatar person={person} size="md" />
              <Text fw={600}>{person.name}</Text>
            </Group>
            {people.length > 1 && (
              <ActionIcon
                variant="subtle"
                color="red"
                aria-label={`Remove ${person.name}`}
                onClick={() => removePerson(person.id)}
              >
                <IconTrash size={17} />
              </ActionIcon>
            )}
          </Group>
        ))}
        <form onSubmit={submit}>
          <Group align="flex-start">
            <TextInput
              placeholder="Name"
              aria-label="Person name"
              style={{ flex: 1 }}
              {...form.getInputProps("name")}
            />
            <Button type="submit">Add</Button>
          </Group>
        </form>
        <Button variant="light" onClick={onClose}>
          Done
        </Button>
      </Stack>
    </Modal>
  );
}
