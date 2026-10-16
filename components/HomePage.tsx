"use client";

import { MealCard } from "@/components/MealCard";
import { OptionGroup } from "@/components/OptionGroup";
import { defaultMealTypeForHour } from "@/lib/default-meal-type";
import { needInputMessage, requestMeal } from "@/lib/meal-api-client";
import type { DiningMode, ItemId, Meal, MealType } from "@/lib/meal-types";
import { useCallback, useEffect, useMemo, useState } from "react";

const MEAL_TYPES = ["早餐", "午餐", "晚餐"] as const;
const DINING_MODES = ["外卖", "食堂", "自己做"] as const;

export function HomePage() {
  const [mealType, setMealType] = useState<MealType>("午餐");
  const [diningMode, setDiningMode] = useState<DiningMode>("外卖");
  const [meal, setMeal] = useState<Meal | null>(null);
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [replacingId, setReplacingId] = useState<ItemId | null>(null);
  const [lastAction, setLastAction] = useState<
    "generate" | { type: "replace"; id: ItemId }
  >("generate");
  const [isDemo, setIsDemo] = useState<boolean | null>(null);

  useEffect(() => {
    setMealType(defaultMealTypeForHour(new Date().getHours()));
  }, []);

  useEffect(() => {
    fetch("/api/meal")
      .then((r) => r.json())
      .then((data: { demo?: boolean }) => setIsDemo(Boolean(data.demo)))
      .catch(() => setIsDemo(null));
  }, []);

  const busy = generating || replacingId !== null;

  const runGenerate = useCallback(async () => {
    setGenerating(true);
    setError(null);
    setInfoMessage("");
    setLastAction("generate");
    try {
      const data = await requestMeal({
        action: "generate",
        meal_type: mealType,
        dining_mode: diningMode,
        restrictions: "",
      });
      if (data.demo) setIsDemo(true);
      if (data.status === "ok" && data.meal) {
        setMeal(data.meal);
        setInfoMessage(data.message);
      } else if (data.status === "need_input") {
        setError(needInputMessage(data) || "请补全选择后重试");
      } else {
        setError(data.message || "无法生成搭配，请重试");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "网络错误，请重试");
    } finally {
      setGenerating(false);
    }
  }, [mealType, diningMode]);

  const runReplace = useCallback(
    async (id: ItemId) => {
      if (!meal) return;
      setReplacingId(id);
      setError(null);
      setInfoMessage("");
      setLastAction({ type: "replace", id });
      try {
        const data = await requestMeal({
          action: "replace",
          meal_type: meal.meal_type,
          dining_mode: meal.dining_mode,
          current_meal: meal,
          replace_id: id,
          restrictions: "",
        });
        if (data.demo) setIsDemo(true);
        if (data.status === "ok" && data.meal) {
          setMeal(data.meal);
          setInfoMessage(data.message);
        } else {
          setError(data.message || "替换失败，请重试");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "网络错误，请重试");
      } finally {
        setReplacingId(null);
      }
    },
    [meal]
  );

  const retry = useCallback(() => {
    if (lastAction === "generate") {
      void runGenerate();
    } else if (meal) {
      void runReplace(lastAction.id);
    }
  }, [lastAction, meal, runGenerate, runReplace]);

  const subtitle = useMemo(
    () => "选餐次和就餐方式，一键得到本餐搭配与参考份量",
    []
  );

  return (
    <main className="mx-auto max-w-lg px-4 pb-12 pt-8">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-ink">这一餐</h1>
        {isDemo && (
          <p className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-0.5 text-xs text-amber-800 ring-1 ring-amber-200">
            演示模式 · 预设食谱（无需 API 密钥）
          </p>
        )}
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
      </header>

      <section className="space-y-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <OptionGroup
          label="餐次"
          name="meal_type"
          options={MEAL_TYPES}
          value={mealType}
          onChange={setMealType}
          disabled={busy}
        />
        <OptionGroup
          label="就餐方式"
          name="dining_mode"
          options={DINING_MODES}
          value={diningMode}
          onChange={setDiningMode}
          disabled={busy}
        />

        <button
          type="button"
          onClick={() => void runGenerate()}
          disabled={busy}
          className="w-full rounded-xl bg-accent py-3 text-base font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generating ? "正在搭配…" : "帮我搭配"}
        </button>
      </section>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void retry()}
            disabled={busy}
            className="mt-2 font-medium underline disabled:opacity-50"
          >
            重试
          </button>
        </div>
      )}

      {meal && (
        <div className="mt-6">
          <MealCard
            meal={meal}
            onReplace={(id) => void runReplace(id)}
            replacingId={replacingId}
            disabled={busy}
            footerMessage={infoMessage}
          />
        </div>
      )}

      {!meal && !error && !generating && (
        <p className="mt-8 text-center text-sm text-muted">
          尚未生成本餐建议，点击「帮我搭配」开始
        </p>
      )}
    </main>
  );
}
