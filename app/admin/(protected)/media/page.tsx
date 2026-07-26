import { ExternalLink, FileText, ImageIcon } from "lucide-react";
import CopyMediaUrlButton from "@/components/admin/copy-media-url-button";
import MediaUploadForm from "@/components/admin/media-upload-form";
import { requireAdmin } from "@/lib/admin/auth";
import {
  getPortfolioAdminDocument,
  listPortfolioMedia
} from "@/lib/content/repository";

export default async function AdminMediaPage() {
  const admin = await requireAdmin();
  const [media, document] = await Promise.all([
    listPortfolioMedia(),
    getPortfolioAdminDocument()
  ]);

  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
          Asset management
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Media and resume
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
          Upload a file, then copy its URL into the relevant content field.
          Resume PDFs can be selected automatically during upload.
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
            Resume selected in draft
          </p>
          <p className="mt-2 truncate text-sm text-slate-300">
            {document.draftContent.personalInfo.resumeFile}
          </p>
        </div>
        <a
          href={document.draftContent.personalInfo.resumeFile}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:border-emerald-400/40 hover:text-white"
        >
          <ExternalLink size={14} />
          Open resume
        </a>
      </section>

      <MediaUploadForm actor={admin.actor} />

      <section>
        <h2 className="font-display text-2xl font-semibold">Media library</h2>
        {media.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {media.map((asset) => {
            const isPdf = asset.contentType === "application/pdf";
            return (
              <article
                key={asset.id}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
              >
                <div className="flex aspect-[16/9] items-center justify-center bg-slate-950">
                  {isPdf ? (
                    <FileText size={38} className="text-rose-300" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.url}
                      alt={asset.altText ?? asset.originalName}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-2">
                    <ImageIcon size={15} className="mt-0.5 shrink-0 text-emerald-300" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {asset.originalName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {(asset.size / 1024).toFixed(1)} KB · {asset.kind}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                    >
                      Open
                    </a>
                    <CopyMediaUrlButton url={asset.url} />
                  </div>
                </div>
              </article>
            );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
            <ImageIcon size={25} className="mx-auto text-slate-600" />
            <p className="mt-3 text-sm font-bold text-slate-300">
              No uploaded media yet
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Your first upload will appear here with a reusable URL.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
