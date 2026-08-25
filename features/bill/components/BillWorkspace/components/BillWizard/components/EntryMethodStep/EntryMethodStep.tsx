import { Button, Text, Title, UnstyledButton } from "@mantine/core";
import {
  IconArrowLeft,
  IconArrowRight,
  IconPencil,
  IconReceipt,
  IconSparkles,
} from "@tabler/icons-react";
import { useBillStore } from "@/features/bill/store/bill.store";
import styles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";

export function EntryMethodStep() {
  const goToStep = useBillStore((state) => state.goToStep);
  const previousStep = useBillStore((state) => state.previousStep);

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIcon}>2</div>
      <Text className={styles.eyebrow}>Step 2</Text>
      <Title className={styles.stepTitle}>How are we adding items?</Title>
      <Text className={styles.stepIntro}>
        Add them manually or upload a receipt.
      </Text>
      <div className={styles.methodGrid}>
        <UnstyledButton
          className={styles.methodCard}
          onClick={() => goToStep("assign")}
        >
          <span className={styles.methodIcon}>
            <IconPencil size={24} />
          </span>
          <strong>Add manually</strong>
          <span>Enter each item</span>
          <IconArrowRight className={styles.methodArrow} size={20} />
        </UnstyledButton>
        <div className={styles.methodCard} data-disabled>
          <span className={styles.comingSoon}>
            <IconSparkles size={13} /> Coming soon
          </span>
          <span className={styles.methodIcon}>
            <IconReceipt size={24} />
          </span>
          <strong>Upload receipt</strong>
          <span>Scan items automatically</span>
        </div>
      </div>
      <Button
        variant="subtle"
        color="party"
        leftSection={<IconArrowLeft size={18} />}
        onClick={previousStep}
      >
        Back
      </Button>
    </div>
  );
}
