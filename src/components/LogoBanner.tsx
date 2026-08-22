import { useCallback, useEffect, useRef, useState } from "react";

type Logo = { file: string; name: string };

const logos: Logo[] = [
  { file: "clover.svg", name: "Clover" },
  { file: "freshbooks.webp", name: "FreshBooks" },
  { file: "gohighlevel.png", name: "GoHighLevel" },
  { file: "hubspot.webp", name: "HubSpot" },
  { file: "keap.webp", name: "Keap" },
  { file: "magento.webp", name: "Magento" },
  { file: "mastercard.webp", name: "Mastercard" },
  { file: "ncr.webp", name: "NCR" },
  { file: "nmi.webp", name: "NMI" },
  { file: "quickbooks.webp", name: "QuickBooks" },
  { file: "salesforce.webp", name: "Salesforce" },
  { file: "shopify.png", name: "Shopify" },
  { file: "squarespace.webp", name: "Squarespace" },
  { file: "visa.webp", name: "Visa" },
  { file: "wix.webp", name: "Wix" },
  { file: "zoho_crm.webp", name: "Zoho CRM" },
  { file: "kurvs.svg", name: "Kurvs" },
];

/* Feel of a single barrel roll. */
const ROLL_DURATION_MS = 640;
const ROLL_EASING = "cubic-bezier(0.7, 0, 0.2, 1)";

/**
 * How long a logo rests in its slot before rolling away. The randomised dwell
 * is multiplied by the number of visible slots, so the aggregate cadence stays
 * at roughly one flip every 2-4s whether two slots are visible or six.
 */
const DWELL_MIN_MS = 2000;
const DWELL_MAX_MS = 4000;

/* No two slots may begin rolling within this window of each other. */
const MIN_FLIP_GAP_MS = 450;

/* Visible slots per breakpoint, widest first. */
const SLOT_BREAKPOINTS = [
  { query: "(min-width: 1280px)", count: 6 },
  { query: "(min-width: 1024px)", count: 5 },
  { query: "(min-width: 768px)", count: 4 },
  { query: "(min-width: 640px)", count: 3 },
];
const NARROW_SLOT_COUNT = 2;

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const shuffle = (items: Logo[]): Logo[] => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
};

const resolveSlotCount = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return SLOT_BREAKPOINTS[SLOT_BREAKPOINTS.length - 1].count;
  }

  const match = SLOT_BREAKPOINTS.find((breakpoint) => window.matchMedia(breakpoint.query).matches);

  return match ? match.count : NARROW_SLOT_COUNT;
};

const useSlotCount = () => {
  const [count, setCount] = useState(resolveSlotCount);

  useEffect(() => {
    const lists = SLOT_BREAKPOINTS.map((breakpoint) => window.matchMedia(breakpoint.query));
    const update = () => setCount(resolveSlotCount());

    lists.forEach((list) => list.addEventListener("change", update));
    update();

    return () => lists.forEach((list) => list.removeEventListener("change", update));
  }, []);

  return count;
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const list = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(list.matches);

    list.addEventListener("change", update);
    update();

    return () => list.removeEventListener("change", update);
  }, []);

  return reduced;
};

type LogoSlotProps = {
  index: number;
  seed: Logo;
  slotCount: number;
  reducedMotion: boolean;
  drawNext: () => Logo;
  claimFlipWindow: () => number;
  setOccupancy: (index: number, names: string[]) => void;
  clearOccupancy: (index: number) => void;
};

