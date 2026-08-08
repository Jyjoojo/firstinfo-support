import { proxyAttachment } from "@/lib/attachment-proxy";

export async function GET(
  _request: Request,
  context: { params: Promise<{ piece: string }> },
) {
  const { piece } = await context.params;
  return proxyAttachment(piece, "telecharger");
}
