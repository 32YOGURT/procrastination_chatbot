"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTaskById, updateConversationId } from "@/lib/storage";
import type { TaskCard } from "@/lib/types";
import ChatWindow from "@/components/chat/ChatWindow";

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

  useEffect(() => {
    getTaskById(cardId).then(async (found) => {
      if (!found) {
        router.push("/dashboard");
        return;
      }
      setTask(found);
      if (found.conversationId) {
        setConversationId(found.conversationId);
        const res = await fetch(
          `/api/agent2/messages?conversation_id=${found.conversationId}`,
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
        }
      } else {
        sendMessage("[init]", "", found);
      }
    });
  }, [cardId, router]);

  const sendMessage = async (
    text: string,
    currentConversationId: string,
    currentTask: TaskCard,
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId: currentConversationId,
          task: currentTask,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("응답 오류");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setLoading(false);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let newConversationId = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;
          try {
            const data = JSON.parse(jsonStr);
            if (data.event === "message" && data.answer) {
              fullText += data.answer;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: fullText,
                };
                return updated;
              });
            }
            if (data.event === "message_end" && data.conversation_id) {
              newConversationId = data.conversation_id;
            }
          } catch {
            // 파싱 불가 청크 스킵
          }
        }
      }

      if (newConversationId) {
        setConversationId(newConversationId);
        updateConversationId(currentTask.id, newConversationId);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "오류가 발생했어요. 다시 시도해주세요." },
      ]);
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || !task) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    await sendMessage(trimmed, conversationId, task);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!task) return null;

  return (
    <div className="chat-page bg-emerald-50">
      {/* 헤더 */}
      <header className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <button
            onClick={() => router.push("/tasks")}
            className="w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center shrink-0"
          >
            <span className="text-neutral-500 text-base leading-none">‹</span>
          </button>
          <div>
            <h1 className="text-sm font-semibold text-neutral-800">
              {task.title}
            </h1>
            <p className="text-xs text-neutral-400">
              {task.procrastinationType} · {task.personalityType}
            </p>
          </div>
        </div>
      </header>

      <ChatWindow messages={messages} loading={loading} />

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
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-30 hover:bg-emerald-800 transition-colors shrink-0"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
