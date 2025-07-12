import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  // Only use relevant params for signing (typically just timestamp unless others are needed)
  params.delete("file");
  params.delete("signature");

  const sortedParams = Array.from(params.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  // DO NOT encode values
  const signatureString = sortedParams
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(signatureString + apiSecret)
    .digest("hex");

  return NextResponse.json({
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    ...Object.fromEntries(sortedParams),
  });
}
