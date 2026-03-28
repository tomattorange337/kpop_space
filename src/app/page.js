"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";



const GROUP_LIBRARY = [...new Set([
   "2NE1",
"2PM",
"AOA",
"Apink",
"ASTRO",
"aespa",
"AKMU",
"BADVILLAIN",
"BABYMONSTER",
"BEAST",
"BIGBANG",
"BLACKPINK",
"BOYNEXTDOOR",
"BTOB",
"BTS",
"ENHYPEN",
"EXO",
"fromis_9",
"GFRIEND",
"GOT7",
"Girls' Generation",
"Highlight",
"Hearts2Hearts",
"ILLIT",
"INFINITE",
"IVE",
"izna",
"KARA",
"KATSEYE",
"Kep1er",
"KiiiKiii",
"KISS OF LIFE",
"LE SSERAFIM",
"MAMAMOO",
"MEOVV",
"miss A",
"MONSTA X",
"NCT 127",
"NCT DREAM",
"NCT WISH",
"NewJeans",
"NMIXX",
"OH MY GIRL",
"Red Velvet",
"RIIZE",
"SEVENTEEN",
"SHINee",
"SISTAR",
"STAYC",
"Stray Kids",
"T-ARA",
"THE BOYZ",
"TREASURE",
"tripleS",
"TWICE",
"TWS",
"TXT",
"Wanna One",
"Wonder Girls",
"ZEROBASEONE",

"10cm",
"Ailee",
"Agust D",
"Ash Island",
"Baek Yerin",
"Baekhyun",
"BIBI",
"Big Naughty",
"BoA",
"Car, the garden",
"Changmo",
"Chen",
"Chungha",
"CL",
"Crush",
"Daesung",
"Dean",
"D.O.",
"DPR IAN",
"DPR LIVE",
"G-Dragon",
"Gray",
"Heize",
"Hyolyn",
"HyunA",
"IU",
"Jay Park",
"Jessi",
"Jimin",
"Jin",
"Jo Yuri",
"Jungkook",
"Kai",
"Kang Daniel",
"Kwon Eunbi",
"Lay",
"Lee Hi",
"Lee Mujin",
"Loco",
"MeloMance",
"Park Jihoon",
"Paul Kim",
"Penomeco",
"pH-1",
"Psy",
"Rain",
"RM",
"Sandara Park",
"Simon Dominic",
"Somi",
"Stella Jang",
"SUGA",
"Sunmi",
"Suho",
"Taemin",
"Taeyeon",
"Taeyang",
"T.O.P",
"V",
"Woodz",
"Xiumin",
"Yena",
"Younha",
"ZICO",
"Zion.T"

])];
const INITIAL_GROUPS = [
  { id: "exo", name: "EXO", x: -900, y: -260, baseRadius: 168 },
  { id: "wannaone", name: "Wanna One", x: -420, y: -420, baseRadius: 164 },
  { id: "redvelvet", name: "Red Velvet", x: 120, y: -360, baseRadius: 164 },
  { id: "blackpink", name: "BLACKPINK", x: 700, y: -240, baseRadius: 160 },
  { id: "bts", name: "BTS", x: -780, y: 260, baseRadius: 184 },
  { id: "newjeans", name: "NewJeans", x: -180, y: 180, baseRadius: 168 },
  { id: "aespa", name: "aespa", x: 380, y: 220, baseRadius: 164 },
  { id: "ive", name: "IVE", x: 930, y: 180, baseRadius: 160 },
  { id: "izna", name: "izna", x: -40, y: 620, baseRadius: 150 },
  { id: "hearts2hearts", name: "Hearts2Hearts", x: 620, y: 620, baseRadius: 158 },
  { id: "kiiikiii", name: "KiiiKiii", x: -700, y: 640, baseRadius: 150 }
];

