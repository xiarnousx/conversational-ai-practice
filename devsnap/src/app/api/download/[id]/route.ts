import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getItemById } from "@/lib/db/items";
import { getSignedDownloadUrl, keyFromUrl } from "@/lib/s3";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const item = await getItemById(session.user.id, id);

  if (!item?.fileUrl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const key = keyFromUrl(item.fileUrl);
  const signedUrl = await getSignedDownloadUrl(key, item.fileName ?? "download");

  return NextResponse.redirect(signedUrl);
}
