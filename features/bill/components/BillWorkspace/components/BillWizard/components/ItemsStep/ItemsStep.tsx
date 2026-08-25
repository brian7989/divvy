import { Button, Group, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useBillStore } from "@/features/bill/store/bill.store";
import { ItemList } from "./components/ItemList/ItemList";
import { WizardStepLayout } from "../WizardStepLayout/WizardStepLayout";
import styles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";

export function ItemsStep() {
  const items = useBillStore((state) => state.bill.items);
  const unassignedCount = items.filter((item) => !item.ownerIds.length).length;
  const nextStep = useBillStore((state) => state.nextStep);
  const previousStep = useBillStore((state) => state.previousStep);
  const canContinue = items.length > 0 && unassignedCount === 0;

  const actions = (
    <Group className={styles.stepActions} justify="space-between">
      <Button
        variant="subtle"
        color="party"
        leftSection={<IconArrowLeft size={18} />}
        onClick={previousStep}
      >
        Back
      </Button>
      <Button
        size="lg"
        radius="xl"
        rightSection={<IconArrowRight size={18} />}
        onClick={nextStep}
        disabled={!canContinue}
      >
        {!items.length
          ? "Add an item"
          : unassignedCount
            ? `Assign ${unassignedCount} more`
            : "Review the split"}
      </Button>
    </Group>
  );

  return (
    <WizardStepLayout actions={actions}>
      <div className={styles.stepIcon}>3</div>
      <Text className={styles.eyebrow}>Step 3</Text>
      <Title className={styles.stepTitle}>Add and assign items</Title>
      <Text className={styles.stepIntro}>
        Assign at least one person to every item.
      </Text>
      <div className={styles.itemWorkspace}>
        <ItemList />
      </div>
    </WizardStepLayout>
  );
}
