"use client";

import { BUILDER_TITLES } from "@/lib/constants";

type Props = {
  name: string;
  role: string;
  title: string;
  onNameChange: (v: string) => void;
  onRoleChange: (v: string) => void;
  onTitleChange: (v: string) => void;
};

export default function BuilderForm({
  name, role, title, onNameChange, onRoleChange, onTitleChange,
}: Props) {
  function rollTitle() {
    const pick = BUILDER_TITLES[Math.floor(Math.random() * BUILDER_TITLES.length)];
    onTitleChange(pick);
  }

  return (
    <div className="panel">
      <h3>Your Details</h3>

      <label className="f" htmlFor="nameIn">Name</label>
      <input
        id="nameIn" type="text" maxLength={28} value={name}
        onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. Om Raj"
      />

      <label className="f" htmlFor="roleIn">Role / Stack</label>
      <input
        id="roleIn" type="text" maxLength={26} value={role}
        onChange={(e) => onRoleChange(e.target.value)} placeholder="e.g. Full Stack"
      />

      <label className="f" htmlFor="titleIn">Builder Title</label>
      <div className="row">
        <input
          id="titleIn" type="text" maxLength={26} value={title}
          onChange={(e) => onTitleChange(e.target.value)} placeholder="Roll for a title →"
        />
        <button type="button" className="roll" onClick={rollTitle}>Roll</button>
      </div>
    </div>
  );
}