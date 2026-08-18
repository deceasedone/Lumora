"use client";

/**
 * ShimejiSpec.tsx — spec-driven Shimeji engine for Next.js.
 *
 * This is a TypeScript/React port of the Shimeji Browser Extension's engine.
 * It consumes the extension's character spec format directly (the JSON stored
 * under chrome.storage "specs"): per-frame sprite rects, actions
 * (Sequence/Select/Reference/Stay/Animate/Move/Embedded), behaviors with
 * frequencies + condition expressions, and conditional animations.
 *
 * Matches the original: physics in px-per-40ms ticks, spring-follow dragging
 * with sway frames, data-driven context menu (greyed-out items when conditions
 * fail), element grabbing/throwing with 8s restore, ballistic jumps, wall and
 * ceiling behaviors, breed/split, reboot watchdog.
 *
 * Page hooks: mark elements with data-shimeji-ie — mascots can land on, walk
 * along, climb, grab and throw them. <video> elements are auto-marked.
 *
 * Setup: put the exported specs at public/specs/shimeji-specs.json and the
 * spritesheets at public/sprites/*.png (see sheetOverrides).
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* ================================================================== */
/* Spec types (extension format)                                       */
/* ================================================================== */

interface SpriteRect { x: number; y: number; width: number; height: number }
interface PoseDef {
  sprite: string;
  anchor: { x: number; y: number };
  velocity: { x: number; y: number };
  duration: number; // ticks (40ms each)
}
interface AnimationDef { poses: PoseDef[]; condition?: string }
interface ActionDef {
  type: "Stay" | "Animate" | "Move" | "Sequence" | "Select" | "Reference" | "Embedded" | "Behavior";
  name?: string;
  embedType?: string;
  borderType?: "Floor" | "Wall" | "Ceiling";
  animations?: AnimationDef[];
  actions?: ActionDef[];
  condition?: string;
  duration?: string;
  targetX?: string; targetY?: string;
  velocity?: string;
  x?: string; y?: string;
  lookRight?: string;
  initialVx?: string; initialVy?: string;
  resistanceX?: string; resistanceY?: string; gravity?: string;
  bornX?: string; bornY?: string; bornBehavior?: string;
  ieOffsetX?: string; ieOffsetY?: string;
  gap?: string;
}
interface BehaviorDef {
  type?: string;
  name: string;
  frequency: number;
  conditions?: string[];
  groupIndex: number;
  hidden?: boolean;
  nextBehaviors?: { name: string; frequency?: number; conditions?: string[] }[];
}
export interface CharacterSpec {
  id: string;
  spritesheet: string;
  sprites: Record<string, SpriteRect>;
  actions: ActionDef[];
  behaviors: BehaviorDef[];
  metadata?: unknown;
}

const TICK = 40; // ms per tick, matches the extension
const ACCENT = "#dd6b20";
const DROP_RESTORE_MS = 8000;
const CATCH_ATTR = "data-shimeji-catch";
const ELEM_ATTR = "data-shimeji-elem";

/* ================================================================== */
/* Expression evaluation                                               */
/* ================================================================== */
/** Spec expressions are JS-ish: "#{mascot.environment.floor.isOn(mascot.anchor)}",
 *  "${100+Math.random()*100}", "true". We compile them with Function + with(). */

type EnvGlobal = Record<string, unknown>;
const exprCache = new Map<string, (env: EnvGlobal) => unknown>();

