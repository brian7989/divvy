import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { createId } from "../../model/bill.factory";
import type { Adjustment } from "../../model/bill.schema";
import { useBillStore } from "../../model/bill.store";
import { centsToDollars, dollarsToCents } from "../../model/money";

export function AdjustmentsEditor() {
  const adjustments = useBillStore((state) => state.bill.adjustments);
  const save = useBillStore((state) => state.saveAdjustment);
  const remove = useBillStore((state) => state.removeAdjustment);
  const patch = (adjustment: Adjustment, values: Partial<Adjustment>) =>
    save({ ...adjustment, ...values });
  return (
    <Stack gap="xs">
      {adjustments.map((adjustment) => (
        <Group key={adjustment.id} gap="xs" wrap="nowrap">
          <Select
            w={96}
            value={adjustment.kind}
            data={[
              { value: "fee", label: "Fee" },
              { value: "discount", label: "Discount" },
            ]}
            onChange={(value) =>
              patch(adjustment, { kind: value as Adjustment["kind"] })
            }
          />
          <TextInput
            aria-label="Adjustment label"
            value={adjustment.label}
            onChange={(event) =>
              patch(adjustment, { label: event.currentTarget.value })
            }
            style={{ flex: 1 }}
          />
          <NumberInput
            aria-label="Adjustment amount"
            w={100}
            prefix="$"
            decimalScale={2}
            value={centsToDollars(adjustment.amountCents)}
            onChange={(value) =>
              patch(adjustment, { amountCents: dollarsToCents(value) })
            }
          />
          <ActionIcon
            color="red"
            variant="subtle"
            aria-label={`Remove ${adjustment.label}`}
            onClick={() => remove(adjustment.id)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ))}
      <Button
        size="xs"
        variant="subtle"
        leftSection={<IconPlus size={14} />}
        onClick={() =>
          save({
            id: createId(),
            label: "Service fee",
            amountCents: 0,
            kind: "fee",
          })
        }
      >
        Add fee or discount
      </Button>
    </Stack>
  );
}
