import { Text, UnstyledButton } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import { formatMoney } from "@/features/bill/domain/money";
import { getItemTotal } from "@/features/bill/domain/getItemTotal";

type Props = { itemId: string };

export function ItemDetails({ itemId }: Props) {
  const item = useBillStore((state) =>
    state.bill.items.find(({ id }) => id === itemId),
  );
  const assignItem = useBillStore((state) => state.assignItem);
  if (!item) return null;
  const total = formatMoney(getItemTotal(item));
  const adjusted = item.discountCents > 0;

  return (
    <UnstyledButton
      onClick={() => assignItem(itemId)}
      style={{
        flex: 1,
        border: 0,
        padding: 0,
        background: "transparent",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <Text fw={700} size="sm">
        {item.name}
      </Text>
      <Text
        c="dimmed"
        size="xs"
        title={adjusted ? "Adjusted after discount" : undefined}
        aria-label={adjusted ? `${total}, adjusted after discount` : undefined}
      >
        {total}
        {adjusted ? "*" : ""}
      </Text>
    </UnstyledButton>
  );
}
