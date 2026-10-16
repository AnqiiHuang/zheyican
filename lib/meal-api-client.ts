import type { MealApiResponse, MealRequestBody } from "./meal-types";

export async function requestMeal(
  body: MealRequestBody,
  signal?: AbortSignal
): Promise<MealApiResponse> {
  const res = await fetch("/api/meal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  const data = (await res.json()) as MealApiResponse & { error?: string };

  if (!res.ok) {
    throw new Error(data.message || data.error || "请求失败，请稍后重试");
  }

  return data;
}

export function needInputMessage(data: MealApiResponse): string {
  if (data.status !== "need_input") return data.message || "";
  const parts = data.questions.map((q) => q.text).filter(Boolean);
  return parts.join(" ") || "请补全餐次或就餐方式后重试";
}
