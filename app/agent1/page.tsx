"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPersonalityType, saveTask } from "@/lib/storage";
import type { PersonalityType, ProcrastinationType } from "@/lib/types";
import ChatWindow from "@/components/chat/ChatWindow";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DifyResponse {
  message: string;
  status: "collecting" | "confirmed";
  confirmed_stage?: ProcrastinationType;
  task_title?: string;
  task_deadline?: string;
  task_importance?: string;
  task_estimated_time?: string;
}

export default function Agent1Page() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [personalityType, setPersonalityTypeState] = useState<PersonalityType | null>(null);

  useEffect(() => {
    getPersonalityType().then(setPersonalityTypeState);
  }, []);

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
        displayMessage = parsed!.message;
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
        await saveTask({
          id: crypto.randomUUID(),
          title: parsed.task_title ?? "",
          personalityType: personalityType!,
          procrastinationType: parsed.confirmed_stage,
          deadline: parsed.task_deadline ?? "",
          importance: parsed.task_importance ?? "",
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

      <ChatWindow messages={messages} loading={loading} emptyText="첫 메시지를 입력해주세요." />

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
