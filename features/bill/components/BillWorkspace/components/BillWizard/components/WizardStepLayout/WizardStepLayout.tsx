import type { ReactNode } from "react";
import styles from "@/features/bill/components/BillWorkspace/BillWorkspace.module.css";

type Props = {
  children: ReactNode;
  actions: ReactNode;
};

/** Keeps wizard content scrollable while actions remain reachable on mobile. */
export function WizardStepLayout({ children, actions }: Props) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.stepBody}>{children}</div>
      <div className={styles.stepFooter}>{actions}</div>
    </div>
  );
}