function compileExpr(src: string): (env: EnvGlobal) => unknown {
  let fn = exprCache.get(src);
  if (fn) return fn;
  const m = src.match(/^[#$]\{([\s\S]*)\}\s*$/);
  const s = (m ? m[1] : src)
    .replace(/\bMascot\./g, "mascot.")
    .replace(/\btargetx\b/gi, "targetX")
    .replace(/\btargety\b/gi, "targetY")
    .replace(/\bfootx\b/gi, "footX")
    .replace(/\bfooty\b/gi, "footY")
    .replace(/\bmaxcount\b/gi, "maxCount");
  try {
    // eslint-disable-next-line no-new-func
    const f = new Function("env", `with (env) { return (${s}); }`) as (e: EnvGlobal) => unknown;
    fn = (env) => { try { return f(env); } catch { return undefined; } };
  } catch {
    fn = () => undefined;
  }
  exprCache.set(src, fn);
  return fn;
}
const evalNum = (src: string | undefined, env: EnvGlobal, dflt?: number): number | undefined => {
  if (src === undefined) return dflt;
  const v = compileExpr(src)(env);
  return typeof v === "number" && !Number.isNaN(v) ? v : dflt;
};
const evalBool = (src: string | undefined, env: EnvGlobal, dflt = false): boolean => {
  if (src === undefined) return dflt;
  const v = compileExpr(src)(env);
  return v === undefined ? dflt : !!v;
};
const condsMet = (conds: string[] | undefined, env: EnvGlobal): boolean =>
  !conds || conds.every((c) => evalBool(c, env, false));

/* ================================================================== */
/* Geometry helpers (ported)                                           */
/* ================================================================== */

interface Rect { x: number; y: number; width: number; height: number }
interface Pt { x: number; y: number }

const onTop = (p: Pt, r: Rect, tol = 0) => p.x >= r.x && p.x <= r.x + r.width && Math.abs(p.y - r.y) <= tol;
const onLeft = (p: Pt, r: Rect, tol = 0) => p.y >= r.y && p.y <= r.y + r.height && Math.abs(p.x - r.x) <= tol;
const onRight = (p: Pt, r: Rect, tol = 0) => p.y >= r.y && p.y <= r.y + r.height && Math.abs(p.x - r.x - r.width) <= tol;
const onBottom = (p: Pt, r: Rect, tol = 0) => p.x >= r.x && p.x <= r.x + r.width && Math.abs(p.y - r.y - r.height) <= tol;
const inside = (p: Pt, r: Rect, tol = 0) =>
  p.x >= r.x - tol && p.x <= r.x + r.width + tol && p.y >= r.y - tol && p.y <= r.y + r.height + tol;
const nearestEdge = (p: Pt, r: Rect): "top" | "left" | "right" | "bottom" => {
  const t = Math.abs(p.y - r.y), l = Math.abs(p.x - r.x),
    ri = Math.abs(p.x - r.x - r.width), b = Math.abs(p.y - r.y - r.height);
  const mn = Math.min(t, l, ri, b);
  return mn === t ? "top" : mn === l ? "left" : mn === ri ? "right" : "bottom";
};
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const isOn = (a: number, b: number) => Math.abs(a - b) < 0.75;

function pickWeighted<T>(items: T[], w: (t: T) => number): T | undefined {
  const total = items.reduce((s, i) => s + w(i), 0);
  if (total <= 0) return undefined;
  let r = Math.random() * total;
  return items.find((i) => (r -= w(i)) < 0);
}

/* ================================================================== */
/* prepareSpec — synthesize ThrowElement…, JumpTo…, Exit!, Reboot      */
/* (ported from the extension)                                         */
/* ================================================================== */

function prepareSpec(spec: CharacterSpec): CharacterSpec {
  const t = [...spec.actions];
  const n = [...spec.behaviors];
  const has = (name: string) => t.some((a) => a.name === name);
  const throwable = has("ThrowIEFromLeft") || has("ThrowIEFromRight") || has("ThrowIEToLeft") || has("ThrowIEToRight");
  const jumpable = has("Jumping");
  const u = "mascot.environment.cursor.y - mascot.environment.activeIE.top";
  const c = "mascot.environment.activeIE.right - mascot.environment.cursor.x";
  const l = "mascot.environment.activeIE.bottom - mascot.environment.cursor.y";
  const p = "mascot.environment.cursor.x - mascot.environment.activeIE.left";

  t.push({
    type: "Sequence", name: "ThrowElement...",
    actions: [
      { type: "Embedded", embedType: "SelectIE", name: "Select" },
      {
        type: "Select", name: "SelectCorner",
        actions: [
          {
            type: "Sequence", name: "ThrowIEFromLeft",
            condition: throwable
              ? "mascot.anchor.x < mascot.environment.activeIE.left + (mascot.environment.activeIE.width / 2)"
              : "false",
            actions: [
              { type: "Reference", name: "Jumping", targetX: "${mascot.environment.activeIE.left}", targetY: "${mascot.environment.activeIE.bottom+64}" },
              { type: "Reference", name: "Look", lookRight: "true" },
              { type: "Reference", name: "FallWithIe" },
              { type: "Reference", name: "WalkWithIe", targetX: "#{Math.max(mascot.environment.workArea.right-400, mascot.anchor.x) + 1}" },
              { type: "Reference", name: "ThrowIe" },
            ],
          },
          {
            type: "Sequence", name: "ThrowIEFromRight",
            condition: throwable
              ? "mascot.anchor.x >= mascot.environment.activeIE.left + (mascot.environment.activeIE.width / 2)"
              : "false",
            actions: [
              { type: "Reference", name: "Jumping", targetX: "${mascot.environment.activeIE.right}", targetY: "${mascot.environment.activeIE.bottom+64}" },
              { type: "Reference", name: "Look", lookRight: "false" },
              { type: "Reference", name: "FallWithIe" },
              { type: "Reference", name: "WalkWithIe", targetX: "#{Math.min(mascot.environment.workArea.left+400, mascot.anchor.x) - 1}" },
              { type: "Reference", name: "ThrowIe" },
            ],
          },
        ],
      },
    ],
  });

  t.push({
    type: "Sequence", name: "JumpTo...",
    actions: [
      { type: "Embedded", embedType: "SelectEdge", name: "Select" },
      {
        type: "Select", name: "Select",
        actions: [
          {
            type: "Reference", name: "Jumping",
            condition: `#{${u} < Math.min(${l}, Math.min(${p}, ${c}))}`,
            targetX: "#{mascot.environment.cursor.x}", targetY: "#{mascot.environment.activeIE.top}",
          },
          {
            type: "Sequence", name: "JumpingToRightEdge",
            condition: `#{${c} < Math.min(${l}, Math.min(${p}, ${u}))}`,
            actions: [
              { type: "Reference", name: "Jumping", targetX: "#{mascot.environment.activeIE.right}", targetY: "#{mascot.environment.cursor.y}" },
              { type: "Reference", name: "GrabWall", duration: "100+Math.random()*100" },
            ],
          },
          {
            type: "Reference", name: "Jumping",
            condition: `#{${l} < Math.min(${u}, Math.min(${p}, ${c}))}`,
            targetX: "#{mascot.environment.cursor.x}", targetY: "#{mascot.environment.activeIE.bottom}",
          },
          {
            type: "Sequence", name: "JumpingToLeftEdge",
            condition: `#{${p} < Math.min(${l}, Math.min(${u}, ${c}))}`,
            actions: [
              { type: "Reference", name: "Jumping", targetX: "#{mascot.environment.activeIE.left}", targetY: "#{mascot.environment.cursor.y}" },
              { type: "Reference", name: "GrabWall", duration: "100+Math.random()*100" },
            ],
          },
        ],
      },
    ],
  });

  t.push({
    type: "Sequence", name: "Exit!",
    actions: [
      {
        type: "Reference", name: "Dash",
        targetX: "#{mascot.anchor.x < mascot.environment.workArea.width / 2 ? -128 : mascot.environment.workArea.width + 128}",
      },
      { type: "Embedded", name: "Exit", embedType: "Exit" },
    ],
  });
  t.push({ type: "Embedded", name: "Reboot", embedType: "Reboot" });

  n.push({ type: "Behavior", name: "ThrowElement...", frequency: 0, nextBehaviors: [], conditions: [throwable ? "true" : "false"], groupIndex: 0, hidden: false });
  n.push({ type: "Behavior", name: "JumpTo...", frequency: 0, nextBehaviors: [], conditions: [jumpable ? "true" : "false"], groupIndex: 0, hidden: false });
  n.push({ type: "Behavior", name: "Exit!", frequency: 0, nextBehaviors: [], conditions: ["true"], groupIndex: 0, hidden: false });
  n.push({ type: "Behavior", name: "Reboot", frequency: 0, nextBehaviors: [], conditions: ["true"], groupIndex: 0, hidden: true });

  return { ...spec, actions: t, behaviors: n };
}

/* ================================================================== */
/* Menu building (ported from Hi)                                      */
/* ================================================================== */

interface MenuItem { title: string; disabled: boolean; behaviorName: string; rightContent?: string; groupIndex: number }

function titleFor(name: string): string {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, " $1 $2")
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([a-zA-Z])(\d)/g, "$1 $2")
    .trim()
    .replace(/IE/g, "element")
    .toLowerCase()
    .replace("work area", "window")
    .replace("floor", "f̲l̲o̲o̲r̲")
    .replace("bottom", "b̲o̲t̲t̲o̲m̲")
    .replace("ceiling", "⌈ceiling⌉")
    .replace("walk", "𝘸𝘢𝘭𝘬")
    .replace("jump", "𝐣𝐮𝐦𝐩")
    .replace("throw", "𝘁𝗵𝗿𝗼𝘄")
    .replace("exit!", "remove")
    .replace("dragged", "pin to mouse")
    .replace("b̲o̲t̲t̲o̲m̲ left", "left")
    .replace("b̲o̲t̲t̲o̲m̲ right", "right")
    .replace("pull up shimeji", "pull up shimeji*")
    .replace("split into two", "split into two*");
}

