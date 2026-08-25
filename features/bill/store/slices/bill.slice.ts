import type { StateCreator } from "zustand";
import { createBill } from "@/features/bill/domain/bill.factory";
import type { Bill } from "@/features/bill/domain/bill.schema";
import type { BillSlice, BillStore } from "../bill-store.types";

/** Stamps a changed bill so persistence and future sync logic can identify it. */
const touch = (bill: Bill): Bill => ({
  ...bill,
  updatedAt: new Date().toISOString(),
});

/**
 * Creates persisted bill state and actions.
 * Mutations refresh `updatedAt` and clean up related references.
 */
export const createBillSlice: StateCreator<BillStore, [], [], BillSlice> = (
  set,
) => ({
  bill: createBill(),
  reset: () => set({ bill: createBill() }),
  updateTitle: (title) =>
    set((state) => {
      return title.trim()
        ? { bill: touch({ ...state.bill, title }) }
        : state;
    }),
  addPerson: (person) =>
    set((state) => ({
      bill: touch({ ...state.bill, people: [...state.bill.people, person] }),
    })),
  updatePersonName: (personId, name) =>
    set((state) => ({
      bill: touch({
        ...state.bill,
        people: state.bill.people.map((person) =>
          person.id === personId ? { ...person, name } : person,
        ),
      }),
    })),
  removePerson: (personId) =>
    set((state) => ({
      bill: touch({
        ...state.bill,
        people: state.bill.people.filter(({ id }) => id !== personId),
        items: state.bill.items.map((item) => ({
          ...item,
          ownerIds: item.ownerIds.filter((id) => id !== personId),
        })),
      }),
    })),
  saveItem: (item) =>
    set((state) => ({
      bill: touch({
        ...state.bill,
        items: state.bill.items.some(({ id }) => id === item.id)
          ? state.bill.items.map((current) =>
              current.id === item.id ? item : current,
            )
          : [...state.bill.items, item],
      }),
    })),
  removeItem: (itemId) =>
    set((state) => ({
      bill: touch({
        ...state.bill,
        items: state.bill.items.filter(({ id }) => id !== itemId),
      }),
    })),
  setOwners: (itemId, ownerIds) =>
    set((state) => ({
      bill: touch({
        ...state.bill,
        items: state.bill.items.map((item) =>
          item.id === itemId ? { ...item, ownerIds } : item,
        ),
      }),
    })),
  updateTax: (taxCents) =>
    set((state) => ({ bill: touch({ ...state.bill, taxCents }) })),
  updateTip: (tipPercent) =>
    set((state) => ({ bill: touch({ ...state.bill, tipPercent }) })),
  saveAdjustment: (adjustment) =>
    set((state) => ({
      bill: touch({
        ...state.bill,
        adjustments: state.bill.adjustments.some(
          ({ id }) => id === adjustment.id,
        )
          ? state.bill.adjustments.map((current) =>
              current.id === adjustment.id ? adjustment : current,
            )
          : [...state.bill.adjustments, adjustment],
      }),
    })),
  removeAdjustment: (adjustmentId) =>
    set((state) => ({
      bill: touch({
        ...state.bill,
        adjustments: state.bill.adjustments.filter(
          ({ id }) => id !== adjustmentId,
        ),
      }),
    })),
});
