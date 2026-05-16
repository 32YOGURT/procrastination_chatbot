"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTaskById } from "@/lib/storage";
import type { TaskCard } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Agent2Page() {
  const { cardId } = useParams<{ cardId: string }>();
  const router = useRouter();
  const [task, setTask] = useState<TaskCard | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const found = getTaskById(cardId);
    if (!found) {
      router.push("/dashboard");
      return;
    }
    setTask(found);
  }, [cardId, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || !task) return;

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          conversationId,
          task,
        }),
      });

      const data = await res.json();

      if (data.conversationId) setConversationId(data.conversationId);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
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

  if (!task) return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* 헤더 */}
      <header className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-sm font-semibold text-neutral-800">
            {task.title}
          </h1>
          <p className="text-xs text-neutral-400">
            {task.procrastinationType} · {task.personalityType}
          </p>
        </div>
      </header>

      {/* 메시지 목록 */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl flex flex-col gap-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-neutral-400 mt-16">
              솔루션 챗봇입니다. 구현 예정
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
