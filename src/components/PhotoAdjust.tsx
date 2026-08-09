"use client";

type Props = {
  visible: boolean;
  zoom: number;
  onZoomChange: (z: number) => void;
  onReset: () => void;
};

export default function PhotoAdjust({ visible, zoom, onZoomChange, onReset }: Props) {
  if (!visible) return null;
  return (
    <div className="panel">
      <h3>Frame It</h3>
      <label className="f" htmlFor="zoomIn">Zoom — {zoom.toFixed(2)}×</label>
      <input
        id="zoomIn" type="range" min={1} max={3} step={0.01} value={zoom}
        onChange={(e) => onZoomChange(parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />
      <p className="hint">Drag the photo itself to reposition it.</p>
      <button type="button" className="roll" onClick={onReset} style={{ marginTop: 8 }}>
        Reset
      </button>
    </div>
  );
}