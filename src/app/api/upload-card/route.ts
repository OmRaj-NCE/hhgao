import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.type === "image/jpeg" ? "jpg" : "png";
  const blob = await put(
    `cards/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`,
    file,
    { access: "public", contentType: file.type || "image/png", addRandomSuffix: false }
  );
  return NextResponse.json({ url: blob.url });
}