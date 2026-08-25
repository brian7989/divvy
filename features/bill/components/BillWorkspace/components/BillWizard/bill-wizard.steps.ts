import type { ComponentType } from "react";
import type { BillWizardStep } from "@/features/bill/store/wizard/bill-wizard";
import { EntryMethodStep } from "./components/EntryMethodStep/EntryMethodStep";
import { ItemsStep } from "./components/ItemsStep/ItemsStep";
import { PeopleStep } from "./components/PeopleStep/PeopleStep";
import { ReviewStep } from "./components/ReviewStep/ReviewStep";

type WizardStepDefinition = {
  id: BillWizardStep;
  label: string;
  component: ComponentType;
};

export const BILL_WIZARD_STEP_DEFINITIONS = [
  { id: "people", label: "People", component: PeopleStep },
  { id: "entry", label: "Items", component: EntryMethodStep },
  { id: "assign", label: "Assign", component: ItemsStep },
  { id: "review", label: "Split", component: ReviewStep },
] satisfies readonly WizardStepDefinition[];
