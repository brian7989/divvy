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
      <Text c="dimmed" size="xs">
        {item.quantity > 1 ? `${item.quantity} × ` : ""}
        {formatMoney(item.unitPriceCents)}
        {item.discountCents
          ? ` − ${formatMoney(item.discountCents)} discount · ${formatMoney(getItemTotal(item))} total`
          : ""}
      </Text>
    </UnstyledButton>
  );
}
