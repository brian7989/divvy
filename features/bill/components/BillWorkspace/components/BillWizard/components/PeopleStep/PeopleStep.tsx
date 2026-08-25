import { Button, Text, Title } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useBillStore } from "@/features/bill/store/bill.store";
import { BillTitle } from "./components/BillTitle/BillTitle";
import { PeopleBar } from "./components/PeopleBar/PeopleBar";
import styles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";

export function PeopleStep() {
  const peopleCount = useBillStore((state) => state.bill.people.length);
  const nextStep = useBillStore((state) => state.nextStep);

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
        onClick={nextStep}
        disabled={!peopleCount}
      >
        {peopleCount ? "Continue" : "Add a person to continue"}
      </Button>
    </div>
  );
}
