"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, saveTask } from "@/lib/storage";
import type { PersonalityType, ProcrastinationType } from "@/lib/types";
import ChatWindow from "@/components/chat/ChatWindow";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface DifyResponse {
  message: string;
  status: "collecting" | "confirmed";
  show_ui?: boolean;
  confirmed_stage?: ProcrastinationType;
  task_title?: string;
  task_deadline?: string;
  task_importance?: string;
  task_estimated_time?: string;
}

const PROCRASTINATION_TYPES: ProcrastinationType[] = [
  "계획 지연",
  "착수 지연",
  "지속 지연",
  "완수 지연",
  "결과 평가",
];

const PROCRASTINATION_DESCRIPTIONS: Record<ProcrastinationType, string> = {
  "계획 지연": "뭘 해야 할지 목록 자체를 세우지 못하고 미루는 상태",
  "착수 지연": "계획은 있지만 막상 시작을 못 하는 상태",
  "지속 지연": "시작은 했지만 중간에 자꾸 멈추는 상태",
  "완수 지연": "거의 다 했는데 마무리를 짓지 못하는 상태",
  "결과 평가": "끝냈지만 제출이나 공유를 미루는 상태",
};

export default function Agent1Page() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [personalityType, setPersonalityTypeState] =
    useState<PersonalityType | null>(null);
  const [userName, setUserNameState] = useState<string | null>(null);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [proStageDone, setProStageDone] = useState(false);

  useEffect(() => {
    getUser().then(({ personalityType: type, userName: name }) => {
      setPersonalityTypeState(type);
      setUserNameState(name);
      sendMessage("[init]", "", type, name, false);
    });
  }, []);

  const sendMessage = async (
    text: string,
    currentConversationId: string,
    currentPersonalityType: PersonalityType | null,
    currentUserName: string | null,
    currentProStageDone: boolean,
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationId: currentConversationId,
          personalityType: currentPersonalityType,
          userName: currentUserName,
          proStageDone: currentProStageDone,
        }),
      });

      const data = await res.json();
      if (data.conversationId) setConversationId(data.conversationId);

      const parsed: DifyResponse | null = data.answer ?? null;
      const displayMessage: string = parsed?.message ?? "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: displayMessage },
      ]);

      if (parsed?.show_ui) setSelectorVisible(true);

      if (
        parsed?.status === "confirmed" &&
        parsed.confirmed_stage &&
        parsed.task_title
      ) {
        await saveTask({
          id: crypto.randomUUID(),
          title: parsed.task_title ?? "",
          personalityType: currentPersonalityType!,
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

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    await sendMessage(
      trimmed,
      conversationId,
      personalityType,
      userName,
      proStageDone,
    );
  };

  const handleSelect = async (type: ProcrastinationType) => {
    setSelectorVisible(false);
    setProStageDone(true);
    const text = `선택: ${type}`;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    await sendMessage(text, conversationId, personalityType, userName, true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="border-b border-neutral-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-sm font-semibold text-neutral-800">과제 추가</h1>
          <p className="text-xs text-neutral-400">
            어떤 과제를 미루고 있는지 이야기해주세요.
          </p>
        </div>
      </header>

      <ChatWindow messages={messages} loading={loading} />

      {selectorVisible && !loading && (
        <div className="px-6 pb-4">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs text-neutral-400 mb-3">
              지연 행동 단계를 선택해주세요
            </p>
            <div className="flex flex-col gap-2">
              {PROCRASTINATION_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleSelect(type)}
                  className="text-left rounded-xl border border-neutral-200 bg-white px-4 py-3 hover:border-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  <p className="text-sm font-medium text-neutral-800">{type}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {PROCRASTINATION_DESCRIPTIONS[type]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-neutral-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-2xl flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요 (Enter로 전송)"
            rows={1}
            disabled={selectorVisible || loading}
            className="flex-1 resize-none rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 leading-relaxed disabled:opacity-40"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading || selectorVisible}
            className="rounded-xl bg-neutral-800 px-5 py-3 text-sm font-semibold text-white disabled:opacity-30 hover:bg-neutral-700 transition-colors shrink-0"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
