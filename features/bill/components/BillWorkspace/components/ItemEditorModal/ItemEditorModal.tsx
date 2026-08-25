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
import { createId } from "@/features/bill/domain/bill.factory";
import { useBillStore } from "@/features/bill/store/bill.store";
import { centsToDollars, dollarsToCents } from "@/features/bill/domain/money";
import styles from "../../BillWorkspace.module.css";
import { QuantityInput } from "./components/QuantityInput/QuantityInput";

type FormValues = {
  name: string;
  price: number;
  quantity: number;
  discount: number;
};

export function ItemEditorModal() {
  const itemId = useBillStore((state) => state.editingItemId);
  const opened = itemId !== undefined;
  const closeItemEditor = useBillStore((state) => state.closeItemEditor);
  const item = useBillStore((state) =>
    state.bill.items.find(({ id }) => id === itemId),
  );
  const saveItem = useBillStore((state) => state.saveItem);
  const removeItem = useBillStore((state) => state.removeItem);
  const form = useForm<FormValues>({
    initialValues: { name: "", price: 0, quantity: 1, discount: 0 },
    validate: {
      name: (value) => (value.trim() ? null : "Enter an item name"),
      price: (value) => (value > 0 ? null : "Enter a price"),
      quantity: (value) => (value >= 1 ? null : "Minimum 1"),
      discount: (value, values) =>
        dollarsToCents(value) <=
        dollarsToCents(values.price) * Number(values.quantity)
          ? null
          : "Discount cannot exceed item total",
    },
  });

  useEffect(() => {
    form.setValues(
      item
        ? {
            name: item.name,
            price: centsToDollars(item.unitPriceCents),
            quantity: item.quantity,
            discount: centsToDollars(item.discountCents),
          }
        : { name: "", price: 0, quantity: 1, discount: 0 },
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
      discountCents: dollarsToCents(values.discount),
      quantity: Number(values.quantity),
      ownerIds: item?.ownerIds ?? [],
    });
    closeItemEditor();
  });
  const confirmDelete = () =>
    modals.openConfirmModal({
      title: "Delete item?",
      children: `Remove ${item?.name} from this bill?`,
      labels: { confirm: "Delete", cancel: "Keep item" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (item) removeItem(item.id);
        closeItemEditor();
      },
    });

  return (
    <Modal
      opened={opened}
      onClose={closeItemEditor}
      title={item ? "Edit item" : "Add item"}
      centered
      classNames={{
        inner: styles.modalInner,
        content: styles.modalContent,
        header: styles.modalHeader,
        title: styles.modalTitle,
        body: styles.modalBody,
        close: styles.closeButton,
      }}
      transitionProps={{ transition: "slide-up", duration: 180 }}
    >
      <form className={styles.sheetLayout} onSubmit={submit}>
        <div className={styles.sheetBody}>
          <Stack>
            <TextInput
              className={styles.textInput}
              size="md"
              label="Item"
              placeholder="Spicy rigatoni"
              {...form.getInputProps("name")}
            />
            <div className={styles.fieldGrid}>
              <NumberInput
                className={styles.numberInput}
                size="md"
                label="Price"
                prefix="$"
                decimalScale={2}
                min={0}
                hideControls
                {...form.getInputProps("price")}
              />
              <NumberInput
                className={styles.numberInput}
                size="md"
                label="Item discount"
                prefix="$"
                decimalScale={2}
                min={0}
                hideControls
                {...form.getInputProps("discount")}
              />
            </div>
            <QuantityInput
              value={form.values.quantity}
              onChange={(quantity) => form.setFieldValue("quantity", quantity)}
              onBlur={() => form.validateField("quantity")}
              error={form.errors.quantity}
            />
          </Stack>
        </div>
        <div className={styles.sheetFooter}>
          <Stack gap="xs">
            <Group grow>
              <Button size="md" variant="default" onClick={closeItemEditor}>
                Cancel
              </Button>
              <Button size="md" type="submit">
                Save
              </Button>
            </Group>
            {item && (
              <Button
                size="md"
                variant="subtle"
                color="red"
                onClick={confirmDelete}
              >
                Delete item
              </Button>
            )}
          </Stack>
        </div>
      </form>
    </Modal>
  );
}
