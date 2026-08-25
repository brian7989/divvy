import type { StateCreator } from "zustand";
import { DEFAULT_BILL_TITLE } from "@/features/bill/domain/bill.factory";
import type { BillStore, BillUiSlice } from "../bill-store.types";
import {
  canContinueFromPeople,
  getAdjacentStep,
} from "../wizard/bill-wizard";

/**
 * Creates transient modal state. Item IDs use undefined=closed, null=new,
 * and string=edit existing.
 */
export const createBillUiSlice: StateCreator<BillStore, [], [], BillUiSlice> = (
  set,
) => ({
  wizardStep: "people",
  titleDraft: DEFAULT_BILL_TITLE,
  peopleOpen: false,
  editingItemId: undefined,
  assigningItemId: null,
  goToStep: (wizardStep) => set({ wizardStep }),
  setTitleDraft: (titleDraft) => set({ titleDraft }),
  nextStep: () =>
    set((state) => {
      if (
        state.wizardStep === "people" &&
        !canContinueFromPeople(state.bill.people.length, state.titleDraft)
      )
        return state;
      return { wizardStep: getAdjacentStep(state.wizardStep, 1) };
    }),
  previousStep: () =>
    set((state) => ({ wizardStep: getAdjacentStep(state.wizardStep, -1) })),
  openPeople: () => set({ peopleOpen: true }),
  closePeople: () => set({ peopleOpen: false }),
  addItem: () => set({ editingItemId: null }),
  editItem: (editingItemId) => set({ editingItemId }),
  closeItemEditor: () => set({ editingItemId: undefined }),
  assignItem: (assigningItemId) => set({ assigningItemId }),
  closeAssignment: () => set({ assigningItemId: null }),
  editAssignedItem: (editingItemId) =>
    set({ assigningItemId: null, editingItemId }),
});
