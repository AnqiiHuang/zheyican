"use client";

type OptionGroupProps<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  name: string;
};

export function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
  name,
}: OptionGroupProps<T>) {
  return (
    <fieldset className="space-y-2" disabled={disabled}>
      <legend className="text-sm font-medium text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <label
              key={opt}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                selected
                  ? "border-accent bg-emerald-50 text-accent font-medium"
                  : "border-border bg-card text-ink hover:border-stone-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={selected}
                onChange={() => onChange(opt)}
                className="sr-only"
                disabled={disabled}
              />
              {opt}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
