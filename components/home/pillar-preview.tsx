"use client"

import { useRef, useState } from "react"

type Pillar = "Assess" | "Understand" | "Accompany"
const PILLARS: { name: Pillar; orb: "listening" | "thinking" | "ready"; caption: string }[] = [
  { name: "Assess", orb: "listening", caption: "One area at a time, in plain words. Pause and come back whenever you like." },
  { name: "Understand", orb: "thinking", caption: "Results area by area, kept separate from any AI explanation." },
  { name: "Accompany", orb: "ready", caption: "A companion that clarifies and explains. It never diagnoses or picks answers." },
]

// The three pillars as tabs, each showing an example of what that step
// looks like. Every preview is labelled as an example: no real results.
export function PillarPreview() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const pillar = PILLARS[active]

  function onKey(e: React.KeyboardEvent) {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0
    if (!d) return
    e.preventDefault()
    const next = (active + d + PILLARS.length) % PILLARS.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <div className="w-full max-w-[28rem] mx-auto">
      <div role="tablist" aria-label="How NeuRafiki works" className="flex gap-1 rounded-full bg-secondary p-1">
        {PILLARS.map((p, i) => (
          <button
            key={p.name}
            ref={(el) => {
              tabs.current[i] = el
            }}
            role="tab"
            id={`pillar-tab-${i}`}
            aria-selected={i === active}
            aria-controls="pillar-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKey}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
              i === active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div
        id="pillar-panel"
        role="tabpanel"
        aria-labelledby={`pillar-tab-${active}`}
        className="relative mt-4 overflow-hidden rounded-3xl border bg-card p-6 shadow-[0_12px_32px_-16px_rgb(35_40_56/0.35)]"
      >
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="companion-orb h-10 w-10 rounded-full" data-state={pillar.orb} />
          <p className="text-sm text-muted-foreground text-pretty">{pillar.caption}</p>
        </div>

        <div className="mt-5 min-h-[15rem]">
          {pillar.name === "Assess" && (
            <div>
              <p className="flex justify-between text-xs text-muted-foreground tabular-nums">
                <span>Area 2 of 4 · Attention and focus</span>
                <span>17 / 42</span>
              </p>
              <div aria-hidden="true" className="mt-2 h-1.5 rounded-full bg-secondary">
                <div className="h-full w-[40%] rounded-full bg-primary" />
              </div>
              <p className="mt-5 font-display text-lg">Let&apos;s explore how this feels for you.</p>
              <p className="mt-1 font-semibold">When you&apos;re given several things to do at once, what usually happens?</p>
              <ul className="mt-4 grid gap-2" aria-label="Example answers">
                {["I get started on one and finish it", "I start several and finish few", "I find it hard to start any", "It depends on the day"].map((o, i) => (
                  <li key={o} className={`rounded-xl border px-3 py-2 text-sm ${i === 1 ? "border-primary bg-secondary font-semibold" : ""}`}>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pillar.name === "Understand" && (
            <ul className="grid gap-4" aria-label="Example results">
              {[
                { area: "Attention and focus", note: "An area to explore further", w: "72%", c: "var(--thread-terracotta)" },
                { area: "Sensory processing", note: "Some differences noticed", w: "48%", c: "var(--thread-gold)" },
                { area: "Motor coordination", note: "Fewer differences noticed", w: "22%", c: "var(--thread-teal)" },
              ].map((r) => (
                <li key={r.area}>
                  <p className="flex justify-between gap-3 text-sm">
                    <span className="font-semibold">{r.area}</span>
                    <span className="text-muted-foreground">{r.note}</span>
                  </p>
                  <div aria-hidden="true" className="mt-1.5 h-2 rounded-full bg-secondary">
                    <div className="h-full rounded-full" style={{ width: r.w, backgroundColor: r.c }} />
                  </div>
                </li>
              ))}
              <li className="rounded-xl bg-secondary p-3 text-sm text-pretty">
                This screening does not establish a diagnosis. You may wish to discuss these areas with a qualified
                professional.
              </li>
            </ul>
          )}

          {pillar.name === "Accompany" && (
            <div className="grid gap-3 text-sm">
              <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground">
                What does &ldquo;difficulty initiating tasks&rdquo; mean?
              </p>
              <p className="max-w-[90%] rounded-2xl rounded-bl-sm bg-secondary px-4 py-2.5 text-pretty">
                It means finding it difficult to get started on something even when you understand what needs to be done.
                Shall we go back to the question?
              </p>
              <p className="max-w-[90%] rounded-2xl rounded-bl-sm border px-4 py-2.5 text-muted-foreground text-pretty">
                After your results, I can help you prepare questions for a teacher or professional.
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">Example screen, not real results.</p>
      </div>
    </div>
  )
}
