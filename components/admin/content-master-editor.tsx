"use client";

import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  CopyPlus,
  Save,
  Trash2
} from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import type { AdminActionState } from "@/app/admin/(protected)/actions";
import { saveDraftAction } from "@/app/admin/(protected)/actions";
import AdminSubmitButton from "@/components/admin/admin-submit-button";
import type { PortfolioSnapshot } from "@/lib/portfolio-data";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

const initialActionState: AdminActionState = {
  ok: false,
  message: ""
};

function labelFor(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function cloneForNewItem(value: JsonValue, key = ""): JsonValue {
  if (Array.isArray(value)) {
    if (!value.length) return [];
    return typeof value[0] === "object" && value[0] !== null
      ? [cloneForNewItem(value[0])]
      : [];
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        cloneForNewItem(childValue, childKey)
      ])
    );
  }

  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  if (key === "category") return value;
  return "";
}

function valueAtPath(root: JsonValue, path: (string | number)[]): JsonValue {
  return path.reduce<JsonValue>((current, segment) => {
    if (Array.isArray(current) && typeof segment === "number") {
      return current[segment];
    }
    if (
      current &&
      typeof current === "object" &&
      !Array.isArray(current) &&
      typeof segment === "string"
    ) {
      return current[segment];
    }
    throw new Error("Invalid editor path");
  }, root);
}

function setAtPath(
  root: JsonValue,
  path: (string | number)[],
  nextValue: JsonValue
): JsonValue {
  if (!path.length) return nextValue;
  const [segment, ...rest] = path;

  if (Array.isArray(root) && typeof segment === "number") {
    return root.map((item, index) =>
      index === segment ? setAtPath(item, rest, nextValue) : item
    );
  }

  if (
    root &&
    typeof root === "object" &&
    !Array.isArray(root) &&
    typeof segment === "string"
  ) {
    return {
      ...root,
      [segment]: setAtPath(root[segment], rest, nextValue)
    };
  }

  throw new Error("Invalid editor path");
}

function isLongText(key: string, value: string) {
  return (
    value.length > 90 ||
    /summary|description|challenge|outcome|impact|problem|solution|result|note|address/i.test(
      key
    )
  );
}

function PrimitiveField({
  fieldKey,
  value,
  onChange
}: {
  fieldKey: string;
  value: JsonPrimitive;
  onChange: (value: JsonPrimitive) => void;
}) {
  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/55 px-3 py-3">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-400"
        />
        <span className="text-sm font-semibold text-slate-300">
          {labelFor(fieldKey)}
        </span>
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
          {labelFor(fieldKey)}
        </span>
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400"
        />
      </label>
    );
  }

  const stringValue = value ?? "";
  if (fieldKey === "category") {
    return (
      <label className="grid gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
          Category
        </span>
        <select
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
        >
          <option value="company">Company</option>
          <option value="freelance">Freelance</option>
          <option value="personal">Personal</option>
        </select>
      </label>
    );
  }

  const fieldType = /email/i.test(fieldKey)
    ? "email"
    : /url|website|file|thumbnail|diagram/i.test(fieldKey)
      ? "url"
      : /phone/i.test(fieldKey)
        ? "tel"
        : "text";

  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
        {labelFor(fieldKey)}
      </span>
      {isLongText(fieldKey, stringValue) ? (
        <textarea
          value={stringValue}
          rows={Math.min(8, Math.max(3, Math.ceil(stringValue.length / 90)))}
          onChange={(event) => onChange(event.target.value)}
          className="resize-y rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm leading-relaxed text-white outline-none focus:border-emerald-400"
        />
      ) : (
        <input
          type={fieldType}
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400"
        />
      )}
    </label>
  );
}

