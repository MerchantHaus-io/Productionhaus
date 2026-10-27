# Partner Logos

Logos shown in the "Integrations & Partnerships" banner on the homepage
(`src/components/LogoBanner.tsx`).

## Conventions

- `<name>.webp` / `<name>.svg` is the logo for **light** backgrounds.
- `<name>-on-dark.webp` / `<name>-on-dark.svg` is an optional version for
  **dark** mode. Add one whenever the logo has a black, charcoal or other
  dark wordmark that would disappear on a dark background (the banner swaps
  it in with Tailwind's `dark:` classes).
- Trim transparent padding so the file's edges are the logo's edges. The
  banner sizes each logo from its aspect ratio, so padding makes it look
  smaller than its neighbours.
- Raster logos are lossless WebP, at most 600×180 px (sharp at 3× for the
  roughly 160×50 CSS px they render at).

## Adding a logo

1. Add the trimmed file (and an `-on-dark` version if needed) here.
2. Add an entry to the `logos` array in `LogoBanner.tsx` with `file`,
   optional `darkFile`, `name`, and the file's pixel `width` and `height`.
