import { formatMoney } from "@/features/bill/domain/money";
import type {
  BillShareData,
  BillShareLine,
  PersonShareSection,
} from "./bill-share.types";

const IMAGE_WIDTH = 1080;
const PAGE_PADDING = 64;
const CARD_GAP = 24;
const LINE_HEIGHT = 44;
const MAX_IMAGE_HEIGHT = 16_000;
const COLORS = {
  background: "#f8f7ff",
  card: "#ffffff",
  ink: "#181622",
  muted: "#6f697e",
  line: "#e5deff",
  purple: "#754cff",
};

function getSectionHeight(section: PersonShareSection): number {
  const lineCount = section.items.length + section.extras.length;
  return 214 + lineCount * LINE_HEIGHT;
}

function getImageHeight(data: BillShareData): number {
  return (
    250 +
    data.people.reduce(
      (height, person) => height + getSectionHeight(person) + CARD_GAP,
      0,
    ) +
    80
  );
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function fillRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  color: string,
) {
  roundedRect(context, x, y, width, height, radius);
  context.fillStyle = color;
  context.fill();
}

function fitText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (context.measureText(text).width <= maxWidth) return text;
  let shortened = text;
  while (
    shortened.length > 1 &&
    context.measureText(`${shortened}…`).width > maxWidth
  )
    shortened = shortened.slice(0, -1);
  return `${shortened}…`;
}

function drawBrand(context: CanvasRenderingContext2D) {
  fillRoundedRect(context, PAGE_PADDING, 58, 58, 58, 17, COLORS.purple);
  context.fillStyle = "white";
  context.font = "800 30px sans-serif";
  context.textAlign = "center";
  context.fillText("÷", PAGE_PADDING + 29, 98);
  context.fillStyle = COLORS.ink;
  context.font = "800 34px sans-serif";
  context.textAlign = "left";
  context.fillText("divvy", PAGE_PADDING + 76, 98);
}

function drawHeader(context: CanvasRenderingContext2D, data: BillShareData) {
  drawBrand(context);
  context.fillStyle = COLORS.ink;
  context.font = "800 54px sans-serif";
  context.fillText(fitText(context, data.title, 680), PAGE_PADDING, 178);
  context.fillStyle = COLORS.muted;
  context.font = "500 24px sans-serif";
  context.fillText("Itemized split", PAGE_PADDING, 218);
  context.fillStyle = COLORS.purple;
  context.font = "800 42px sans-serif";
  context.textAlign = "right";
  context.fillText(
    formatMoney(data.totalCents),
    IMAGE_WIDTH - PAGE_PADDING,
    190,
  );
  context.textAlign = "left";
}

function drawLine(
  context: CanvasRenderingContext2D,
  line: BillShareLine,
  y: number,
  muted = false,
) {
  context.fillStyle = muted ? COLORS.muted : COLORS.ink;
  context.font = `${muted ? 500 : 600} 24px sans-serif`;
  context.textAlign = "left";
  context.fillText(fitText(context, line.label, 650), PAGE_PADDING + 36, y);
  context.textAlign = "right";
  context.fillText(
    formatMoney(line.amountCents),
    IMAGE_WIDTH - PAGE_PADDING - 36,
    y,
  );
}

function drawPersonHeader(
  context: CanvasRenderingContext2D,
  person: PersonShareSection,
  y: number,
) {
  context.fillStyle = person.color;
  context.beginPath();
  context.arc(PAGE_PADDING + 68, y + 58, 28, 0, Math.PI * 2);
  context.fill();
  context.font = '28px "Apple Color Emoji", sans-serif';
  context.textAlign = "center";
  context.fillText(person.emoji, PAGE_PADDING + 68, y + 68);
  context.fillStyle = COLORS.ink;
  context.font = "800 30px sans-serif";
  context.textAlign = "left";
  context.fillText(
    fitText(context, person.name, 500),
    PAGE_PADDING + 112,
    y + 68,
  );
  context.font = "800 32px sans-serif";
  context.textAlign = "right";
  context.fillText(
    formatMoney(person.totalCents),
    IMAGE_WIDTH - PAGE_PADDING - 36,
    y + 68,
  );
}

function drawPersonSection(
  context: CanvasRenderingContext2D,
  person: PersonShareSection,
  y: number,
): number {
  const height = getSectionHeight(person);
  fillRoundedRect(
    context,
    PAGE_PADDING,
    y,
    IMAGE_WIDTH - PAGE_PADDING * 2,
    height,
    30,
    COLORS.card,
  );
  drawPersonHeader(context, person, y);

  let lineY = y + 126;
  person.items.forEach((line) => {
    drawLine(context, line, lineY);
    lineY += LINE_HEIGHT;
  });
  person.extras.forEach((line) => {
    drawLine(context, line, lineY, true);
    lineY += LINE_HEIGHT;
  });

  context.strokeStyle = COLORS.line;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(PAGE_PADDING + 36, lineY + 4);
  context.lineTo(IMAGE_WIDTH - PAGE_PADDING - 36, lineY + 4);
  context.stroke();
  context.fillStyle = COLORS.ink;
  context.font = "800 27px sans-serif";
  context.textAlign = "left";
  context.fillText("Total", PAGE_PADDING + 36, lineY + 52);
  context.textAlign = "right";
  context.fillText(
    formatMoney(person.totalCents),
    IMAGE_WIDTH - PAGE_PADDING - 36,
    lineY + 52,
  );
  return y + height + CARD_GAP;
}

function drawFooter(context: CanvasRenderingContext2D, height: number) {
  context.fillStyle = COLORS.muted;
  context.font = "600 22px sans-serif";
  context.textAlign = "center";
  context.fillText("Made with divvy", IMAGE_WIDTH / 2, height - 42);
}

function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Could not create the image.")),
      "image/png",
    ),
  );
}

function createFileName(title: string): string {
  const safeTitle = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${safeTitle || "divvy"}-split.png`;
}

/** Renders itemized bill data into a shareable PNG without server uploads. */
export async function renderBillShareImage(data: BillShareData): Promise<File> {
  const height = getImageHeight(data);
  if (height > MAX_IMAGE_HEIGHT)
    throw new Error("This split is too large for one image.");

  const canvas = document.createElement("canvas");
  canvas.width = IMAGE_WIDTH;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser cannot create the image.");
  context.fillStyle = COLORS.background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawHeader(context, data);
  let y = 250;
  data.people.forEach((person) => {
    y = drawPersonSection(context, person, y);
  });
  drawFooter(context, height);
  return new File([await canvasToPng(canvas)], createFileName(data.title), {
    type: "image/png",
  });
}

