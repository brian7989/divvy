import { Button, NumberInput, SegmentedControl, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { centsToDollars, dollarsToCents } from "@/features/bill/domain/money";
import { useBillStore } from "@/features/bill/store/bill.store";
import { FeesAndDiscountsModal } from "./components/FeesAndDiscountsModal/FeesAndDiscountsModal";

const TIP_OPTIONS = ["0", "18", "20", "25"];

export function BillSettings() {
  const [opened, setOpened] = useState(false);
  const taxCents = useBillStore((state) => state.bill.taxCents);
  const tipPercent = useBillStore((state) => state.bill.tipPercent);
  const updateTax = useBillStore((state) => state.updateTax);
  const updateTip = useBillStore((state) => state.updateTip);
  const selectedTip = TIP_OPTIONS.includes(String(tipPercent))
    ? String(tipPercent)
    : "";

  return (
    <Stack gap="sm">
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
          value={selectedTip}
          data={TIP_OPTIONS.map((value) => ({
            value,
            label: `${value}%`,
          }))}
          onChange={(value) => updateTip(Number(value))}
        />
      </Stack>
      <Button
        variant="subtle"
        size="compact-sm"
        onClick={() => setOpened(true)}
      >
        Edit fees & discounts
      </Button>
      <FeesAndDiscountsModal
        opened={opened}
        onClose={() => setOpened(false)}
      />
    </Stack>
  );
}
