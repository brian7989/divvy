import Dexie, { type EntityTable } from "dexie";
import { BillSchema, type Bill } from "../model/bill.schema";

const LEGACY_KEY = "divvy-bill-v1";

class DivvyDatabase extends Dexie {
  bills!: EntityTable<Bill, "id">;
  constructor() {
    super("divvy");
    this.version(1).stores({ bills: "id, updatedAt" });
  }
}

let database: DivvyDatabase | undefined;
const getDatabase = () => (database ??= new DivvyDatabase());

export const billRepository = {
  async loadLatest(): Promise<Bill | null> {
    const saved = await getDatabase().bills.orderBy("updatedAt").last();
    const result = BillSchema.safeParse(saved);
    if (result.success) return result.data;
    window.localStorage.removeItem(LEGACY_KEY);
    return null;
  },
  async save(bill: Bill): Promise<void> {
    const parsed = BillSchema.parse(bill);
    await getDatabase().bills.put(parsed);
  },
};
