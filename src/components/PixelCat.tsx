// src/components/PixelCat.tsx
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PALETTE,
  SPRITE_W,
  SPRITE_H,
  FRAMES,
  EYE_PIXELS,
  type CatState,
} from "@/lib/catSprites";
import {
  pickWanderTarget,
  pickDwellState,
  dwellDuration,
  frameForState,
} from "@/lib/catBehavior";

const SCALE = 4; // px per sprite pixel -> 64x64 on screen
const SPRITE_PX = SPRITE_W * SCALE;
const LERP = 0.02; // lazy glide toward target
const STEP_MS = 200; // walk-frame swap cadence
const BLINK_MIN = 2500;
const PAW_DIST = 26;
const PAW_LIFE = 2600;
const REACTION_MS = 1800;

type Paw = { id: number; x: number; y: number };

function Sprite({
  state,
  frame,
  blink,
  flip,
}: {
  state: CatState;
  frame: number;
  blink: boolean;
  flip: boolean;
}) {
  const frames = FRAMES[state];
  const grid = frames[frame] ?? frames[0];

  const rects = useMemo(() => {
    const eye = new Set(EYE_PIXELS.map(([r, c]) => `${r},${c}`));
    const out: { x: number; y: number; fill: string }[] = [];
    grid.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        let ch = row[x];
        if (ch === ".") continue;
        if (blink && ch === "G" && eye.has(`${y},${x}`)) ch = "K";
        const fill = PALETTE[ch];
        if (fill) out.push({ x, y, fill });
      }
    });
    return out;
  }, [grid, blink]);

  return (
    <svg
      width={SPRITE_W * SCALE}
      height={SPRITE_H * SCALE}
      viewBox={`0 0 ${SPRITE_W} ${SPRITE_H}`}
      shapeRendering="crispEdges"
      style={{
        imageRendering: "pixelated",
        transform: flip ? "scaleX(-1)" : "none",
        display: "block",
      }}
      aria-hidden
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={1} height={1} fill={r.fill} />
      ))}
    </svg>
  );
}

export default function PixelCat() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CatState>("sit");
  const [frame, setFrame] = useState(0);
  const [flip, setFlip] = useState(false);
  const [blink, setBlink] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [paws, setPaws] = useState<Paw[]>([]);

  const pos = useRef({ x: 40, y: 300 });
  const target = useRef({ x: 40, y: 300 });
  const stateRef = useRef<CatState>("sit");
  const dwellUntil = useRef(0);
  const reactionUntil = useRef(0);
  const lastStep = useRef(0);
  const tick = useRef(0);
  const lastBlink = useRef(0);
  const lastPaw = useRef({ x: 40, y: 300 });
  const pawId = useRef(0);
  const size = useRef({ w: SPRITE_PX, h: SPRITE_PX });

  const setCatState = (s: CatState) => {
    if (s !== stateRef.current) {
      stateRef.current = s;
      setState(s);
    }
  };

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    pos.current = { x: 40, y: window.innerHeight * 0.6 };
    target.current = { ...pos.current };
    lastPaw.current = { ...pos.current };
    dwellUntil.current = Date.now() + 1500;
    const showId = requestAnimationFrame(() => setMounted(true));

    const dropPaw = () => {
      const px = pos.current.x + size.current.w / 2;
      const py = pos.current.y + size.current.h - 8;
      const id = pawId.current++;
      setPaws((prev) => [...prev.slice(-13), { id, x: px, y: py }]);
      window.setTimeout(
        () => setPaws((prev) => prev.filter((p) => p.id !== id)),
        PAW_LIFE
      );
    };

    let raf = 0;
    const loop = () => {
      const now = Date.now();
      const inReaction = now < reactionUntil.current;

      const dx = target.current.x - pos.current.x;
      const dy = target.current.y - pos.current.y;
      const dist = Math.hypot(dx, dy);
      const arrived = dist <= 2;

      if (reduce) {
        setCatState("sit");
      } else if (inReaction) {
        // hold the reaction state set in onClick
      } else if (!arrived) {
        setCatState("walk");
        pos.current.x += dx * LERP;
        pos.current.y += dy * LERP;
        if (Math.abs(dx) > 0.5) setFlip(dx < 0);
        if (now - lastStep.current > STEP_MS) {
          lastStep.current = now;
          tick.current++;
          setFrame(frameForState(FRAMES.walk.length, tick.current));
        }
        const pd = Math.hypot(
          pos.current.x - lastPaw.current.x,
          pos.current.y - lastPaw.current.y
        );
        if (pd > PAW_DIST) {
          lastPaw.current = { x: pos.current.x, y: pos.current.y };
          dropPaw();
        }
      } else if (now >= dwellUntil.current) {
        // Either start a dwell behavior, or (if already dwelling) wander on.
        if (stateRef.current === "walk") {
          const dwell = pickDwellState();
          setCatState(dwell);
          setFrame(0);
          tick.current = 0;
          dwellUntil.current = now + dwellDuration(dwell);
        } else {
          target.current = pickWanderTarget(
            window.innerWidth,
            window.innerHeight,
            size.current
          );
          setCatState("walk");
          dwellUntil.current = now + 800;
        }
      } else {
        // Animate multi-frame dwell states (groom).
        const frames = FRAMES[stateRef.current].length;
        if (frames > 1 && now - lastStep.current > STEP_MS * 2) {
          lastStep.current = now;
          tick.current++;
          setFrame(frameForState(frames, tick.current));
        }
      }

      // Blink while idle/sit.
      if (
        (stateRef.current === "idle" || stateRef.current === "sit") &&
        now - lastBlink.current > BLINK_MIN + Math.random() * 2500
      ) {
        lastBlink.current = now;
        setBlink(true);
        window.setTimeout(() => setBlink(false), 140);
      }

      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(showId);
    };
  }, []);

  const onClick = () => {
    if (Date.now() < reactionUntil.current) return;
    const love = Math.random() < 0.5;
    setCatState(love ? "love" : "happy");
    setFrame(0);
    setBubble(love ? "♥" : "!");
    reactionUntil.current = Date.now() + REACTION_MS;
    window.setTimeout(() => {
      setBubble(null);
      dwellUntil.current = Date.now(); // let the loop pick the next behavior
    }, REACTION_MS);
  };

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
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: PALETTE.D,
              animation: `pawFade ${PAW_LIFE}ms ease-out forwards`,
            }}
          />
        ))}
      </div>

      {/* the cat */}
      <div
        ref={wrapRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 30,
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
            marginBottom: 2,
            fontSize: 13,
            color: PALETTE.P,
            opacity: bubble ? 1 : 0,
            transition: "opacity 150ms ease",
            pointerEvents: "none",
          }}
        >
          {bubble}
        </div>
        <div
          onClick={onClick}
          style={{ cursor: "pointer", pointerEvents: "auto", width: SPRITE_PX }}
        >
          <Sprite state={state} frame={frame} blink={blink} flip={flip} />
        </div>
      </div>
    </>
  );
}
