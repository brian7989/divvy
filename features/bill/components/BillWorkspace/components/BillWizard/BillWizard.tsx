import { useBillStore } from "@/features/bill/store/bill.store";
import { WizardProgress } from "./components/WizardProgress/WizardProgress";
import { BILL_WIZARD_STEP_DEFINITIONS } from "./bill-wizard.steps";
import styles from "../../BillWorkspace.module.css";

export function BillWizard() {
  const step = useBillStore((state) => state.wizardStep);
  const activeStep = BILL_WIZARD_STEP_DEFINITIONS.find(
    ({ id }) => id === step,
  );
  const ActiveStep = activeStep?.component;

  if (!ActiveStep) return null;

  return (
    <section className={styles.wizard}>
      <WizardProgress />
      <div className={styles.stepPanel} key={step}>
        <ActiveStep />
      </div>
    </section>
  );
}
