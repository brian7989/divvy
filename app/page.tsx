"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Person = { id: string; name: string; color: string };
type Item = { id: string; name: string; price: number; quantity: number; ownerIds: string[] };
type Adjustment = { id: string; label: string; amount: number; kind: "fee" | "discount" };
type Bill = {
  title: string;
  people: Person[];
  items: Item[];
  tax: number;
  tipPercent: number;
  adjustments: Adjustment[];
};

const COLORS = ["#ff6b51", "#8b68e8", "#2cae8b", "#e3a21a", "#3b82d0", "#e05d97"];
const STORAGE_KEY = "divvy-bill-v1";

const starterBill: Bill = {
  title: "Dinner at Little Lemon",
  people: [
    { id: "p1", name: "You", color: COLORS[0] },
    { id: "p2", name: "Maya", color: COLORS[1] },
    { id: "p3", name: "Leo", color: COLORS[2] },
  ],
  items: [
    { id: "i1", name: "Spicy rigatoni", price: 24, quantity: 1, ownerIds: ["p1"] },
    { id: "i2", name: "Chicken parm", price: 27, quantity: 1, ownerIds: ["p2"] },
    { id: "i3", name: "Margherita pizza", price: 21, quantity: 1, ownerIds: ["p3"] },
    { id: "i4", name: "Burrata & bread", price: 18, quantity: 1, ownerIds: ["p1", "p2", "p3"] },
    { id: "i5", name: "Sparkling water", price: 8, quantity: 1, ownerIds: [] },
  ],
  tax: 8.58,
  tipPercent: 20,
  adjustments: [{ id: "a1", label: "Service fee", amount: 3.5, kind: "fee" }],
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function Home() {
  const [bill, setBill] = useState<Bill>(starterBill);
  const [ready, setReady] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [newPerson, setNewPerson] = useState("");
  const [itemDraft, setItemDraft] = useState({ name: "", price: "" });
  const [showAddItem, setShowAddItem] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showPeople, setShowPeople] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setBill(JSON.parse(stored));
    } catch { /* keep the example bill */ }
    setReady(true);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bill));
  }, [bill, ready]);

  const calculations = useMemo(() => {
    const subtotal = bill.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const assignedSubtotal = bill.items.reduce(
      (sum, item) => sum + (item.ownerIds.length ? item.price * item.quantity : 0), 0,
    );
    const fees = bill.adjustments.reduce((sum, a) => sum + (a.kind === "fee" ? a.amount : -a.amount), 0);
    const tip = subtotal * (bill.tipPercent / 100);
    const total = subtotal + bill.tax + fees + tip;
    const shares = bill.people.map((person) => {
      const itemShare = bill.items.reduce((sum, item) => {
        if (!item.ownerIds.includes(person.id)) return sum;
        return sum + (item.price * item.quantity) / item.ownerIds.length;
      }, 0);
      const ratio = assignedSubtotal ? itemShare / assignedSubtotal : 0;
      return { person, itemShare, total: itemShare + ratio * (bill.tax + fees + tip) };
    });
    return { subtotal, assignedSubtotal, fees, tip, total, shares };
  }, [bill]);

  const selectedItem = bill.items.find((item) => item.id === selectedItemId);
  const unassignedCount = bill.items.filter((item) => item.ownerIds.length === 0).length;

  function addPerson(event: FormEvent) {
    event.preventDefault();
    const name = newPerson.trim();
    if (!name) return;
    setBill((current) => ({
      ...current,
      people: [...current.people, { id: uid(), name, color: COLORS[current.people.length % COLORS.length] }],
    }));
    setNewPerson("");
  }

  function removePerson(id: string) {
    setBill((current) => ({
      ...current,
      people: current.people.filter((person) => person.id !== id),
      items: current.items.map((item) => ({ ...item, ownerIds: item.ownerIds.filter((owner) => owner !== id) })),
    }));
  }

  function addItem(event: FormEvent) {
    event.preventDefault();
    const price = Number(itemDraft.price);
    if (!itemDraft.name.trim() || !Number.isFinite(price) || price <= 0) return;
    setBill((current) => ({
      ...current,
      items: [...current.items, { id: uid(), name: itemDraft.name.trim(), price, quantity: 1, ownerIds: [] }],
    }));
    setItemDraft({ name: "", price: "" });
    setShowAddItem(false);
  }

  function toggleOwner(personId: string) {
    if (!selectedItemId) return;
    setBill((current) => ({
      ...current,
      items: current.items.map((item) => item.id !== selectedItemId ? item : {
        ...item,
        ownerIds: item.ownerIds.includes(personId)
          ? item.ownerIds.filter((id) => id !== personId)
          : [...item.ownerIds, personId],
      }),
    }));
  }

  function selectEveryone() {
    if (!selectedItemId) return;
    setBill((current) => ({
      ...current,
      items: current.items.map((item) => item.id === selectedItemId
        ? { ...item, ownerIds: current.people.map((person) => person.id) }
        : item),
    }));
  }

  function deleteSelectedItem() {
    if (!selectedItemId) return;
    setBill((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== selectedItemId),
    }));
    setSelectedItemId(null);
    setConfirmDelete(false);
  }

  function resetBill() {
    setBill({ title: "New bill", people: [{ id: uid(), name: "You", color: COLORS[0] }], items: [], tax: 0, tipPercent: 20, adjustments: [] });
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Divvy home"><span className="brand-mark">D</span> divvy</a>
        <button className="icon-button" onClick={resetBill} aria-label="Start a new bill" title="Start new bill">↻</button>
      </header>

      <section className="workspace" id="top">
        <div className="bill-column">
          <div className="eyebrow"><span className="live-dot" /> Saved on this device</div>
          <input
            className="title-input"
            value={bill.title}
            onChange={(event) => setBill({ ...bill, title: event.target.value })}
            aria-label="Bill name"
          />
          <div className="people-row">
            {bill.people.map((person) => (
              <button className="person-chip" key={person.id} onClick={() => setShowPeople(true)}>
                <span className="avatar" style={{ background: person.color }}>{person.name.slice(0, 1).toUpperCase()}</span>
                {person.name}
              </button>
            ))}
            <button className="add-person" onClick={() => setShowPeople(true)}>＋ Add person</button>
          </div>

          <div className="section-heading">
            <div><span className="step">1</span><h2>Who had what?</h2></div>
            <span className={unassignedCount ? "status warning" : "status complete"}>
              {unassignedCount ? `${unassignedCount} unassigned` : "All assigned"}
            </span>
          </div>
          <p className="section-copy">Tap an item, then choose everyone who shared it.</p>

          <div className="items-list">
            {bill.items.map((item) => (
              <button className={`item-card ${item.ownerIds.length ? "" : "unassigned"}`} key={item.id} onClick={() => { setSelectedItemId(item.id); setConfirmDelete(false); }}>
                <div className="item-main">
                  <strong>{item.name}</strong>
                  <span>{item.quantity > 1 ? `${item.quantity} × ` : ""}{money(item.price)}</span>
                </div>
                <div className="owners">
                  {item.ownerIds.length ? item.ownerIds.map((ownerId) => {
                    const person = bill.people.find((p) => p.id === ownerId);
                    return person ? <span className="mini-avatar" style={{ background: person.color }} key={ownerId}>{person.name[0]}</span> : null;
                  }) : <span className="assign-hint">Tap to assign →</span>}
                </div>
              </button>
            ))}
            {!bill.items.length && <div className="empty-state">Your items will appear here.<br />Add the first one below.</div>}
          </div>

          {showAddItem ? (
            <form className="inline-form item-form" onSubmit={addItem}>
              <input autoFocus placeholder="Item name" value={itemDraft.name} onChange={(e) => setItemDraft({ ...itemDraft, name: e.target.value })} aria-label="Item name" />
              <label className="price-input"><span>$</span><input inputMode="decimal" placeholder="0.00" value={itemDraft.price} onChange={(e) => setItemDraft({ ...itemDraft, price: e.target.value })} aria-label="Item price" /></label>
              <button type="submit" className="small-primary">Add</button>
              <button type="button" className="text-button" onClick={() => setShowAddItem(false)}>Cancel</button>
            </form>
          ) : <button className="add-item-button" onClick={() => setShowAddItem(true)}>＋ Add an item</button>}

          <button className="scan-card" disabled><span>▣</span><span><strong>Scan receipt</strong><small>Coming soon</small></span><em>Later phase</em></button>
        </div>

        <aside className="summary-card">
          <div className="summary-kicker"><span className="step">2</span> Settle up</div>
          <h2>Your split</h2>
          <div className="summary-lines">
            <button onClick={() => setShowDetails(!showDetails)}><span>Subtotal</span><strong>{money(calculations.subtotal)}</strong></button>
            {showDetails && <div className="adjustment-panel">
              <label><span>Tax</span><span className="money-field">$<input inputMode="decimal" value={bill.tax || ""} placeholder="0.00" onChange={(e) => setBill({ ...bill, tax: Number(e.target.value) || 0 })} /></span></label>
              {bill.adjustments.map((adjustment) => <label key={adjustment.id}><span>{adjustment.label}</span><span className="money-field">$<input inputMode="decimal" value={adjustment.amount || ""} onChange={(e) => setBill({ ...bill, adjustments: bill.adjustments.map((a) => a.id === adjustment.id ? { ...a, amount: Number(e.target.value) || 0 } : a) })} /></span></label>)}
            </div>}
            <div><span>Tax & fees</span><strong>{money(bill.tax + calculations.fees)}</strong></div>
            <div className="tip-line"><span>Tip <small>pre-tax</small></span><span className="tip-pills">{[18, 20, 25].map((value) => <button key={value} className={bill.tipPercent === value ? "active" : ""} onClick={() => setBill({ ...bill, tipPercent: value })}>{value}%</button>)}</span></div>
            <div><span>Tip amount</span><strong>{money(calculations.tip)}</strong></div>
          </div>
          <div className="grand-total"><span>Total</span><strong>{money(calculations.total)}</strong></div>
          {bill.adjustments.some((a) => a.kind === "fee" && /service/i.test(a.label)) && bill.tipPercent > 0 && <div className="fee-note">ⓘ This bill includes a service fee. Check whether gratuity is already included.</div>}
          <div className="person-totals">
            {calculations.shares.map(({ person, total }) => <div key={person.id}><span><i style={{ background: person.color }} />{person.name}</span><strong>{money(total)}</strong></div>)}
          </div>
          <button className="primary-button" disabled={unassignedCount > 0}>{unassignedCount ? "Assign all items to finish" : "Share summary"}</button>
          <button className="details-toggle" onClick={() => setShowDetails(!showDetails)}>{showDetails ? "Hide bill details" : "Edit tax & fees"}</button>
        </aside>
      </section>

      {selectedItem && <div className="modal-backdrop" onMouseDown={() => setSelectedItemId(null)}>
        <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="assign-title" onMouseDown={(event) => event.stopPropagation()}>
          <div className="sheet-handle" />
          <div className="sheet-header"><div><small>Assign item</small><h2 id="assign-title">{selectedItem.name}</h2></div><strong>{money(selectedItem.price * selectedItem.quantity)}</strong></div>
          <p>Who shared this? Select everyone who had some.</p>
          <button className="everyone-button" onClick={selectEveryone}>◎ Everyone <span>Split equally</span></button>
          <div className="people-select">
            {bill.people.map((person) => {
              const chosen = selectedItem.ownerIds.includes(person.id);
              return <button className={chosen ? "chosen" : ""} key={person.id} onClick={() => toggleOwner(person.id)}><span className="avatar" style={{ background: person.color }}>{person.name[0]}</span><strong>{person.name}</strong><i>{chosen ? "✓" : ""}</i></button>;
            })}
          </div>
          <div className="split-preview">{selectedItem.ownerIds.length ? `${money(selectedItem.price * selectedItem.quantity / selectedItem.ownerIds.length)} each` : "Choose at least one person"}</div>
          {confirmDelete ? <div className="delete-confirm" role="alert">
            <p>Delete <strong>{selectedItem.name}</strong>? This can’t be undone.</p>
            <div><button className="cancel-delete" onClick={() => setConfirmDelete(false)}>Keep item</button><button className="confirm-delete" onClick={deleteSelectedItem}>Delete</button></div>
          </div> : <button className="delete-item-button" onClick={() => setConfirmDelete(true)}>Delete item</button>}
          <button className="primary-button" onClick={() => setSelectedItemId(null)} disabled={!selectedItem.ownerIds.length}>Done</button>
        </section>
      </div>}

      {showPeople && <div className="modal-backdrop" onMouseDown={() => setShowPeople(false)}>
        <section className="sheet people-sheet" role="dialog" aria-modal="true" aria-labelledby="people-title" onMouseDown={(e) => e.stopPropagation()}>
          <div className="sheet-handle" /><h2 id="people-title">People on this bill</h2>
          <div className="manage-people">{bill.people.map((person) => <div key={person.id}><span className="avatar" style={{ background: person.color }}>{person.name[0]}</span><strong>{person.name}</strong>{bill.people.length > 1 && <button onClick={() => removePerson(person.id)} aria-label={`Remove ${person.name}`}>×</button>}</div>)}</div>
          <form className="inline-form" onSubmit={addPerson}><input autoFocus placeholder="Name" value={newPerson} onChange={(e) => setNewPerson(e.target.value)} aria-label="Person name" /><button className="small-primary" type="submit">Add</button></form>
          <button className="primary-button" onClick={() => setShowPeople(false)}>Done</button>
        </section>
      </div>}
    </main>
  );
}
