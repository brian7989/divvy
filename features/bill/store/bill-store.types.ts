import type {
  Adjustment,
  Bill,
  BillItem,
  Person,
} from "@/features/bill/domain/bill.schema";
import type { BillWizardStep } from "./wizard/bill-wizard";

/** Persisted bill data and every action that mutates that data. */
export type BillSlice = {
  bill: Bill;
  reset: () => void;
  updateTitle: (title: string) => void;
  addPerson: (person: Person) => void;
  updatePersonName: (personId: string, name: string) => void;
  removePerson: (personId: string) => void;
  saveItem: (item: BillItem) => void;
  removeItem: (itemId: string) => void;
  setOwners: (itemId: string, ownerIds: string[]) => void;
  updateTax: (taxCents: number) => void;
  updateTip: (tipPercent: number) => void;
  saveAdjustment: (adjustment: Adjustment) => void;
  removeAdjustment: (adjustmentId: string) => void;
};

/** Ephemeral modal/navigation state that should reset when the app reloads. */
export type BillUiSlice = {
  wizardStep: BillWizardStep;
  peopleOpen: boolean;
  editingItemId: string | null | undefined;
  assigningItemId: string | null;
  goToStep: (step: BillWizardStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  openPeople: () => void;
  closePeople: () => void;
  addItem: () => void;
  editItem: (itemId: string) => void;
  closeItemEditor: () => void;
  assignItem: (itemId: string) => void;
  closeAssignment: () => void;
  editAssignedItem: (itemId: string) => void;
};

/** Complete Zustand store assembled from the persisted data and transient UI slices. */
export type BillStore = BillSlice & BillUiSlice;
