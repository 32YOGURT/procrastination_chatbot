import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const conversationId = request.nextUrl.searchParams.get("conversation_id");
  if (!conversationId) {
    return NextResponse.json({ error: "conversation_id required" }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.dify_endpoint_URL}/messages?conversation_id=${conversationId}&user=user&limit=100`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AGENT2_API_KEY}`,
      },
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    console.error("[agent2/messages] Dify error:", res.status, errorBody);
    return NextResponse.json({ error: "Dify API 요청 실패" }, { status: res.status });
  }

  const data = await res.json();

  const messages = data.data.flatMap((item: { query: string; answer: string }) => [
    { role: "user", content: item.query },
    { role: "assistant", content: item.answer },
  ]);

  return NextResponse.json({ messages });
}
