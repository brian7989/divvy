import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useEffect } from "react";
import { createId } from "../../model/bill.factory";
import { useBillStore } from "../../model/bill.store";
import { centsToDollars, dollarsToCents } from "../../model/money";

type FormValues = { name: string; price: number; quantity: number };

export function ItemEditorModal({
  itemId,
  opened,
  onClose,
}: {
  itemId: string | null | undefined;
  opened: boolean;
  onClose: () => void;
}) {
  const item = useBillStore((state) =>
    state.bill.items.find(({ id }) => id === itemId),
  );
  const saveItem = useBillStore((state) => state.saveItem);
  const removeItem = useBillStore((state) => state.removeItem);
  const form = useForm<FormValues>({
    initialValues: { name: "", price: 0, quantity: 1 },
    validate: {
      name: (value) => (value.trim() ? null : "Enter an item name"),
      price: (value) => (value > 0 ? null : "Enter a price"),
      quantity: (value) => (value >= 1 ? null : "Minimum 1"),
    },
  });

  useEffect(() => {
    form.setValues(
      item
        ? {
            name: item.name,
            price: centsToDollars(item.unitPriceCents),
            quantity: item.quantity,
          }
        : { name: "", price: 0, quantity: 1 },
    );
    form.resetDirty();
    // Form intentionally resets only when the selected item changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, opened]);

  const submit = form.onSubmit((values) => {
    saveItem({
      id: item?.id ?? createId(),
      name: values.name.trim(),
      unitPriceCents: dollarsToCents(values.price),
      quantity: Number(values.quantity),
      ownerIds: item?.ownerIds ?? [],
    });
    onClose();
  });
  const confirmDelete = () =>
    modals.openConfirmModal({
      title: "Delete item?",
      children: `Remove ${item?.name} from this bill?`,
      labels: { confirm: "Delete", cancel: "Keep item" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (item) removeItem(item.id);
        onClose();
      },
    });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={item ? "Edit item" : "Add item"}
      centered
    >
      <form onSubmit={submit}>
        <Stack>
          <TextInput
            label="Item"
            placeholder="Spicy rigatoni"
            {...form.getInputProps("name")}
          />
          <Group grow align="flex-start">
            <NumberInput
              label="Price"
              prefix="$"
              decimalScale={2}
              min={0}
              {...form.getInputProps("price")}
            />
            <NumberInput
              label="Quantity"
              min={1}
              step={1}
              allowDecimal={false}
              {...form.getInputProps("quantity")}
            />
          </Group>
          <Group justify={item ? "space-between" : "flex-end"}>
            {item && (
              <Button variant="subtle" color="red" onClick={confirmDelete}>
                Delete item
              </Button>
            )}
            <Group>
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
