import { Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useBillStore } from "@/features/bill/store/bill.store";

export function ServiceFeeWarning() {
  const bill = useBillStore((state) => state.bill);
  const hasServiceFee = bill.adjustments.some(
    ({ kind, label }) => kind === "fee" && /service|gratuity/i.test(label),
  );
  if (!hasServiceFee || bill.tipPercent <= 0) return null;
  return (
    <Alert color="lime" icon={<IconAlertCircle size={16} />} p="sm">
      A service fee is included. Check whether gratuity is already covered.
    </Alert>
  );
}