function ValueEditor({
  fieldKey,
  value,
  path,
  onUpdate
}: {
  fieldKey: string;
  value: JsonValue;
  path: (string | number)[];
  onUpdate: (path: (string | number)[], value: JsonValue) => void;
}) {
  if (!Array.isArray(value) && (value === null || typeof value !== "object")) {
    return (
      <PrimitiveField
        fieldKey={fieldKey}
        value={value}
        onChange={(nextValue) => onUpdate(path, nextValue)}
      />
    );
  }

  if (Array.isArray(value)) {
    const objectItems = value.some(
      (item) => item !== null && typeof item === "object"
    );

    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-950/35 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              {labelFor(fieldKey)}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {value.length} {value.length === 1 ? "item" : "items"}
            </p>
          </div>
          {value.length ? (
            <button
              type="button"
              onClick={() =>
                onUpdate(path, [
                  ...value,
                  cloneForNewItem(value[0], fieldKey)
                ])
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-emerald-400/50 hover:text-white"
            >
              <CopyPlus size={13} />
              Add item
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onUpdate(path, [""])}
              disabled={objectItems}
              className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add text item
            </button>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {value.map((item, index) => (
            <div
              key={`${path.join(".")}-${index}`}
              className={`rounded-xl border border-slate-800 ${
                item !== null && typeof item === "object"
                  ? "bg-slate-900/75 p-4"
                  : "bg-slate-950/70 p-3"
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500">
                  {objectItems ? `${labelFor(fieldKey)} ${index + 1}` : `Item ${index + 1}`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Move item up"
                    disabled={index === 0}
                    onClick={() => {
                      const next = [...value];
                      [next[index - 1], next[index]] = [next[index], next[index - 1]];
                      onUpdate(path, next);
                    }}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white disabled:opacity-25"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    aria-label="Move item down"
                    disabled={index === value.length - 1}
                    onClick={() => {
                      const next = [...value];
                      [next[index], next[index + 1]] = [next[index + 1], next[index]];
                      onUpdate(path, next);
                    }}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white disabled:opacity-25"
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove item"
                    disabled={objectItems && value.length === 1}
                    onClick={() =>
                      onUpdate(
                        path,
                        value.filter((_, itemIndex) => itemIndex !== index)
                      )
                    }
                    className="rounded-md p-1.5 text-slate-500 hover:bg-rose-500/15 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <ValueEditor
                fieldKey={String(index)}
                value={item}
                path={[...path, index]}
                onUpdate={onUpdate}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-4">
      {Object.entries(value).map(([childKey, childValue]) => (
        <ValueEditor
          key={childKey}
          fieldKey={childKey}
          value={childValue}
          path={[...path, childKey]}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export default function ContentMasterEditor({
  initialContent,
  visibleKeys,
  title,
  description
}: {
  initialContent: PortfolioSnapshot;
  visibleKeys: (keyof PortfolioSnapshot)[];
  title: string;
  description: string;
}) {
  const [draft, setDraft] = useState<PortfolioSnapshot>(() =>
    structuredClone(initialContent)
  );
  const [openKey, setOpenKey] = useState<keyof PortfolioSnapshot>(
    visibleKeys[0]
  );
  const [actionState, formAction] = useActionState(
    saveDraftAction,
    initialActionState
  );
  const serializedDraft = useMemo(() => JSON.stringify(draft), [draft]);

  const updateValue = (path: (string | number)[], value: JsonValue) => {
    setDraft((current) =>
      setAtPath(
        current as unknown as JsonValue,
        path,
        value
      ) as unknown as PortfolioSnapshot
    );
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
          Draft content
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
          {description}
        </p>
      </header>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="content" value={serializedDraft} />

        <div className="grid gap-3">
          {visibleKeys.map((key) => {
            const isOpen = openKey === key;
            const value = valueAtPath(
              draft as unknown as JsonValue,
              [key]
            );

            return (
              <section
                key={key}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
              >
                <button
                  type="button"
                  onClick={() => setOpenKey(key)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-display text-lg font-semibold">
                    {labelFor(key)}
                  </span>
                  <ChevronDown
                    size={17}
                    className={`text-slate-500 transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen ? (
                  <div className="border-t border-slate-800 p-5">
                    <ValueEditor
                      fieldKey={key}
                      value={value}
                      path={[key]}
                      onUpdate={updateValue}
                    />
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>

        <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl shadow-black/30 backdrop-blur">
          <div>
            {actionState.message ? (
              <p
                className={`text-sm font-semibold ${
                  actionState.ok ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {actionState.message}
              </p>
            ) : (
              <p className="text-sm text-slate-400">
                Saving updates the private draft only.
              </p>
            )}
            {actionState.issues?.length ? (
              <ul className="mt-2 max-w-3xl space-y-1 text-xs text-rose-200">
                {actionState.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-2">
            <Save size={15} className="text-emerald-300" />
            <AdminSubmitButton
              idleLabel="Save draft"
              pendingLabel="Saving…"
            />
          </span>
        </div>
      </form>
    </div>
  );
}
