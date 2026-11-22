/** The one primary call to action used across the home page, and its secondary. */
export const PRIMARY_CTA = {
  label: "Apply now",
  /* The merchant application in the Ops Terminal; the footer's "Apply now" uses the same URL. */
  href: "https://ops-terminal.merchant.haus/merchant-apply",
} as const;

export const SECONDARY_CTA = {
  label: "Send us a statement",
  href: "/#contact",
} as const;
