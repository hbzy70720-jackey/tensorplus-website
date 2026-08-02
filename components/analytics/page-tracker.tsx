"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * 页面访问追踪组件。
 * 挂载到 layout 中，自动记录每次页面浏览的 IP、路径、来源和停留时长。
 */
export default function PageTracker() {
  const pathname = usePathname();
  const recordIdRef = useRef<number | null>(null);
  const startTimeRef = useRef(Date.now());
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function record() {
      try {
        const res = await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: pathname,
            referer: document.referrer || null,
          }),
        });
        if (!cancelled && res.ok) {
          const data = await res.json();
          recordIdRef.current = data.id;
        }
      } catch {
        // 静默失败，不影响用户体验
      }
    }

    startTimeRef.current = Date.now();
    record();

    // 每 30 秒心跳更新停留时长
    heartbeatRef.current = setInterval(async () => {
      if (recordIdRef.current == null) return;
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      try {
        await fetch("/api/track", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: recordIdRef.current, duration }),
        });
      } catch {
        // 静默失败
      }
    }, 30000);

    return () => {
      cancelled = true;
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [pathname]);

  // 页面离开时发送最终停留时长（使用 sendBeacon 保证可靠）
  useEffect(() => {
    function handleBeforeUnload() {
      if (recordIdRef.current == null) return;
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      navigator.sendBeacon(
        "/api/track",
        JSON.stringify({ id: recordIdRef.current, duration })
      );
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return null;
}
