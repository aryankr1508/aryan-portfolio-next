"use client";

import { upload } from "@vercel/blob/client";
import { FileUp, ImagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function MediaUploadForm({ actor }: { actor: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  return (
    <form
      ref={formRef}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const file = form.get("file");
        const kind = String(form.get("kind") ?? "image");
        const altText = String(form.get("altText") ?? "").trim();
        const setAsResume = form.get("setAsResume") === "on";

        if (!(file instanceof File) || !file.size) {
          setMessage("Choose an image or PDF first.");
          return;
        }

        setPending(true);
        setProgress(0);
        setMessage("");

        try {
          const folder = kind === "resume" ? "portfolio/resume" : "portfolio/images";
          const blob = await upload(`${folder}/${file.name}`, file, {
            access: "public",
            handleUploadUrl: "/api/admin/media/upload",
            contentType: file.type,
            multipart: file.size > 5 * 1024 * 1024,
            clientPayload: JSON.stringify({
              actor,
              originalName: file.name,
              kind,
              altText: altText || undefined,
              size: file.size,
              setAsResume
            }),
            onUploadProgress: ({ percentage }) => setProgress(percentage)
          });

          setMessage(
            setAsResume
              ? "Upload complete and selected in the private resume draft."
              : `Upload complete: ${blob.pathname}`
          );
          formRef.current?.reset();
          router.refresh();
        } catch (error) {
          console.error(error);
          setMessage("Upload failed. Check the Blob configuration and file limits.");
        } finally {
          setPending(false);
        }
      }}
    >
      <div className="flex items-center gap-2 text-emerald-300">
        <ImagePlus size={18} />
        <h2 className="font-display text-xl font-semibold text-white">
          Upload media
        </h2>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
            File
          </span>
          <input
            required
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
            Media type
          </span>
          <select
            name="kind"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
          >
            <option value="image">Portfolio image</option>
            <option value="resume">Resume PDF</option>
          </select>
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
            Alt text
          </span>
          <input
            name="altText"
            placeholder="Describe the image for accessibility"
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400"
          />
        </label>
      </div>

      <label className="mt-4 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-sm text-slate-300">
        <input
          type="checkbox"
          name="setAsResume"
          className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-emerald-400"
        />
        Select this PDF as the resume in the private draft
      </label>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60"
        >
          <FileUp size={15} />
          {pending ? `Uploading ${Math.round(progress)}%` : "Upload"}
        </button>
        {message ? (
          <p className="text-sm text-slate-400" role="status">
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
