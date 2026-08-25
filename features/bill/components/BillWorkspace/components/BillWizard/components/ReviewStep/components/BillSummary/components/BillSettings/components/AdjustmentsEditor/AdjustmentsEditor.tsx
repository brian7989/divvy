import { Stack } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import { AddAdjustmentButton } from "./components/AddAdjustmentButton/AddAdjustmentButton";
import { AdjustmentRow } from "./components/AdjustmentRow/AdjustmentRow";

export function AdjustmentsEditor() {
  const adjustments = useBillStore((state) => state.bill.adjustments);
  return (
    <Stack gap="xs">
      {adjustments.map(({ id }) => (
        <AdjustmentRow key={id} adjustmentId={id} />
      ))}
      <AddAdjustmentButton />
    </Stack>
  );
}
