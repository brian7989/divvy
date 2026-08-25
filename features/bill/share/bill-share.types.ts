export type BillShareLine = {
  label: string;
  amountCents: number;
};

export type PersonShareSection = {
  personId: string;
  name: string;
  color: string;
  emoji: string;
  items: BillShareLine[];
  extras: BillShareLine[];
  totalCents: number;
};

export type BillShareData = {
  title: string;
  totalCents: number;
  people: PersonShareSection[];
};

