export type MealType = "早餐" | "午餐" | "晚餐";
export type DiningMode = "外卖" | "食堂" | "自己做";
export type ItemId = "staple" | "protein" | "vegetable";
export type MealAction = "generate" | "replace";

export interface MealItem {
  id: ItemId;
  category: string;
  name: string;
  portion: string;
}

export interface Meal {
  name: string;
  meal_type: MealType;
  dining_mode: DiningMode;
  items: MealItem[];
  guide: string[];
}

export interface MealQuestion {
  field: "meal_type" | "dining_mode";
  text: string;
  options: string[];
}

export interface MealApiResponse {
  status: "ok" | "need_input" | "invalid_input" | "out_of_scope";
  meal: Meal | null;
  questions: MealQuestion[];
  message: string;
  /** 服务端演示模式（预设食谱），非模型输出字段 */
  demo?: boolean;
}

export interface MealRequestBody {
  action?: MealAction;
  meal_type?: MealType;
  dining_mode?: DiningMode;
  current_meal?: Meal;
  replace_id?: ItemId;
  restrictions?: string;
}
