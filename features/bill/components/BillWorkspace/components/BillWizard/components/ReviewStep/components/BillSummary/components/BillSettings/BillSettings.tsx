import {
  Button,
  Collapse,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { useBillStore } from "@/features/bill/store/bill.store";
import { centsToDollars, dollarsToCents } from "@/features/bill/domain/money";
import { AdjustmentsEditor } from "./components/AdjustmentsEditor/AdjustmentsEditor";

export function BillSettings() {
  const [editing, setEditing] = useState(false);
  const taxCents = useBillStore((state) => state.bill.taxCents);
  const tipPercent = useBillStore((state) => state.bill.tipPercent);
  const updateTax = useBillStore((state) => state.updateTax);
  const updateTip = useBillStore((state) => state.updateTip);
  return (
    <>
      <Collapse expanded={editing}>
        <Stack p="sm" bg="gray.0" style={{ borderRadius: 12 }}>
          <NumberInput
            label="Tax"
            prefix="$"
            decimalScale={2}
            min={0}
            value={centsToDollars(taxCents)}
            onChange={(value) => updateTax(dollarsToCents(value))}
          />
          <div>
            <Text size="sm" fw={500} mb={5}>
              Tip
            </Text>
            <SegmentedControl
              fullWidth
              value={String(tipPercent)}
              data={["0", "18", "20", "25"].map((value) => ({
                value,
                label: `${value}%`,
              }))}
              onChange={(value) => updateTip(Number(value))}
            />
          </div>
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
