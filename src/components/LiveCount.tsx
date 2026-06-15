"use client";
import { useEffect, useState } from "react";

export default function LiveCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    const beat = async () => {
      try {
        const r = await fetch("/api/presence", { method: "POST" });
        const j = await r.json();
        if (alive) setCount(j.count);
      } catch {
        /* ignore transient errors */
      }
    };
    beat();
    const iv = setInterval(beat, 15_000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, []);

  if (count === null) return null;
  return (
    <span className="muted">
      {count} {count === 1 ? "soul" : "souls"} here now
    </span>
  );
}
