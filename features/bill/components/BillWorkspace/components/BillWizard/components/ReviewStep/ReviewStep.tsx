import { Button, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useBillStore } from "@/features/bill/store/bill.store";
import { BillSummary } from "./components/BillSummary/BillSummary";
import { WizardStepLayout } from "../WizardStepLayout/WizardStepLayout";
import styles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";

export function ReviewStep() {
  const previousStep = useBillStore((state) => state.previousStep);

  const actions = (
    <Button
      variant="subtle"
      color="party"
      leftSection={<IconArrowLeft size={18} />}
      onClick={previousStep}
    >
      Back to items
    </Button>
  );

  return (
    <WizardStepLayout actions={actions}>
      <div className={styles.stepIcon}>4</div>
      <Text className={styles.eyebrow}>Step 4</Text>
      <Title className={styles.stepTitle}>Review the split</Title>
      <Text className={styles.stepIntro}>
        Add tax, tip, and fees before sharing.
      </Text>
      <div className={styles.reviewCard}>
        <BillSummary />
      </div>
    </WizardStepLayout>
  );
}
