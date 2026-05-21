import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { message, conversationId, personalityType, userName, proStageDone } = await request.json();

  const res = await fetch(`${process.env.dify_endpoint_URL}/chat-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.dify_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: { personality_type: personalityType, user_name: userName ?? "", pro_stage_done: proStageDone ?? false },
      query: message,
      response_mode: "blocking",
      ...(conversationId ? { conversation_id: conversationId } : {}),
      user: "user",
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    console.error("[agent1] Dify error:", res.status, errorBody);
    return NextResponse.json(
      { error: "Dify API 요청 실패", detail: errorBody },
      { status: res.status }
    );
  }

  const data = await res.json();

  return NextResponse.json({
    answer: data.answer,
    conversationId: data.conversation_id,
  });
}
