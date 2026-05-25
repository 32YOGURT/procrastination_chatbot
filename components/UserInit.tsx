"use client";

import { useEffect, useState } from "react";
import { getAuthUserId, getUser, setUserName } from "@/lib/storage";

export default function UserInit() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function init() {
      const userId = await getAuthUserId();
      if (!userId) return;
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const { userName } = await getUser();
      if (!userName) setShowModal(true);
    }
    init();
  }, []);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    await setUserName(trimmed);
    setShowModal(false);
    setSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-8 w-full max-w-sm mx-4 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-neutral-800">닉네임을 알려주세요</h2>
          <p className="text-sm text-neutral-400">상담 중 이름으로 불러드릴게요.</p>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="닉네임 입력"
          maxLength={20}
          autoFocus
          className="rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400"
        />
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || submitting}
          className="rounded-xl bg-emerald-700 py-3 text-sm font-semibold text-white disabled:opacity-30 hover:bg-emerald-800 transition-colors"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
