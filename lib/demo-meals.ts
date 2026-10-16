import type {
  DiningMode,
  ItemId,
  Meal,
  MealApiResponse,
  MealRequestBody,
  MealType,
} from "./meal-types";

type FoodOption = { name: string; portion: string };

const STAPLES: Record<MealType, FoodOption[]> = {
  早餐: [
    { name: "全麦面包", portion: "2 片（约手掌大）" },
    { name: "燕麦粥", portion: "1 小碗（约拳头高）" },
    { name: "杂粮馒头", portion: "1 个（约拳头大）" },
    { name: "红薯", portion: "1 个（约拳头大，蒸熟）" },
  ],
  午餐: [
    { name: "糙米饭", portion: "1 碗（约 1 拳头平碗）" },
    { name: "荞麦面", portion: "1 碗（干面约 1 拳头量，煮熟）" },
    { name: "小米饭", portion: "1 碗（约平碗 8 分满）" },
    { name: "全麦卷饼", portion: "1 张（约手掌大）" },
  ],
  晚餐: [
    { name: "杂粮饭", portion: "1 小碗（约 8 分满）" },
    { name: "蒸玉米", portion: "1 根（约手掌长）" },
    { name: "藜麦饭", portion: "1 小碗（约拳头高）" },
    { name: "山药", portion: "1 段（约 2 指宽，蒸熟）" },
  ],
};

const PROTEINS: Record<MealType, FoodOption[]> = {
  早餐: [
    { name: "水煮蛋", portion: "1 个整蛋 + 1 个蛋白" },
    { name: "无糖豆浆", portion: "1 杯（约 250 ml）" },
    { name: "低脂酸奶", portion: "1 小杯（约 150 g）" },
    { name: "豆腐脑", portion: "1 碗（约 1 拳头量，少卤）" },
  ],
  午餐: [
    { name: "去皮鸡胸肉", portion: "1 块（约 1 手掌大、1 指厚）" },
    { name: "清蒸鱼", portion: "1 段（约 1 手掌大）" },
    { name: "卤牛肉", portion: "1 份（约 1 手掌心大小）" },
    { name: "虾仁", portion: "10–12 只（约 1 手掌心量）" },
  ],
  晚餐: [
    { name: "番茄炒蛋", portion: "1 份（约 1 个蛋 + 半拳番茄）" },
    { name: "北豆腐", portion: "1 块（约 2 指厚、手掌大）" },
    { name: "瘦猪肉片", portion: "1 份（约 1 手掌大、薄切）" },
    { name: "白切鸡", portion: "1 份（约 1 手掌大，去皮）" },
  ],
};

const VEGETABLES: Record<MealType, FoodOption[]> = {
  早餐: [
    { name: "小番茄", portion: "6–8 颗（约 1 把）" },
    { name: "黄瓜", portion: "1 根（约 2 指粗，可切片）" },
    { name: "生菜", portion: "1 把（约 2 个拳头体积）" },
    { name: "彩椒", portion: "半个（约 1 拳头大）" },
  ],
  午餐: [
    { name: "西兰花", portion: "1 份（约 2 个拳头体积，清炒/白灼）" },
    { name: "菠菜", portion: "1 份（约 2 个拳头体积，焯水）" },
    { name: "凉拌木耳", portion: "1 小碟（约 1 拳头量）" },
    { name: "清炒时蔬", portion: "1 份（约 2 个拳头体积，少油）" },
  ],
  晚餐: [
    { name: "冬瓜", portion: "1 份（约 2 个拳头体积，清炖）" },
    { name: "香菇青菜", portion: "1 份（约 2 个拳头体积）" },
    { name: "凉拌海带丝", portion: "1 小碟（约 1 拳头量）" },
    { name: "芦笋", portion: "7–8 根（约 1 手掌长一束）" },
  ],
};

const PRESET_COMBOS: Record<
  MealType,
  Record<DiningMode, { name: string; staple: number; protein: number; vegetable: number }[]>
