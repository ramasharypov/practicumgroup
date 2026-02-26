import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Constants ---
const GAP = 2; 
const ITEM_COUNT = 8;
const TRACK_WIDTH = 800; 
const TRACK_HEIGHT = 100; 
const TRACK_GAP = 20; 
const DEGREES_TO_PIXELS = TRACK_WIDTH / 180; 

// STATUS TRACK = статусная полоса (100px) + детальный блок (400px)
const STATUS_HEIGHT = 500;

// Base Y Positions
const DEFAULT_TOP_Y = -(TRACK_GAP/2) - (TRACK_HEIGHT/2); // -60
const DEFAULT_BOT_Y = (TRACK_GAP/2) + (TRACK_HEIGHT/2); // +60
const SHIFT_UNIT = 240; 
const EXTRA_OFFSET = STATUS_HEIGHT + TRACK_GAP; // 520

interface Item {
  id: number;
  content: string;
  image: string;
  color: string;
}

const IMAGES = [
  "https://images.unsplash.com/photo-1764258560163-198782335017?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRleHR1cmUlMjBuZW9uJTIwZGFyayUyMGN5YmVycHVuayUyMGdlb21ldHJpYyUyMGZsdWlkJTIwM2QlMjByZW5kZXJ8ZW58MXx8fHwxNzY5MDA3NjM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1761933401842-a00488fa3bc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwZnV0dXJlJTIwYXJjaGl0ZWN0dXJlJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzY5MDA3NjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1709996165626-7f9fbd981aba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5JTIwbGlnaHRzJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzY5MDA3NjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1764258906159-3f5952286f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZmx1aWQlMjBhcnQlMjBuZW9uJTIwZGFya3xlbnwxfHx8fDE3NjkwMDc2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

const COLORS = [
    "#ef4444", "#f97316", "#f59e0b", "#84cc16", 
    "#10b981", "#06b6d4", "#3b82f6", "#a855f7"
];

const ITEMS: Item[] = Array.from({ length: ITEM_COUNT }, (_, i) => ({
  id: i,
  content: `SEC-${String(i).padStart(2, "0")}`,
  image: IMAGES[i % IMAGES.length],
  color: COLORS[i % COLORS.length]
}));

// --- Math Helpers ---
function normalize180(a: number) {
    let angle = a % 360;
    if (angle > 180) angle -= 360;
    if (angle <= -180) angle += 360;
    return angle;
}

function angleToPos(angle: number) {
    const norm = normalize180(angle);
    if (norm <= 0) {
        const x = (norm + 180) * DEGREES_TO_PIXELS - (TRACK_WIDTH / 2);
        return { row: 0, x };
    } else {
        const x = (TRACK_WIDTH / 2) - (norm * DEGREES_TO_PIXELS);
        return { row: 1, x };
    }
}

function getDualTrackPath(startAngle: number, endAngle: number, topTrackY: number, botTrackY: number) {
    if (!Number.isFinite(startAngle) || !Number.isFinite(endAngle)) return "";
    const span = endAngle - startAngle;
    if (span <= 0) return "";

    const cuts = [];
    const minMult = Math.floor(startAngle / 180);
    const maxMult = Math.ceil(endAngle / 180);
    for (let k = minMult; k <= maxMult; k++) {
        const cut = k * 180;
        if (cut > startAngle && cut < endAngle) cuts.push(cut);
    }
    const points = [startAngle, ...cuts, endAngle];
    let pathD = "";

    for (let i = 0; i < points.length - 1; i++) {
        const s = points[i];
        const e = points[i+1];
        const mid = (s + e) / 2;
        const pos = angleToPos(mid);
        const y = pos.row === 0 ? topTrackY : botTrackY;
        const halfH = TRACK_HEIGHT / 2;
        const p1 = angleToPos(s);
        const p2 = angleToPos(e);
        pathD += `M ${p1.x} ${y - halfH} L ${p2.x} ${y - halfH} L ${p2.x} ${y + halfH} L ${p1.x} ${y + halfH} Z `;
    }
    return pathD;
}

function unwrapAngle(target: number, current: number) {
    const diff = target - current;
    const correction = Math.round(diff / 360) * 360;
    return target - correction;
}

export default function TorusInterface() {
  const [activeState, setActiveState] = useState<{ id: number, hemisphere: 'top' | 'bottom' } | null>(null);
  const [lastAnchor, setLastAnchor] = useState<{ id: number, hemisphere: 'top' | 'bottom' }>({ id: 1, hemisphere: 'top' });
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [step, setStep] = useState(0);

  // --- Layout Engine ---
  const sectors = useMemo(() => {
    const weights = ITEMS.map(item => {
        if (activeState !== null) return item.id === activeState.id ? 100 : 1;
        return item.id === hoveredId ? 2.5 : 1;
    });

    let result = new Array(ITEM_COUNT).fill(null);
    const getSequence = (startId: number, count: number) => {
        const arr = [];
        for(let i=0; i<count; i++) arr.push((startId + i + ITEM_COUNT) % ITEM_COUNT);
        return arr;
    };

    if (activeState !== null) {
        const isTop = activeState.hemisphere === 'top';
        const activeStart = isTop ? -180 : 0;
        const activeEnd = isTop ? 0 : 180;
        result[activeState.id] = { item: ITEMS[activeState.id], start: activeStart, end: activeEnd, isActive: true };
        
        const totalOtherWeight = weights.reduce((sum, w, i) => i === activeState.id ? sum : sum + w, 0);
        const availableSpace = 180 - (6 * GAP);
        let currentAngle = isTop ? 0 : -180; 
        
        for (let i = 1; i < ITEM_COUNT; i++) {
            const id = (activeState.id + i) % ITEM_COUNT;
            const weight = weights[id];
            const span = (weight / totalOtherWeight) * availableSpace;
            const itemEnd = currentAngle + span;
            result[id] = { item: ITEMS[id], start: currentAngle, end: itemEnd, isActive: false };
            currentAngle = itemEnd;
            if (i < ITEM_COUNT - 1) currentAngle += GAP;
        }
    } else {
        let topIds: number[] = [], botIds: number[] = [];
        if (lastAnchor.hemisphere === 'top') {
            topIds = getSequence(lastAnchor.id - 1, 4);
            botIds = getSequence(lastAnchor.id + 3, 4);
        } else {
            botIds = getSequence(lastAnchor.id - 1, 4);
            topIds = getSequence(lastAnchor.id + 3, 4);
        }

        let cur = -180 + GAP/2;
        const topTotalWeight = topIds.reduce((sum, id) => sum + weights[id], 0);
        const topSpace = 180 - (4 * GAP);
        topIds.forEach(id => {
            const span = (weights[id] / topTotalWeight) * topSpace;
            result[id] = { item: ITEMS[id], start: cur, end: cur + span, isActive: false };
            cur += span + GAP;
        });

        cur = 0 + GAP/2;
        const botTotalWeight = botIds.reduce((sum, id) => sum + weights[id], 0);
        const botSpace = 180 - (4 * GAP);
        botIds.forEach(id => {
            const span = (weights[id] / botTotalWeight) * botSpace;
            result[id] = { item: ITEMS[id], start: cur, end: cur + span, isActive: false };
            cur += span + GAP;
        });
    }
    return result;
  }, [activeState, hoveredId, lastAnchor]);

  const handleSectorClick = (id: number, currentMidAngle: number) => {
    if (activeState?.id === id) { setActiveState(null); return; }
    const norm = normalize180(currentMidAngle);
    const row = norm <= 0 ? 0 : 1; 
    const isVisualBottom = (step % 2 === 0 && row === 1) || (step % 2 !== 0 && row === 0);
    if (isVisualBottom) setStep(s => s + 1);
    const hemisphere = row === 0 ? 'top' : 'bottom';
    setActiveState({ id, hemisphere });
    setLastAnchor({ id, hemisphere });
  };

  const activeItem = activeState ? ITEMS[activeState.id] : null;

  // --- POSITIONING ---
  // Leapfrog Physics
  // Each step pushes one row down by SHIFT_UNIT (240px).
  const row0Shifts = Math.ceil(step / 2);
  const row1Shifts = Math.floor(step / 2);
  
  let currentTopY = DEFAULT_TOP_Y + (row0Shifts * SHIFT_UNIT);
  let currentBotY = DEFAULT_BOT_Y + (row1Shifts * SHIFT_UNIT);

  // STATUS TRACK LOGIC
  // Визуально верхний трек = тот у которого меньше Y (выше на экране)
  const visuallyTopIsRow0 = currentTopY < currentBotY;
  
  // STATUS позиция: сразу под визуально верхним треком
  const visualTopY = visuallyTopIsRow0 ? currentTopY : currentBotY;
  const statusY = visualTopY + (TRACK_HEIGHT/2) + TRACK_GAP + (STATUS_HEIGHT/2);
  
  // Если есть activeState, сдвигаем визуально нижний трек вниз
  if (activeState) {
    if (visuallyTopIsRow0) {
      // Row0 визуально вверху, сдвигаем Row1 (botY) вниз
      currentBotY += STATUS_HEIGHT + TRACK_GAP;
    } else {
      // Row1 визуально вверху, сдвигаем Row0 (topY) вниз
      currentTopY += STATUS_HEIGHT + TRACK_GAP;
    }
  }

  // Dynamic Height Logic
  // Initial height 600px (covers roughly -300 to +300).
  // Each step adds roughly 120px of occupied vertical space at the bottom.
  // We expand the container to fit this new content so it doesn't shrink.
  let dynamicHeight = 600 + (step * 240);
  if (activeState) dynamicHeight += STATUS_HEIGHT; // Добавляем место для STATUS
  const halfHeight = dynamicHeight / 2;
  const viewBoxStr = `-500 ${-300} 1000 ${dynamicHeight}`;

  return (
    <div className="relative flex h-screen w-full flex-col items-center bg-black overflow-y-auto overflow-x-hidden select-none font-mono">
      <div className="absolute inset-0 z-0 bg-neutral-950 min-h-full" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] [background-size:40px_40px] min-h-full" />

      {/* --- DUAL TRACK CONTAINER --- */}
      <div className="relative z-10 w-full flex items-center justify-center pt-[calc(50vh-300px)]">
            <svg 
                // We physically grow the SVG pixel height to match the viewbox height 1:1
                // This prevents shrinking.
                style={{ width: 1000, height: dynamicHeight }}
                viewBox={viewBoxStr} 
                className="overflow-visible"
            >
                {/* Track Backgrounds */}
                <rect 
                    x={-TRACK_WIDTH/2} 
                    y={currentTopY - TRACK_HEIGHT/2}
                    width={TRACK_WIDTH} height={TRACK_HEIGHT} 
                    fill="#111" stroke="#222"
                />
                <rect 
                    x={-TRACK_WIDTH/2} 
                    y={currentBotY - TRACK_HEIGHT/2}
                    width={TRACK_WIDTH} height={TRACK_HEIGHT} 
                    fill="#111" stroke="#222" 
                />
                
                {/* Labels */}
                <text 
                    x={-TRACK_WIDTH/2 - 10} 
                    y={currentTopY} 
                    fill="#444" textAnchor="end" dominantBaseline="middle" fontSize="10" 
                    className="pointer-events-none select-none"
                >
                    {(step % 2 !== 0) ? "BOT TRACK" : "TOP TRACK"}
                </text>
                
                <text 
                    x={-TRACK_WIDTH/2 - 10} 
                    y={currentBotY} 
                    fill="#444" textAnchor="end" dominantBaseline="middle" fontSize="10" 
                    className="pointer-events-none select-none"
                >
                    {(step % 2 !== 0) ? "TOP TRACK" : "BOT TRACK"}
                </text>

                {sectors.map((sector) => (
                    <SectorBlock
                        key={sector.item.id}
                        item={sector.item}
                        targetStart={sector.start}
                        targetEnd={sector.end}
                        isActive={sector.isActive}
                        topY={currentTopY}
                        botY={currentBotY}
                        onHover={() => setHoveredId(sector.item.id)}
                        onLeave={() => setHoveredId(null)}
                        onClick={handleSectorClick}
                    />
                ))}

                {/* STATUS TRACK - рендерится поверх секций */}
                {activeItem && (
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* STATUS BAR - верхние 100px */}
                        <rect 
                            x={-TRACK_WIDTH/2} 
                            y={statusY - STATUS_HEIGHT/2} 
                            width={TRACK_WIDTH} 
                            height={100} 
                            fill="#1a1a1a" 
                            stroke="#333" 
                            strokeWidth={2}
                        />
                        
                        <text 
                            x={0} 
                            y={statusY - STATUS_HEIGHT/2 + 50} 
                            fill="#fff" 
                            fontSize={14} 
                            fontWeight="bold"
                            textAnchor="middle" 
                            dominantBaseline="middle"
                            className="pointer-events-none select-none"
                        >
                            ACTIVE: {activeItem.content}
                        </text>

                        {/* DETAIL BLOCK - нижние 400px */}
                        <rect 
                            x={-TRACK_WIDTH/2} 
                            y={statusY - STATUS_HEIGHT/2 + 100} 
                            width={TRACK_WIDTH} 
                            height={400} 
                            fill="#0a0a0a" 
                            stroke="#222" 
                            strokeWidth={1}
                        />
                        
                        <text 
                            x={-TRACK_WIDTH/2 + 20} 
                            y={statusY - STATUS_HEIGHT/2 + 130} 
                            fill="#888" 
                            fontSize={12}
                            className="pointer-events-none select-none"
                        >
                            SECTOR DETAILS
                        </text>
                        
                        <text 
                            x={-TRACK_WIDTH/2 + 20} 
                            y={statusY - STATUS_HEIGHT/2 + 160} 
                            fill={activeItem.color} 
                            fontSize={10}
                            className="pointer-events-none select-none"
                        >
                            ID: {activeItem.id}
                        </text>
                        
                        <text 
                            x={-TRACK_WIDTH/2 + 20} 
                            y={statusY - STATUS_HEIGHT/2 + 185} 
                            fill={activeItem.color} 
                            fontSize={10}
                            className="pointer-events-none select-none"
                        >
                            Color: {activeItem.color}
                        </text>
                    </motion.g>
                )}
            </svg>
      </div>
    </div>
  );
}

