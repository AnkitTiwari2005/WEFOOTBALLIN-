"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Sparkles, X, AlertCircle } from "lucide-react";
import { GAMES, type GameMatch, type MatchPass, type Position } from "@/lib/data";
import { ease } from "@/lib/tokens";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone?: "volt" | "flare";
}

interface BookPayload {
  gameId: string;
  playerName: string;
  phone: string;
  position: Position;
  spots: number;
  promoCode?: string;
}

interface AppContextValue {
  games: GameMatch[];
  passes: MatchPass[];
  selectedGame: GameMatch | null;
  isBookingOpen: boolean;
  isPassesOpen: boolean;
  isCmdOpen: boolean;
  unlockedPromo: boolean;
  openBooking: (gameId: string) => void;
  closeBooking: () => void;
  openPasses: () => void;
  closePasses: () => void;
  setCmdOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bookMatch: (payload: BookPayload) => MatchPass | null;
  cancelPass: (passId: string) => void;
  unlockPromo: () => void;
  notify: (title: string, description?: string, tone?: "volt" | "flare") => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const PASSES_KEY = "wf_passes_v1";
const PROMO_KEY = "wf_promo_topbins50";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [games, setGames] = useState<GameMatch[]>(GAMES);
  const [passes, setPasses] = useState<MatchPass[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [isPassesOpen, setIsPassesOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [unlockedPromo, setUnlockedPromo] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    try {
      const savedPasses = localStorage.getItem(PASSES_KEY);
      if (savedPasses) {
        const parsed = JSON.parse(savedPasses) as MatchPass[];
        setPasses(parsed);
        // Reflect persisted passes in available spots
        if (parsed.length > 0) {
          setGames((prev) =>
            prev.map((g) => {
              const userSpots = parsed.filter((p) => p.gameId === g.id).reduce((sum, p) => sum + p.spots, 0);
              if (!userSpots) return g;
              const userPlayers = parsed
                .filter((p) => p.gameId === g.id)
                .map((p) => ({
                  name: `${p.playerName} (You)`,
                  initials: p.playerName
                    .split(" ")
                    .map((s) => s[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase(),
                  pos: p.position,
                  team: (g.filled % 2 === 0 ? "Volt" : "Chalk") as "Volt" | "Chalk",
                  matches: 1,
                }));
              return {
                ...g,
                filled: Math.min(g.capacity, g.filled + userSpots),
                roster: [...g.roster, ...userPlayers],
              };
            })
          );
        }
      }
      if (localStorage.getItem(PROMO_KEY) === "1") {
        setUnlockedPromo(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCmdOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setIsCmdOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const notify = useCallback((title: string, description?: string, tone: "volt" | "flare" = "volt") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-2), { id, title, description, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const unlockPromo = useCallback(() => {
    setUnlockedPromo((already) => {
      if (!already) {
        try {
          localStorage.setItem(PROMO_KEY, "1");
        } catch {
          // ignore
        }
        notify("Reward Unlocked: TOPBINS50", "₹50 off automatically available on your next match booking.");
      }
      return true;
    });
  }, [notify]);

  const openBooking = useCallback((gameId: string) => {
    setIsPassesOpen(false);
    setIsCmdOpen(false);
    setSelectedGameId(gameId);
  }, []);

  const closeBooking = useCallback(() => setSelectedGameId(null), []);

  const openPasses = useCallback(() => {
    setSelectedGameId(null);
    setIsCmdOpen(false);
    setIsPassesOpen(true);
  }, []);

  const closePasses = useCallback(() => setIsPassesOpen(false), []);

  const bookMatch = useCallback(
    ({ gameId, playerName, phone, position, spots, promoCode }: BookPayload): MatchPass | null => {
      const target = games.find((g) => g.id === gameId);
      if (!target) return null;
      const discount = promoCode?.trim().toUpperCase() === "TOPBINS50" ? 50 : 0;
      const totalPaid = Math.max(0, target.price * spots - discount);
      const ticketCode = `WF-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const pass: MatchPass = {
        id: `${Date.now()}`,
        gameId: target.id,
        gameTitle: target.title,
        venue: target.venue,
        dateLabel: target.dateLabel,
        timeLabel: target.timeLabel,
        format: target.format,
        playerName,
        phone,
        position,
        spots,
        totalPaid,
        promoApplied: discount > 0 ? "TOPBINS50" : undefined,
        createdAt: new Date().toISOString(),
        ticketCode,
      };

      setPasses((prev) => {
        const next = [pass, ...prev];
        try {
          localStorage.setItem(PASSES_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      const initials =
        playerName
          .trim()
          .split(/\s+/)
          .map((s) => s[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "YO";

      setGames((prev) =>
        prev.map((g) =>
          g.id === gameId
            ? {
                ...g,
                filled: Math.min(g.capacity, g.filled + spots),
                roster: [
                  ...g.roster,
                  {
                    name: `${playerName.split(" ")[0]} (You)`,
                    initials,
                    pos: position,
                    team: g.filled % 2 === 0 ? "Volt" : "Chalk",
                    matches: 1,
                  },
                ],
              }
            : g
        )
      );

      notify("Match Pass Confirmed", `${spots} spot${spots > 1 ? "s" : ""} locked for ${target.venue}`);
      return pass;
    },
    [games, notify]
  );

  const cancelPass = useCallback(
    (passId: string) => {
      const target = passes.find((p) => p.id === passId);
      if (!target) return;
      setPasses((prev) => {
        const next = prev.filter((p) => p.id !== passId);
        try {
          localStorage.setItem(PASSES_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      setGames((prev) =>
        prev.map((g) => {
          if (g.id !== target.gameId) return g;
          const idx = g.roster.findLastIndex((r) => r.name.includes("(You)"));
          const newRoster = idx >= 0 ? g.roster.filter((_, i) => i !== idx) : g.roster;
          return {
            ...g,
            filled: Math.max(0, g.filled - target.spots),
            roster: newRoster,
          };
        })
      );

      notify("Pass Released", `Your spot at ${target.venue} was released back to the pitch.`, "flare");
    },
    [passes, notify]
  );

  const selectedGame = games.find((g) => g.id === selectedGameId) ?? null;

  return (
    <AppContext.Provider
      value={{
        games,
        passes,
        selectedGame,
        isBookingOpen: Boolean(selectedGame),
        isPassesOpen,
        isCmdOpen,
        unlockedPromo,
        openBooking,
        closeBooking,
        openPasses,
        closePasses,
        setCmdOpen: setIsCmdOpen,
        bookMatch,
        cancelPass,
        unlockPromo,
        notify,
      }}
    >
      {children}

      {/* Floating Stadium Toast Stack */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 right-5 z-[110] flex w-full max-w-sm flex-col gap-2.5 px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.35, ease: ease.expo }}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
                t.tone === "flare"
                  ? "border-flare/40 bg-pitch/95 text-chalk"
                  : "border-volt/35 bg-pitch/95 text-chalk"
              }`}
            >
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  t.tone === "flare" ? "bg-flare/15 text-flare" : "bg-volt/15 text-volt"
                }`}
              >
                {t.tone === "flare" ? <AlertCircle className="h-4 w-4" /> : t.title.includes("Reward") ? <Sparkles className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight text-chalk">{t.title}</p>
                {t.description && <p className="mt-1 text-xs leading-relaxed text-mute">{t.description}</p>}
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
                className="rounded-lg p-1 text-mute transition-colors hover:bg-turf hover:text-chalk"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
