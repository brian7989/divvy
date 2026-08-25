import { describe, expect, it } from "vitest";
import type { Bill, BillItem, Person } from "./bill.schema";
import { allocateBillItems } from "./allocateBillItems";
import { calculateBill } from "./calculateBill";

const bill: Bill = {
  id: "bill",
  version: 2,
  title: "Test",
  updatedAt: "2026-01-01T00:00:00.000Z",
  people: [
    { id: "a", name: "A", color: "red" },
    { id: "b", name: "B", color: "blue" },
    { id: "c", name: "C", color: "green" },
  ],
  items: [
    {
      id: "item",
      name: "Shared",
      unitPriceCents: 1000,
      discountCents: 0,
      quantity: 1,
      ownerIds: ["a", "b", "c"],
    },
  ],
  taxCents: 83,
  tipPercent: 20,
  adjustments: [{ id: "fee", label: "Fee", amountCents: 17, kind: "fee" }],
};

describe("calculateBill", () => {
  it("keeps equally responsible people on the same cent amount", () => {
    const totals = calculateBill(bill);
    expect(totals.shares.map(({ totalCents }) => totalCents)).toEqual([
      433, 433, 433,
    ]);
    expect(totals.totalCents).toBe(1299);
    expect(totals.roundingCents).toBe(-1);
  });
  it("prefers equal payments over assigning an indivisible cent", () => {
    const totals = calculateBill({
      ...bill,
      taxCents: 0,
      tipPercent: 0,
      adjustments: [],
    });
    expect(totals.shares.map(({ totalCents }) => totalCents)).toEqual([
      333, 333, 333,
    ]);
    expect(totals.roundingCents).toBe(-1);
  });
  it("reports unassigned items", () => {
    const totals = calculateBill({
      ...bill,
      items: [{ ...bill.items[0], ownerIds: [] }],
    });
    expect(totals.unassignedCount).toBe(1);
    expect(totals.shares.every(({ totalCents }) => totalCents === 0)).toBe(
      true,
    );
  });
  it("applies an item discount before splitting its owners", () => {
    const totals = calculateBill({
      ...bill,
      taxCents: 0,
      tipPercent: 0,
      adjustments: [],
      items: [{ ...bill.items[0], discountCents: 100 }],
    });
    expect(totals.subtotalCents).toBe(900);
    expect(totals.shares.map(({ totalCents }) => totalCents)).toEqual([
      300, 300, 300,
    ]);
  });

  it("equalizes a seven-way receipt split across several rounded items", () => {
    const people = Array.from({ length: 9 }, (_, index) => ({
      id: String(index),
      name: String(index),
      color: "purple",
    }));
    const ownerIds = people.slice(0, 7).map(({ id }) => id);
    const totals = calculateBill({
      ...bill,
      people,
      items: [340, 300, 469].map((unitPriceCents, index) => ({
        id: String(index),
        name: String(index),
        unitPriceCents,
        discountCents: 0,
        quantity: 1,
        ownerIds,
      })),
      taxCents: 109,
      tipPercent: (219 / 1109) * 100,
      adjustments: [],
    });
    expect(totals.shares.map(({ totalCents }) => totalCents)).toEqual([
      ...Array(7).fill(205),
      0,
      0,
    ]);
    expect(totals.totalCents).toBe(1435);
    expect(totals.roundingCents).toBe(-2);
  });

  it("still reconciles mixed ownership exactly", () => {
    const totals = calculateBill({
      ...bill,
      taxCents: 0,
      tipPercent: 0,
      adjustments: [],
      items: [
        { ...bill.items[0], ownerIds: ["a", "b"] },
        {
          ...bill.items[0],
          id: "second",
          unitPriceCents: 101,
          ownerIds: ["b", "c"],
        },
      ],
    });
    expect(totals.roundingCents).toBe(0);
    expect(totals.shares.reduce((sum, share) => sum + share.totalCents, 0)).toBe(
      1101,
    );
  });
});
function createPeople(count: number): Person[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `person-${index}`,
    name: `Person ${index}`,
    color: "purple",
  }));
}

function createItem(
  id: string,
  totalCents: number,
  ownerIds: string[],
): BillItem {
  return {
    id,
    name: `Item ${id}`,
    unitPriceCents: totalCents,
    discountCents: 0,
    quantity: 1,
    ownerIds,
  };
}

