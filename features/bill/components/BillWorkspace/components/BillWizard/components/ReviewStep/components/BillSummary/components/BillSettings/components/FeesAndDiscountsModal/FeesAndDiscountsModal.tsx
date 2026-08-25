import { Button, Modal } from "@mantine/core";
import modalStyles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";
import { AdjustmentsEditor } from "./components/AdjustmentsEditor/AdjustmentsEditor";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export function FeesAndDiscountsModal({ opened, onClose }: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Fees & discounts"
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
          <AdjustmentsEditor />
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
