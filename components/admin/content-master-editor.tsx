"use client";

import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  CopyPlus,
  Eye,
  RotateCcw,
  Save,
  Trash2
} from "lucide-react";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
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

const sectionDescriptions: Partial<Record<keyof PortfolioSnapshot, string>> = {
  personalInfo: "Name, profile image, contact details and current resume",
  siteCopy: "Page metadata, hero messaging and section headings",
  navItems: "Public navigation labels and section order",
  socialLinks: "Profile links and which ones appear prominently",
  aboutHighlights: "The key points shown in the About section",
  toolsAndTechnologies: "Core-stack badges shown beside your profile",
  quickFacts: "Compact facts displayed in the hero and About area",
  skillGroups: "Grouped technical capabilities and descriptions",
  experienceItems: "Companies, roles and nested client projects",
  educationItems: "Degrees, institutions and education highlights",
  projects: "Detailed personal and freelance case-study pages",
  internships: "Internship roles, dates and outcomes",
  contactAddress: "The location/address shown in Contact",
  freelanceShowcaseProjects: "Freelance cards without dedicated case-study pages",
  featuredProjectIds: "Project IDs and their order in Featured Work"
};

function itemSummary(item: JsonValue, index: number, fieldKey: string) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    return `${labelFor(fieldKey)} ${index + 1}`;
  }

  const preferredKeys = ["title", "name", "company", "label", "slug", "id"];
  for (const key of preferredKeys) {
    const value = item[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return `${labelFor(fieldKey)} ${index + 1}`;
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
    : /url$|website/i.test(fieldKey)
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
          {value.map((item, index) => {
            const controls = (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Move item up"
                  disabled={index === 0}
                  onClick={() => {
                    const next = [...value];
                    [next[index - 1], next[index]] = [
                      next[index],
                      next[index - 1]
                    ];
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
                    [next[index], next[index + 1]] = [
                      next[index + 1],
                      next[index]
                    ];
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
            );

            if (objectItems) {
              return (
                <details
                  key={`${path.join(".")}-${index}`}
                  className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/75 open:border-slate-700"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 marker:hidden">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-slate-200">
                        {itemSummary(item, index, fieldKey)}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-600">
                        Click to edit · Item {index + 1} of {value.length}
                      </span>
                    </span>
                    <span className="rounded-lg border border-slate-700 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 transition group-open:border-emerald-400/30 group-open:text-emerald-300">
                      Details
                    </span>
                  </summary>
                  <div className="border-t border-slate-800 p-4">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500">
                        Reorder or remove this item
                      </span>
                      {controls}
                    </div>
                    <ValueEditor
                      fieldKey={String(index)}
                      value={item}
                      path={[...path, index]}
                      onUpdate={onUpdate}
                    />
                  </div>
                </details>
              );
            }

            return (
              <div
                key={`${path.join(".")}-${index}`}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-3"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-500">
                    Item {index + 1}
                  </span>
                  {controls}
                </div>
                <ValueEditor
                  fieldKey={String(index)}
                  value={item}
                  path={[...path, index]}
                  onUpdate={onUpdate}
                />
              </div>
            );
          })}
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

function DraftSaveControls({
  hasUnsavedChanges,
  onDiscard
}: {
  hasUnsavedChanges: boolean;
  onDiscard: () => void;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="sticky top-[84px] z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
            pending || hasUnsavedChanges
              ? "bg-amber-400/15 text-amber-300"
              : "bg-emerald-400/15 text-emerald-300"
          }`}
        >
          {hasUnsavedChanges ? (
            <AlertCircle size={17} />
          ) : (
            <CheckCircle2 size={17} />
          )}
        </span>
        <div>
          <p className="text-sm font-bold text-white">
            {pending
              ? "Saving your draft…"
              : hasUnsavedChanges
                ? "You have unsaved changes"
                : "Draft is saved"}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Saving never changes the public preview
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!hasUnsavedChanges || pending}
          onClick={onDiscard}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3.5 py-2.5 text-xs font-bold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          <RotateCcw size={14} />
          Discard
        </button>
        <span className="inline-flex items-center gap-2">
          <Save size={15} className="text-emerald-300" />
          <AdminSubmitButton
            idleLabel="Save draft"
            pendingLabel="Saving…"
            disabled={!hasUnsavedChanges}
          />
        </span>
      </div>
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
  const savedContent =
    actionState.savedContent ?? JSON.stringify(initialContent);
  const hasUnsavedChanges = serializedDraft !== savedContent;
  const selectedValue = valueAtPath(
    draft as unknown as JsonValue,
    [openKey]
  );

  useEffect(() => {
    const adminWindow = window as Window & {
      __portfolioAdminDirty?: boolean;
    };
    adminWindow.__portfolioAdminDirty = hasUnsavedChanges;
    if (!hasUnsavedChanges) {
      return () => {
        adminWindow.__portfolioAdminDirty = false;
      };
    }

    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => {
      adminWindow.__portfolioAdminDirty = false;
      window.removeEventListener("beforeunload", warnBeforeLeaving);
    };
  }, [hasUnsavedChanges]);

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
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
            Private draft
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
            {description}
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-slate-300 transition hover:border-emerald-400/40 hover:text-white"
        >
          <Eye size={14} />
          Open public preview
        </Link>
      </header>

      <form
        action={formAction}
        className="space-y-5"
      >
        <input type="hidden" name="content" value={serializedDraft} />

        <DraftSaveControls
          hasUnsavedChanges={hasUnsavedChanges}
          onDiscard={() =>
            setDraft(JSON.parse(savedContent) as PortfolioSnapshot)
          }
        />

        {actionState.message ? (
          <div
            role="status"
            className={`rounded-2xl border p-4 ${
              actionState.ok
                ? "border-emerald-400/25 bg-emerald-400/10"
                : "border-rose-400/25 bg-rose-400/10"
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                actionState.ok ? "text-emerald-200" : "text-rose-200"
              }`}
            >
              {actionState.message}
            </p>
            {actionState.issues?.length ? (
              <ul className="mt-2 max-w-3xl space-y-1 text-xs text-rose-200/80">
                {actionState.issues.map((issue) => (
                  <li key={issue}>• {issue}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="self-start rounded-2xl border border-slate-800 bg-slate-900 p-2 xl:sticky xl:top-[176px]">
            <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
              Choose what to edit
            </p>
            <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-1">
              {visibleKeys.map((key) => {
                const active = openKey === key;
                const value = valueAtPath(
                  draft as unknown as JsonValue,
                  [key]
                );
                const itemCount = Array.isArray(value) ? value.length : null;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setOpenKey(key)}
                    className={`rounded-xl border px-3 py-3 text-left transition ${
                      active
                        ? "border-emerald-400/30 bg-emerald-400/10"
                        : "border-transparent hover:border-slate-700 hover:bg-slate-800/70"
                    }`}
                  >
                    <span
                      className={`block text-sm font-bold ${
                        active ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {labelFor(key)}
                      {itemCount !== null ? (
                        <span className="ml-2 text-[10px] text-slate-600">
                          {itemCount}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-slate-600">
                      {sectionDescriptions[key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <header className="border-b border-slate-800 px-5 py-4">
              <p className="font-display text-xl font-semibold">
                {labelFor(openKey)}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {sectionDescriptions[openKey]}
              </p>
            </header>
            <div className="p-4 sm:p-5">
              <ValueEditor
                fieldKey={openKey}
                value={selectedValue}
                path={[openKey]}
                onUpdate={updateValue}
              />
            </div>
          </section>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-500">
          <p>
            Finished editing? Save the draft, review it, then publish from the
            Dashboard.
          </p>
          <Link
            href="/admin"
            onClick={(event) => {
              if (
                hasUnsavedChanges &&
                !window.confirm(
                  "You have unsaved draft changes. Leave this page and discard them?"
                )
              ) {
                event.preventDefault();
              }
            }}
            className="font-bold text-emerald-300 hover:text-emerald-200"
          >
            Go to Dashboard
          </Link>
        </div>
      </form>
    </div>
  );
}
