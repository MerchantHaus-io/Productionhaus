/**
 * Card-present device catalog data.
 *
 * Sourced from the Merchant Haus device catalog. Processor lists mirror the
 * catalog exactly, including its "+N more" summaries where the full list is
 * not published — confirm exact configurations before ordering.
 */

export type DeviceSpec =
  | { label: string; value: string; pending?: boolean }
  | { label: string; badges: string[] };

export type Device = {
  name: string;
  slug: string;
  manufacturer: string;
  description: string;
  image: string | null;
  imageAlt: string | null;
  specs: DeviceSpec[];
  highlights: string[];
  useCases: string[];
  notes: string | null;
};

export type DeviceCategory = {
  id: string;
  title: string;
  description: string;
  devices: Device[];
};

/** A matrix cell: true = supported, false/null = not applicable or unconfirmed, string = free text. */
export type MatrixCell = boolean | string | null;

export type MatrixRow =
  | { category: string }
  | { device: string; cells: MatrixCell[] };

export type Stat = { value: string; label: string };

export const HERO_STATS: Stat[] = [
  { value: "12", label: "Supported devices" },
  { value: "4", label: "Form factors" },
  { value: "6", label: "Manufacturers" },
  { value: "175+", label: "Processor connections" },
  { value: "1", label: "Account" },
];

