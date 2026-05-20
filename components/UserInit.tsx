"use client";

import { useEffect } from "react";
import { getUserId } from "@/lib/storage";

export default function UserInit() {
  useEffect(() => {
    const userId = getUserId();
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
  }, []);

  return null;
}
