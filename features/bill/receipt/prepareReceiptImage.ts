const MAX_IMAGE_DIMENSION = 1_800;
const JPEG_QUALITY = 0.86;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("That image could not be opened."));
    image.src = url;
  });
}

function getScaledDimensions(image: HTMLImageElement) {
  const scale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
  );
  return {
    width: Math.max(1, Math.round(image.naturalWidth * scale)),
    height: Math.max(1, Math.round(image.naturalHeight * scale)),
  };
}

function drawImage(image: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const dimensions = getScaledDimensions(image);
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser cannot prepare the image.");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function canvasToJpeg(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("Image conversion failed.")),
      "image/jpeg",
      JPEG_QUALITY,
    ),
  );
}

/** Normalizes phone photos to a compact JPEG before uploading them. */
export async function prepareReceiptImage(file: File): Promise<File> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    const blob = await canvasToJpeg(drawImage(image));
    return new File([blob], "receipt.jpg", { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
