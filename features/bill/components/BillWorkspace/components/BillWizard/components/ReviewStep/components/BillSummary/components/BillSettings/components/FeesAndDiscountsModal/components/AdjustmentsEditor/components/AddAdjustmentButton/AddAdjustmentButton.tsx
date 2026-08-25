import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { createId } from "@/features/bill/domain/bill.factory";
import { useBillStore } from "@/features/bill/store/bill.store";

export function AddAdjustmentButton() {
  const saveAdjustment = useBillStore((state) => state.saveAdjustment);
  return (
    <Button
      size="xs"
      variant="subtle"
      leftSection={<IconPlus size={14} />}
      onClick={() =>
        saveAdjustment({
          id: createId(),
          label: "Service fee",
          amountCents: 0,
          kind: "fee",
        })
      }
    >
      Add fee or discount
    </Button>
  );
}
