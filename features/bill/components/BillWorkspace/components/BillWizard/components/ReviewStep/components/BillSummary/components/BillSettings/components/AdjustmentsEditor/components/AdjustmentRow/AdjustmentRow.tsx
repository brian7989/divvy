import {
  ActionIcon,
  Group,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import type { Adjustment } from "@/features/bill/domain/bill.schema";
import { useBillStore } from "@/features/bill/store/bill.store";
import {
  centsToDollars,
  dollarsToCents,
} from "@/features/bill/domain/money";

type Props = { adjustmentId: string };

export function AdjustmentRow({ adjustmentId }: Props) {
  const adjustment = useBillStore((state) =>
    state.bill.adjustments.find(({ id }) => id === adjustmentId),
  );
  const saveAdjustment = useBillStore((state) => state.saveAdjustment);
  const removeAdjustment = useBillStore((state) => state.removeAdjustment);
  if (!adjustment) return null;
  const patch = (values: Partial<Adjustment>) =>
    saveAdjustment({ ...adjustment, ...values });
  return (
    <Group gap="xs" wrap="nowrap">
      <Select
        w={96}
        value={adjustment.kind}
        data={[
          { value: "fee", label: "Fee" },
          { value: "discount", label: "Discount" },
        ]}
        onChange={(value) => patch({ kind: value as Adjustment["kind"] })}
      />
      <TextInput
        aria-label="Adjustment label"
        value={adjustment.label}
        onChange={(event) => patch({ label: event.currentTarget.value })}
        style={{ flex: 1 }}
      />
      <NumberInput
        aria-label="Adjustment amount"
        w={100}
        prefix="$"
        decimalScale={2}
        value={centsToDollars(adjustment.amountCents)}
        onChange={(value) => patch({ amountCents: dollarsToCents(value) })}
      />
      <ActionIcon
        color="red"
        variant="subtle"
        aria-label={`Remove ${adjustment.label}`}
        onClick={() => removeAdjustment(adjustment.id)}
      >
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
  );
}