function createTestBill(
  people: Person[],
  items: BillItem[],
  overrides: Partial<Bill> = {},
): Bill {
  return {
    id: "bill",
    version: 2,
    title: "Test bill",
    people,
    items,
    taxCents: 0,
    tipPercent: 0,
    adjustments: [],
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function expectIntegerTotals(bill: Bill): void {
  const totals = calculateBill(bill);
  const personTotals = totals.shares.map(({ totalCents }) => totalCents);
  expect(personTotals.every(Number.isInteger)).toBe(true);
  expect(personTotals.every((total) => total >= 0)).toBe(true);
  expect(totals.totalCents).toBe(sum(personTotals));
  expect(totals.totalCents).toBeGreaterThanOrEqual(0);
  expect(totals.roundingCents).toBe(
    totals.totalCents -
      (totals.subtotalCents +
        bill.taxCents +
        totals.adjustmentsCents +
        totals.tipCents),
  );
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 2 ** 32;
  };
}

function randomInteger(random: () => number, maximum: number): number {
  return Math.floor(random() * maximum);
}

function shuffle<T>(values: T[], random: () => number): T[] {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInteger(random, index + 1);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

function createRandomBill(random: () => number, index: number): Bill {
  const people = createPeople(1 + randomInteger(random, 12));
  const items = Array.from(
    { length: 1 + randomInteger(random, 20) },
    (_, itemIndex) => {
      const shuffledPeople = shuffle(people, random);
      const ownerCount = 1 + randomInteger(random, people.length);
      const quantity = 1 + randomInteger(random, 8);
      const unitPriceCents = randomInteger(random, 20_000);
      const grossCents = unitPriceCents * quantity;
      return {
        id: `item-${itemIndex}`,
        name: `Item ${itemIndex}`,
        unitPriceCents,
        quantity,
        discountCents: randomInteger(random, grossCents + 1),
        ownerIds: shuffledPeople.slice(0, ownerCount).map(({ id }) => id),
      };
    },
  );
  return createTestBill(people, items, {
    id: `bill-${index}`,
    taxCents: randomInteger(random, 5_000),
    tipPercent: randomInteger(random, 10_001) / 100,
    adjustments: [
      {
        id: "fee",
        label: "Fee",
        kind: "fee",
        amountCents: randomInteger(random, 5_000),
      },
      {
        id: "discount",
        label: "Discount",
        kind: "discount",
        amountCents: randomInteger(random, 100_000),
      },
    ],
  });
}

describe("calculateBill edge cases", () => {
  it("handles an empty bill", () => {
    const totals = calculateBill(createTestBill([], []));
    expect(totals.totalCents).toBe(0);
    expect(totals.shares).toEqual([]);
  });

  it("assigns all cents to one responsible person", () => {
    const people = createPeople(2);
    const totals = calculateBill(
      createTestBill(people, [createItem("one", 101, [people[0].id])], {
        taxCents: 9,
        tipPercent: 20,
      }),
    );
    expect(totals.shares.map(({ totalCents }) => totalCents)).toEqual([130, 0]);
  });

  it("uses participation to split extras when assigned items cost zero", () => {
    const people = createPeople(2);
    const totals = calculateBill(
      createTestBill(people, [createItem("free", 0, people.map(({ id }) => id))], {
        taxCents: 101,
      }),
    );
    expect(totals.shares.map(({ totalCents }) => totalCents)).toEqual([51, 51]);
    expect(totals.roundingCents).toBe(1);
  });

  it("caps an excessive bill discount at zero due", () => {
    const people = createPeople(2);
    const totals = calculateBill(
      createTestBill(people, [createItem("one", 100, people.map(({ id }) => id))], {
        adjustments: [
          {
            id: "discount",
            label: "Discount",
            kind: "discount",
            amountCents: 10_000,
          },
        ],
      }),
    );
    expect(totals.adjustmentsCents).toBe(-100);
    expect(totals.totalCents).toBe(0);
    expect(totals.shares.map(({ totalCents }) => totalCents)).toEqual([0, 0]);
  });

  it("balances repeated remainder cents across item owners", () => {
    const people = createPeople(7);
    const bill = createTestBill(
      people,
      Array.from({ length: 50 }, (_, index) =>
        createItem(String(index), 1, people.map(({ id }) => id)),
      ),
    );
    const itemShares = [
      ...allocateBillItems(bill).itemShares.values(),
    ];
    expect(Math.max(...itemShares) - Math.min(...itemShares)).toBeLessThanOrEqual(
      1,
    );
  });

  it("ignores duplicate and unknown owner identifiers", () => {
    const people = createPeople(2);
    const totals = calculateBill(
      createTestBill(people, [
        createItem("one", 100, [people[0].id, people[0].id, "missing"]),
      ]),
    );
    expect(totals.shares.map(({ totalCents }) => totalCents)).toEqual([100, 0]);
  });

  it("preserves every item total across mixed owner groups", () => {
    const people = createPeople(5);
    const bill = createTestBill(people, [
      createItem("a", 101, [people[0].id, people[1].id]),
      createItem("b", 103, [people[1].id, people[2].id, people[3].id]),
      createItem("c", 107, people.map(({ id }) => id)),
    ]);
    const allocations = allocateBillItems(bill).allocations;
    expect(
      allocations.map(({ portions }) => sum([...portions.values()])),
    ).toEqual([101, 103, 107]);
  });

  it("keeps calculation invariants across 1,000 seeded bills", () => {
    const random = createSeededRandom(0xd1_77_1);
    for (let index = 0; index < 1_000; index += 1)
      expectIntegerTotals(createRandomBill(random, index));
  });

  it("equalizes every whole-cent total across 2 to 25 people", () => {
    for (let peopleCount = 2; peopleCount <= 25; peopleCount += 1) {
      const people = createPeople(peopleCount);
      const ownerIds = people.map(({ id }) => id);
      for (let totalCents = 0; totalCents <= 500; totalCents += 1) {
        const totals = calculateBill(
          createTestBill(people, [createItem("shared", totalCents, ownerIds)]),
        );
        const personTotals = totals.shares.map((share) => share.totalCents);
        expect(new Set(personTotals).size).toBe(1);
        expect(Math.abs(totals.roundingCents)).toBeLessThanOrEqual(
          Math.floor(peopleCount / 2),
        );
      }
    }
  });
});