export const DEVICE_CATEGORIES: DeviceCategory[] = [
  {
    id: "countertop",
    title: "Countertop",
    description:
      "Traditional in-store PIN pads for retail and hospitality counters. Broad processor coverage and a proven cloud integration — the quickest way to start taking cards at the till if you are already boarded with us.",
    devices: [
      {
        name: "Lane/3600",
        slug: "lane-3600",
        manufacturer: "Ingenico",
        description:
          "Next-generation compact countertop PIN pad. PCI PTS v6 certified — the current standard for card-present security compliance.",
        image: "/device-images/lane-3600.webp",
        imageAlt: "Ingenico Lane/3600 compact countertop PIN pad",
        specs: [
          { label: "Form", value: "Compact countertop PIN pad" },
          { label: "Integration", value: "Cloud API" },
          { label: "Processors", badges: ["First Data Rapid Connect", "TSYS Sierra"] },
        ],
        highlights: [
          "PCI PTS v6 certified",
          "Cloud API integration",
        ],
        useCases: [
          "High-volume retail with limited counter space",
          "Restaurant POS integration",
          "Counters already running on our cloud API",
        ],
        notes: null,
      },
      {
        name: "Lane/7000 Deluxe",
        slug: "lane-7000-deluxe",
        manufacturer: "Ingenico",
        description:
          "Large-touchscreen premium countertop terminal. Full-color signature capture and an engaging customer-facing display — a fit for higher-ticket retail and restaurant environments.",
        image: "/device-images/lane-7000-deluxe.webp",
        imageAlt: "Lane/7000 Deluxe premium countertop terminal",
        specs: [
          { label: "Form", value: "Premium countertop, large touchscreen" },
          { label: "Integration", value: "Cloud API" },
          { label: "Processors", badges: ["Chase Paymentech Tampa", "Elavon viaConex", "+3 more"] },
        ],
        highlights: [
          "5\" capacitive colour touchscreen",
          "Signature capture and on-device prompts",
          "Ethernet + Wi-Fi",
          "Plug-and-play upgrade for Lane/7000 Cloud",
          "Support commitment through 2032+",
          "PCI PTS v6 compliant",
        ],
        useCases: [
          "Full-service restaurants (signature capture at table)",
          "Higher-ticket retail with rich customer prompts",
          "Upgrading from the discontinued Lane/7000 Cloud",
        ],
        notes: "List price $999.99. Ask us about current availability and lead times.",
      },
    ],
  },
  {
    id: "smartpos",
    title: "SmartPOS",
    description:
      "Android all-in-one terminals that run your point-of-sale app and take payments on the same device. If you would rather not have a separate terminal taking up counter space, SmartPOS replaces both.",
    devices: [
      {
        name: "Axium SmartPOS",
        slug: "axium-smartpos",
        manufacturer: "Ingenico",
        description:
          "Android all-in-one SmartPOS terminal. Runs your point-of-sale app and takes payments on the same device — no second box to manage.",
        image: "/device-images/axium-smartpos.webp",
        imageAlt: "Ingenico Axium SmartPOS terminal",
        specs: [
          { label: "Form", value: "Android SmartPOS, all-in-one" },
          { label: "Integration", value: "Android SDK" },
          { label: "Processors", badges: ["Amex APACS", "Elavon EISOP", "+1 more"] },
        ],
        highlights: [
          "Native Android app + payments on one device",
          "Full merchant-facing display",
        ],
        useCases: [
          "Running your own POS app without a separate terminal",
          "Replacing a phone or tablet plus reader combo",
        ],
        notes: null,
      },
      {
        name: "Moneris GO",
        slug: "moneris-go",
        manufacturer: "Moneris",
        description:
          "Android all-in-one SmartPOS terminal. Availability and processor list pending — ask us for a firm timeline.",
        image: "/device-images/moneris-go.webp",
        imageAlt: "Moneris GO SmartPOS terminal",
        specs: [
          { label: "Form", value: "Android SmartPOS, all-in-one" },
          { label: "Integration", value: "Cloud API" },
          { label: "Processors", value: "Pending release", pending: true },
        ],
        highlights: [
          "Android SmartPOS with built-in printer",
        ],
        useCases: [
          "An all-in-one device with integrated receipt printing",
        ],
        notes: "Availability pending — timeline confirmation available on request.",
      },
    ],
  },
  {
    id: "mobile",
    title: "Mobile",
    description:
      "Handheld and portable card readers for field service, delivery, markets, and anywhere a countertop terminal doesn't fit. Includes dedicated readers and a countertop base for the ID TECH VP3350.",
    devices: [
      {
        name: "DUET",
        slug: "duet",
        manufacturer: "LANDI",
        description:
          "The LANDI M20 paired with the ID TECH VP3350 — an all-in-one mPOS combining the M20 host device with a dedicated card reader for chip, contactless, and magstripe.",
        image: "/device-images/duet.webp",
        imageAlt: "LANDI DUET all-in-one mPOS with ID TECH VP3350",
        specs: [
          { label: "Form", value: "All-in-one mPOS, paired reader" },
          { label: "Integration", value: "Android SDK" },
          { label: "Processors", badges: ["Elavon viaConex", "First Data Rapid Connect", "+2 more"] },
        ],
        highlights: [
          "LANDI M20 host + ID TECH VP3350 reader",
          "Full EMV / contactless / magstripe support",
        ],
        useCases: [
          "Field service technicians needing a durable mPOS",
          "Delivery and courier workflows",
        ],
        notes: null,
      },
      {
        name: "M20",
        slug: "m20",
        manufacturer: "LANDI",
        description:
          "Mobile contactless reader with a built-in printer, powered by Tap to Pay. Fits if you need a printed receipt without carrying a separate printer.",
        image: "/device-images/m20.webp",
        imageAlt: "LANDI M20 mobile contactless reader",
        specs: [
          { label: "Form", value: "Handheld, contactless, integrated printer" },
          { label: "Integration", value: "Android SDK" },
          { label: "Processors", badges: ["TSYS Sierra", "Shift4", "+1 more"] },
        ],
        highlights: [
          "Built-in printer",
          "Tap to Pay software layer",
        ],
        useCases: [
          "Table-side ordering with receipt printing",
          "Field service where a paper receipt matters",
        ],
        notes: null,
      },
      {
        name: "M20SE",
        slug: "m20se",
        manufacturer: "LANDI",
        description:
          "Mobile contactless reader powered by Tap to Pay. Same M20 platform, streamlined if you don't need the on-device printer.",
        image: "/device-images/m20se.webp",
        imageAlt: "LANDI M20SE mobile contactless reader",
        specs: [
          { label: "Form", value: "Handheld, contactless" },
          { label: "Integration", value: "Android SDK" },
          { label: "Processors", badges: ["TSYS Sierra", "Shift4", "+1 more"] },
        ],
        highlights: [
          "Same M20 platform, streamlined without the printer",
        ],
        useCases: [
          "Mobile trading without printed receipts",
          "Lower-cost mPOS deployments",
        ],
        notes: null,
      },
      {
        name: "VP3350",
        slug: "vp3350",
        manufacturer: "ID TECH",
        description:
          "All-in-one mobile reader supporting Bluetooth Low Energy, USB-C, and Lightning. Pairs with an iPhone or Android phone for a flexible mobile setup — our recommended reader for taking cards away from the counter.",
        image: "/device-images/vp3350.webp",
        imageAlt: "ID TECH VP3350 mobile card reader",
        specs: [
          { label: "Form", value: "Mobile reader (BLE / USB-C / Lightning)" },
          { label: "Integration", value: "Android SDK, iOS SDK" },
          { label: "Processors", badges: ["Elavon viaConex", "First Data Rapid Connect", "+2 more"] },
        ],
        highlights: [
          "BLE, USB-C, and Lightning connectivity",
          "Our recommended reader for card-present acceptance on the move",
        ],
        useCases: [
          "iOS and Android host device pairings",
          "Any mobile app that needs a reliable chip and tap reader",
        ],
        notes: null,
      },
      {
        name: "VP3350 Countertop",
        slug: "vp3350-countertop",
        manufacturer: "ID TECH",
        description:
          "The same VP3350 reader mounted in a weighted charging base — a low-cost countertop option that shares the same integration and processor coverage as the mobile form factor.",
        image: "/device-images/vp3350-countertop.webp",
        imageAlt: "ID TECH VP3350 mobile reader in countertop base",
        specs: [
          { label: "Form", value: "Countertop base with VP3350 reader" },
          { label: "Integration", value: "Android SDK, iOS SDK" },
          { label: "Processors", badges: ["Elavon viaConex", "First Data Rapid Connect", "+2 more"] },
        ],
        highlights: [
          "Weighted charging base for the VP3350 mobile reader",
        ],
        useCases: [
          "Low-cost countertop deployment where a full terminal isn't warranted",
        ],
        notes: "Shares the same integration and processor coverage as the mobile VP3350.",
      },
      {
        name: "Link/2500LE",
        slug: "link-2500le",
        manufacturer: "Ingenico",
        description:
          "Wireless mobile PIN pad with Wi-Fi connectivity. Handheld, with a full physical keypad — a fit if you want to take payment away from the till without giving up real keys.",
        image: "/device-images/link-2500le.webp",
        imageAlt: "Ingenico Link/2500 LE wireless mobile PIN pad",
        specs: [
          { label: "Form", value: "Wireless mobile PIN pad" },
          { label: "Integration", value: "Cloud API" },
          { label: "Processors", badges: ["Chase Paymentech Tampa", "Elavon viaConex", "+3 more"] },
        ],
        highlights: [
          "Wireless mobile PIN pad",
          "Wi-Fi connectivity",
          "Full physical keypad",
        ],
        useCases: [
          "In-store mobility (line-busting) with tactile key entry",
          "If you prefer physical keys to on-screen PIN entry",
        ],
        notes: null,
      },
    ],
  },
  {
    id: "softpos",
    title: "SoftPOS",
    description:
      "Software-only contactless acceptance — the phone in your pocket becomes the terminal. Nothing to buy, nothing to ship, and a real way to start taking cards today.",
    devices: [
      {
        name: "Tap to Pay on Android",
        slug: "tap-to-pay-on-android",
        manufacturer: "Mastercard",
        description:
          "Software-only SoftPOS on any NFC-enabled Android device. Powered by Mastercard's Cloud Commerce infrastructure — the fastest way to start if you already carry a compatible phone.",
        image: null,
        imageAlt: null,
        specs: [
          { label: "Form", value: "Software-only, NFC Android device" },
          { label: "Integration", value: "Manufacturer's SDK / API" },
          { label: "Processors", badges: ["TSYS Sierra", "Shift4", "+1 more"] },
        ],
        highlights: [
          "Software-only, no additional hardware",
          "Powered by Mastercard Cloud Commerce",
        ],
        useCases: [
          "Small businesses already carrying a compatible NFC Android phone",
          "Testing card acceptance before committing to hardware",
        ],
        notes: "Requires Google Pay or Samsung Pay wallet activation, and NFC enabled on your account.",
      },
      {
        name: "Tap to Pay on iPhone",
        slug: "tap-to-pay-on-iphone",
        manufacturer: "Apple",
        description:
          "Apple's native SoftPOS on iPhone. Contactless acceptance without any external reader — the iPhone itself is the terminal, with tap acceptance native to iOS.",
        image: null,
        imageAlt: null,
        specs: [
          { label: "Form", value: "Software-only, iPhone native" },
          { label: "Integration", value: "Manufacturer's SDK / API" },
          { label: "Processors", badges: ["TSYS Sierra", "First Data Rapid Connect"] },
        ],
        highlights: [
          "Software-only, no external reader",
        ],
        useCases: [
          "Businesses already working off an iPhone",
          "The fastest start — no hardware to buy",
        ],
        notes: "Requires Apple Pay activation, and NFC enabled on your account.",
      },
    ],
  },
];

