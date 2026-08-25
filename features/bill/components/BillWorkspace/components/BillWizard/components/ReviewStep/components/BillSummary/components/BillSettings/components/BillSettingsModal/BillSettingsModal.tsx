import {
  Button,
  Modal,
  NumberInput,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { centsToDollars, dollarsToCents } from "@/features/bill/domain/money";
import { useBillStore } from "@/features/bill/store/bill.store";
import modalStyles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";
import { AdjustmentsEditor } from "../AdjustmentsEditor/AdjustmentsEditor";

type Props = {
  opened: boolean;
  onClose: () => void;
};

const TIP_OPTIONS = ["0", "18", "20", "25"];

export function BillSettingsModal({ opened, onClose }: Props) {
  const taxCents = useBillStore((state) => state.bill.taxCents);
  const tipPercent = useBillStore((state) => state.bill.tipPercent);
  const updateTax = useBillStore((state) => state.updateTax);
  const updateTip = useBillStore((state) => state.updateTip);
  const selectedTip = TIP_OPTIONS.includes(String(tipPercent))
    ? String(tipPercent)
    : "";

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Tax, tip & discounts"
      centered
      classNames={{
        inner: modalStyles.modalInner,
        content: modalStyles.modalContent,
        header: modalStyles.modalHeader,
        title: modalStyles.modalTitle,
        body: modalStyles.modalBody,
        close: modalStyles.closeButton,
      }}
      transitionProps={{ transition: "slide-up", duration: 180 }}
    >
      <div className={modalStyles.sheetLayout}>
        <div className={modalStyles.sheetBody}>
          <Stack gap="lg">
            <NumberInput
              className={modalStyles.numberInput}
              size="md"
              label="Tax"
              prefix="$"
              decimalScale={2}
              min={0}
              hideControls
              value={centsToDollars(taxCents)}
              onChange={(value) => updateTax(dollarsToCents(value))}
            />
            <Stack gap="xs">
              <Text size="sm" fw={600}>
                Tip
              </Text>
              <SegmentedControl
                fullWidth
                size="md"
                value={selectedTip}
                data={TIP_OPTIONS.map((value) => ({
                  value,
                  label: `${value}%`,
                }))}
                onChange={(value) => updateTip(Number(value))}
              />
              <NumberInput
                className={modalStyles.numberInput}
                size="md"
                label="Custom tip"
                suffix="%"
                decimalScale={2}
                min={0}
                max={100}
                hideControls
                value={tipPercent}
                onChange={(value) => updateTip(Number(value) || 0)}
              />
            </Stack>
            <Stack gap="xs">
              <Text size="sm" fw={600}>
                Fees & discounts
              </Text>
              <AdjustmentsEditor />
            </Stack>
          </Stack>
        </div>
        <div className={modalStyles.sheetFooter}>
          <Button fullWidth size="md" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
