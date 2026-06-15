"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Persistent interactive ASCII (kaomoji) cat companion.
 *
 * - Slowly creeps toward the cursor, but stays in the empty page margins so it
 *   never covers the centered text column.
 * - Leaves a fading trail of tiny paw prints as it walks.
 * - Faces its travel direction (CSS flip).
 * - Debounced mood state machine (sit / walk / sleep / alert / purr) so it does
 *   not flicker between states; click reactions (happy / love) with a bubble.
 * - On narrow screens (no real margins / touch) it just wanders and naps.
 */

const CONTENT_WIDTH = 672; // matches Tailwind max-w-2xl (42rem)
const LERP = 0.016; // lower = slower / lazier
const IDLE_MS = 6000;
const ALERT_DIST = 95;
const MOOD_HOLD = 1000; // min ms a mood sticks before it can change
const STEP_MS = 480; // walk-cycle leg swap
const REACTION_MS = 2200;
const PAW_DIST = 52; // px traveled between paw prints
const PAW_LIFE = 2400; // ms a paw print lingers before removal

type Mood =
  | "sit"
  | "walk"
  | "sleep"
  | "alert"
  | "purr"
  | "happy"
  | "love";

const POSES: Record<Exclude<Mood, "walk"> | "walk1" | "walk2", string[]> = {
  sit: [" ／l、", "（ﾟ､ ｡ ７", " l、 ~ヽ", " じしf_,)ノ"],
  walk1: [" ／l、", "（ﾟ､ ｡ ７", " l、 ~ヽ", " じしf_,)ノ"],
  walk2: [" ／l、", "（ﾟ､ ｡ ７", " l、 ~ヽ", " ∪∪ f_,)ﾉ"],
  sleep: [" ／l、  z", "（ ーωー ７ z", " l、 ~ヽ", " じしf_,)ノ"],
  alert: [" ／l、 !", "（ﾟoﾟ ７", " l、 ~ヽ", " じしf_,)ノ"],
  purr: [" ／l、 ~", "（ ´ω` ７", " l、 ~ヽ", " じしf_,)ノ"],
  happy: [" ／l、 ♪", "（ ^ω^ ７", " l、 ~ヽ", " じしf_,)ノ"],
  love: [" ／l、 ♥", "（ ♥ω♥ ７", " l、 ~ヽ", " じしf_,)ノ"],
};

const REACTIONS: { mood: Mood; bubble: string }[] = [
  { mood: "happy", bubble: "MEOW" },
  { mood: "love", bubble: "♥" },
];

type Paw = { id: number; x: number; y: number };

