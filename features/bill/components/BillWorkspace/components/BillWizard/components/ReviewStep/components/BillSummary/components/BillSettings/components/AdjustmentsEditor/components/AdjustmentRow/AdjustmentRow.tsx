import { ActionIcon, NumberInput, Select, TextInput } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import type { Adjustment } from "@/features/bill/domain/bill.schema";
import { useBillStore } from "@/features/bill/store/bill.store";
import {
  centsToDollars,
  dollarsToCents,
} from "@/features/bill/domain/money";
import styles from "./AdjustmentRow.module.css";

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
    <div className={styles.row}>
      <TextInput
        className={styles.label}
        aria-label="Adjustment label"
        placeholder={adjustment.kind === "fee" ? "Fee name" : "Discount name"}
        value={adjustment.label}
        onChange={(event) => patch({ label: event.currentTarget.value })}
      />
      <Select
        className={styles.kind}
        value={adjustment.kind}
        data={[
          { value: "fee", label: "Fee" },
          { value: "discount", label: "Discount" },
        ]}
        onChange={(value) => patch({ kind: value as Adjustment["kind"] })}
      />
      <NumberInput
        className={styles.amount}
        aria-label="Adjustment amount"
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
    </div>
  );
}
