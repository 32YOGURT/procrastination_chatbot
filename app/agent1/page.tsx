"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPersonalityType, saveTask } from "@/lib/storage";
import type { ProcrastinationType } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DifyResponse {
  message: string;
  status: "collecting" | "confirmed";
  confirmed_stage?: ProcrastinationType;
  task_title?: string;
  task_description?: string;
  task_deadline?: string;
  task_importance?: string;
  task_category?: string;
  task_estimated_time?: string;
}

export default function Agent1Page() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const personalityType = getPersonalityType();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          conversationId,
          personalityType,
        }),
      });

      const data = await res.json();

      if (data.conversationId) setConversationId(data.conversationId);

      let displayMessage: string = data.answer;
      let parsed: DifyResponse | null = null;

      try {
        parsed = JSON.parse(data.answer);
        displayMessage = parsed.message;
      } catch {
        // plain text 응답
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: displayMessage },
      ]);

      if (
        parsed?.status === "confirmed" &&
        parsed.confirmed_stage &&
        parsed.task_title
      ) {
        saveTask({
          id: crypto.randomUUID(),
          title: parsed.task_title ?? "",
          description: parsed.task_description ?? "",
          personalityType: personalityType!,
          procrastinationType: parsed.confirmed_stage,
          deadline: parsed.task_deadline ?? "",
          importance: parsed.task_importance ?? "",
          taskCategory: parsed.task_category ?? "",
          estimatedTime: parsed.task_estimated_time ?? "",
          createdAt: new Date().toISOString(),
        });
        router.push("/dashboard");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "오류가 발생했어요. 다시 시도해주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* 헤더 */}
      <header className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-sm font-semibold text-neutral-800">과제 추가</h1>
          <p className="text-xs text-neutral-400">
            어떤 과제를 미루고 있는지 이야기해주세요.
          </p>
        </div>
      </header>

      {/* 메시지 목록 */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl flex flex-col gap-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-neutral-400 mt-16">
              첫 메시지를 입력해주세요.
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-neutral-800 text-white rounded-br-sm"
                    : "bg-white border border-neutral-200 text-neutral-700 rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-sm px-4 py-3">
                <span className="text-neutral-400 text-sm">···</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* 입력창 */}
      <div className="border-t border-neutral-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-2xl flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요 (Enter로 전송)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 leading-relaxed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="rounded-xl bg-neutral-800 px-5 py-3 text-sm font-semibold text-white disabled:opacity-30 hover:bg-neutral-700 transition-colors shrink-0"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
