"use client";

import { useEffect, useRef, useState } from "react";
import {
  CARD_ASPECT_RATIO,
  CARD_TEMPLATE_SRC,
  OVERLAY_POSITIONS,
} from "@/lib/constants";
import { computePhotoDraw, clampOffset, type PhotoOffset } from "@/lib/photoTransform";
import FitText from "./FitText";

type Props = {
  photoImage: HTMLImageElement | null;
  name: string;
  role: string;
  title: string;
  zoom: number;
  offset: PhotoOffset;
  onOffsetChange: (o: PhotoOffset) => void;
};

export default function IDCardPreview({
  photoImage, name, role, title, zoom, offset, onOffsetChange,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ startX: number; startY: number; startOffset: PhotoOffset } | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !photoImage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const S = canvas.width;
    ctx.clearRect(0, 0, S, S);
    const iw = photoImage.naturalWidth || photoImage.width;
    const ih = photoImage.naturalHeight || photoImage.height;
    const { dw, dh, dx, dy } = computePhotoDraw(iw, ih, S, zoom, offset);
    ctx.drawImage(photoImage, dx, dy, dw, dh);
  }, [photoImage, zoom, offset]);

  function onPointerDown(e: React.PointerEvent) {
    if (!photoImage) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, startOffset: offset };
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current || !slotRef.current || !photoImage) return;
    const slotSize = slotRef.current.clientWidth || 1;
    const iw = photoImage.naturalWidth || photoImage.width;
    const ih = photoImage.naturalHeight || photoImage.height;
    const { dw, dh } = computePhotoDraw(iw, ih, slotSize, zoom, { x: 0, y: 0 });
    const maxPanX = Math.max((dw - slotSize) / 2, 0);
    const maxPanY = Math.max((dh - slotSize) / 2, 0);

    const deltaX = e.clientX - dragState.current.startX;
    const deltaY = e.clientY - dragState.current.startY;

    const nextX = maxPanX > 0 ? clampOffset(dragState.current.startOffset.x + deltaX / maxPanX) : 0;
    const nextY = maxPanY > 0 ? clampOffset(dragState.current.startOffset.y + deltaY / maxPanY) : 0;
    onOffsetChange({ x: nextX, y: nextY });
  }

  function onPointerUp() {
    dragState.current = null;
    setDragging(false);
  }

  const { photo, name: namePos, role: rolePos, title: titlePos } = OVERLAY_POSITIONS;

  return (
    <div className="card-stage">
      <div className="id-card" style={{ aspectRatio: `${CARD_ASPECT_RATIO}` }}>
        <img className="base" src={CARD_TEMPLATE_SRC} alt="Hacker House Goa 2026 Builder ID template" />

        <div
          ref={slotRef}
          className="photo-slot"
          style={{
            left: `${photo.cx * 100}%`,
            top: `${photo.cy * 100}%`,
            width: `${photo.r * 2 * 100}%`,
            transform: "translate(-46%,-32%)",
            cursor: photoImage ? (dragging ? "grabbing" : "grab") : "default",
            touchAction: "none",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {photoImage ? (
            <canvas ref={canvasRef} width={400} height={400} />
          ) : (
            <svg viewBox="0 0 100 100" className="placeholder-icon" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="phGrad" cx="35%" cy="30%" r="80%">
                  <stop offset="0%" stopColor="#FBEFD8" />
                  <stop offset="100%" stopColor="#E7D3A8" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="50" fill="url(#phGrad)" />
              <circle cx="50" cy="100" r="42" fill="none" stroke="#1B4332" strokeWidth="1.4" strokeDasharray="4 4" opacity="0.5" />
              <circle cx="50" cy="41" r="16" fill="#1B4332" opacity="0.55" />
              <path d="M18 92 C18 66 32 55 50 55 C68 55 82 66 82 92 Z" fill="#1B4332" opacity="0.55" />
              <g transform="translate(66,66)">
                <circle r="15" fill="#F2C744" stroke="#16241D" strokeWidth="2" />
                <path d="M-6 -1 h3 l1.6 -2.4 h2.8 L2 -1 h4 v6 h-12 z" fill="#16241D" />
                <circle cx="0" cy="1.6" r="2.6" fill="#F2C744" />
              </g>
            </svg>
          )}
        </div>

        <FitText text={name || "Your Name"} top={`${namePos.y * 100}%`} maxPx={namePos.maxFontPx} minPx={namePos.minFontPx} className="name" />
        <FitText text={role || "Your role"} top={`${rolePos.y * 100}%`} maxPx={rolePos.maxFontPx} minPx={rolePos.minFontPx} className="role" />
        <FitText text={(title || "—").toUpperCase()} top={`${titlePos.y * 100}%`} maxPx={titlePos.maxFontPx} minPx={titlePos.minFontPx} className="title" />
      </div>
    </div>
  );
}