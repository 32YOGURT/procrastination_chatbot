import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { message, conversationId, task } = await request.json();

  const res = await fetch(`${process.env.dify_endpoint_URL}/chat-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.dify_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: {
        personality_type: task.personalityType,
        procrastination_type: task.procrastinationType,
        task_title: task.title,
        task_description: task.description,
        task_deadline: task.deadline,
        task_importance: task.importance,
        task_category: task.taskCategory,
        task_estimated_time: task.estimatedTime,
      },
      query: message,
      response_mode: "blocking",
      conversation_id: conversationId ?? "",
      user: "user",
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Dify API 요청 실패" },
      { status: res.status }
    );
  }

  const data = await res.json();

  return NextResponse.json({
    answer: data.answer,
    conversationId: data.conversation_id,
  });
}
