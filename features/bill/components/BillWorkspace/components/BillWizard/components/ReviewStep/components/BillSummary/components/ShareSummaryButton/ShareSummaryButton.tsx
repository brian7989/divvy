import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconShare } from "@tabler/icons-react";
import { useState } from "react";
import { useBillTotals } from "@/features/bill/hooks/useBillTotals";
import { useBillStore } from "@/features/bill/store/bill.store";
import { shareBillImage } from "@/features/bill/share/shareBillImage";

export function ShareSummaryButton() {
  const [creating, setCreating] = useState(false);
  const bill = useBillStore((state) => state.bill);
  const totals = useBillTotals();
  const share = async () => {
    setCreating(true);
    try {
      const result = await shareBillImage(bill);
      if (result === "downloaded")
        notifications.show({
          message: "Split image downloaded",
          color: "party",
        });
    } catch (error) {
      notifications.show({
        title: "Could not create the image",
        message: error instanceof Error ? error.message : "Try again.",
        color: "red",
      });
    } finally {
      setCreating(false);
    }
  };
  return (
    <Button
      leftSection={<IconShare size={17} />}
      disabled={creating || totals.unassignedCount > 0 || !bill.items.length}
      loading={creating}
      onClick={share}
    >
      {totals.unassignedCount ? "Assign all items to finish" : "Share image"}
    </Button>
  );
}
