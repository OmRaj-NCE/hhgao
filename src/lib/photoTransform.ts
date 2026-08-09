export type PhotoOffset = { x: number; y: number }; // each in range -1..1

export function computePhotoDraw(
  iw: number,
  ih: number,
  S: number,
  zoom: number,
  offset: PhotoOffset
) {
  const baseScale = Math.max(S / iw, S / ih);
  const scale = baseScale * zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  const maxPanX = Math.max((dw - S) / 2, 0);
  const maxPanY = Math.max((dh - S) / 2, 0);
  const dx = (S - dw) / 2 + offset.x * maxPanX;
  const dy = (S - dh) / 2 + offset.y * maxPanY;
  return { dw, dh, dx, dy };
}

export function clampOffset(v: number): number {
  return Math.max(-1, Math.min(1, v));
}