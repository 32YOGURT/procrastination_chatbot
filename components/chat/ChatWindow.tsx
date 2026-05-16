"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  emptyText?: string;
}

export default function ChatWindow({ messages, loading, emptyText }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-2xl flex flex-col gap-4">
        {messages.length === 0 && emptyText && (
          <p className="text-center text-sm text-neutral-400 mt-16">{emptyText}</p>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
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
  );
}
