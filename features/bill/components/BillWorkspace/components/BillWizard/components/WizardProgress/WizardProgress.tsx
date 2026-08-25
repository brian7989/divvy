import { UnstyledButton } from "@mantine/core";
import { useBillStore } from "@/features/bill/store/bill.store";
import { BILL_WIZARD_STEPS } from "@/features/bill/store/wizard/bill-wizard";
import { BILL_WIZARD_STEP_DEFINITIONS } from "../../bill-wizard.steps";
import styles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";

export function WizardProgress() {
  const currentStep = useBillStore((state) => state.wizardStep);
  const goToStep = useBillStore((state) => state.goToStep);

  return (
    <nav className={styles.progress} aria-label="Bill setup progress">
      {BILL_WIZARD_STEP_DEFINITIONS.map(({ id, label }, index) => {
        const isCurrent = id === currentStep;
        const isComplete = index < BILL_WIZARD_STEPS.indexOf(currentStep);
        return (
          <UnstyledButton
            key={id}
            className={styles.progressStep}
            data-active={isCurrent || undefined}
            data-complete={isComplete || undefined}
            onClick={() => isComplete && goToStep(id)}
            disabled={!isComplete}
            aria-current={isCurrent ? "step" : undefined}
          >
            <span className={styles.progressDot}>{index + 1}</span>
            <span>{label}</span>
          </UnstyledButton>
        );
      })}
    </nav>
  );
}
