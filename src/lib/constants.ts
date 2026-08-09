export const CARD_NATIVE_WIDTH = 1110;
export const CARD_NATIVE_HEIGHT = 1417;
export const CARD_ASPECT_RATIO = CARD_NATIVE_WIDTH / CARD_NATIVE_HEIGHT;
export const CARD_TEMPLATE_SRC = "/card-template.jpg";

// Fractional positions, measured against the artwork itself.
// Change these only if you swap in different artwork.
export const OVERLAY_POSITIONS = {
  photo: { cx: 0.5, cy: 0.315, r: 0.116 },
  name: { y: 0.497, maxFontPx: 52, minFontPx: 24 },
  role: { y: 0.5681, maxFontPx: 40, minFontPx: 16 },
  title: { y: 0.6316, maxFontPx: 35, minFontPx: 14 },
} as const;

export const BUILDER_TITLES: string[] = [
  "HOTFIX CHIEFTAIN", "MERGE CONFLICT SURVIVOR", "SHIP-IT SORCERER",
  "NULL POINTER WHISPERER", "CTRL+Z CHAMPION", "PROD DEPLOYER (BRAVE)",
  "COFFEE-DRIVEN DEVELOPER", "STANDUP STORYTELLER", "DEMO DAY DAREDEVIL",
  "REGEX ROMANTIC", "GIT BLAME DODGER", "API WRANGLER", "BUG WHISPERER",
  "PIVOT TABLE PIRATE", "INFINITE LOOP SURVIVOR", "409 CONFLICT RESOLVER",
  "LATE-NIGHT LINTER", "STACK OVERFLOW SCHOLAR", "README SKIPPER",
  "409-COFFEE ENGINEER",
];

export function buildShareCaption(name: string, role: string): string {
  const who = [name.trim(), role.trim()].filter(Boolean).join(" + ") || "I";
  return `${who} is building at Hacker House Goa 2026 🌴🛠️\nBuild. Ship. Launch. Repeat.\n#FrameInGoa`;
}