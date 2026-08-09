"use client";

import { useRef, useState } from "react";
import { convertHeicIfNeeded } from "@/lib/exportCard";

type Props = {
  onPhotoReady: (img: HTMLImageElement) => void;
  onError: (message: string) => void;
};

export default function PhotoUpload({ onPhotoReady, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !/\.(heic|heif)$/i.test(file.name)) {
      onError("That doesn't look like an image — try JPG, PNG or WebP.");
      return;
    }

    try {
      setBusy(true);
      const blob = await convertHeicIfNeeded(file);
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        onPhotoReady(img);
        URL.revokeObjectURL(url);
        setBusy(false);
      };
      img.onerror = () => {
        onError("Couldn't read that photo — try another file.");
        URL.revokeObjectURL(url);
        setBusy(false);
      };
      img.src = url;
    } catch {
      onError("Couldn't convert that HEIC file — try a JPG or PNG.");
      setBusy(false);
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="panel">
      <h3>Your Photo</h3>
      <button
        type="button"
        className="upload-btn"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
      >
        {busy ? "Processing…" : "Upload your photo"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        hidden
        onChange={handleChange}
      />
      <p className="hint">JPG, PNG, WebP or HEIC — straight off your phone is fine.</p>
    </div>
  );
}