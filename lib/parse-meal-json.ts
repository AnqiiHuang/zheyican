import type { MealApiResponse } from "./meal-types";

export function extractJsonObject(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) return trimmed;
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) return fence[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

export function parseMealResponse(raw: string): MealApiResponse {
  const json = extractJsonObject(raw);
  const parsed = JSON.parse(json) as MealApiResponse;
  if (!parsed || typeof parsed.status !== "string") {
    throw new Error("模型返回格式无效");
  }
  return parsed;
}