const LogoSlot = ({
  index,
  seed,
  slotCount,
  reducedMotion,
  drawNext,
  claimFlipWindow,
  setOccupancy,
  clearOccupancy,
}: LogoSlotProps) => {
  const [current, setCurrent] = useState(seed);
  const [incoming, setIncoming] = useState<Logo | null>(null);
  const [rolling, setRolling] = useState(false);

  // Mirrors of state/props the scheduler reads without re-subscribing.
  const stateRef = useRef({ current, incoming });
  stateRef.current = { current, incoming };
  const slotCountRef = useRef(slotCount);
  slotCountRef.current = slotCount;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  useEffect(() => {
    setOccupancy(index, incoming ? [current.name, incoming.name] : [current.name]);
  }, [index, current, incoming, setOccupancy]);

  useEffect(() => () => clearOccupancy(index), [index, clearOccupancy]);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    let frame = 0;

    const dwell = () => randomBetween(DWELL_MIN_MS, DWELL_MAX_MS) * Math.max(slotCountRef.current, 1);

    const schedule = (delay: number) => {
      timer = window.setTimeout(flip, delay);
    };

    const flip = () => {
      if (cancelled) return;

      // Another slot is rolling right now — come back in a moment.
      const wait = claimFlipWindow();
      if (wait > 0) {
        schedule(wait);
        return;
      }

      const next = drawNext();
      // Reserve the incoming logo immediately so a sibling cannot pick it too.
      setOccupancy(index, [stateRef.current.current.name, next.name]);

      if (reducedMotionRef.current) {
        setCurrent(next);
        schedule(dwell());
        return;
      }

      setIncoming(next);
      // Two frames: one to paint the reel with the incoming cell parked above
      // the mask, one to start the transition towards it.
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => {
          if (!cancelled) setRolling(true);
        });
      });

      timer = window.setTimeout(() => {
        if (cancelled) return;
        // Settle: the incoming logo becomes the resting one and the reel snaps
        // back to its parked offset with no transition, so nothing is visible.
        setCurrent(next);
        setIncoming(null);
        setRolling(false);
        schedule(dwell());
      }, ROLL_DURATION_MS + 40);
    };

    // Stagger first flips across the row so slots never fall into lockstep.
    schedule((dwell() * (index + 0.5)) / Math.max(slotCountRef.current, 1) + randomBetween(0, 400));

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);

      const pending = stateRef.current.incoming;
      if (pending) {
        setCurrent(pending);
        setIncoming(null);
        setRolling(false);
      }
    };
  }, [index, drawNext, claimFlipWindow, setOccupancy]);

  const renderCell = (logo: Logo) => (
    <div className="flex h-1/2 items-center justify-center px-1">
      <img
        src={`/logos/${logo.file}`}
        alt=""
        loading="lazy"
        decoding="async"
        className="max-h-10 md:max-h-12 w-auto max-w-full object-contain opacity-65 grayscale-[40%] transition-all duration-300 group-hover:opacity-95 group-hover:grayscale-0"
      />
    </div>
  );

  return (
    <div className="group relative h-16 md:h-20 overflow-hidden transition-transform duration-300 hover:scale-105">
      <div
        className="absolute inset-x-0 top-0 flex flex-col"
        style={{
          height: "200%",
          transform: rolling ? "translateY(0%)" : "translateY(-50%)",
          transition: rolling ? `transform ${ROLL_DURATION_MS}ms ${ROLL_EASING}` : "none",
          willChange: "transform",
        }}
      >
        {renderCell(incoming ?? current)}
        {renderCell(current)}
      </div>

      {/* Soft shading at the lip of the drum keeps the roll contained. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

const LogoBanner = () => {
  const slotCount = useSlotCount();
  const reducedMotion = usePrefersReducedMotion();

  // One shared deck, dealt out and reshuffled, so every logo keeps its turn.
  const deckRef = useRef<Logo[]>([]);
  const cursorRef = useRef(0);
  // Logo names each slot is holding (its resting logo, plus one rolling in).
  const occupiedRef = useRef(new Map<number, string[]>());
  const lastFlipAtRef = useRef(0);

  if (deckRef.current.length === 0) {
    deckRef.current = shuffle(logos);
  }

  const drawNext = useCallback(() => {
    const taken = new Set<string>();
    occupiedRef.current.forEach((names) => names.forEach((name) => taken.add(name)));

    for (let pass = 0; pass <= logos.length; pass += 1) {
      if (cursorRef.current >= deckRef.current.length) {
        const previousLast = deckRef.current[deckRef.current.length - 1];
        const reshuffled = shuffle(deckRef.current);
        // Avoid repeating a logo straight across the deck boundary.
        if (reshuffled.length > 1 && reshuffled[0] === previousLast) {
          [reshuffled[0], reshuffled[1]] = [reshuffled[1], reshuffled[0]];
        }
        deckRef.current = reshuffled;
        cursorRef.current = 0;
      }

      const deck = deckRef.current;
      const cursor = cursorRef.current;
      let candidate = cursor;
      while (candidate < deck.length && taken.has(deck[candidate].name)) {
        candidate += 1;
      }

      if (candidate < deck.length) {
        // Pull the candidate forward; the skipped logos keep their place in line.
        const pick = deck[candidate];
        deck[candidate] = deck[cursor];
        deck[cursor] = pick;
        cursorRef.current = cursor + 1;

        return pick;
      }

      // Everything left in the deck is already on screen — reshuffle and retry.
      cursorRef.current = deck.length;
    }

    return deckRef.current[0];
  }, []);

  const claimFlipWindow = useCallback(() => {
    const now = performance.now();
    const sinceLast = now - lastFlipAtRef.current;

    if (sinceLast < MIN_FLIP_GAP_MS) {
      // Jitter the retry so two blocked slots do not collide again.
      return MIN_FLIP_GAP_MS - sinceLast + randomBetween(0, 120);
    }

    lastFlipAtRef.current = now;

    return 0;
  }, []);

  const setOccupancy = useCallback((index: number, names: string[]) => {
    occupiedRef.current.set(index, names);
  }, []);

  const clearOccupancy = useCallback((index: number) => {
    occupiedRef.current.delete(index);
  }, []);

  const [seeds, setSeeds] = useState<Logo[]>(() =>
    Array.from({ length: slotCount }, () => drawNext())
  );

  useEffect(() => {
    setSeeds((previous) => {
      if (previous.length === slotCount) return previous;

      if (previous.length > slotCount) {
        for (let index = slotCount; index < previous.length; index += 1) {
          occupiedRef.current.delete(index);
        }

        return previous.slice(0, slotCount);
      }

      const next = [...previous];
      while (next.length < slotCount) {
        next.push(drawNext());
      }

      return next;
    });
  }, [slotCount, drawNext]);

  return (
    <section className="py-20 overflow-hidden border-b border-border">
      <div className="px-6 md:px-16 lg:px-24 mb-10">
        <div className="text-center">
          <p className="font-ubuntu text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Integrations & Partnerships
          </p>
          <p className="font-inter text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-light">
            Plug into the platforms your business already trusts
          </p>
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24">
        <div
          className="mx-auto grid max-w-6xl gap-x-6 gap-y-4 md:gap-x-10"
          style={{ gridTemplateColumns: `repeat(${seeds.length}, minmax(0, 1fr))` }}
        >
          {seeds.map((seed, index) => (
            <LogoSlot
              key={index}
              index={index}
              seed={seed}
              slotCount={seeds.length}
              reducedMotion={reducedMotion}
              drawNext={drawNext}
              claimFlipWindow={claimFlipWindow}
              setOccupancy={setOccupancy}
              clearOccupancy={clearOccupancy}
            />
          ))}
        </div>
      </div>

      {/* The rolling slots are decorative; name every partner once for assistive tech. */}
      <ul className="sr-only">
        {logos.map((logo) => (
          <li key={logo.name}>{logo.name}</li>
        ))}
      </ul>
    </section>
  );
};

export default LogoBanner;
