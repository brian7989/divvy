import {
  Alert,
  Button,
  Card,
  Collapse,
  Divider,
  Group,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconShare } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { calculateBill } from "../../model/calculateBill";
import { useBillStore } from "../../model/bill.store";
import { centsToDollars, dollarsToCents, formatMoney } from "../../model/money";
import { AdjustmentsEditor } from "./AdjustmentsEditor";

export function BillSummary() {
  const bill = useBillStore((state) => state.bill);
  const updateTax = useBillStore((state) => state.updateTax);
  const updateTip = useBillStore((state) => state.updateTip);
  const [editing, setEditing] = useState(false);
  const totals = useMemo(() => calculateBill(bill), [bill]);
  const hasServiceFee = bill.adjustments.some(
    ({ kind, label }) => kind === "fee" && /service|gratuity/i.test(label),
  );

  const share = async () => {
    const text = [
      bill.title,
      ...totals.shares.map(
        ({ person, totalCents }) =>
          `${person.name}: ${formatMoney(totalCents)}`,
      ),
      `Total: ${formatMoney(totals.totalCents)}`,
    ].join("\n");
    try {
      if (navigator.share) await navigator.share({ title: bill.title, text });
      else {
        await navigator.clipboard.writeText(text);
        notifications.show({
          message: "Summary copied to clipboard",
          color: "teal",
        });
      }
    } catch {
      /* The user cancelled the share sheet. */
    }
  };

  return (
    <Card withBorder radius="xl" p="xl" shadow="lg">
      <Text tt="uppercase" size="xs" fw={800} c="dimmed">
        2 · Settle up
      </Text>
      <Title order={2} mt="xs" mb="lg">
        Your split
      </Title>
      <Stack gap="sm">
        <SummaryRow
          label="Subtotal"
          value={formatMoney(totals.subtotalCents)}
        />
        <SummaryRow
          label="Tax & adjustments"
          value={formatMoney(bill.taxCents + totals.adjustmentsCents)}
        />
        <SummaryRow
          label="Tip · pre-tax"
          value={formatMoney(totals.tipCents)}
        />
        <Collapse expanded={editing}>
          <Stack p="sm" bg="gray.0" style={{ borderRadius: 12 }}>
            <NumberInput
              label="Tax"
              prefix="$"
              decimalScale={2}
              min={0}
              value={centsToDollars(bill.taxCents)}
              onChange={(value) => updateTax(dollarsToCents(value))}
            />
            <div>
              <Text size="sm" fw={500} mb={5}>
                Tip
              </Text>
              <SegmentedControl
                fullWidth
                value={String(bill.tipPercent)}
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
        <Divider />
        <Group justify="space-between">
          <Text fw={800}>Total</Text>
          <Text fw={800} size="xl">
            {formatMoney(totals.totalCents)}
          </Text>
        </Group>
        {hasServiceFee && bill.tipPercent > 0 && (
          <Alert color="yellow" icon={<IconAlertCircle size={16} />} p="sm">
            A service fee is included. Check whether gratuity is already
            covered.
          </Alert>
        )}
        <Stack gap={4}>
          {totals.shares.map(({ person, totalCents }) => (
            <Group key={person.id} justify="space-between">
              <Group gap="xs">
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 99,
                    background: person.color,
                  }}
                />
                <Text size="sm">{person.name}</Text>
              </Group>
              <Text fw={700} size="sm">
                {formatMoney(totalCents)}
              </Text>
            </Group>
          ))}
        </Stack>
        <Button
          leftSection={<IconShare size={17} />}
          disabled={totals.unassignedCount > 0 || !bill.items.length}
          onClick={share}
        >
          {totals.unassignedCount
            ? "Assign all items to finish"
            : "Share summary"}
        </Button>
      </Stack>
    </Card>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Group justify="space-between">
      <Text c="dimmed" size="sm">
        {label}
      </Text>
      <Text fw={700}>{value}</Text>
    </Group>
  );
}
