import {
  Avatar,
  Button,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useBillStore } from "../../model/bill.store";
import { formatMoney } from "../../model/money";
import { PersonAvatar } from "../shared/PersonAvatar";

export function AssignmentModal({
  itemId,
  opened,
  onClose,
  onEdit,
}: {
  itemId: string | null;
  opened: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
}) {
  const bill = useBillStore((state) => state.bill);
  const setOwners = useBillStore((state) => state.setOwners);
  const item = bill.items.find(({ id }) => id === itemId);
  if (!item) return null;
  const toggle = (personId: string) =>
    setOwners(
      item.id,
      item.ownerIds.includes(personId)
        ? item.ownerIds.filter((id) => id !== personId)
        : [...item.ownerIds, personId],
    );
  const perPerson = item.ownerIds.length
    ? Math.floor((item.unitPriceCents * item.quantity) / item.ownerIds.length)
    : 0;

  return (
    <Modal opened={opened} onClose={onClose} title="Assign item" centered>
      <Stack>
        <Group justify="space-between">
          <div>
            <Text fw={800} size="lg">
              {item.name}
            </Text>
            <Text c="dimmed" size="sm">
              Who shared this?
            </Text>
          </div>
          <Text fw={800}>
            {formatMoney(item.unitPriceCents * item.quantity)}
          </Text>
        </Group>
        <Button
          variant="light"
          onClick={() =>
            setOwners(
              item.id,
              bill.people.map(({ id }) => id),
            )
          }
        >
          Everyone · split equally
        </Button>
        <SimpleGrid cols={2}>
          {bill.people.map((person) => {
            const chosen = item.ownerIds.includes(person.id);
            return (
              <Button
                key={person.id}
                variant={chosen ? "light" : "default"}
                justify="flex-start"
                leftSection={<PersonAvatar person={person} />}
                rightSection={
                  chosen ? (
                    <Avatar size={20} color="coral">
                      ✓
                    </Avatar>
                  ) : undefined
                }
                onClick={() => toggle(person.id)}
              >
                {person.name}
              </Button>
            );
          })}
        </SimpleGrid>
        <Text ta="center" c="dimmed" size="sm">
          {item.ownerIds.length
            ? `${formatMoney(perPerson)} each`
            : "Choose at least one person"}
        </Text>
        <Group grow>
          <Button variant="default" onClick={() => onEdit(item.id)}>
            Edit item
          </Button>
          <Button disabled={!item.ownerIds.length} onClick={onClose}>
            Done
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