// --- Dual Track Sector Block ---
interface SectorBlockProps {
    item: Item;
    targetStart: number;
    targetEnd: number;
    isActive: boolean;
    topY: number;
    botY: number;
    onHover: () => void;
    onLeave: () => void;
    onClick: (id: number, currentAngle: number) => void;
}

const SectorBlock = ({ item, targetStart, targetEnd, isActive, topY, botY, onHover, onLeave, onClick }: SectorBlockProps) => {
    const safeStart = Number.isFinite(targetStart) ? targetStart : 0;
    const safeEnd = Number.isFinite(targetEnd) ? targetEnd : 10;

    const prevStartRef = useRef(safeStart);
    const prevEndRef = useRef(safeEnd);

    const springConfig = { stiffness: 100, damping: 20 };
    
    // Physics for width expansion only
    const startMv = useSpring(safeStart, springConfig);
    const endMv = useSpring(safeEnd, springConfig);
    
    // Y-Position MotionValues (Instant Snap)
    const topYMv = useMotionValue(topY);
    const botYMv = useMotionValue(botY);

    useEffect(() => {
        const nextStart = unwrapAngle(safeStart, prevStartRef.current);
        const nextEnd = unwrapAngle(safeEnd, prevEndRef.current);
        
        startMv.set(nextStart);
        endMv.set(nextEnd);
        
        // Instant update
        topYMv.set(topY);
        botYMv.set(botY);
        
        prevStartRef.current = nextStart;
        prevEndRef.current = nextEnd;
    }, [safeStart, safeEnd, isActive, topY, botY, startMv, endMv, topYMv, botYMv]);

    const pathD = useTransform(
        [startMv, endMv, topYMv, botYMv],
        ([s, e, tY, bY]) => getDualTrackPath(s, e, tY, bY)
    );

    const textVals = useTransform(
        [startMv, endMv, topYMv, botYMv],
        ([s, e, tY, bY]) => {
            const mid = (s + e) / 2;
            const pos = angleToPos(mid);
            const y = pos.row === 0 ? tY : bY;
            return { x: pos.x, y };
        }
    );

    const textX = useTransform(textVals, v => v.x);
    const textY = useTransform(textVals, v => v.y);

    const handleClick = () => {
        const currentStart = startMv.get();
        const currentEnd = endMv.get();
        const mid = (currentStart + currentEnd) / 2;
        onClick(item.id, mid);
    };

    const clipId = `clip-${item.id}`;

    return (
        <motion.g
            className="cursor-pointer"
            onClick={handleClick}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            <defs>
                <clipPath id={clipId}>
                     <motion.path d={pathD} />
                </clipPath>
            </defs>

            <g clipPath={`url(#${clipId})`}>
                <motion.g style={{ y: textY }}>
                    <rect
                        x={-500} y={-400} width={1000} height={800}
                        fill={item.color}
                        className="opacity-20"
                    />
                    <image 
                        href={item.image}
                        x={-500}
                        y={-400}
                        width={1000}
                        height={800}
                        preserveAspectRatio="none"
                        className="opacity-50 transition-opacity duration-300 hover:opacity-100"
                    />
                    <motion.rect 
                        x={-500} y={-400} width={1000} height={800} 
                        fill={item.color} 
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: isActive ? 0.05 : 0.3 }}
                        className="mix-blend-overlay"
                    />
                    <rect x={-500} y={-400} width={1} height={800} fill="black" opacity="0.5" />
                </motion.g>
            </g>

            <motion.path
                d={pathD}
                fill="none"
                stroke={isActive ? "#fff" : "#000"}
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={isActive ? 1 : 0.5}
            />

            <motion.g style={{ x: textX, y: textY }}>
                <text
                    fill="white"
                    fontSize={isActive ? 16 : 10}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-mono pointer-events-none select-none"
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
                >
                    {item.content}
                </text>
            </motion.g>
        </motion.g>
    );
};