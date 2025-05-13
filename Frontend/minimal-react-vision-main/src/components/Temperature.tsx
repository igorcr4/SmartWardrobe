// src/components/Temperature.tsx
import React from "react";
import { Sun, Cloud, CloudSnow } from "lucide-react";

export interface TempRange { min: number; max: number }

export const GARMENT_TEMP_MAP: Record<string, TempRange> = {
  geaca:            { min: 0,  max: 10 },
  jacheta:          { min: 10, max: 18 },
  pulover:          { min: 12, max: 20 },
  jerseu:           { min: 12, max: 20 },
  tricou:           { min: 18, max: 30 },
  camasa:           { min: 16, max: 26 },
  pantaloni:        { min: 14, max: 24 },
  "pantaloni scurti": { min: 22, max: 35 },
  rochie:           { min: 18, max: 30 },
  fusta:            { min: 18, max: 30 },
  blugi:            { min: 12, max: 22 },
  adidasi:          { min: 14, max: 26 },
  pantofi:          { min: 10, max: 24 },
  cizme:            { min: 0,  max: 12 },
  accesorii:        { min: 0,  max: 35 },
};

export function getGarmentAvgTemp(type: string): number {
  const range = GARMENT_TEMP_MAP[type] ?? { min: 15, max: 20 };
  return (range.min + range.max) / 2;
}

export function getOutfitAvgTemp(garments: { type: string }[]): number {
  if (garments.length === 0) return 20;
  const avgs = garments.map(g => getGarmentAvgTemp(g.type));
  return avgs.reduce((s, a) => s + a, 0) / avgs.length;
}

export function getWeatherIcon(avg: number) {
  if (avg >= 18)     return <Sun       size={20} className="text-yellow-400" />;
  if (avg >= 10)     return <Cloud     size={20} className="text-gray-500" />;
  /* sub 10° */      return <CloudSnow size={20} className="text-blue-400" />;
}
