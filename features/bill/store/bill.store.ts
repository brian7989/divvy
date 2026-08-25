import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BillSchema, type Bill } from "@/features/bill/domain/bill.schema";
import type { BillStore } from "./bill-store.types";
import { createBillSlice } from "./slices/bill.slice";
import { createBillUiSlice } from "./slices/bill-ui.slice";

type PersistedBillState = { bill: Bill };

/**
 * Global bill store. Bill data is persisted and validated; UI state is transient.
 * `useBillHydration` starts restoration explicitly to keep SSR predictable.
 */
export const useBillStore = create<BillStore>()(
  persist<BillStore, [], [], PersistedBillState>(
    (...args) => ({
      ...createBillSlice(...args),
      ...createBillUiSlice(...args),
    }),
    {
      name: "divvy-bill-v2",
      version: 2,
      skipHydration: true,
      partialize: ({ bill }) => ({ bill }),
      merge: (persistedState, currentState) => {
        const result = BillSchema.safeParse(
          (persistedState as Partial<PersistedBillState> | undefined)?.bill,
        );
        return result.success
          ? {
              ...currentState,
              bill: result.data,
              titleDraft: result.data.title,
            }
          : currentState;
      },
    },
  ),
);
