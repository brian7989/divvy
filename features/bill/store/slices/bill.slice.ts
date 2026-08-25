import type { StateCreator } from "zustand";
import { createBill, createId } from "@/features/bill/domain/bill.factory";
import type { Bill } from "@/features/bill/domain/bill.schema";
import type { ParsedReceipt } from "@/features/bill/receipt/receipt.schema";
import { getAdjustmentLabel } from "@/features/bill/domain/getAdjustmentLabel";
import type { BillSlice, BillStore } from "../bill-store.types";

/** Stamps a changed bill so persistence and future sync logic can identify it. */
const touch = (bill: Bill): Bill => ({
  ...bill,
  updatedAt: new Date().toISOString(),
});

function getImportedTipPercent(
  receipt: ParsedReceipt,
  currentTipPercent: number,
): number {
  if (!receipt.tipCents || !receipt.subtotalCents) return currentTipPercent;
  return Math.round((receipt.tipCents / receipt.subtotalCents) * 10_000) / 100;
}

/** Merges parsed receipt values without discarding existing manual entries. */
function mergeReceipt(bill: Bill, receipt: ParsedReceipt): Bill {
  return {
    ...bill,
    items: [
      ...bill.items,
      ...receipt.items.map((item) => ({
        id: createId(),
        name: item.name,
        unitPriceCents: item.unitPriceCents,
        discountCents: item.discountCents,
        quantity: item.quantity,
        ownerIds: [],
      })),
    ],
    taxCents: receipt.taxCents ?? bill.taxCents,
    tipPercent: getImportedTipPercent(receipt, bill.tipPercent),
    adjustments: [
      ...bill.adjustments,
      ...receipt.adjustments.map((adjustment) => ({
        id: createId(),
        ...adjustment,
        label: getAdjustmentLabel(adjustment.label, adjustment.kind),
      })),
    ],
  };
}

/**
 * Creates persisted bill state and actions.
 * Mutations refresh `updatedAt` and clean up related references.
 */
export const createBillSlice: StateCreator<BillStore, [], [], BillSlice> = (
  set,
) => ({
  bill: createBill(),
  reset: () => {
    const bill = createBill();
    set({ bill, titleDraft: bill.title });
  },
  updateTitle: (title) =>
    set((state) => {
      const nextTitle = title.trim();
      return nextTitle
        ? { bill: touch({ ...state.bill, title: nextTitle }) }
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
  importReceipt: (receipt) =>
    set((state) => ({ bill: touch(mergeReceipt(state.bill, receipt)) })),
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
