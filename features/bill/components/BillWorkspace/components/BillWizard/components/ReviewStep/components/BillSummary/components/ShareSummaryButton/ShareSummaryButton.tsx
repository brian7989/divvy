import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconShare } from "@tabler/icons-react";
import { useBillTotals } from "@/features/bill/hooks/useBillTotals";
import { useBillStore } from "@/features/bill/store/bill.store";
import { formatMoney } from "@/features/bill/domain/money";

export function ShareSummaryButton() {
  const bill = useBillStore((state) => state.bill);
  const totals = useBillTotals();
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
    <Button
      leftSection={<IconShare size={17} />}
      disabled={totals.unassignedCount > 0 || !bill.items.length}
      onClick={share}
    >
      {totals.unassignedCount ? "Assign all items to finish" : "Share summary"}
    </Button>
  );
}