function buildMenu(spec: CharacterSpec, env: EnvGlobal, anchor: Pt): MenuItem[][] {
  const mEnv = env as unknown as { mascot: { environment: { workArea: { bottomBorder: { isOn: (p: Pt) => boolean } } } } };
  const onFloor = mEnv.mascot.environment.workArea.bottomBorder.isOn(anchor);
  const items = spec.behaviors
    .filter(
      (b) =>
        !b.hidden &&
        !["Fall", "Thrown", "PullUp", "Divided"].includes(b.name) &&
        (!["SitAndFaceMouse", "SitAndSpinHead", "Tripped"].includes(b.name) || onFloor)
    )
    .map((b) => ({
      title: titleFor(b.name),
      disabled: !condsMet(b.conditions, env),
      behaviorName: b.name,
      rightContent: ["JumpTo...", "ThrowElement..."].includes(b.name) ? "[select]" : undefined,
      groupIndex: b.groupIndex === 0 ? (b.frequency === 0 ? 1 : 2) : b.groupIndex + 3,
    }))
    .sort((a, b) => a.groupIndex - b.groupIndex);
  const groups = new Map<number, MenuItem[]>();
  for (const it of items) {
    if (!groups.has(it.groupIndex)) groups.set(it.groupIndex, []);
    groups.get(it.groupIndex)!.push(it);
  }
  return Array.from(groups.values()).filter((group) => group.some((item) => !item.disabled)).reverse();
}

/* ================================================================== */
/* DOM element ops: catch marking, carrying, restoring (ported)        */
/* ================================================================== */

let elemIdCounter = 1;
function elemSelector(el: Element): string {
  let id = el.getAttribute(ELEM_ATTR);
  if (!id) {
    id = `${elemIdCounter++}`;
    el.setAttribute(ELEM_ATTR, id);
  }
  return `[${ELEM_ATTR}="${id}"]`;
}

interface CaughtItem {
  div: HTMLElement;
  placeholder: HTMLElement;
  originalParent: HTMLElement;
  originalStyleProps: Record<string, string>;
}
const caught: Record<string, CaughtItem> = {};
const dropped: Record<string, { dropDate: number; item: CaughtItem }> = {};

function catchElement(selector: string): CaughtItem | undefined {
  if (caught[selector]) return caught[selector];
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  const parent = el.parentElement;
  if (!parent) return;
  const cs = window.getComputedStyle(el);
  const orig: Record<string, string> = {
    width: cs.width, height: cs.height, position: cs.position, zIndex: cs.zIndex,
    top: cs.top, right: cs.right, bottom: cs.bottom, left: cs.left, margin: cs.margin,
    backdropFilter: cs.backdropFilter, boxShadow: cs.boxShadow, borderRadius: cs.borderRadius,
  };
  const w = parseFloat(cs.width) + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
  const h = parseFloat(cs.height) + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);
  const ph = document.createElement("div");
  ph.style.width = `${w}px`;
  ph.style.height = `${h}px`;
  ph.style.visibility = "hidden";
  parent.insertBefore(ph, el);
  Object.assign(el.style, {
    width: cs.width, height: cs.height, position: "fixed", zIndex: "2147483644",
    top: "initial", right: "initial", bottom: "initial", left: "initial", margin: "0px",
    backdropFilter: "blur(3px)", boxShadow: `0px 0px 16px ${ACCENT}`, borderRadius: "5px",
  });
  el.setAttribute(CATCH_ATTR, "true");
  document.body.appendChild(el);
  caught[selector] = { div: el, placeholder: ph, originalParent: parent, originalStyleProps: orig };
  return caught[selector];
}

function restoreItem(item: CaughtItem) {
  Object.entries(item.originalStyleProps).forEach(([k, v]) => {
    (item.div.style as unknown as Record<string, string>)[k] = v;
  });
  item.div.removeAttribute(CATCH_ATTR);
  item.originalParent.insertBefore(item.div, item.placeholder);
  item.placeholder.remove();
}

function positionCarried(selector: string, x: number, y: number, lookRight: boolean) {
  const item = catchElement(selector);
  if (!item) return;
  delete dropped[selector];
  item.div.style.left = lookRight ? `${x}px` : "initial";
  item.div.style.right = lookRight ? "initial" : `${window.innerWidth - x}px`;
  item.div.style.bottom = `${window.innerHeight - y}px`;
}

function dropCarried(selector: string) {
  if (caught[selector]) {
    dropped[selector] = { dropDate: Date.now(), item: caught[selector] };
    delete caught[selector];
  }
}

function restoreExpiredDrops() {
  Object.entries(dropped).forEach(([sel, { dropDate, item }]) => {
    if (dropDate + DROP_RESTORE_MS < Date.now()) {
      restoreItem(item);
      delete dropped[sel];
    }
  });
}

/* ================================================================== */
/* Mascot / engine state                                               */
/* ================================================================== */

class ActionAbort extends Error {}

interface EvalAction {
  def: ActionDef;
  animations: AnimationDef[];
  lookRight: boolean | undefined;
  duration: number | undefined;
  targetX?: number; targetY?: number;
  velocity?: number;
  offX?: number; offY?: number;
  initialVx?: number; initialVy?: number;
  resistanceX: number; resistanceY: number; gravity: number;
  bornX: number; bornY: number; bornBehavior?: string;
  ieOffsetX: number; ieOffsetY: number;
}

interface Exec {
  step(m: Mascot, dst: number): "running" | "done";
}

interface Mascot {
  id: number;
  spec: CharacterSpec;
  x: number; y: number; // anchor point (usually bottom-center of sprite)
  vx: number; vy: number; // px per tick
  lookRight: boolean;
  sprite: string;
  anchorX: number; anchorY: number;
  behaviorName: string;
  parentSelector: string | null; // null = workArea, else riding an element
  lastParentRect: Rect | null;
  carrySelector: string | null;
  selectedNode: string | null; // selector chosen via SelectIE/SelectEdge
  selectedAge: number; // behaviors since selection
  exec: Exec | null;
  footX: number; // drag spring position
  footDx: number; // drag spring momentum
  dragT: number;
  outsideMs: number;
  pinned: boolean;
}

interface CatchRect { selector: string; rect: Rect }

/* ================================================================== */
/* Provider                                                            */
/* ================================================================== */

interface ShimejiContextValue {
  summon: (specId?: string) => void;
  dismissAll: () => void;
  count: number;
  specIds: string[];
}
const Ctx = createContext<ShimejiContextValue | null>(null);
export function useShimeji(): ShimejiContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useShimeji must be used inside <ShimejiProvider>");
  return v;
}

