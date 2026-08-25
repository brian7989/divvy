import { create } from "zustand";
import type { Adjustment, Bill, BillItem, Person } from "./bill.schema";
import { createBill } from "./bill.factory";

type BillStore = {
  bill: Bill;
  hydrated: boolean;
  hydrate: (bill: Bill) => void;
  reset: () => void;
  updateTitle: (title: string) => void;
  addPerson: (person: Person) => void;
  removePerson: (personId: string) => void;
  saveItem: (item: BillItem) => void;
  removeItem: (itemId: string) => void;
  setOwners: (itemId: string, ownerIds: string[]) => void;
  updateTax: (taxCents: number) => void;
  updateTip: (tipPercent: number) => void;
  saveAdjustment: (adjustment: Adjustment) => void;
  removeAdjustment: (adjustmentId: string) => void;
};

const touch = (bill: Bill): Bill => ({
  ...bill,
  updatedAt: new Date().toISOString(),
});

export const useBillStore = create<BillStore>((set) => ({
  bill: createBill(),
  hydrated: false,
  hydrate: (bill) => set({ bill, hydrated: true }),
  reset: () => set({ bill: createBill(), hydrated: true }),
  updateTitle: (title) =>
    set((state) => ({ bill: touch({ ...state.bill, title }) })),
  addPerson: (person) =>
    set((state) => ({
      bill: touch({ ...state.bill, people: [...state.bill.people, person] }),
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
}));