> = {
  早餐: {
    外卖: [
      { name: "清爽早餐外卖组合", staple: 0, protein: 0, vegetable: 2 },
      { name: "高纤早餐外带", staple: 1, protein: 1, vegetable: 0 },
    ],
    食堂: [
      { name: "食堂轻盈早餐", staple: 2, protein: 3, vegetable: 1 },
      { name: "食堂均衡早餐", staple: 3, protein: 0, vegetable: 3 },
    ],
    自己做: [
      { name: "自制十分钟早餐", staple: 1, protein: 0, vegetable: 1 },
      { name: "自制奶香早餐", staple: 0, protein: 2, vegetable: 2 },
    ],
  },
  午餐: {
    外卖: [
      { name: "轻负担午餐外卖", staple: 0, protein: 0, vegetable: 0 },
      { name: "高蛋白外卖餐", staple: 2, protein: 2, vegetable: 2 },
    ],
    食堂: [
      { name: "食堂标准搭配", staple: 1, protein: 1, vegetable: 1 },
      { name: "食堂多样选菜", staple: 3, protein: 3, vegetable: 3 },
    ],
    自己做: [
      { name: "快手自做午餐", staple: 1, protein: 0, vegetable: 0 },
      { name: "自做均衡碗", staple: 0, protein: 2, vegetable: 1 },
    ],
  },
  晚餐: {
    外卖: [
      { name: "清淡晚餐外卖", staple: 0, protein: 0, vegetable: 0 },
      { name: "轻食晚餐外送", staple: 2, protein: 2, vegetable: 2 },
    ],
    食堂: [
      { name: "食堂晚间简餐", staple: 1, protein: 3, vegetable: 1 },
      { name: "食堂蔬菜多加", staple: 3, protein: 1, vegetable: 3 },
    ],
    自己做: [
      { name: "自做暖胃晚餐", staple: 0, protein: 0, vegetable: 2 },
      { name: "自做三步晚餐", staple: 1, protein: 2, vegetable: 1 },
    ],
  },
};

const ITEM_IDS: ItemId[] = ["staple", "protein", "vegetable"];
const CATEGORY: Record<ItemId, string> = {
  staple: "主食",
  protein: "蛋白质食物",
  vegetable: "蔬菜",
};

function poolFor(id: ItemId, mealType: MealType): FoodOption[] {
  if (id === "staple") return STAPLES[mealType];
  if (id === "protein") return PROTEINS[mealType];
  return VEGETABLES[mealType];
}

function pickIndex(length: number, salt: number): number {
  return Math.abs(salt) % length;
}

