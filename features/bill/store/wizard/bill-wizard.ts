export const BILL_WIZARD_STEPS = [
  "people",
  "entry",
  "assign",
  "review",
] as const;

export type BillWizardStep = (typeof BILL_WIZARD_STEPS)[number];

/** Returns the adjacent step while keeping navigation inside the wizard. */
export function getAdjacentStep(
  currentStep: BillWizardStep,
  direction: -1 | 1,
): BillWizardStep {
  const currentIndex = BILL_WIZARD_STEPS.indexOf(currentStep);
  const nextIndex = Math.max(
    0,
    Math.min(BILL_WIZARD_STEPS.length - 1, currentIndex + direction),
  );
  return BILL_WIZARD_STEPS[nextIndex];
}
