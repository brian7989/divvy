import {
  Button,
  Collapse,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { centsToDollars, dollarsToCents } from "@/features/bill/domain/money";
import { useBillStore } from "@/features/bill/store/bill.store";
import { AdjustmentsEditor } from "./components/AdjustmentsEditor/AdjustmentsEditor";

const TIP_OPTIONS = ["0", "18", "20", "25"];

export function BillSettings() {
  const [editing, setEditing] = useState(false);
  const taxCents = useBillStore((state) => state.bill.taxCents);
  const tipPercent = useBillStore((state) => state.bill.tipPercent);
  const updateTax = useBillStore((state) => state.updateTax);
  const updateTip = useBillStore((state) => state.updateTip);

  return (
    <>
      <Collapse expanded={editing}>
        <Stack p="sm" gap="sm" bg="gray.0" style={{ borderRadius: 12 }}>
          <NumberInput
            label="Tax"
            prefix="$"
            decimalScale={2}
            min={0}
            hideControls
            value={centsToDollars(taxCents)}
            onChange={(value) => updateTax(dollarsToCents(value))}
          />
          <Stack gap={5}>
            <Text size="sm" fw={500}>
              Tip
            </Text>
            <SegmentedControl
              fullWidth
              value={String(tipPercent)}
              data={TIP_OPTIONS.map((value) => ({
                value,
                label: `${value}%`,
              }))}
              onChange={(value) => updateTip(Number(value))}
            />
          </Stack>
          <AdjustmentsEditor />
        </Stack>
      </Collapse>
      <Button
        variant="subtle"
        size="compact-sm"
        onClick={() => setEditing((value) => !value)}
      >
        {editing ? "Hide details" : "Edit tax, tip & fees"}
      </Button>
    </>
  );
}