const INITIAL_MESSAGES = {
  EXO: [
    { id: "local-1", text: "엑소 사랑해", angle: 20, dist: 115, speed: 0.2 },
    { id: "local-2", text: "늘 빛나", angle: 170, dist: 135, speed: -0.14 }
  ],
  "Wanna One": [{ id: "local-3", text: "다시 만나자", angle: 110, dist: 120, speed: 0.15 }],
  "Red Velvet": [{ id: "local-4", text: "레벨 최고", angle: 250, dist: 110, speed: -0.12 }],
  BLACKPINK: [{ id: "local-5", text: "forever", angle: 60, dist: 118, speed: 0.16 }],
  BTS: [
    { id: "local-6", text: "방탄 사랑해", angle: 40, dist: 130, speed: 0.18 },
    { id: "local-7", text: "늘 응원해", angle: 200, dist: 148, speed: -0.11 }
  ],
  NewJeans: [{ id: "local-8", text: "항상 반짝여", angle: 130, dist: 118, speed: 0.17 }],
  aespa: [{ id: "local-9", text: "무대 최고야", angle: 280, dist: 112, speed: 0.16 }],
  IVE: [{ id: "local-10", text: "아이브 짱", angle: 320, dist: 115, speed: -0.14 }],
  izna: [{ id: "local-11", text: "izna 화이팅", angle: 70, dist: 108, speed: 0.15 }],
  Hearts2Hearts: [{ id: "local-12", text: "하투하 응원해", angle: 180, dist: 120, speed: -0.13 }],
  KiiiKiii: [{ id: "local-13", text: "kiiiiii", angle: 260, dist: 106, speed: 0.16 }]
};

function distance(ax, ay, bx, by) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function getDynamicRadius(baseRadius, count) {
  const growth = Math.floor(count / 5) * 8;
  return Math.min(baseRadius + growth, baseRadius + 120);
}

function createStableStars() {
  return Array.from({ length: 130 }, (_, i) => ({
    id: i,
    left: ((i * 37) % 100) + ((i % 7) * 0.23),
    top: ((i * 53) % 100) + ((i % 5) * 0.17),
    size: 0.8 + (i % 3) * 0.65,
    opacity: 0.22 + (i % 6) * 0.1
  }));
}

function resolveGroupCollisions(groups, messages) {
  const nextGroups = groups.map((group) => ({ ...group }));

  for (let pass = 0; pass < 18; pass += 1) {
    let moved = false;

    for (let i = 0; i < nextGroups.length; i += 1) {
      for (let j = i + 1; j < nextGroups.length; j += 1) {
        const a = nextGroups[i];
        const b = nextGroups[j];
        const aRadius = getDynamicRadius(a.baseRadius, (messages[a.name] || []).length);
        const bRadius = getDynamicRadius(b.baseRadius, (messages[b.name] || []).length);
        const minDistance = aRadius + bRadius + 90;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

        if (dist < minDistance) {
          const overlap = minDistance - dist;
          const pushX = (dx / dist) * (overlap / 2);
          const pushY = (dy / dist) * (overlap / 2);

          a.x -= pushX;
          a.y -= pushY;
          b.x += pushX;
          b.y += pushY;
          moved = true;
        }
      }
    }

    if (!moved) break;
  }

  return nextGroups;
}

function makeOrbitalMessage(raw, radius) {
  return {
    id: String(raw.id),
    text: raw.text,
    angle: Math.random() * 360,
    dist: radius * (0.58 + Math.random() * 0.2),
    speed: (Math.random() * 0.14 + 0.05) * (Math.random() > 0.5 ? 1 : -1)
  };
}

function getGroupGlow(count) {
  if (count >= 1000) {
    return {
      border: "rgba(255, 215, 120, 0.45)",
      shadow: "rgba(255, 215, 120, 0.28)"
    };
  }
  if (count >= 500) {
    return {
      border: "rgba(255, 120, 220, 0.38)",
      shadow: "rgba(255, 120, 220, 0.22)"
    };
  }
  if (count >= 100) {
    return {
      border: "rgba(170, 120, 255, 0.34)",
      shadow: "rgba(170, 120, 255, 0.2)"
    };
  }
  if (count >= 10) {
    return {
      border: "rgba(120, 200, 255, 0.28)",
      shadow: "rgba(120, 200, 255, 0.16)"
    };
  }
  return {
    border: "rgba(255,255,255,0.08)",
    shadow: "rgba(255,255,255,0.04)"
  };
}

export default function Home() {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.72);
  const [dragging, setDragging] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [tick, setTick] = useState(0);
  const [launchingMessage, setLaunchingMessage] = useState(null);
const [evolutionText, setEvolutionText] = useState(null);
const [shownEvolutionStages, setShownEvolutionStages] = useState({});
  const [groupInput, setGroupInput] = useState("");
  const [groupNotice, setGroupNotice] = useState("");

  const dragRef = useRef({ startX: 0, startY: 0, camX: 0, camY: 0 });
  const stars = useMemo(() => createStableStars(), []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGroups((prev) => resolveGroupCollisions(prev, messages));
    }, 20);
    return () => clearTimeout(timeout);
  }, [messages]);

  useEffect(() => {
    if (!groupNotice) return;
    const timeout = setTimeout(() => setGroupNotice(""), 1800);
    return () => clearTimeout(timeout);
  }, [groupNotice]);
