"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  Check,
  CalendarPlus,
  Copy,
  Users,
  CreditCard,
  Smartphone,
  Banknote,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import type { MatchPass, Position } from "@/lib/data";
import { ease } from "@/lib/tokens";

const POSITIONS: { id: Position; label: string; coords: { x: number; y: number } }[] = [
  { id: "GK", label: "Goalkeeper", coords: { x: 14, y: 50 } },
  { id: "DEF", label: "Defender", coords: { x: 32, y: 32 } },
  { id: "MID", label: "Midfielder", coords: { x: 48, y: 62 } },
  { id: "FWD", label: "Forward", coords: { x: 64, y: 42 } },
];

function TacticalPitch({
  roster,
  selectedPos,
  onSelectPos,
}: {
  roster: { name: string; initials: string; pos: Position; team: "Volt" | "Chalk" }[];
  selectedPos: Position;
  onSelectPos: (p: Position) => void;
}) {
  const slotPos = POSITIONS.find((p) => p.id === selectedPos) ?? POSITIONS[2];

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-pitch">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-xs">
        <span className="font-mono uppercase tracking-wider text-mute">Live Pitch Lineup</span>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span className="flex items-center gap-1 text-volt">
            <span className="h-2 w-2 rounded-full bg-volt" /> Team Volt
          </span>
          <span className="flex items-center gap-1 text-chalk">
            <span className="h-2 w-2 rounded-full bg-chalk" /> Team Chalk
          </span>
        </div>
      </div>

      {/* Interactive 2D Pitch */}
      <div className="relative aspect-[2/1] w-full bg-[#111115] p-2.5">
        <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden>
          <rect x="6" y="6" width="308" height="168" rx="4" fill="none" stroke="#262730" strokeWidth="1.5" />
          <line x1="160" y1="6" x2="160" y2="174" stroke="#262730" strokeWidth="1.5" />
          <circle cx="160" cy="90" r="28" fill="none" stroke="#262730" strokeWidth="1.5" />
          <circle cx="160" cy="90" r="2.5" fill="#FF463A" />
          <rect x="6" y="42" width="44" height="96" fill="none" stroke="#262730" strokeWidth="1.5" />
          <rect x="270" y="42" width="44" height="96" fill="none" stroke="#262730" strokeWidth="1.5" />
        </svg>

        {/* Existing Roster Dots */}
        {roster.slice(0, 12).map((player, idx) => {
          const isVolt = player.team === "Volt";
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          const left = isVolt ? 14 + col * 14 : 62 + col * 13;
          const top = 22 + ((row * 26 + idx * 9) % 62);
          return (
            <div
              key={`${player.initials}-${idx}`}
              title={`${player.name} · ${player.pos}`}
              style={{ left: `${left}%`, top: `${top}%` }}
              className={`absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-pitch font-mono text-[9px] font-bold shadow ${
                isVolt ? "bg-volt/90 text-pitch" : "bg-chalk/90 text-pitch"
              }`}
            >
              {player.initials}
            </div>
          );
        })}

        {/* User's Selected Slot */}
        <motion.div
          animate={{ left: `${slotPos.coords.x}%`, top: `${slotPos.coords.y}%` }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-volt bg-pitch font-mono text-[10px] font-bold text-volt shadow-[0_0_20px_rgba(255,70,58,0.5)]">
            <span className="absolute inset-0 animate-ping rounded-full border border-volt opacity-60" />
            YOU
          </span>
          <span className="mt-1 rounded bg-volt px-1.5 py-0.5 font-mono text-[9px] font-bold text-pitch">
            {selectedPos}
          </span>
        </motion.div>
      </div>

      {/* Position Selector */}
      <div className="grid grid-cols-4 gap-1.5 border-t border-line bg-turf/60 p-2">
        {POSITIONS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectPos(p.id)}
            className={`rounded-xl py-2 text-center transition-all ${
              selectedPos === p.id
                ? "bg-volt font-bold text-pitch"
                : "bg-pitch/60 text-mute hover:text-chalk"
            }`}
          >
            <span className="block font-mono text-xs">{p.id}</span>
            <span className="block text-[10px] opacity-80">{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function RegistrationDrawer() {
  const { selectedGame, isBookingOpen, closeBooking, bookMatch, unlockedPromo, openPasses, notify } = useApp();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState<Position>("MID");
  const [spots, setSpots] = useState(1);
  const [promo, setPromo] = useState("");
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "turf">("upi");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState<MatchPass | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isBookingOpen) {
      setConfirmedPass(null);
      setSpots(1);
      setError("");
      if (unlockedPromo) setPromo("TOPBINS50");
    }
  }, [isBookingOpen, selectedGame?.id, unlockedPromo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isBookingOpen) closeBooking();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isBookingOpen, closeBooking]);

  if (!selectedGame) return null;

  const spotsLeft = Math.max(0, selectedGame.capacity - selectedGame.filled);
  const isFull = spotsLeft === 0;
  const maxBookable = Math.min(3, Math.max(1, spotsLeft));
  const promoValid = promo.trim().toUpperCase() === "TOPBINS50";
  const subtotal = selectedGame.price * spots;
  const discount = promoValid ? 50 : 0;
  const total = Math.max(0, subtotal - discount);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Enter your name for the matchday roster.");
      return;
    }
    if (phone.trim().length < 8) {
      setError("Enter a valid phone / WhatsApp number for turf pin.");
      return;
    }
    setError("");
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      if (isFull) {
        notify("Added to Priority Waitlist", `We'll WhatsApp ${phone} immediately if a spot opens at ${selectedGame.venue}.`);
        closeBooking();
        return;
      }
      const created = bookMatch({
        gameId: selectedGame.id,
        playerName: name.trim(),
        phone: phone.trim(),
        position,
        spots,
        promoCode: promo,
      });
      if (created) setConfirmedPass(created);
    }, 850);
  };

  const downloadICS = (pass: MatchPass) => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//WEFOOTBALLIN//MatchPass//EN",
      "BEGIN:VEVENT",
      `UID:${pass.ticketCode}@wefootballin.in`,
      `SUMMARY:WEFOOTBALLIN' - ${pass.gameTitle} (${pass.format})`,
      `LOCATION:${pass.venue}`,
      `DESCRIPTION:Ticket ${pass.ticketCode} | Position: ${pass.position} | Spots: ${pass.spots}`,
      "DTSTART:20261128T150000Z",
      "DTEND:20261128T163000Z",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pass.ticketCode}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Calendar Event Downloaded", `${pass.ticketCode}.ics saved to your device.`);
  };

  return (
    <AnimatePresence>
      {isBookingOpen && (
        <div className="fixed inset-0 z-[115] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBooking}
            className="fixed inset-0 bg-pitch/80 backdrop-blur-md"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Match registration drawer"
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: ease.expo }}
            className="relative z-10 flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-line bg-pitch shadow-2xl"
          >
            {/* Fixed Drawer Header */}
            <div className="shrink-0 flex items-center justify-between border-b border-line bg-pitch/95 px-6 py-4 backdrop-blur-xl">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-volt">
                  {confirmedPass ? "Digital Match Pass" : isFull ? "Priority Waitlist" : "Instant Pitch Registration"}
                </span>
                <h2 className="font-display text-2xl uppercase tracking-wide text-chalk">
                  {selectedGame.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeBooking}
                aria-label="Close registration drawer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-turf text-chalk transition-colors hover:border-volt hover:text-volt"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {confirmedPass ? (
              /* Confirmation Digital Match Pass Ticket */
              <div data-lenis-prevent className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto overscroll-contain p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 rounded-2xl border border-volt/35 bg-volt/10 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-volt text-pitch">
                      <Check className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-display text-xl uppercase text-chalk">You&apos;re on the teamsheet!</p>
                      <p className="text-xs text-mute">
                        Arrive 10 mins early for bibs &amp; balanced squad draft.
                      </p>
                    </div>
                  </div>

                  {/* Stadium Boarding Pass Card */}
                  <div className="overflow-hidden rounded-3xl border border-chalk/20 bg-turf shadow-2xl">
                    <div className="border-b border-dashed border-line p-6">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xl uppercase text-volt">WEFOOTBALLIN&apos; PASS</span>
                        <span className="rounded-full bg-pitch px-3 py-1 font-mono text-xs text-chalk">
                          {confirmedPass.format}
                        </span>
                      </div>

                      <h3 className="mt-4 font-display text-3xl uppercase text-chalk">{confirmedPass.gameTitle}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-mute">
                        <MapPin className="h-4 w-4 text-volt" /> {confirmedPass.venue}
                      </p>

                      <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-pitch/80 p-3.5 font-mono text-xs">
                        <div>
                          <span className="block text-[10px] text-mute">PLAYER</span>
                          <strong className="text-chalk">{confirmedPass.playerName}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-mute">POSITION</span>
                          <strong className="text-volt">{confirmedPass.position}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-mute">KICKOFF</span>
                          <strong className="text-chalk">{confirmedPass.timeLabel}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Ticket QR Footer */}
                    <div className="flex items-center justify-between gap-4 bg-pitch/70 p-6">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                          PASS CODE ({confirmedPass.spots} SLOT{confirmedPass.spots > 1 ? "S" : ""})
                        </span>
                        <p className="mt-1 font-mono text-xl font-bold tracking-wider text-volt">
                          {confirmedPass.ticketCode}
                        </p>
                        <p className="mt-1 font-mono text-xs text-mute">
                          Paid: ₹{confirmedPass.totalPaid}
                          {confirmedPass.promoApplied && ` (${confirmedPass.promoApplied})`}
                        </p>
                      </div>

                      {/* Stylized Vector QR Matrix */}
                      <div className="rounded-xl bg-chalk p-2">
                        <svg width="64" height="64" viewBox="0 0 32 32" aria-label="QR Code">
                          <rect width="32" height="32" fill="#F7F5F0" />
                          <path
                            d="M2 2h10v10H2zM4 4v6h6V4zM6 6h2v2H6zM20 2h10v10H20zM22 4v6h6V4zM24 6h2v2h-2zM2 20h10v10H2zM4 22v6h6v-6zM6 24h2v2H6zM14 4h4v2h-4zM14 8h2v4h-2zM14 14h6v4h-6zM22 14h4v2h-4zM18 20h6v2h-6zM26 18h4v6h-4zM14 24h4v6h-4zM20 26h8v4h-8z"
                            fill="#09090B"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => downloadICS(confirmedPass)}
                      className="flex items-center justify-center gap-2 rounded-full border border-line bg-turf py-3 text-xs font-semibold text-chalk hover:border-volt hover:text-volt"
                    >
                      <CalendarPlus className="h-4 w-4 text-volt" /> Add to Calendar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(
                          `Join me at ${confirmedPass.gameTitle} (${confirmedPass.venue}, ${confirmedPass.dateLabel} ${confirmedPass.timeLabel}) — Pass ${confirmedPass.ticketCode}`
                        );
                        notify("Invite Copied", "Send it to your WhatsApp group to fill the remaining slots.");
                      }}
                      className="flex items-center justify-center gap-2 rounded-full border border-line bg-turf py-3 text-xs font-semibold text-chalk hover:border-volt hover:text-volt"
                    >
                      <Copy className="h-4 w-4 text-volt" /> Copy Squad Invite
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex gap-3 border-t border-line pt-5">
                  <button
                    type="button"
                    onClick={openPasses}
                    className="flex-1 rounded-full bg-volt py-3.5 text-sm font-bold text-pitch hover:bg-chalk"
                  >
                    Open My Passes
                  </button>
                  <button
                    type="button"
                    onClick={closeBooking}
                    className="rounded-full border border-line px-6 py-3.5 text-sm text-mute hover:text-chalk"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form & Tactical Squad Picker */
              <form onSubmit={handleConfirm} className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div data-lenis-prevent className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-6">
                {/* Match Metadata Strip */}
                <div className="rounded-2xl border border-line bg-turf/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-mute">
                    <span className="flex items-center gap-1.5 text-chalk">
                      <MapPin className="h-3.5 w-3.5 text-volt" /> {selectedGame.venue}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-volt">
                      <Clock className="h-3.5 w-3.5" /> {selectedGame.dateLabel} · {selectedGame.timeLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-mute">{selectedGame.vibeNote}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-line pt-3 text-[11px] text-mute">
                    <span className="flex items-center gap-1 text-chalk">
                      <ShieldCheck className="h-3.5 w-3.5 text-volt" /> Host: {selectedGame.hostName}
                    </span>
                    <span>•</span>
                    <span>{selectedGame.surface}</span>
                    <span>•</span>
                    <span className="font-mono text-volt">
                      {isFull ? "FULL" : `${spotsLeft} spots left`}
                    </span>
                  </div>
                </div>

                {/* Live Tactical Pitch & Position Selector */}
                <TacticalPitch
                  roster={selectedGame.roster}
                  selectedPos={position}
                  onSelectPos={setPosition}
                />

                {/* Player Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="wf-name" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-mute">
                        Your Name *
                      </label>
                      <input
                        id="wf-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="h-11 w-full rounded-xl border border-line bg-turf px-3.5 text-sm text-chalk placeholder:text-mute/60 focus:border-volt focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="wf-phone" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-mute">
                        WhatsApp Number *
                      </label>
                      <input
                        id="wf-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98XXX XXXXX"
                        className="h-11 w-full rounded-xl border border-line bg-turf px-3.5 text-sm text-chalk placeholder:text-mute/60 focus:border-volt focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Spots & Promo */}
                  {!isFull && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-mute">
                          <Users className="mr-1 inline h-3 w-3 text-volt" /> Spots to Book
                        </span>
                        <div className="flex h-11 items-center justify-between rounded-xl border border-line bg-turf px-2">
                          {[1, 2, 3].map((n) => {
                            const disabled = n > maxBookable;
                            return (
                              <button
                                key={n}
                                type="button"
                                disabled={disabled}
                                onClick={() => setSpots(n)}
                                className={`flex-1 rounded-lg py-1.5 font-mono text-xs font-bold transition-colors ${
                                  spots === n
                                    ? "bg-volt text-pitch"
                                    : disabled
                                    ? "cursor-not-allowed text-mute/30"
                                    : "text-mute hover:text-chalk"
                                }`}
                              >
                                {n} {n === 1 ? "Solo" : `+${n - 1}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="wf-promo" className="mb-1.5 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-mute">
                          <span>Promo Code</span>
                          {unlockedPromo && (
                            <span className="text-volt">TOPBINS50 Ready!</span>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            id="wf-promo"
                            type="text"
                            value={promo}
                            onChange={(e) => setPromo(e.target.value)}
                            placeholder="TOPBINS50"
                            className="h-11 w-full rounded-xl border border-line bg-turf pl-3.5 pr-16 font-mono text-xs uppercase text-chalk placeholder:text-mute/50 focus:border-volt focus:outline-none"
                          />
                          {promoValid && (
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded bg-volt/15 px-2 py-0.5 font-mono text-[10px] font-bold text-volt">
                              -₹50
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {!unlockedPromo && !isFull && (
                    <p className="flex items-center gap-1.5 rounded-xl border border-line/70 bg-turf/40 px-3 py-2 text-[11px] text-mute">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-volt" />
                      Pro tip: Score 4 goals in the Penalty Shootout section to unlock <strong className="text-chalk">TOPBINS50</strong> for ₹50 off!
                    </p>
                  )}

                  {/* Payment Options */}
                  {!isFull && (
                    <div>
                      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-mute">
                        Checkout Method
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "upi" as const, label: "UPI Instant", icon: Smartphone },
                          { id: "card" as const, label: "Card / Net", icon: CreditCard },
                          { id: "turf" as const, label: "Pay at Turf", icon: Banknote },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPayMethod(m.id)}
                            className={`flex flex-col items-center justify-center gap-1 rounded-xl border py-2.5 text-xs transition-all ${
                              payMethod === m.id
                                ? "border-volt bg-volt/10 font-semibold text-volt"
                                : "border-line bg-turf text-mute hover:text-chalk"
                            }`}
                          >
                            <m.icon className="h-4 w-4" />
                            <span>{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {error && <p className="text-xs font-medium text-flare">{error}</p>}
                </div>

                {/* Sticky Checkout CTA Footer */}
                <div className="shrink-0 border-t border-line bg-pitch/95 px-6 py-4 backdrop-blur-xl">
                  {!isFull && (
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="text-mute">
                        {spots} × ₹{selectedGame.price}
                        {discount > 0 ? " − ₹50 promo" : ""}
                      </span>
                      <span className="font-mono text-2xl font-bold text-chalk">₹{total}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-full font-bold transition-all active:scale-[0.98] ${
                      isFull
                        ? "bg-flare text-pitch hover:opacity-90"
                        : "bg-volt text-pitch hover:bg-chalk"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Securing your slot...</span>
                      </>
                    ) : isFull ? (
                      <>
                        <span>Join Priority Waitlist</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>Confirm &amp; Get Match Pass · ₹{total}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