export function ShimejiProvider({
  children,
  specsUrl = "/specs/shimeji-specs.json",
  specs: specsProp,
  sheetOverrides = {},
  maxMascots = 15,
  zIndex = 2147483643,
}: {
  children: React.ReactNode;
  specsUrl?: string;
  specs?: CharacterSpec[];
  /** map spec id → local spritesheet URL, e.g. { "vocaloid-hatsune-miku": "/sprites/miku.png" } */
  sheetOverrides?: Record<string, string>;
  maxMascots?: number;
  zIndex?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0);
  const [count, setCount] = useState(0);
  const [specs, setSpecs] = useState<CharacterSpec[]>([]);
  const [menu, setMenu] = useState<{ x: number; y: number; mascotId: number } | null>(null);
  const [selecting, setSelecting] = useState<{ mascotId: number; edge: boolean } | null>(null);
  const [hover, setHover] = useState<{ r: Rect; edge?: string } | null>(null);

  const mascots = useRef<Mascot[]>([]);
  const nextId = useRef(1);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const cursor = useRef({ x: 0, y: 0, dx: 0, dy: 0 });
  const mouseHist = useRef<Pt[]>([]);
  const catchRects = useRef<CatchRect[]>([]);
  const dragging = useRef<{ id: number; downT: number; started: boolean; downX: number; downY: number } | null>(null);
  const selectingRef = useRef(selecting);
  selectingRef.current = selecting;

  useEffect(() => setMounted(true), []);

  /* ---------- load specs ---------- */
  useEffect(() => {
    if (!mounted) return;
    if (specsProp) {
      setSpecs(specsProp.map(prepareSpec));
      return;
    }
    fetch(specsUrl)
      .then((r) => r.json())
      .then((arr: CharacterSpec[]) => setSpecs(arr.map(prepareSpec)))
      .catch((e) => console.warn("shimeji: failed to load specs", e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, specsUrl]);

  const sheetUrl = (spec: CharacterSpec) => sheetOverrides[spec.id] ?? spec.spritesheet;

  /* ---------- environment ---------- */

  const scanCatch = () => {
    document.querySelectorAll("video, [data-shimeji-ie]").forEach((el) => el.setAttribute(CATCH_ATTR, "true"));
    const out: CatchRect[] = [];
    document.querySelectorAll<HTMLElement>(`[${CATCH_ATTR}]`).forEach((el) => {
      const r = el.getBoundingClientRect();
      out.push({ selector: elemSelector(el), rect: { x: r.x, y: r.y, width: r.width, height: r.height } });
    });
    catchRects.current = out;
  };

  const rectFor = (selector: string | null): Rect | null => {
    if (!selector) return null;
    const el = document.querySelector(selector);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  };

  const activeIERect = (m: Mascot): Rect | null => {
    const sel = m.carrySelector ?? m.selectedNode ?? m.parentSelector ?? catchRects.current[0]?.selector ?? null;
    if (!sel) return null;
    const cached = catchRects.current.find((c) => c.selector === sel);
    return cached ? cached.rect : rectFor(sel);
  };

  const buildEnv = (m: Mascot): EnvGlobal => {
    const W = window.innerWidth, H = window.innerHeight;
    const ie = activeIERect(m) ?? { x: -100, y: -100, width: 0, height: 0 };
    const border = (test: (p: Pt) => boolean) => ({ isOn: test });
    const work = {
      left: 0, right: W, top: 0, bottom: H, width: W, height: H,
      topBorder: border((p) => isOn(p.y, 0)),
      leftBorder: border((p) => isOn(p.x, 0)),
      rightBorder: border((p) => isOn(p.x, W)),
      bottomBorder: border((p) => isOn(p.y, H)),
    };
    const env: EnvGlobal = {
      gap: 0,
      maxCount: 999,
      targetX: 0, targetY: 0,
      footX: m.footX, footY: m.y,
      Math,
      mascot: {
        totalCount: mascots.current.length,
        anchor: { x: m.x, y: m.y },
        lookRight: m.lookRight,
        environment: {
          cursor: { ...cursor.current },
          screen: { width: W, height: H },
          ground: { isOn: (p: Pt) => isOn(p.y, H) },
          floor: { isOn: (p: Pt) => isOn(p.y, H) },
          ceiling: { isOn: (p: Pt) => isOn(p.y, 0) },
          workArea: work,
          activeIE: {
            visible: ie.width > 0 && ie.height > 0,
            left: ie.x, right: ie.x + ie.width, top: ie.y, bottom: ie.y + ie.height,
            width: ie.width, height: ie.height,
            topBorder: border((p) => onTop(p, ie, 1)),
            leftBorder: border((p) => onLeft(p, ie, 1)),
            rightBorder: border((p) => onRight(p, ie, 1)),
            bottomBorder: border((p) => onBottom(p, ie, 1)),
          },
        },
      },
    };
    return env;
  };

  const parentSurface = (m: Mascot): { rect: Rect; isWork: boolean } => {
    if (m.parentSelector) {
      const r = rectFor(m.parentSelector);
      if (r) return { rect: r, isWork: false };
    }
    return { rect: { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight }, isWork: true };
  };

  const checkBorder = (m: Mascot, borderType?: string): boolean => {
    if (!borderType) return true;
    const { rect, isWork } = parentSurface(m);
    const a = { x: m.x, y: m.y };
    switch (borderType) {
      case "Floor":
        return isWork ? onBottom(a, rect, 1) : onTop(a, rect, 1);
      case "Ceiling":
        return isWork ? onTop(a, rect, 1) : onBottom(a, rect, 1);
      case "Wall":
        return onLeft(a, rect, 1) || onRight(a, rect, 1);
      default:
        return true;
    }
  };

  /* ---------- action evaluation (ported from Oo) ---------- */

  const evalAction = (def: ActionDef, m: Mascot): EvalAction => {
    const env = buildEnv(m);
    const gap = def.gap ? evalNum(def.gap, env, 0)! : 0;
    (env as { gap: number }).gap = gap;
    const targetX = def.targetX ? evalNum(def.targetX, env) : undefined;
    const initialVx = def.initialVx ? evalNum(def.initialVx, env) : undefined;
    let lookRight: boolean | undefined;
    const anchor = { x: m.x, y: m.y };
    const menv = (env as unknown as {
      mascot: {
        environment: {
          workArea: { rightBorder: { isOn: (p: Pt) => boolean } };
          activeIE: { leftBorder: { isOn: (p: Pt) => boolean } };
        };
      };
    }).mascot.environment;
    if (def.borderType === "Wall") {
      lookRight = menv.workArea.rightBorder.isOn(anchor) || menv.activeIE.leftBorder.isOn(anchor);
    } else if (def.type === "Move" || def.embedType === "Jump" || def.embedType === "WalkWithIE") {
      lookRight = targetX !== undefined && targetX > anchor.x;
    } else if (def.embedType === "Fall" || def.embedType === "FallWithIE") {
      lookRight = initialVx === 0 || initialVx === undefined ? m.lookRight : initialVx > 0;
    } else if (def.embedType === "Look" || def.lookRight !== undefined) {
      lookRight = def.embedType === "Look" && def.lookRight === undefined
        ? !m.lookRight
        : def.lookRight !== undefined
          ? evalBool(def.lookRight, env, m.lookRight)
          : m.lookRight;
    }
    const anims = def.animations ?? [];
    const duration = def.duration
      ? evalNum(def.duration, env)
      : anims[0]?.poses?.reduce((s, p) => s + p.duration, 0);
    return {
      def,
      animations: anims,
      lookRight,
      duration,
      targetX,
      targetY: def.targetY ? evalNum(def.targetY, env) : undefined,
      velocity: def.velocity ? evalNum(def.velocity, env) : undefined,
      offX: def.x ? evalNum(def.x, env) : undefined,
      offY: def.y ? evalNum(def.y, env) : undefined,
      initialVx,
      initialVy: def.initialVy ? evalNum(def.initialVy, env) : undefined,
      resistanceX: def.resistanceX ? evalNum(def.resistanceX, env, 0.05)! : 0.05,
      resistanceY: def.resistanceY ? evalNum(def.resistanceY, env, 0.01)! : 0.01,
      gravity: def.gravity ? evalNum(def.gravity, env, 2)! : 2,
      bornX: def.bornX ? evalNum(def.bornX, env, 0)! : 0,
      bornY: def.bornY ? evalNum(def.bornY, env, 0)! : 0,
      bornBehavior: def.bornBehavior,
      ieOffsetX: def.ieOffsetX ? evalNum(def.ieOffsetX, env, 0)! : 0,
      ieOffsetY: def.ieOffsetY ? evalNum(def.ieOffsetY, env, 0)! : 0,
    };
  };

  /* ---------- exec builders ---------- */

  const resolveRef = (spec: CharacterSpec, ref: ActionDef): ActionDef => {
    const found = spec.actions.find((a) => a.name === ref.name);
    if (!found) throw new ActionAbort(`Action '${ref.name}' not found`);
    return { ...found, ...ref, type: found.type };
  };

  const makeExec = (m: Mascot, def: ActionDef): Exec => {
    if (def.type === "Reference") return makeExec(m, resolveRef(m.spec, def));
    const env = buildEnv(m);
    if (def.condition && !evalBool(def.condition, env, true)) {
      // condition-gated child inside a Sequence: skip (Sequence handles), but as
      // a root it means "do nothing"
      return { step: () => "done" };
    }
    if (def.type === "Sequence") return makeSequenceExec(m, def);
    if (def.type === "Select") {
      const child = (def.actions ?? []).find((a) => !a.condition || evalBool(a.condition, buildEnv(m), false));
      return child ? makeExec(m, child) : { step: () => "done" };
    }
    if (!checkBorder(m, def.borderType)) throw new ActionAbort(`border ${def.borderType} not met for ${def.name}`);
    return makePrimitiveExec(m, def);
  };

  const makeSequenceExec = (m: Mascot, def: ActionDef): Exec => {
    const children = def.actions ?? [];
    let idx = 0;
    let current: Exec | null = null;
    return {
      step: (mm, dst) => {
        for (;;) {
          if (!current) {
            if (idx >= children.length) return "done";
            let child = children[idx];
            if (child.type === "Reference") child = resolveRef(mm.spec, child);
            if (child.condition && !evalBool(child.condition, buildEnv(mm), false)) {
              idx++;
              continue;
            }
            current = makeExec(mm, child);
          }
          const r = current.step(mm, dst);
          if (r === "done") {
            current = null;
            idx++;
            continue;
          }
          return "running";
        }
      },
    };
  };

  const spawnRef = useRef<(spec: CharacterSpec, x: number, y: number, behavior: string) => void>(() => {});

  const makePrimitiveExec = (m: Mascot, def: ActionDef): Exec => {
    const a = evalAction(def, m);
    if (a.lookRight !== undefined) m.lookRight = a.lookRight;

    // carry bookkeeping: non-IE primitives drop any carried element
    const isCarry = def.embedType === "FallWithIE" || def.embedType === "WalkWithIE" || def.embedType === "ThrowIE";
    if (!isCarry && m.carrySelector) {
      dropCarried(m.carrySelector);
      m.carrySelector = null;
    }
    if (isCarry && !m.carrySelector) {
      const sel = m.selectedNode ?? catchRects.current[0]?.selector ?? null;
      if (sel) m.carrySelector = sel;
    }

    let t = 0;
    let poseIdx = 0;
    let poseT = 0;
    let animIdx = -1;
    let tickIndex = 0;
    let bred = false;
    let selStarted = false;
    let carryX = 0, carryY = 0, carryInit = false;

    const pickAnim = (mm: Mascot): AnimationDef | undefined => {
      if (a.animations.length === 0) return undefined;
      if (a.animations.length === 1 && !a.animations[0].condition) {
        if (animIdx !== 0) { animIdx = 0; poseIdx = 0; poseT = 0; }
        return a.animations[0];
      }
      const env = buildEnv(mm);
      (env as { targetX: number }).targetX = a.targetX ?? 0;
      (env as { targetY: number }).targetY = a.targetY ?? 0;
      const i = a.animations.findIndex((an) => !an.condition || evalBool(an.condition, env, false));
      const use = i >= 0 ? i : 0;
      if (use !== animIdx) { animIdx = use; poseIdx = 0; poseT = 0; }
      return a.animations[use];
    };

    const advancePose = (mm: Mascot, dst: number): PoseDef | undefined => {
      const anim = pickAnim(mm);
      if (!anim || anim.poses.length === 0) return undefined;
      poseT += dst;
      let guard = 0;
      while (poseT >= anim.poses[poseIdx].duration && guard++ < 64) {
        poseT -= anim.poses[poseIdx].duration;
        poseIdx = (poseIdx + 1) % anim.poses.length;
      }
      const p = anim.poses[poseIdx];
      mm.sprite = p.sprite;
      mm.anchorX = p.anchor.x;
      mm.anchorY = p.anchor.y;
      return p;
    };

    const animMove = (mm: Mascot, p: PoseDef | undefined, dst: number) => {
      if (!p) return;
      const dx = p.velocity.x * dst * (mm.lookRight ? -1 : 1);
      const dy = p.velocity.y * dst;
      if (dx !== 0) {
        mm.x = dx < 0 ? Math.max(mm.x + dx, a.targetX ?? -Infinity) : Math.min(mm.x + dx, a.targetX ?? Infinity);
      }
      if (dy !== 0) {
        mm.y = dy < 0 ? Math.max(mm.y + dy, a.targetY ?? -Infinity) : Math.min(mm.y + dy, a.targetY ?? Infinity);
      }
    };

    const et = def.embedType;

    return {
      step: (mm, dst) => {
        t += dst;
        tickIndex++;
        const W = window.innerWidth, H = window.innerHeight;

        switch (def.type) {
          case "Stay":
          case "Animate": {
            const p = advancePose(mm, dst);
            animMove(mm, p, dst);
            return a.duration !== undefined && t >= a.duration ? "done" : "running";
          }
          case "Move": {
            const p = advancePose(mm, dst);
            animMove(mm, p, dst);
            const doneX = a.targetX !== undefined && mm.x === a.targetX;
            const doneY = a.targetY !== undefined && mm.y === a.targetY;
            return doneX || doneY ? "done" : "running";
          }
          case "Embedded": {
            switch (et) {
              case "Look":
                return "done";
              case "Offset":
                mm.x += a.offX ?? 0;
                mm.y += a.offY ?? 0;
                return "done";
              case "Fall":
              case "FallWithIE": {
                if (tickIndex === 1) {
                  mm.vx = a.initialVx ?? 0;
                  mm.vy = a.initialVy ?? 0;
                  mm.parentSelector = null;
                }
                advancePose(mm, dst);
                const l = mm.vy * dst * 2;
                const landing = tickIndex > 5
                  ? catchRects.current.find((c) => onTop({ x: mm.x, y: mm.y }, c.rect, Math.max(2, l)))
                  : undefined;
                mm.x = clamp(mm.x + mm.vx * dst, 0, W);
                mm.y = landing ? landing.rect.y : Math.min(mm.y + mm.vy * dst, H);
                mm.vx = mm.vx * (1 - a.resistanceX * dst);
                mm.vy = mm.vy * (1 - a.resistanceY * dst) + a.gravity * dst;
                if (et === "FallWithIE" && mm.carrySelector) {
                  positionCarried(mm.carrySelector, mm.x + a.ieOffsetX, mm.y + a.ieOffsetY, mm.lookRight);
                }
                if (landing) {
                  mm.parentSelector = landing.selector;
                  mm.lastParentRect = landing.rect;
                  mm.vx = 0; mm.vy = 0;
                  return "done";
                }
                if (
                  tickIndex > 1 &&
                  (mm.y >= H || ((a.initialVx ?? 0) < 0 && mm.x <= 0) || ((a.initialVx ?? 0) > 0 && mm.x >= W))
                ) {
                  mm.vx = 0; mm.vy = 0;
                  return "done";
                }
                return "running";
              }
              case "Dragged": {
                const c = cursor.current;
                // spring-follow with momentum (ported from fo): footX drives sway frames
                const step = 0.8 * (mm.footDx + 0.1 * (c.x - mm.footX)) * dst;
                mm.footX += step;
                mm.footDx = step;
                advancePose(mm, dst);
                mm.x = c.x;
                mm.y = c.y + 120;
                mm.dragT += dst;
                if (!mm.pinned && mm.dragT > 250) {
                  // struggles free after ~10s
                  throw new ActionAbort("break free");
                }
                return "running";
              }
              case "Regist": {
                advancePose(mm, dst);
                return a.duration !== undefined && t >= a.duration ? "done" : "running";
              }
              case "Jump": {
                advancePose(mm, dst);
                const v = a.velocity ?? 20;
                const tx = a.targetX ?? mm.x;
                const ty = a.targetY ?? mm.y;
                const ddx = tx - mm.x, ddy = ty - mm.y;
                const dist = Math.hypot(ddx, ddy);
                if (dist === 0) return "done";
                const sx = (v * ddx) / dist * dst;
                const sy = (v * ddy) / dist * dst;
                mm.x = tx < mm.x ? Math.max(mm.x + sx, tx) : Math.min(mm.x + sx, tx);
                mm.y = ty < mm.y ? Math.max(mm.y + sy, ty) : Math.min(mm.y + sy, ty);
                if (mm.x === tx && mm.y === ty) {
                  // land on catch element if we jumped onto its top edge
                  const c = catchRects.current.find((cc) => onTop({ x: mm.x, y: mm.y }, cc.rect, 4));
                  mm.parentSelector = c ? c.selector : null;
                  mm.lastParentRect = c ? c.rect : null;
                  return "done";
                }
                return "running";
              }
              case "WalkWithIE": {
                const p = advancePose(mm, dst);
                animMove(mm, p, dst);
                if (mm.carrySelector) {
                  positionCarried(mm.carrySelector, mm.x + a.ieOffsetX, mm.y + a.ieOffsetY, mm.lookRight);
                }
                const doneX = a.targetX !== undefined && mm.x === a.targetX;
                const doneY = a.targetY !== undefined && mm.y === a.targetY;
                return doneX || doneY ? "done" : "running";
              }
              case "ThrowIE": {
                advancePose(mm, dst);
                if (!mm.carrySelector) return "done";
                if (!carryInit) {
                  carryInit = true;
                  carryX = mm.x + a.ieOffsetX;
                  carryY = mm.y + a.ieOffsetY;
                  mm.vx = (a.initialVx ?? 32) * (mm.lookRight ? 1 : -1);
                  mm.vy = a.initialVy ?? -10;
                }
                mm.vy += a.gravity * dst;
                carryX += mm.vx * dst;
                carryY += mm.vy * dst;
                positionCarried(mm.carrySelector, carryX, carryY, mm.lookRight);
                if (carryX >= W + 200 || carryX <= -200 || carryY >= H + 200 || carryY <= -200) {
                  dropCarried(mm.carrySelector);
                  mm.carrySelector = null;
                  mm.vx = 0; mm.vy = 0;
                  return "done";
                }
                return "running";
              }
              case "Breed": {
                advancePose(mm, dst);
                if (!bred && (a.duration === undefined || t >= a.duration)) {
                  bred = true;
                  spawnRef.current(mm.spec, mm.x + a.bornX, mm.y + a.bornY, a.bornBehavior ?? "Fall");
                  return "done";
                }
                return bred ? "done" : "running";
              }
              case "SelectIE":
              case "SelectEdge": {
                if (!selStarted) {
                  selStarted = true;
                  mm.selectedNode = null;
                  setSelecting({ mascotId: mm.id, edge: et === "SelectEdge" });
                  return "running";
                }
                return mm.selectedNode ? "done" : "running";
              }
              case "Exit": {
                mascots.current = mascots.current.filter((x) => x.id !== mm.id);
                setCount(mascots.current.length);
                return "done";
              }
              case "Reboot": {
                mm.x = 128 + (W - 256) * Math.random();
                mm.y = 128 + (H - 256) * Math.random();
                mm.vx = 0; mm.vy = 0;
                mm.parentSelector = null;
                if (mm.carrySelector) { dropCarried(mm.carrySelector); mm.carrySelector = null; }
                return "done";
              }
              default:
                throw new ActionAbort(`embed '${et}' not implemented`);
            }
          }
          default:
            return "done";
        }
      },
    };
  };

  /* ---------- behavior selection ---------- */

  const setBehavior = (m: Mascot, name: string) => {
    const b = m.spec.behaviors.find((x) => x.name === name);
    const action = m.spec.actions.find((x) => x.name === name);
    void b;
    m.behaviorName = name;
    m.selectedAge++;
    if (m.selectedAge > 1) m.selectedNode = null;
    m.dragT = 0;
    try {
      if (!action) throw new ActionAbort(`no action '${name}'`);
      m.exec = makeExec(m, action);
    } catch {
      if (name !== "Fall") setBehavior(m, "Fall");
      else m.exec = null;
    }
  };

  const pickBehavior = (m: Mascot, candidates?: { name: string; frequency?: number; conditions?: string[] }[]) => {
    const env = buildEnv(m);
    const pool =
      candidates && candidates.length
        ? candidates.map((c) => {
            const b = m.spec.behaviors.find((x) => x.name === c.name);
            return { name: c.name, frequency: c.frequency ?? b?.frequency ?? 100, conditions: c.conditions ?? b?.conditions };
          })
        : m.spec.behaviors;
    const ok = pool.filter((b) => condsMet(b.conditions, env));
    const chosen = pickWeighted(ok, (b) => b.frequency ?? 0);
    setBehavior(m, chosen ? chosen.name : "Fall");
  };

  /* ---------- spawn / dismiss ---------- */

  const spawn = (spec: CharacterSpec, x?: number, y?: number, behavior = "Fall") => {
    if (mascots.current.length >= maxMascots) return;
    const W = typeof window !== "undefined" ? window.innerWidth : 1200;
    const H = typeof window !== "undefined" ? window.innerHeight : 800;
    const m: Mascot = {
      id: nextId.current++,
      spec,
      x: x ?? W * Math.random(),
      y: y ?? H * Math.random() * 0.5,
      vx: 0, vy: 0,
      lookRight: false,
      sprite: "/shime1.png",
      anchorX: 64, anchorY: 128,
      behaviorName: behavior,
      parentSelector: null,
      lastParentRect: null,
      carrySelector: null,
      selectedNode: null,
      selectedAge: 0,
      exec: null,
      footX: x ?? W * Math.random(),
      footDx: 0,
      dragT: 0,
      outsideMs: 0,
      pinned: false,
    };
    mascots.current.push(m);
    setCount(mascots.current.length);
    setBehavior(m, behavior);
  };
  spawnRef.current = (spec, x, y, behavior) => spawn(spec, x, y, behavior);

  const summon = useCallback(
    (specId?: string) => {
      const list = specs;
      if (!list.length) return;
      const spec = specId ? list.find((s) => s.id === specId) ?? list[0] : list[Math.floor(Math.random() * list.length)];
      spawn(spec, window.innerWidth * (0.1 + 0.8 * Math.random()), 0, "Fall");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [specs, maxMascots]
  );

  const dismissAll = useCallback(() => {
    for (const m of mascots.current) if (m.carrySelector) dropCarried(m.carrySelector);
    mascots.current = [];
    setCount(0);
    setMenu(null);
    setSelecting(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- main loop ---------- */

  useEffect(() => {
    if (!mounted) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dtMs = Math.min(now - last, 100);
      last = now;
      const dst = dtMs / TICK;
      if (mascots.current.length > 0) {
        scanCatch();
        restoreExpiredDrops();
        const W = window.innerWidth, H = window.innerHeight;

        for (const m of [...mascots.current]) {
          // ride moving parent element
          if (m.parentSelector) {
            const r = rectFor(m.parentSelector);
            if (r && m.lastParentRect) {
              m.x += r.x - m.lastParentRect.x;
              m.y += r.y - m.lastParentRect.y;
            }
            m.lastParentRect = r;
            if (!r) m.parentSelector = null;
          }

          // watchdog: outside work area for 8s → reboot
          if (!inside({ x: m.x, y: m.y }, { x: 0, y: 0, width: W, height: H }, 1)) {
            m.outsideMs += dtMs;
            if (m.outsideMs > 8000) {
              m.outsideMs = 0;
              setBehavior(m, "Reboot");
            }
          } else m.outsideMs = 0;

          // selection pending → pause
          if (selectingRef.current && selectingRef.current.mascotId === m.id) continue;

          if (!m.exec) {
            pickBehavior(m);
            continue;
          }
          try {
            const r = m.exec.step(m, dst);
            if (!mascots.current.includes(m)) continue; // removed via Exit
            if (r === "done") {
              const b = m.spec.behaviors.find((x) => x.name === m.behaviorName);
              m.exec = null;
              pickBehavior(m, b?.nextBehaviors?.length ? b.nextBehaviors : undefined);
            }
          } catch (e) {
            m.exec = null;
            if (dragging.current?.id === m.id && dragging.current.started) {
              // broke free from the cursor
              dragging.current = null;
              setBehavior(m, "Thrown");
            } else {
              setBehavior(m, "Fall");
            }
          }
        }
        setTick((t) => t + 1);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, specs]);

  /* ---------- pointer handling ---------- */

  useEffect(() => {
    if (!mounted) return;

    const onMove = (e: MouseEvent) => {
      const h = mouseHist.current;
      h.push({ x: e.clientX, y: e.clientY });
      if (h.length > 3) h.shift();
      const w = [0.2, 0.5, 1.1];
      let dx = 0, dy = 0;
      for (let i = 0; i < h.length; i++) {
        const prev = i === 0 ? h[0] : h[i - 1];
        dx += (h[i].x - prev.x) * w[i];
        dy += (h[i].y - prev.y) * w[i];
      }
      cursor.current = { x: e.clientX, y: e.clientY, dx, dy };

      const d = dragging.current;
      if (d && !d.started && performance.now() - d.downT > 200) {
        d.started = true;
        const m = mascots.current.find((mm) => mm.id === d.id);
        if (m) {
          m.pinned = false;
          m.footX = m.x;
          setBehavior(m, "Dragged");
        }
      }
    };

    const onUp = () => {
      const d = dragging.current;
      dragging.current = null;
      if (!d) return;
      const m = mascots.current.find((mm) => mm.id === d.id);
      if (!m) return;
      if (d.started || m.pinned) {
        m.pinned = false;
        setBehavior(m, "Thrown");
      } else {
        // quick click → menu
        setMenu({ x: d.downX, y: d.downY, mascotId: d.id });
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        if (selectingRef.current) {
          const mid = selectingRef.current.mascotId;
          setSelecting(null);
          setHover(null);
          const m = mascots.current.find((mm) => mm.id === mid);
          if (m) {
            m.exec = null;
            pickBehavior(m);
          }
        }
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  /* ---------- selection overlay ---------- */

  const pageElementAt = (x: number, y: number): HTMLElement | null => {
    const stack = document.elementsFromPoint(x, y);
    for (const el of stack) {
      if (!(el instanceof HTMLElement)) continue;
      if (layerRef.current && layerRef.current.contains(el)) continue;
      if (el === document.documentElement || el === document.body) continue;
      return el;
    }
    return null;
  };

  const onSelectMove = (e: React.MouseEvent) => {
    if (!selecting) return;
    const el = pageElementAt(e.clientX, e.clientY);
    if (!el) return setHover(null);
    const r = el.getBoundingClientRect();
    const rect = { x: r.x, y: r.y, width: r.width, height: r.height };
    setHover({ r: rect, edge: selecting.edge ? nearestEdge({ x: e.clientX, y: e.clientY }, rect) : undefined });
  };

  const onSelectClick = (e: React.MouseEvent) => {
    if (!selecting) return;
    const sel = selecting;
    const el = pageElementAt(e.clientX, e.clientY);
    setSelecting(null);
    setHover(null);
    const m = mascots.current.find((mm) => mm.id === sel.mascotId);
    if (!m) return;
    if (!el) {
      m.exec = null;
      pickBehavior(m);
      return;
    }
    el.setAttribute(CATCH_ATTR, "true");
    m.selectedNode = elemSelector(el);
    m.selectedAge = 0;
    // the SelectIE exec is now unblocked (it returns done when selectedNode set)
  };

  /* ---------- render ---------- */

  const ctxValue: ShimejiContextValue = {
    summon,
    dismissAll,
    count,
    specIds: specs.map((s) => s.id),
  };

  const menuMascot = menu ? mascots.current.find((m) => m.id === menu.mascotId) : undefined;
  const menuGroups = menu && menuMascot ? buildMenu(menuMascot.spec, buildEnv(menuMascot), { x: menuMascot.x, y: menuMascot.y }) : [];
  const vw = typeof window !== "undefined" ? window.innerWidth : 800;
  const vh = typeof window !== "undefined" ? window.innerHeight : 600;

  return (
    <Ctx.Provider value={ctxValue}>
      {children}
      {mounted && (
        <div
          ref={layerRef}
          style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex, overflow: "hidden" }}
        >
          {mascots.current.map((m) => {
            const rect = m.spec.sprites[m.sprite.toLowerCase()] ?? m.spec.sprites[m.sprite];
            if (!rect) return null;
            return (
              <div
                key={m.id}
                onMouseDown={(e) => {
                  if (e.button !== 0) return;
                  e.preventDefault();
                  dragging.current = {
                    id: m.id,
                    downT: performance.now(),
                    started: false,
                    downX: e.clientX,
                    downY: e.clientY,
                  };
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenu({ x: e.clientX, y: e.clientY, mascotId: m.id });
                }}
                style={{
                  position: "absolute",
                  left: -m.anchorX,
                  top: -m.anchorY,
                  width: rect.width,
                  height: rect.height,
                  background: `url('${sheetUrl(m.spec)}')`,
                  backgroundPosition: `${-rect.x}px ${-rect.y}px`,
                  transform: `translate(${m.x}px, ${m.y}px) scaleX(${m.lookRight ? -1 : 1})`,
                  pointerEvents: selecting ? "none" : "auto",
                  cursor: "context-menu",
                  userSelect: "none",
                  zIndex: m.parentSelector ? 1 : 2,
                }}
              />
            );
          })}

          {selecting && (
            <div
              onMouseMove={onSelectMove}
              onClick={onSelectClick}
              onContextMenu={(e) => {
                e.preventDefault();
                setSelecting(null);
                setHover(null);
              }}
              style={{ position: "absolute", inset: 0, pointerEvents: "auto", cursor: "cell" }}
            >
              {hover && (
                <div
                  style={{
                    position: "absolute",
                    left: hover.r.x,
                    top: hover.r.y,
                    width: hover.r.width,
                    height: hover.r.height,
                    boxShadow: `0px 0px 16px ${ACCENT}`,
                    ...(hover.edge
                      ? { [`border${hover.edge[0].toUpperCase()}${hover.edge.slice(1)}`]: `4px solid ${ACCENT}` }
                      : {}),
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
          )}

          {menu && menuMascot && (
            <>
              <div
                style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}
                onMouseDown={() => setMenu(null)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setMenu(null);
                }}
              />
              <div
                onMouseDown={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  ...(menu.x < 0.7 * vw ? { left: menu.x + 40 } : { right: vw - menu.x + 40 }),
                  top: menu.y,
                  transform: `translateY(-${(menu.y / vh) * 100}%)`,
                  maxHeight: "calc(100vh - 50px)",
                  minWidth: 200,
                  maxWidth: 400,
                  overflowY: "auto",
                  overscrollBehavior: "contain",
                  backgroundColor: "rgba(255, 240, 230, 0.9)",
                  boxShadow: "0 0 5px -2px rgba(0,0,0,1)",
                  fontFamily: '"Balsamiq Sans", "Comic Sans MS", "Comic Sans", "Gill Sans", "Arial", sans-serif',
                  fontSize: "10pt",
                  borderRadius: 5,
                  padding: "0.4em",
                  backdropFilter: "blur(20px)",
                  pointerEvents: "auto",
                }}
              >
                {menuGroups.map((group, gi) => (
                  <React.Fragment key={gi}>
                    {gi > 0 && (
                      <hr
                        style={{
                          border: 0,
                          height: 1,
                          background: "#333",
                          backgroundImage: "linear-gradient(to right, #ccc, #333, #ccc)",
                        }}
                      />
                    )}
                    {group.map((item) => (
                      <div
                        key={item.behaviorName}
                        onMouseDown={() => {
                          if (item.disabled) return;
                          const m = mascots.current.find((mm) => mm.id === menu.mascotId);
                          setMenu(null);
                          if (!m) return;
                          if (item.behaviorName === "Dragged") {
                            m.pinned = true;
                            m.footX = m.x;
                          }
                          setBehavior(m, item.behaviorName);
                        }}
                        onMouseEnter={(e) => {
                          if (item.disabled) return;
                          e.currentTarget.style.backgroundColor = ACCENT;
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "black";
                        }}
                        style={{
                          position: "relative",
                          padding: "0.5em 1em",
                          color: "black",
                          borderRadius: 5,
                          display: "flex",
                          opacity: item.disabled ? 0.5 : 1,
                          cursor: item.disabled ? "not-allowed" : "default",
                        }}
                      >
                        <div style={{ flexGrow: 1 }}>{item.title}</div>
                        {item.rightContent && <div>{item.rightContent}</div>}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </Ctx.Provider>
  );
}

/* ================================================================== */
/* Ready-made summon button                                            */
/* ================================================================== */

export function ShimejiSummonButton({
  label = "Summon shimeji",
  specId,
  style,
}: {
  label?: string;
  specId?: string;
  style?: React.CSSProperties;
}) {
  const { summon } = useShimeji();
  return (
    <button
      onClick={() => summon(specId)}
      style={{
        padding: "10px 18px",
        borderRadius: 10,
        border: "1px solid #d8d8d8",
        background: "#fff",
        cursor: "pointer",
        fontSize: 14,
        fontFamily: "system-ui, sans-serif",
        ...style,
      }}
    >
      {label}
    </button>
  );
}

export default ShimejiProvider;
