"use client";

type Props = {
  canAct: boolean;
  statusText: string;
  onDownload: () => void;
  onShare: () => void;
};

export default function ActionBar({ canAct, statusText, onDownload, onShare }: Props) {
  return (
    <div>
      <div className="actions">
        <button type="button" className="btn download" disabled={!canAct} onClick={onDownload}>
          Download
        </button>
        <button type="button" className="btn share" disabled={!canAct} onClick={onShare}>
          Share on X
        </button>
      </div>
      <p className="status">{statusText}</p>
    </div>
  );
}