function hashSalt(parts: (string | number)[]): number {
  const s = parts.join("|");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function buildGuide(
  diningMode: DiningMode,
  mealType: MealType,
  items: Meal["items"]
): string[] {
  const staple = items.find((i) => i.id === "staple")!.name;
  const protein = items.find((i) => i.id === "protein")!.name;
  const veg = items.find((i) => i.id === "vegetable")!.name;

  if (diningMode === "外卖") {
    return [
      `点 ${mealType} 类轻食或家常菜，主食选 ${staple}，蛋白质选 ${protein}，蔬菜选 ${veg}。`,
      "备注：少油少盐、酱汁分装，主食可按饥饱感选小份或大份。",
    ];
  }
  if (diningMode === "食堂") {
    return [
      `窗口选 ${staple} 作主食，1 份 ${protein}，再取 1–2 份 ${veg} 类蔬菜。`,
      "优先清炒、白灼、蒸制；少选油炸与重芡汁菜品。",
    ];
  }
  return [
    `① 准备 ${staple} 与 ${protein}；② 处理 ${veg}（洗切）；③ 少油快炒或蒸煮，调味以葱蒜、少量盐与胡椒为主。`,
    "全程控制在三步内，可先煮/蒸主食与蛋白，最后做蔬菜。",
  ];
}

function buildMealFromCombo(
  mealType: MealType,
  diningMode: DiningMode,
  combo: (typeof PRESET_COMBOS)[MealType][DiningMode][number],
  salt: number
): Meal {
  const staple = STAPLES[mealType][combo.staple % STAPLES[mealType].length];
  const protein = PROTEINS[mealType][combo.protein % PROTEINS[mealType].length];
  const vegetable =
    VEGETABLES[mealType][combo.vegetable % VEGETABLES[mealType].length];

  const items: Meal["items"] = [
    { id: "staple", category: CATEGORY.staple, ...staple },
    { id: "protein", category: CATEGORY.protein, ...protein },
    { id: "vegetable", category: CATEGORY.vegetable, ...vegetable },
  ];

  return {
    name: combo.name,
    meal_type: mealType,
    dining_mode: diningMode,
    items,
    guide: buildGuide(diningMode, mealType, items),
  };
}

function generateMeal(mealType: MealType, diningMode: DiningMode): Meal {
  const combos = PRESET_COMBOS[mealType][diningMode];
  const salt = hashSalt([mealType, diningMode, Date.now(), Math.random()]);
  const combo = combos[pickIndex(combos.length, salt)];
  return buildMealFromCombo(mealType, diningMode, combo, salt);
}

function replaceItem(meal: Meal, replaceId: ItemId): Meal {
  const pool = poolFor(replaceId, meal.meal_type);
  const current = meal.items.find((i) => i.id === replaceId);
  if (!current) throw new Error("invalid item");

  const others = pool.filter((p) => p.name !== current.name);
  const candidates = others.length > 0 ? others : pool;
  const salt = hashSalt([meal.name, replaceId, current.name, Date.now()]);
  const next = candidates[pickIndex(candidates.length, salt)];

  const items = meal.items.map((item) =>
    item.id === replaceId
      ? { ...item, name: next.name, portion: next.portion }
      : item
  );

  const nameChanged =
    replaceId === "staple" || replaceId === "protein"
      ? `${meal.meal_type}搭配（已换${CATEGORY[replaceId]}）`
      : meal.name;

  return {
    ...meal,
    name: nameChanged,
    items,
    guide: buildGuide(meal.dining_mode, meal.meal_type, items),
  };
}

function needInputResponse(body: MealRequestBody): MealApiResponse | null {
  const questions: MealApiResponse["questions"] = [];
  if (!body.meal_type) {
    questions.push({
      field: "meal_type",
      text: "这次安排哪一餐？",
      options: ["早餐", "午餐", "晚餐"],
    });
  }
  if (!body.dining_mode) {
    questions.push({
      field: "dining_mode",
      text: "这餐打算怎么吃？",
      options: ["外卖", "食堂", "自己做"],
    });
  }
  if (questions.length === 0) return null;
  return { status: "need_input", meal: null, questions, message: "" };
}

export function handleDemoMealRequest(
  body: MealRequestBody
): MealApiResponse & { demo: true } {
  const action = body.action ?? "generate";

  if (action === "generate") {
    const missing = needInputResponse(body);
    if (missing) return { ...missing, demo: true };

    const meal = generateMeal(body.meal_type!, body.dining_mode!);
    return {
      status: "ok",
      meal,
      questions: [],
      message: "【演示模式】份量为一般参考，可根据饥饱感调整。",
      demo: true,
    };
  }

  if (action === "replace") {
    const replaceId = body.replace_id;
    const validId = replaceId && ITEM_IDS.includes(replaceId);
    if (!body.current_meal || !validId) {
      return {
        status: "invalid_input",
        meal: null,
        questions: [],
        message: "替换需要提供当前搭配和有效的食物项",
        demo: true,
      };
    }
    const meal = replaceItem(body.current_meal, replaceId);
    return {
      status: "ok",
      meal,
      questions: [],
      message: "【演示模式】份量为一般参考，可根据饥饱感调整。",
      demo: true,
    };
  }

  return {
    status: "invalid_input",
    meal: null,
    questions: [],
    message: "不支持的操作类型",
    demo: true,
  };
}

export function isDemoModeEnabled(): boolean {
  if (process.env.MEAL_DEMO_MODE === "true") return true;
  if (process.env.MEAL_DEMO_MODE === "false") return false;
  return !process.env.OPENAI_API_KEY?.trim();
}
