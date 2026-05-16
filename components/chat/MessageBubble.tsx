interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          role === "user"
            ? "bg-neutral-800 text-white rounded-br-sm"
            : "bg-white border border-neutral-200 text-neutral-700 rounded-bl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
