import { Button, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useBillStore } from "@/features/bill/store/bill.store";
import { canContinueFromPeople } from "@/features/bill/store/wizard/bill-wizard";
import { BillTitle } from "./components/BillTitle/BillTitle";
import { PeopleBar } from "./components/PeopleBar/PeopleBar";
import styles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";

export function PeopleStep() {
  const peopleCount = useBillStore((state) => state.bill.people.length);
  const titleDraft = useBillStore((state) => state.titleDraft);
  const updateTitle = useBillStore((state) => state.updateTitle);
  const nextStep = useBillStore((state) => state.nextStep);
  const hasTitle = Boolean(titleDraft.trim());
  const canContinue = canContinueFromPeople(peopleCount, titleDraft);

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepIcon}>1</div>
      <Text className={styles.eyebrow}>Step 1</Text>
      <Title className={styles.stepTitle}>Who’s at the table?</Title>
      <Text className={styles.stepIntro}>
        Name the bill and add everyone splitting it.
      </Text>
      <div className={styles.billName}>
        <BillTitle />
      </div>
      <div className={styles.peoplePicker}>
        <PeopleBar />
      </div>
      <Button
        className={styles.primaryAction}
        size="lg"
        radius="xl"
        rightSection={<IconArrowRight size={18} />}
        onClick={() => {
          updateTitle(titleDraft);
          nextStep();
        }}
        disabled={!canContinue}
      >
        {peopleCount === 0
          ? "Add two people to continue"
          : peopleCount === 1
            ? "Add one more person"
          : hasTitle
            ? "Continue"
            : "Name the bill to continue"}
      </Button>
    </div>
  );
}
