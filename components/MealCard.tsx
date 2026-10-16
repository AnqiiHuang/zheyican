"use client";

import type { ItemId, Meal } from "@/lib/meal-types";

type MealCardProps = {
  meal: Meal;
  onReplace: (id: ItemId) => void;
  replacingId: ItemId | null;
  disabled?: boolean;
  footerMessage?: string;
};

export function MealCard({
  meal,
  onReplace,
  replacingId,
  disabled,
  footerMessage,
}: MealCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <header className="mb-4 border-b border-border pb-3">
        <p className="text-xs text-muted">
          {meal.meal_type} · {meal.dining_mode}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-ink">{meal.name}</h2>
      </header>

      <ul className="space-y-3">
        {meal.items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-xl bg-surface px-3 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted">{item.category}</p>
              <p className="font-medium text-ink">{item.name}</p>
              <p className="mt-0.5 text-sm text-muted">{item.portion}</p>
            </div>
            <button
              type="button"
              onClick={() => onReplace(item.id)}
              disabled={disabled || replacingId !== null}
              className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-sm text-ink transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {replacingId === item.id ? "替换中…" : "换一个"}
            </button>
          </li>
        ))}
      </ul>

      {meal.guide.length > 0 && (
        <section className="mt-4">
          <h3 className="text-sm font-medium text-ink">用餐指导</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">
            {meal.guide.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </section>
      )}

      {footerMessage && (
        <p className="mt-4 text-xs text-muted">{footerMessage}</p>
      )}
    </article>
  );
}
