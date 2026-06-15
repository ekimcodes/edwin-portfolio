"use client";
import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number; // ms per char
  startDelay?: number; // ms before typing starts
  caretAfter?: boolean; // keep blinking caret after finishing
  onDone?: () => void;
  className?: string;
};

export default function Typewriter({
  text,
  speed = 65,
  startDelay = 0,
  caretAfter = false,
  onDone,
  className,
}: Props) {
  const [n, setN] = useState(0);
  const [started, setStarted] = useState(startDelay === 0);

  useEffect(() => {
    if (started) return;
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [started, startDelay]);

  useEffect(() => {
    if (!started) return;
    if (n >= text.length) {
      onDone?.();
      return;
    }
    const t = setTimeout(() => setN((x) => x + 1), speed);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, n, text, speed]);

  const done = n >= text.length;
  return (
    <span className={className}>
      {text.slice(0, n)}
      {(!done || caretAfter) && <span className="caret" aria-hidden />}
    </span>
  );
}
