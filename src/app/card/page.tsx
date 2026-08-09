import type { Metadata } from "next";

type Props = { searchParams: { src?: string } };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const src = searchParams.src;
  if (!src) return { title: "Builder ID — Hacker House Goa 2026" };
  return {
    title: "My Hacker House Goa 2026 Builder ID",
    description: "Build. Ship. Launch. Repeat. — #FrameInGoa",
    openGraph: { title: "My Hacker House Goa 2026 Builder ID", images: [src] },
    twitter: { card: "summary_large_image", images: [src] },
  };
}

export default function CardPage({ searchParams }: Props) {
  const src = searchParams.src;
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
      {src ? <img src={src} alt="Builder ID" style={{ maxWidth: 420, width: "100%", borderRadius: 12 }} /> : <p>Card not found.</p>}
      <a href="/" style={{ color: "#F2C744", fontFamily: "monospace" }}>Make your own Builder ID →</a>
    </main>
  );
}