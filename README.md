<div align="center">
  <img src="./public/icon.svg" width="88" alt="Divvy app icon" />
  <h1>Divvy</h1>
  <p>Split the bill, not the vibe.</p>
</div>

Divvy makes it easy to split shared expenses by what each person owes. No accounts, no spreadsheet, and no awkward group-chat math.

## What it does

- Adds everyone involved
- Tracks items, quantities, and prices
- Scans receipt photos into editable items
- Splits shared items between the right people
- Distributes tax, tip, fees, and discounts fairly
- Creates a clear total for each person
- Works on phones and can be installed like an app

## How it works

1. Add the people splitting the bill.
2. Choose how to add expenses.
3. Add items and assign who shared them.
4. Review the final split and share the summary.

Receipt scanning is available as an AI-powered prototype. Always review scanned
items and totals before finishing the split.

## Private by default

Divvy does not require an account. Bill data stays in your browser. When you
choose receipt scanning, that image is sent temporarily for AI processing and is
not added to your saved bill data.

Because there is no cloud sync yet, clearing browser data also clears the saved bill.

## Run it locally

You’ll need Node.js 24.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To run the full project check:

```bash
npm run check
```

## Built with

Next.js, React, Mantine, Zustand, Zod, TypeScript, and Vercel AI Gateway.
