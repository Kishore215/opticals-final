export type Frame = {
  id: string;
  name: string;
  brand: string;
  shape: "Round" | "Square" | "Rectangle" | "Cat-Eye" | "Aviator";
  color: string;
  width: number; // total frame width in mm (S 128 / M 138 / L 148)
  size: "S" | "M" | "L";
  price: number;
  emoji: string;
};

export const FRAMES: Frame[] = [
  { id: "f1", name: "Aurora", brand: "Gowri Signature", shape: "Round", color: "Tortoise", width: 138, size: "M", price: 2499, emoji: "👓" },
  { id: "f2", name: "Meridian", brand: "Gowri Edge", shape: "Square", color: "Matte Black", width: 142, size: "M", price: 2999, emoji: "🕶️" },
  { id: "f3", name: "Coral", brand: "Gowri Bloom", shape: "Cat-Eye", color: "Rose Gold", width: 134, size: "S", price: 3499, emoji: "👓" },
  { id: "f4", name: "Sky Pilot", brand: "Gowri Air", shape: "Aviator", color: "Gunmetal", width: 146, size: "L", price: 3299, emoji: "🕶️" },
  { id: "f5", name: "Studio", brand: "Gowri Signature", shape: "Rectangle", color: "Crystal Clear", width: 140, size: "M", price: 1999, emoji: "👓" },
  { id: "f6", name: "Lumen", brand: "Gowri Edge", shape: "Round", color: "Brushed Silver", width: 130, size: "S", price: 2799, emoji: "👓" },
  { id: "f7", name: "Atlas", brand: "Gowri Air", shape: "Square", color: "Forest Green", width: 148, size: "L", price: 3199, emoji: "🕶️" },
  { id: "f8", name: "Petal", brand: "Gowri Bloom", shape: "Cat-Eye", color: "Burgundy", width: 136, size: "M", price: 2899, emoji: "👓" },
  { id: "f9", name: "North", brand: "Gowri Signature", shape: "Rectangle", color: "Deep Navy", width: 144, size: "L", price: 2599, emoji: "👓" },
];

export const POWER_OPTIONS = [
  "Zero Power (Blue Cut)",
  "Single Vision (-0.25 to -6.00)",
  "Single Vision (+0.25 to +4.00)",
  "Bifocal",
  "Progressive",
  "Reading (+1.00 to +3.50)",
];

export const SIZE_RANGES: Record<Frame["size"], { label: string; range: string }> = {
  S: { label: "Small", range: "126–134 mm" },
  M: { label: "Medium", range: "135–142 mm" },
  L: { label: "Large", range: "143–150 mm" },
};

export function recommendSize(faceWidthMm: number): Frame["size"] {
  if (faceWidthMm < 132) return "S";
  if (faceWidthMm < 145) return "M";
  return "L";
}