export default function AsciiCat() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const [mood, setMood] = useState<Mood>("sit");
  const [step, setStep] = useState(0);
  const [flip, setFlip] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [paws, setPaws] = useState<Paw[]>([]);

  // animation state (refs to avoid re-rendering each frame)
  const pos = useRef({ x: 40, y: 300 });
  const target = useRef({ x: 40, y: 300 });
  const mouse = useRef({ x: -9999, y: -9999, t: 0 });
  const size = useRef({ w: 120, h: 80 });
  const lastMove = useRef(0);
  const nextWander = useRef(0);
  const reactionUntil = useRef(0);
  const reactionMood = useRef<Mood>("happy");
  const hovering = useRef(false);
  const moodRef = useRef<Mood>("sit");
  const moodSince = useRef(0);
  const flipRef = useRef(false);
  const lastStep = useRef(0);
  const lastPaw = useRef({ x: 40, y: 300 });
  const pawId = useRef(0);

  useEffect(() => {
    const showId = requestAnimationFrame(() => setMounted(true));
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    pos.current = { x: 40, y: window.innerHeight * 0.6 };
    target.current = { ...pos.current };
    lastPaw.current = { ...pos.current };

    const measure = () => {
      if (preRef.current) {
        size.current = {
          w: preRef.current.offsetWidth,
          h: preRef.current.offsetHeight,
        };
      }
    };
    measure();

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.t = performance.now();
      lastMove.current = Date.now();
    };

    const randomMarginPoint = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cw = size.current.w;
      const ch = size.current.h;
      const contentLeft = Math.max(8, (vw - CONTENT_WIDTH) / 2);
      const contentRight = contentLeft + CONTENT_WIDTH;
      const narrow = vw < CONTENT_WIDTH + 260;
      const y = 80 + Math.random() * Math.max(40, vh - ch - 160);
      if (narrow) {
        return { x: 8 + Math.random() * Math.max(8, vw - cw - 16), y: vh - ch - 24 };
      }
      const leftMax = contentLeft - cw - 8;
      const onLeft = Math.random() < 0.5;
      if (onLeft && leftMax > 8) {
        return { x: 8 + Math.random() * (leftMax - 8), y };
      }
      const rMin = contentRight + 8;
      const rMax = vw - cw - 8;
      return { x: rMin + Math.random() * Math.max(0, rMax - rMin), y };
    };

    const chaseTarget = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cw = size.current.w;
      const ch = size.current.h;
      const contentLeft = Math.max(8, (vw - CONTENT_WIDTH) / 2);
      const contentRight = contentLeft + CONTENT_WIDTH;
      let dx = mouse.current.x - cw / 2;
      const dy = mouse.current.y - ch / 2;
      if (dx + cw > contentLeft && dx < contentRight) {
        dx =
          mouse.current.x < vw / 2 ? contentLeft - cw - 8 : contentRight + 8;
      }
      target.current = {
        x: Math.min(Math.max(8, dx), vw - cw - 8),
        y: Math.min(Math.max(8, dy), vh - ch - 8),
      };
    };

    const dropPaw = () => {
      const px = pos.current.x + size.current.w / 2;
      const py = pos.current.y + size.current.h - 8;
      const id = pawId.current++;
      setPaws((prev) => [...prev.slice(-9), { id, x: px, y: py }]);
      window.setTimeout(
        () => setPaws((prev) => prev.filter((p) => p.id !== id)),
        PAW_LIFE
      );
    };

    let raf = 0;
    const frame = () => {
      const now = Date.now();
      const vw = window.innerWidth;
      const narrow = vw < CONTENT_WIDTH + 260;
      const hasMouse = mouse.current.x > -9999;

      const idleMs = now - lastMove.current;
      const isIdle = lastMove.current === 0 || idleMs > IDLE_MS;

      if (!reduce) {
        if (!narrow && hasMouse && !isIdle) {
          chaseTarget();
        } else if (now > nextWander.current) {
          target.current = randomMarginPoint();
          nextWander.current = now + 5000 + Math.random() * 6000;
        }
      }

      const dx = target.current.x - pos.current.x;
      const dy = target.current.y - pos.current.y;
      const dist = Math.hypot(dx, dy);
      const moving = dist > 3 && !reduce;
      if (moving) {
        pos.current.x += dx * LERP;
        pos.current.y += dy * LERP;
        if (Math.abs(dx) > 1) {
          const f = dx < 0;
          if (f !== flipRef.current) {
            flipRef.current = f;
            setFlip(f);
          }
        }
        // leg-swap animation
        if (now - lastStep.current > STEP_MS) {
          lastStep.current = now;
          setStep((s) => s ^ 1);
        }
        // paw trail
        const pd = Math.hypot(
          pos.current.x - lastPaw.current.x,
          pos.current.y - lastPaw.current.y
        );
        if (pd > PAW_DIST) {
          lastPaw.current = { x: pos.current.x, y: pos.current.y };
          dropPaw();
        }
      }

      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      // desired mood (priority order)
      const cx = pos.current.x + size.current.w / 2;
      const cy = pos.current.y + size.current.h / 2;
      const dm = hasMouse
        ? Math.hypot(mouse.current.x - cx, mouse.current.y - cy)
        : 99999;

      let desired: Mood;
      if (now < reactionUntil.current) desired = reactionMood.current;
      else if (hovering.current) desired = "purr";
      else if (!narrow && !isIdle && dm < ALERT_DIST) desired = "alert";
      else if (isIdle && !moving) desired = "sleep";
      else if (moving) desired = "walk";
      else desired = "sit";

      // debounce: hold a mood for a minimum time to stop flicker.
      if (desired !== moodRef.current) {
        const forced = now < reactionUntil.current; // reactions apply at once
        if (forced || now - moodSince.current > MOOD_HOLD) {
          moodRef.current = desired;
          moodSince.current = now;
          setMood(desired);
        }
      }

      raf = requestAnimationFrame(frame);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", measure);
    raf = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(showId);
    };
  }, []);

  const react = () => {
    // ignore clicks while a reaction is already playing (no spam-switching)
    if (Date.now() < reactionUntil.current) return;
    const r = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
    reactionMood.current = r.mood;
    reactionUntil.current = Date.now() + REACTION_MS;
    setBubble(r.bubble);
    window.setTimeout(() => setBubble(null), REACTION_MS);
  };

  const poseKey =
    mood === "walk" ? (step ? "walk1" : "walk2") : mood;

  return (
    <>
      {/* paw-print trail */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 29,
          pointerEvents: "none",
        }}
      >
        {paws.map((p) => (
          <span
            key={p.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              fontSize: 9,
              color: "var(--muted)",
              animation: `pawFade ${PAW_LIFE}ms ease-out forwards`,
            }}
          >
            ·
          </span>
        ))}
      </div>

      {/* the cat */}
      <div
        ref={wrapRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 30,
          pointerEvents: "none",
          willChange: "transform",
          opacity: mounted ? 1 : 0,
          transition: "opacity 600ms ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: 4,
            fontSize: 11,
            letterSpacing: "0.15em",
            color: "var(--muted)",
            whiteSpace: "nowrap",
            opacity: bubble ? 1 : 0,
            transition: "opacity 150ms ease",
          }}
        >
          {bubble}
        </div>
        <pre
          ref={preRef}
          onClick={react}
          onMouseEnter={() => (hovering.current = true)}
          onMouseLeave={() => (hovering.current = false)}
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.25,
            color: "var(--muted)",
            userSelect: "none",
            cursor: "pointer",
            pointerEvents: "auto",
            transform: flip ? "scaleX(-1)" : "none",
            fontFamily:
              "var(--font-mono), ui-monospace, SF Mono, Menlo, monospace",
          }}
        >
          {POSES[poseKey].join("\n")}
        </pre>
      </div>
    </>
  );
}
