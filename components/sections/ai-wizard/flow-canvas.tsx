"use client";

import { CheckCircle2, Cloud, Server, ShieldCheck, UserCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

import { KhayyamMark } from "@/components/brand/khayyam-mark";

import { goals, tools, type AiConfig } from "./config";

type Node = { id: string; label: string; color: string; icon?: (typeof tools)[number]["icon"]; x: number; y: number };


/**
 * The customer's automation as a living map: channels on one side, the Khayyam AI core
 * in the middle, results on the other. Pulses travel along every connection; an approval
 * gate appears on each output when a human stays in the loop.
 */
export const FlowCanvas = ({ config, vertical }: { config: AiConfig; vertical: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [box, setBox] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setBox({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const picked = goals.filter((goal) => config.goals.includes(goal.value));
  const inputs = tools.filter((tool) => tool.side === "in" && config.tools.includes(tool.value)).slice(0, vertical ? 3 : 6);
  const systems = tools.filter((tool) => tool.side === "out" && config.tools.includes(tool.value));
  const actions = [...new Set(picked.flatMap((goal) => goal.actions))].slice(0, vertical ? 3 : 6);

  const { width, height } = box;
  // Phones stack the map vertically: nodes share the width, so they shrink to fit three per row.
  const NODE = vertical ? { width: Math.min(150, (width - 24) / 3 - 8), height: 42 } : { width: 170, height: 46 };
  const CORE = vertical ? { width: 180, height: 124 } : { width: 200, height: 150 };
  const centre = { x: width / 2, y: height / 2 };

  // Spread nodes along a column (desktop, right-to-left flow) or a row (phones, top-to-bottom).
  const spread = (count: number, index: number, length: number) => (length / (count + 1)) * (index + 1);
  const rowStart = (count: number) => (width - (count * NODE.width + (count - 1) * 8)) / 2;
  const place = (count: number, index: number, side: "in" | "out") =>
    vertical
      ? { x: rowStart(count) + NODE.width / 2 + index * (NODE.width + 8), y: side === "in" ? 40 : height - 40 }
      : { x: side === "in" ? width - NODE.width / 2 - 24 : NODE.width / 2 + 24, y: spread(count, index, height) };

  const inNodes: Node[] = (inputs.length ? inputs : [{ value: "none", label: "ورودی شما", icon: undefined, color: "#5d6573" }]).map((tool, index, list) => ({
    id: `in-${tool.value}`,
    label: tool.label,
    color: tool.color,
    icon: tool.icon,
    ...place(list.length, index, "in"),
  }));
  const outNodes: Node[] = (actions.length ? actions : ["نتیجه"]).map((action, index, list) => ({ id: `out-${action}`, label: action, color: "#2fd08a", ...place(list.length, index, "out") }));

  // Edges: smooth curves from each input to the core, and from the core to each output.
  const coreIn = vertical ? { x: centre.x, y: centre.y - CORE.height / 2 } : { x: centre.x + CORE.width / 2, y: centre.y };
  const coreOut = vertical ? { x: centre.x, y: centre.y + CORE.height / 2 } : { x: centre.x - CORE.width / 2, y: centre.y };
  const edge = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    if (vertical) {
      const mid = (from.y + to.y) / 2;
      return `M ${from.x} ${from.y} C ${from.x} ${mid}, ${to.x} ${mid}, ${to.x} ${to.y}`;
    }
    const mid = (from.x + to.x) / 2;
    return `M ${from.x} ${from.y} C ${mid} ${from.y}, ${mid} ${to.y}, ${to.x} ${to.y}`;
  };
  const inEdges = inNodes.map((node) => ({ id: node.id, color: node.color, d: edge(vertical ? { x: node.x, y: node.y + NODE.height / 2 } : { x: node.x - NODE.width / 2, y: node.y }, coreIn) }));
  const outEdges = outNodes.map((node) => ({ id: node.id, d: edge(coreOut, vertical ? { x: node.x, y: node.y - NODE.height / 2 } : { x: node.x + NODE.width / 2, y: node.y }), node }));
  const gated = config.autonomy !== "auto";

  return (
    <div ref={ref} className="relative size-full" dir="ltr">
      {width > 0 && (
        <>
          <svg className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
            {[...inEdges.map((item) => ({ ...item, kind: "in" })), ...outEdges.map((item) => ({ id: item.id, d: item.d, color: "#2fd08a", kind: "out" }))].map((item, index) => (
              <g key={item.id}>
                <path d={item.d} fill="none" stroke={item.color} strokeOpacity="0.22" strokeWidth="2" />
                <path d={item.d} fill="none" stroke={item.color} strokeOpacity="0.8" strokeWidth="2" strokeDasharray="4 10" style={reduce ? undefined : { animation: "ai-dash 1.2s linear infinite" }} />
                {!reduce && (
                  <circle r="4" fill={item.color}>
                    <animateMotion dur={`${2.2 + (index % 3) * 0.4}s`} begin={`${(index * 0.37) % 2}s`} repeatCount="indefinite" path={item.d} />
                  </circle>
                )}
              </g>
            ))}
          </svg>

          {/* channels and results */}
          <AnimatePresence>
            {inNodes.map((node) => (
              <motion.div
                key={node.id}

                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, left: node.x - NODE.width / 2, top: node.y - NODE.height / 2 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                className={`absolute flex items-center gap-2 rounded-2xl bg-[#151920] font-bold text-white ring-1 ring-white/10 ${vertical ? "px-2 text-[11px]" : "px-3 text-[12px]"}`}
                style={{ width: NODE.width, height: NODE.height }}
                dir="rtl"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${node.color}22`, color: node.color }}>
                  {node.icon ? <node.icon className="size-4" aria-hidden="true" /> : null}
                </span>
                <span className="truncate">{node.label}</span>
              </motion.div>
            ))}
            {outEdges.map(({ node }) => (
              <motion.div
                key={node.id}

                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, left: node.x - NODE.width / 2, top: node.y - NODE.height / 2 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                className={`absolute flex items-center gap-1.5 rounded-2xl bg-[#2fd08a]/10 font-bold text-[#c8f5df] ring-1 ring-[#2fd08a]/30 ${vertical ? "px-2 text-[10.5px] leading-4" : "px-3 text-[12px]"}`}
                style={{ width: NODE.width, height: NODE.height }}
                dir="rtl"
              >
                {gated ? <UserCheck className="size-4 shrink-0 text-[#f0b44a]" aria-label="با تأیید شما" /> : <CheckCircle2 className="size-4 shrink-0 text-[#2fd08a]" aria-hidden="true" />}
                <span className={vertical ? "line-clamp-2" : "truncate"}>{node.label}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* the AI core */}
          <motion.div

            className="absolute flex flex-col items-center justify-center gap-2 rounded-[28px] bg-[#111419] text-center ring-1 ring-[#4da3ff]/40"
            style={{ left: centre.x - CORE.width / 2, top: centre.y - CORE.height / 2, width: CORE.width, height: CORE.height, boxShadow: "0 0 0 6px rgba(77,163,255,0.06), 0 0 60px -10px rgba(77,163,255,0.5)" }}
            dir="rtl"
          >
            <KhayyamMark size={vertical ? 30 : 40} state={reduce ? "still" : "thinking"} />
            <strong className={`${vertical ? "text-[12px]" : "text-[13px]"} text-white`}>هسته هوش مصنوعی</strong>
            <div className="flex max-w-[180px] flex-wrap justify-center gap-1">
              {picked.slice(0, 3).map((goal) => (
                <span key={goal.value} className="rounded-full bg-white/6 px-2 py-0.5 text-[10px] text-[#a7b0bc]">{goal.label}</span>
              ))}
              {picked.length > 3 && <span className="rounded-full bg-white/6 px-2 py-0.5 text-[10px] text-[#a7b0bc]">+{picked.length - 3}</span>}
            </div>
            <span className="absolute -top-3 flex items-center gap-1 rounded-full bg-[#0b0d12] px-2.5 py-1 text-[10px] font-bold text-[#9ccbff] ring-1 ring-white/10">
              {config.hosting === "onprem" ? <Server className="size-3" aria-hidden="true" /> : <Cloud className="size-3" aria-hidden="true" />}
              {config.hosting === "onprem" ? "روی سرور خودتان" : "ابری امن"}
            </span>
            {systems.length > 0 && (
              <span className="absolute -bottom-3.5 flex max-w-[240px] items-center gap-1 truncate rounded-full bg-[#0b0d12] px-2.5 py-1 text-[10px] font-bold text-[#c9d0d9] ring-1 ring-white/10">
                <ShieldCheck className="size-3 text-[#2fd08a]" aria-hidden="true" />
                متصل به {systems.map((system) => system.label).join("، ")}
              </span>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};
