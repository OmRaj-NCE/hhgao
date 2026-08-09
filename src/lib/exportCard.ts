import {
  CARD_NATIVE_WIDTH,
  CARD_NATIVE_HEIGHT,
  CARD_TEMPLATE_SRC,
  OVERLAY_POSITIONS,
} from "./constants";
import { computePhotoDraw, type PhotoOffset } from "./photoTransform";

let cachedTemplate: HTMLImageElement | null = null;

export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function preloadTemplate(): Promise<void> {
  if (cachedTemplate) return;
  cachedTemplate = await loadImage(CARD_TEMPLATE_SRC);
  if (document.fonts?.ready) await document.fonts.ready;
}

export async function convertHeicIfNeeded(file: File): Promise<Blob> {
  const isHeic = /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
  if (!isHeic) return file;
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
  return Array.isArray(result) ? result[0] : (result as Blob);
}

function drawFitText(
  ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
  fontFamily: string, color: string, maxWidth: number, startPx: number, minPx: number, tiltDeg = 0
) {
  let size = startPx;
  ctx.font = `700 ${size}px ${fontFamily}`;
  while (ctx.measureText(text).width > maxWidth && size > minPx) {
    size -= 1;
    ctx.font = `700 ${size}px ${fontFamily}`;
  }
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (tiltDeg === 0) { ctx.fillText(text, x, y); return; }
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((tiltDeg * Math.PI) / 180);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

type ExportArgs = {
  photoImage: HTMLImageElement | null;
  name: string;
  role: string;
  title: string;
  zoom?: number;
  offsetX?: number;
  offsetY?: number;
  format?: "png" | "jpeg";
};

export async function exportCardToBlob({
  photoImage, name, role, title, zoom = 1, offsetX = 0, offsetY = 0, format = "png",
}: ExportArgs): Promise<Blob> {
  if (!cachedTemplate) await preloadTemplate();
  const template = cachedTemplate!;
  const W = CARD_NATIVE_WIDTH;
  const H = CARD_NATIVE_HEIGHT;

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(template, 0, 0, W, H);

  const { photo, name: namePos, role: rolePos, title: titlePos } = OVERLAY_POSITIONS;
  const cx = W * (photo.cx + 0.08 * photo.r);
  const cy = H * (photo.cy + 0.282 * photo.r);
  const r = W * photo.r;
  const S = r * 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = "#dfe6e0";
  ctx.fillRect(cx - r, cy - r, S, S);
  if (photoImage) {
    const iw = photoImage.naturalWidth || photoImage.width;
    const ih = photoImage.naturalHeight || photoImage.height;
    const off: PhotoOffset = { x: offsetX, y: offsetY };
    const { dw, dh, dx, dy } = computePhotoDraw(iw, ih, S, zoom, off);
    ctx.drawImage(photoImage, cx - r + dx, cy - r + dy, dw, dh);
  }
  ctx.restore();

  const maxW = W * 0.64;
  drawFitText(ctx, name || "Your Name", W * 0.5, H * namePos.y, "'Caveat', cursive", "#1B4332", maxW, namePos.maxFontPx, namePos.minFontPx, -5);
  drawFitText(ctx, role || "Your role", W * 0.5, H * rolePos.y, "'Caveat', cursive", "#1B4332", maxW, rolePos.maxFontPx, rolePos.minFontPx, -3);
  drawFitText(ctx, (title || "—").toUpperCase(), W * 0.5, H * titlePos.y, "'Space Mono', monospace", "#E8368F", maxW, titlePos.maxFontPx, titlePos.minFontPx, -4);

  const mime = format === "jpeg" ? "image/jpeg" : "image/png";
  const quality = format === "jpeg" ? 0.85 : 0.95;
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))), mime, quality);
  });
}