import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { message, conversationId, task } = await request.json();
  console.log("[agent2] inputs:", JSON.stringify({ user_type: task?.personalityType, delay_stage: task?.procrastinationType, task: task?.title, importance: task?.importance, due_date: task?.deadline }, null, 2));

  const res = await fetch(`${process.env.dify_endpoint_URL}/chat-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AGENT2_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: {
        user_type: task.personalityType,
        delay_stage: task.procrastinationType,
        task: task.title,
        importance: task.importance,
        due_date: task.deadline,
      },
      query: message,
      response_mode: "blocking",
      conversation_id: conversationId ?? "",
      user: "user",
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    console.error("[agent2] Dify error:", res.status, JSON.stringify(errorBody, null, 2));
    return NextResponse.json(
      { error: "Dify API 요청 실패", detail: errorBody },
      { status: res.status },
    );
  }

  const data = await res.json();
  console.log("[agent2] raw response:", JSON.stringify(data, null, 2));

  return NextResponse.json({
    answer: data.answer,
    conversationId: data.conversation_id,
  });
}
