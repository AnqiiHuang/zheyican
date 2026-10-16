import type { MealType } from "./meal-types";

/** 根据本地小时推断默认餐次（客户端使用） */
export function defaultMealTypeForHour(hour: number): MealType {
  if (hour >= 5 && hour < 10) return "早餐";
  if (hour >= 10 && hour < 15) return "午餐";
  if (hour >= 15 && hour < 21) return "晚餐";
  return "午餐";
}
