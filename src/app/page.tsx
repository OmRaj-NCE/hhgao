"use client";

import { useEffect, useState } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import PhotoAdjust from "@/components/PhotoAdjust";
import BuilderForm from "@/components/BuilderForm";
import IDCardPreview from "@/components/IDCardPreview";
import ActionBar from "@/components/ActionBar";
import { exportCardToBlob, preloadTemplate } from "@/lib/exportCard";
import { buildShareCaption } from "@/lib/constants";

export default function Page() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");
  const [photoImage, setPhotoImage] = useState<HTMLImageElement | null>(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoOffset, setPhotoOffset] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => { preloadTemplate(); }, []);

  const canAct = Boolean(photoImage) && name.trim().length > 0;
  const statusText = canAct
    ? "Looking sharp. Download it or share it on X."
    : "Add a photo and your name to unlock download & share.";

  function showToast(msg: string, ms = 3200) {
    setToast(msg);
    window.setTimeout(() => setToast(null), ms);
  }

  function triggerDownload(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(name.trim() || "builder").replace(/\s+/g, "_")}_hh-goa-2026.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function handlePhotoReady(img: HTMLImageElement) {
    setPhotoImage(img);
    setPhotoZoom(1);
    setPhotoOffset({ x: 0, y: 0 });
  }

  async function handleDownload() {
    const blob = await exportCardToBlob({
      photoImage, name, role, title,
      zoom: photoZoom, offsetX: photoOffset.x, offsetY: photoOffset.y,
    });
    triggerDownload(blob);
    showToast("Downloaded! Your Builder ID is ready.");
  }

  async function handleShare() {
    setSharing(true);
    showToast("Preparing your card…", 4000);
    try {
      const blob = await exportCardToBlob({
        photoImage, name, role, title,
        zoom: photoZoom, offsetX: photoOffset.x, offsetY: photoOffset.y,
      });
      triggerDownload(blob);
      const text = buildShareCaption(name, role);
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
      showToast("Card downloaded — attach it in the tweet that just opened!", 5000);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong — try Download instead.", 4000);
    } finally {
      setSharing(false);
    }
  }

  return (
    <>
      <header>
        <div>
          <div className="wordmark">Hacker <span className="goa">Goa</span> House</div>
          <p>Drop in a photo, name yourself, and walk away with a Hacker House Goa 2026 Builder ID.</p>
        </div>
        <div className="badge-tag">Goa, India · 28–31 Oct 2026</div>
      </header>

      <main>
        <IDCardPreview
          photoImage={photoImage}
          name={name}
          role={role}
          title={title}
          zoom={photoZoom}
          offset={photoOffset}
          onOffsetChange={setPhotoOffset}
        />

        <div className="controls">
          <PhotoUpload onPhotoReady={handlePhotoReady} onError={(m) => showToast(m, 4000)} />
          <PhotoAdjust
            visible={Boolean(photoImage)}
            zoom={photoZoom}
            onZoomChange={setPhotoZoom}
            onReset={() => { setPhotoZoom(1); setPhotoOffset({ x: 0, y: 0 }); }}
          />
          <BuilderForm
            name={name} role={role} title={title}
            onNameChange={setName} onRoleChange={setRole} onTitleChange={setTitle}
          />
          <ActionBar canAct={canAct} statusText={statusText} onDownload={handleDownload} onShare={handleShare} disabled={sharing} />
        </div>
      </main>

      <footer>Build · Ship · Launch · Repeat — Hacker House Goa 2026 · #FrameInGoa</footer>

      {toast && <div className="toast show">{toast}</div>}
    </>
  );
}