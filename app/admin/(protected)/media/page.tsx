import { FileText, ImageIcon } from "lucide-react";
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
          Files upload directly to Vercel Blob through a short-lived,
          admin-authorized token. Uploaded URLs can be copied into any image
          field in the content masters.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
          Draft resume
        </p>
        <p className="mt-2 break-all text-sm text-slate-300">
          {document.draftContent.personalInfo.resumeFile}
        </p>
      </section>

      <MediaUploadForm actor={admin.actor} />

      <section>
        <h2 className="font-display text-2xl font-semibold">Media library</h2>
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
      </section>
    </div>
  );
}
