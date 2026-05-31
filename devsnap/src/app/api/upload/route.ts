import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadToS3 } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

const IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

const FILE_MIME_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/json",
  "application/x-yaml",
  "text/yaml",
  "application/xml",
  "text/xml",
  "text/csv",
  "application/toml",
]);

const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const FILE_MAX_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const mimeType = file.type;
  const isImage = IMAGE_MIME_TYPES.has(mimeType);
  const isFile = FILE_MIME_TYPES.has(mimeType);

  if (!isImage && !isFile) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
  }

  if (!isImage) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPro: true },
    });
    if (!user?.isPro) {
      return NextResponse.json({ error: "File uploads require a Pro plan." }, { status: 403 });
    }
  }

  const maxBytes = isImage ? IMAGE_MAX_BYTES : FILE_MAX_BYTES;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (buffer.byteLength > maxBytes) {
    const limit = isImage ? "5 MB" : "10 MB";
    return NextResponse.json({ error: `File exceeds ${limit} limit` }, { status: 413 });
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const key = `uploads/${session.user.id}/${randomUUID()}.${ext}`;

  const url = await uploadToS3(key, buffer, mimeType);

  return NextResponse.json({
    url,
    fileName: file.name,
    fileSize: buffer.byteLength,
  });
}
