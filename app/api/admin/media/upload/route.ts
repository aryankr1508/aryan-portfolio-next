import {
  handleUpload,
  type HandleUploadBody
} from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getOptionalAdminIdentity } from "@/lib/admin/auth";
import {
  getPortfolioAdminDocument,
  recordPortfolioMedia,
  savePortfolioDraft
} from "@/lib/content/repository";

const allowedContentTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf"
];
const maximumSizeInBytes = 20 * 1024 * 1024;

const uploadPayloadSchema = z.object({
  actor: z.string().min(1),
  originalName: z.string().min(1).max(255),
  kind: z.enum(["image", "resume"]),
  altText: z.string().max(300).optional(),
  size: z.number().int().positive().max(maximumSizeInBytes),
  setAsResume: z.boolean().default(false)
});

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const admin = await getOptionalAdminIdentity();
        if (!admin) {
          throw new Error("Unauthorized upload request");
        }

        const payload = uploadPayloadSchema.parse(
          clientPayload ? JSON.parse(clientPayload) : null
        );

        if (payload.actor !== admin.actor) {
          throw new Error("Upload actor does not match the authenticated admin");
        }

        return {
          allowedContentTypes,
          maximumSizeInBytes,
          addRandomSuffix: true,
          cacheControlMaxAge: 31_536_000,
          tokenPayload: JSON.stringify(payload)
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = uploadPayloadSchema.parse(
          tokenPayload ? JSON.parse(tokenPayload) : null
        );

        await recordPortfolioMedia({
          pathname: blob.pathname,
          url: blob.url,
          originalName: payload.originalName,
          kind: payload.kind,
          contentType: blob.contentType,
          size: payload.size,
          altText: payload.altText,
          actor: payload.actor
        });

        if (
          payload.setAsResume &&
          payload.kind === "resume" &&
          blob.contentType === "application/pdf"
        ) {
          const document = await getPortfolioAdminDocument();
          await savePortfolioDraft(
            {
              ...document.draftContent,
              personalInfo: {
                ...document.draftContent.personalInfo,
                resumeFile: blob.url
              }
            },
            payload.actor
          );
        }
      }
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Portfolio media upload failed", error);
    return NextResponse.json(
      { error: "Unable to authorize or record the upload." },
      { status: 400 }
    );
  }
}
