import type { Bill, BillItem } from "../domain/bill.schema";
import {
  calculateBill,
  type BillTotals,
} from "../domain/calculateBill";
import { allocateCents, formatMoney } from "../domain/money";
import { getPersonEmoji } from "../domain/person-emojis";
import { getItemTotal } from "../domain/getItemTotal";
import type {
  BillShareData,
  BillShareLine,
  PersonShareSection,
} from "./bill-share.types";

type ExtraComponent = { label: string; amountCents: number };

function getItemLabel(item: BillItem, ownerCount: number): string {
  const quantity = item.quantity > 1 ? `${item.quantity} × ` : "";
  const discount = item.discountCents
    ? ` · −${formatMoney(item.discountCents)}`
    : "";
  const shared = ownerCount > 1 ? ` · 1/${ownerCount} share` : "";
  return `${quantity}${item.name}${discount}${shared}`;
}

function buildItemLines(bill: Bill): Map<string, BillShareLine[]> {
  const lines = new Map<string, BillShareLine[]>(
    bill.people.map((person) => [person.id, [] as BillShareLine[]]),
  );
  bill.items.forEach((item) => {
    const owners = bill.people.filter((person) =>
      item.ownerIds.includes(person.id),
    );
    const portions = allocateCents(
      getItemTotal(item),
      owners.map(() => 1),
    );
    owners.forEach((owner, index) =>
      lines.get(owner.id)?.push({
        label: getItemLabel(item, owners.length),
        amountCents: portions[index],
      }),
    );
  });
  return lines;
}

function getExtraComponents(bill: Bill, tipCents: number): ExtraComponent[] {
  return [
    ...(bill.taxCents ? [{ label: "Tax", amountCents: bill.taxCents }] : []),
    ...(tipCents ? [{ label: "Tip", amountCents: tipCents }] : []),
    ...bill.adjustments.map((adjustment) => ({
      label: adjustment.label,
      amountCents:
        adjustment.kind === "fee"
          ? adjustment.amountCents
          : -adjustment.amountCents,
    })),
  ];
}

function buildExtraLines(
  components: ExtraComponent[],
  weights: number[],
  expectedTotals: number[],
): BillShareLine[][] {
  const lines = weights.map(() => [] as BillShareLine[]);
  components.forEach((component) => {
    allocateCents(component.amountCents, weights).forEach((amountCents, index) => {
      if (amountCents) lines[index].push({ label: component.label, amountCents });
    });
  });

  lines.forEach((personLines, index) => {
    const allocated = personLines.reduce(
      (sum, line) => sum + line.amountCents,
      0,
    );
    const roundingDelta = expectedTotals[index] - allocated;
    if (!roundingDelta) return;
    if (personLines[0]) personLines[0].amountCents += roundingDelta;
    else personLines.push({ label: "Other", amountCents: roundingDelta });
  });
  return lines;
}

function buildPersonSections(
  bill: Bill,
  totals: BillTotals,
): PersonShareSection[] {
  const itemLines = buildItemLines(bill);
  const extras = buildExtraLines(
    getExtraComponents(bill, totals.tipCents),
    totals.shares.map((share) => share.itemsCents),
    totals.shares.map((share) => share.extrasCents),
  );

  return totals.shares.map((share, index) => ({
    personId: share.person.id,
    name: share.person.name,
    color: share.person.color,
    emoji: getPersonEmoji(share.person.id),
    items: itemLines.get(share.person.id) ?? [],
    extras: extras[index],
    totalCents: share.totalCents,
  }));
}

/** Builds itemized, exactly reconciled data for the share image. */
export function buildBillShareData(bill: Bill): BillShareData {
  const totals = calculateBill(bill);
  return {
    title: bill.title,
    totalCents: totals.totalCents,
    people: buildPersonSections(bill, totals),
  };
}
