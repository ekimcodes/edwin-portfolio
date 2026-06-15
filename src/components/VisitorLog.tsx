"use client";
import { useEffect, useState } from "react";
import { relativeTime } from "@/lib/relativeTime";

type V = {
  id: string;
  adjective: string;
  animal: string;
  city: string;
  region: string;
  firstSeen: number;
};

export default function VisitorLog() {
  const [list, setList] = useState<V[] | null>(null);

  useEffect(() => {
    fetch("/api/log")
      .then((r) => r.json())
      .then((j) => setList(j.visitors))
      .catch(() => setList([]));
  }, []);

  if (list === null) return <p className="muted">loading…</p>;
  if (list.length === 0) return <p className="muted">no visitors yet</p>;

  return (
    <ul className="space-y-1">
      {list.map((v) => {
        const loc = [v.city, v.region]
          .filter(Boolean)
          .join(", ")
          .toLowerCase();
        return (
          <li key={v.id} className="grid grid-cols-[1fr_auto] gap-x-6">
            <span>
              {v.adjective} {v.animal}{" "}
              <span className="muted">· {loc || "somewhere"}</span>
            </span>
            <span className="muted">{relativeTime(v.firstSeen)}</span>
          </li>
        );
      })}
    </ul>
  );
}
