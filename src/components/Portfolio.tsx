"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Typewriter from "./Typewriter";
import LiveCount from "./LiveCount";

type Visitor = {
  id: string;
  adjective: string;
  animal: string;
  city: string;
  region: string;
  country: string;
};

const ROW = "grid grid-cols-[8rem_1fr] gap-x-6 md:grid-cols-[10rem_1fr]";

export default function Portfolio() {
  const [v, setV] = useState<Visitor | null>(null);
  const [nameDone, setNameDone] = useState(false);
  const [youDone, setYouDone] = useState(false);

  useEffect(() => {
    fetch("/api/visitor")
      .then((r) => r.json())
      .then(setV)
      .catch(() => {});
  }, []);

  const label = v ? `${v.adjective} ${v.animal}` : "";
  const cityLabel = v ? (v.city || "the void").toLowerCase() : "";
  // Sections reveal once the intro typing has settled.
  const revealSections = nameDone;

  return (
    <div>
      {/* Header */}
      <h1 className="text-base font-normal">
        <Typewriter text="Edwin Kim" speed={95} onDone={() => setNameDone(true)} />
      </h1>
      <div className="text-base min-h-[1.9em]">
        {nameDone && v && (
          <Typewriter
            text={`you are ${label}`}
            speed={48}
            caretAfter={!youDone}
            onDone={() => setYouDone(true)}
            className="muted"
          />
        )}
        {nameDone && !v && <span className="muted">you are …</span>}
      </div>

      <hr
        className="my-10 border-0 border-t"
        style={{ borderColor: "var(--rule)" }}
      />

      <div
        className="transition-opacity duration-700"
        style={{ opacity: revealSections ? 1 : 0 }}
      >
        {/* currently */}
        <section>
          <div className="muted lowercase">currently</div>
          <div className="mt-3">
            <div className={ROW}>
              <a href="https://app.emanate.ai" target="_blank" rel="noreferrer">
                Emanate
              </a>
              <span>Founding Engineer</span>
            </div>
          </div>
        </section>

        {/* projects */}
        <section className="mt-12">
          <div className="muted lowercase">projects</div>
          <div className="mt-3 space-y-1">
            {/* TODO(edwin): replace with real projects */}
            <div className={ROW}>
              <span>project one</span>
              <span className="muted">short result / metric</span>
            </div>
            <div className={ROW}>
              <span>project two</span>
              <span className="muted">short result / metric</span>
            </div>
          </div>
        </section>

        {/* previously */}
        <section className="mt-12">
          <div className="muted lowercase">previously</div>
          <div className="mt-3">
            Google <span className="muted">·</span> CALI{" "}
            <span className="muted">·</span> MyFitnessPal{" "}
            <span className="muted">·</span> UC Berkeley
          </div>
        </section>

        <hr
          className="my-10 border-0 border-t"
          style={{ borderColor: "var(--rule)" }}
        />

        {/* footer links */}
        <div className="space-x-2">
          <a href="#">github</a>
          <span className="muted">·</span>
          <a href="#">email</a>
          <span className="muted">·</span>
          <a href="#">linkedin</a>
        </div>

        {/* visitor line */}
        <p className="mt-10 muted">
          {v && (
            <>
              hello <span style={{ color: "var(--fg)" }}>{cityLabel}</span>, you
              are{" "}
              <Link href="/log" style={{ color: "var(--fg)" }}>
                {label}
              </Link>
            </>
          )}
        </p>

        <p className="mt-6">
          <LiveCount />
        </p>
        <p className="mt-2">
          <Link href="/log" className="muted">
            visitor log
          </Link>
        </p>
      </div>
    </div>
  );
}