useEffect(() => {
  const thresholds = [10, 50, 100, 500, 1000];

  groups.forEach((group) => {
    const count = (messages[group.name] || []).length;

    thresholds.forEach((threshold) => {
      const key = `${group.name}-${threshold}`;

      if (count >= threshold && !shownEvolutionStages[key]) {
        setShownEvolutionStages((prev) => ({
          ...prev,
          [key]: true
        }));

        setEvolutionText(`${group.name} 우주 진화!`);

        setTimeout(() => {
          setEvolutionText(null);
        }, 2200);
      }
    });
  });
}, [messages, groups, shownEvolutionStages]);
  const radiusMap = useMemo(() => {
    const next = {};
    groups.forEach((group) => {
      next[group.name] = getDynamicRadius(group.baseRadius, (messages[group.name] || []).length);
    });
    return next;
  }, [groups, messages]);

  const activeGroup = useMemo(() => {
    const centerWorldX = -camera.x / zoom;
    const centerWorldY = -camera.y / zoom;

    return (
      groups.find((group) => distance(centerWorldX, centerWorldY, group.x, group.y) < radiusMap[group.name]) || null
    );
  }, [camera, zoom, groups, radiusMap]);

  const focusOnGroup = (group) => {
    setCamera({
      x: -group.x * zoom,
      y: -group.y * zoom
    });
  };

  useEffect(() => {
    async function loadMessages() {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("loadMessages error:", error);
        return;
      }

      if (!data) return;

      const grouped = { ...INITIAL_MESSAGES };

      data.forEach((row) => {
        const baseRadius =
          INITIAL_GROUPS.find((g) => g.name === row.group_name)?.baseRadius || 156;

        if (!grouped[row.group_name]) grouped[row.group_name] = [];
        grouped[row.group_name].push(
          makeOrbitalMessage(row, getDynamicRadius(baseRadius, grouped[row.group_name].length))
        );
      });

      setMessages(grouped);

      setGroups((prev) => {
        const existingNames = new Set(prev.map((g) => g.name));
        const missingGroupNames = [...new Set(data.map((row) => row.group_name))].filter(
          (name) => !existingNames.has(name)
        );

        if (missingGroupNames.length === 0) return prev;

        const extraGroups = missingGroupNames.map((name, index) => {
          const angle = (prev.length + index) * 0.82;
          const radius = 1040 + (prev.length + index) * 36;
          return {
            id: slugify(name),
            name,
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            baseRadius: 156
          };
        });

        return resolveGroupCollisions([...prev, ...extraGroups], grouped);
      });
    }

    loadMessages();

        const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new;

          const group =
            groups.find((g) => g.name === row.group_name) ||
            INITIAL_GROUPS.find((g) => g.name === row.group_name);

          const baseRadius = group?.baseRadius || 156;

          setMessages((prev) => {
            const currentList = prev[row.group_name] || [];

            if (
              currentList.some(
                (msg) =>
                  String(msg.id) === String(row.id) ||
                  msg.text === row.text
              )
            ) {
              return prev;
            }

            return {
              ...prev,
              [row.group_name]: [
                ...currentList,
                makeOrbitalMessage(
                  row,
                  getDynamicRadius(baseRadius, currentList.length)
                )
              ]
            };
          });

          setGroups((prev) => {
            if (prev.some((g) => g.name === row.group_name)) return prev;

            const angle = prev.length * 0.82;
            const radius = 1040 + prev.length * 36;
            const newGroup = {
              id: slugify(row.group_name),
              name: row.group_name,
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
              baseRadius: 156
            };

            return resolveGroupCollisions([...prev, newGroup], messages);
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const onPointerDown = (e) => {
    setDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      camX: camera.x,
      camY: camera.y
    };
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setCamera({
      x: dragRef.current.camX + dx,
      y: dragRef.current.camY + dy
    });
  };

  const onPointerUp = () => setDragging(false);

  const onWheel = (e) => {
    e.preventDefault();
    setZoom((prev) => clamp(prev - e.deltaY * 0.0012, 0.35, 1.9));
  };

  useEffect(() => {
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
    };
  });

  const addGroupByInput = () => {
    const clean = groupInput.trim();
    if (!clean) return;

    if (!GROUP_LIBRARY.includes(clean)) {
      setGroupNotice("등록된 그룹만 추가할 수 있어요");
      return;
    }

    const existingGroup = groups.find((group) => group.name.toLowerCase() === clean.toLowerCase());
    if (existingGroup) {
      focusOnGroup(existingGroup);
      setGroupInput("");
      setGroupNotice(`${clean} 쪽으로 이동했어요`);
      return;
    }

    const angle = groups.length * 0.82;
    const radius = 1040 + groups.length * 36;
    const newGroup = {
      id: slugify(clean),
      name: clean,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      baseRadius: 156
    };

    const nextGroups = resolveGroupCollisions([...groups, newGroup], messages);
    setGroups(nextGroups);
    setMessages((prev) => ({
      ...prev,
      [clean]: prev[clean] || []
    }));
    setGroupInput("");
    setGroupNotice(`${clean} 추가 완료`);

    setTimeout(() => {
      const added = nextGroups.find((group) => group.name === clean) || newGroup;
      focusOnGroup(added);
    }, 20);
  };

const submitMessage = async () => {
  const group = activeGroup;
  if (!group || !input.trim()) return;

  const typedText = input.trim();
  const targetRadius = radiusMap[group.name];

  const nextMessage = {
    id: `local-${Date.now()}`,
    text: typedText,
    angle: Math.random() * 360,
    dist: targetRadius * (0.58 + Math.random() * 0.2),
    speed: (Math.random() * 0.14 + 0.05) * (Math.random() > 0.5 ? 1 : -1)
  };

  const endX =
    group.x + Math.cos((nextMessage.angle * Math.PI) / 180) * nextMessage.dist;
  const endY =
    group.y + Math.sin((nextMessage.angle * Math.PI) / 180) * nextMessage.dist;

  setLaunchingMessage({
    ...nextMessage,
    startX: 0,
    startY: 0,
    endX,
    endY,
    animate: false
  });

  setInput("");

  setTimeout(() => {
    setLaunchingMessage((prev) => (prev ? { ...prev, animate: true } : prev));
  }, 20);

  setTimeout(() => {
        setLaunchingMessage(null);
  }, 720);

  const { error } = await supabase.from("messages").insert({
    group_name: group.name,
    text: typedText
  });

  if (error) {
    console.error("insert error:", error);
    setGroupNotice("메시지 저장 실패");
  }
};
  
  return (
    <div
      onWheel={onWheel}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "radial-gradient(circle at 50% 50%, rgba(28,28,34,1) 0%, rgba(0,0,0,1) 66%)",
        color: "white",
        fontFamily: "Inter, Arial, Apple SD Gothic Neo, Noto Sans KR, sans-serif"
      }}
    >
{evolutionText && (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "-120%",
      transform: "translateY(-50%)",
      width: "max-content",
      fontSize: "clamp(48px, 10vw, 160px)",
      fontWeight: 900,
      color: "rgba(255,255,255,0.16)",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      zIndex: 9999,
      textShadow: "0 0 30px rgba(255,255,255,0.18)",
      animation: "evolutionSlide 2.2s linear forwards"
    }}
  >
    {evolutionText}
  </div>
)}
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: "999px",
            background: "white",
            opacity: star.opacity,
            boxShadow: "0 0 10px rgba(255,255,255,0.35)"
          }}
        />
      ))}

      {activeGroup && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 18,
            transform: "translateX(-50%)",
            zIndex: 50,
            padding: "12px 16px",
            borderRadius: 16,
            background: "rgba(255,255,255,0.92)",
            color: "black",
            fontWeight: 700,
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)"
          }}
        >
          {activeGroup.name} 우주 진입!
        </div>
      )}

      {input && activeGroup && !launchingMessage && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            whiteSpace: "nowrap",
            color: "white",
            fontSize: 70,
            fontWeight: 700,
            textShadow: "0 0 14px rgba(255,255,255,0.85)",
            zIndex: 49,
            pointerEvents: "none"
          }}
        >
          {input}
        </div>
      )}

      <div
        onPointerDown={onPointerDown}
        style={{
          position: "absolute",
          inset: 0,
          cursor: dragging ? "grabbing" : "grab"
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${zoom})`,
            transformOrigin: "center center"
          }}
        >
          {groups.map((group) => {
            const radius = radiusMap[group.name];
const count = (messages[group.name] || []).length;
const glow = getGroupGlow(count);

            return (
              <div
                key={group.id}
                style={{
                  position: "absolute",
                  left: `${group.x}px`,
                  top: `${group.y}px`
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: `${radius * 2}px`,
                    height: `${radius * 2}px`,
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    transform: "translate(-50%, -50%)",
                  boxShadow:
  activeGroup?.id === group.id
    ? `0 0 70px ${glow.shadow}`
    : `0 0 30px ${glow.shadow}`,
                    transition: "width 0.3s ease, height 0.3s ease"
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: 30,
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    whiteSpace: "nowrap",
                    textShadow: "0 0 14px rgba(255,255,255,0.75)"
                  }}
                >
                  {group.name}
                </div>

                {(messages[group.name] || []).map((msg) => {
                  const angle = ((msg.angle + tick * msg.speed) * Math.PI) / 180;
                  const x = Math.cos(angle) * msg.dist;
                  const y = Math.sin(angle) * msg.dist;

                  return (
                    <div
                      key={msg.id}
                      style={{
                        position: "absolute",
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: "translate(-50%, -50%)",
                        whiteSpace: "nowrap",
                        fontSize: 15,
                        color: "white",
                        textShadow: "0 0 8px rgba(255,255,255,0.78)",
                        opacity: 0.86 + Math.sin((tick + Number(String(msg.id).replace(/\D/g, "") || 1)) * 0.03) * 0.14
                      }}
                    >
                      {msg.text}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {launchingMessage && (
            <div
              style={{
                position: "absolute",
                left: `${launchingMessage.animate ? launchingMessage.endX : launchingMessage.startX}px`,
                top: `${launchingMessage.animate ? launchingMessage.endY : launchingMessage.startY}px`,
                transform: `translate(-50%, -50%) scale(${launchingMessage.animate ? 0.72 : 1})`,
                whiteSpace: "nowrap",
                fontSize: launchingMessage.animate ? 16 : 24,
                fontWeight: 700,
                color: "white",
                textShadow: "0 0 12px rgba(255,255,255,0.88)",
                opacity: 1,
                transition: "left 0.7s ease, top 0.7s ease, transform 0.7s ease, font-size 0.7s ease",
                pointerEvents: "none"
              }}
            >
              {launchingMessage.text}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 24,
          transform: "translateX(-50%)",
          width: "min(92vw, 760px)",
          zIndex: 50,
          padding: 14,
          borderRadius: 20,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)"
        }}
      >
        <div
          style={{
            marginBottom: 10,
            fontSize: 14,
            color: "rgba(255,255,255,0.82)"
          }}
        >
          {activeGroup ? `${activeGroup.name} 우주에서 하고 싶은 말` : "다른 우주 찾기"}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {activeGroup ? (
            <>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitMessage()}
                placeholder="입력하기"
                style={{
                  flex: 1,
                  padding: "13px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(0,0,0,0.35)",
                  color: "white",
                  outline: "none",
                  fontSize: 14
                }}
              />
              <button
                onClick={submitMessage}
                disabled={!input.trim()}
                style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  border: "none",
                  background: !input.trim() ? "#5c5c5c" : "white",
                  color: !input.trim() ? "#d8d8d8" : "black",
                  fontWeight: 700,
                  cursor: !input.trim() ? "not-allowed" : "pointer"
                }}
              >
                Enter
              </button>
            </>
          ) : (
            <>
              <input
                list="group-library"
                value={groupInput}
                onChange={(e) => setGroupInput(e.target.value)}
                onKeyDown={(e) => e.key === "enter" && addGroupByInput()}
                placeholder="그룹명"
             style={{
                  flex: 1,
                  padding: "13px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(0,0,0,0.35)",
                  color: "white",
                  outline: "none",
                  fontSize: 14
                }}
              />
              <datalist id="group-library">
                {GROUP_LIBRARY.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              <button
                onClick={addGroupByInput}
                disabled={!groupInput.trim()}
                style={{
                  padding: "12px 18px",
                  borderRadius: 12,
                  border: "none",
                  background: !groupInput.trim() ? "#5c5c5c" : "white",
                  color: !groupInput.trim() ? "#d8d8d8" : "black",
                  fontWeight: 700,
                  cursor: !groupInput.trim() ? "not-allowed" : "pointer"
                }}
              >
                Enter
              </button>
            </>
          )}
        </div>

        {!activeGroup && groupNotice && (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{groupNotice}</div>
        )}
      </div>
<style jsx global>{`
  @keyframes evolutionSlide {
    0% {
      left: -120%;
    }
    100% {
      left: 100%;
    }
  }
`}</style>
    </div>
  );
}