export const MATRIX_HEADERS: string[] = [
  "Device",
  "Contactless",
  "Chip / EMV",
  "Magstripe",
  "Touchscreen",
  "PIN entry",
  "Printer",
  "Integration",
];

export const MATRIX_ROWS: MatrixRow[] = [
  { category: "Countertop" },
  { device: "Lane/3600", cells: [true, true, true, false, "Physical", false, "Cloud API"] },
  { device: "Lane/7000 Deluxe", cells: [true, true, true, true, "Digital", false, "Cloud API"] },
  { category: "SmartPOS" },
  { device: "Axium SmartPOS", cells: [true, true, true, true, "Digital", null, "Android SDK"] },
  { device: "Moneris GO", cells: [true, true, true, true, "Digital", true, "Cloud API"] },
  { category: "Mobile" },
  { device: "DUET", cells: [true, true, true, true, "Digital", false, "Android SDK"] },
  { device: "M20", cells: [true, null, null, true, "Digital", true, "Android SDK"] },
  { device: "M20SE", cells: [true, null, null, true, "Digital", false, "Android SDK"] },
  { device: "VP3350", cells: [true, true, true, false, null, false, "iOS + Android SDK"] },
  { device: "VP3350 Countertop", cells: [true, true, true, false, null, false, "iOS + Android SDK"] },
  { device: "Link/2500LE", cells: [true, true, true, true, "Physical", false, "Cloud API"] },
  { category: "SoftPOS" },
  { device: "Tap to Pay on Android", cells: [true, false, false, true, "Digital", false, "Manufacturer's SDK"] },
  { device: "Tap to Pay on iPhone", cells: [true, false, false, true, "Digital", false, "Manufacturer's SDK"] },
];

export const PLATFORM_STATS: Stat[] = [
  { value: "$502B+", label: "Annual payments volume" },
  { value: "1.2M+", label: "Merchants on platform" },
  { value: "235,000", label: "Connected devices" },
  { value: "175+", label: "Processor connections" },
  { value: "300+", label: "EMV device certifications" },
  { value: "6,000+", label: "Technology partners" },
];

export const TOTAL_DEVICES = DEVICE_CATEGORIES.reduce(
  (sum, category) => sum + category.devices.length,
  0
);
