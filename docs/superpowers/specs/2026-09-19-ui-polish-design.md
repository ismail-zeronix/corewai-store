# CoreWAI Supply — Site-Wide UI Polish (Design)

Date: 2026-09-19
Status: Approved
Scope: `frontend/` (Next.js 16 + Tailwind v4 + shadcn/base-ui storefront)

## Problem

The storefront's visual language reads as a generic marketplace template:
dense micro-typography (10–11px text throughout), flat cards (ring-only,
no elevation), and simultaneous full-saturation use of every brand color
(blue nav bar + lime marquee + lime "Deals" label + lime/cyan badges +
amber ratings all firing on one screen). The goal is a "clean premium
minimal" feel — comparable to Apple/Muji-adjacent calm retail — without
changing the brand palette or typefaces, and without introducing new
subsystems. This is a refinement of an existing, working design system,
applied consistently across every page.

## Non-goals

- No palette changes (brand blue/cyan/lime/navy/cloud tokens stay as-is).
- No font changes (Inter display / Manrope body pairing stays).
- No new pages, routes, or backend/API changes.
- No new automated UI test suite (none exists today; verification is
  manual + lint/build).

## Design principles

1. **Whitespace does the premium work.** Raise the type-size floor from
   ~10–11px to a 13px minimum, and loosen spacing rhythm between
   sections and within cards.
2. **Brand color is an accent, not wallpaper.** Neutral surfaces
   (white/cloud/mist) carry the page. Brand color appears in at most
   1–2 deliberate places per view (primary CTA, one accent badge),
   not simultaneously across nav, ticker, labels, and badges.
3. **One consistent elevation system.** Replace the current mix of
   ring-only cards, ad hoc borders, and inconsistent radii with a
   single small shadow scale and a fixed radius convention, applied
   everywhere rather than invented per component.

## System-level changes

### Tokens (`globals.css`)

- Add two shadow custom properties: a resting/soft shadow and an
  elevated/hover shadow, for use in place of ad hoc `ring-*` /
  `shadow-*` combinations scattered per component.
- Radius convention (apply consistently, stop mixing per component):
  - `rounded-xl` — cards, inputs, standard containers
  - `rounded-2xl` — hero/media blocks
  - `rounded-full` — pills, avatars, badges only

### `components/ui/card.tsx`

- Resting state: `shadow-xs ring-1 ring-black/[0.04]` instead of the
  current `ring-1 ring-foreground/10` with no shadow.
- Interactive cards (product cards): add `hover:shadow-md` transition.
- Slightly increase the default `--card-spacing`.

### Badges (`ProductCard.tsx` and anywhere `badgeStyles` is used)

- Desaturate solid-fill badges (`bg-lime`, `bg-cyan`, `bg-amber`) to
  tinted-background/dark-text pairs (e.g. `bg-primary/10 text-primary`),
  so badges read as refined labels rather than neon stickers.
- Keep exactly one solid-fill "loud" badge treatment reserved for
  Best Seller — everything else uses the tinted style.

## Component-level changes

### `SiteHeader.tsx`

- Remove the solid blue category bar and the animated lime marquee
  ticker — these are the loudest, most template-like elements on the
  page.
- Replace with a single clean white/cloud nav row: logo, search,
  plain-text nav links (no pill backgrounds required), cart icon.
- "All Categories" trigger becomes a subtle outline/ghost button
  instead of a white pill sitting on a solid blue bar.
- Promo messaging (flash sale, free shipping) moves to a slim,
  dismissible top strip above the header, replacing the permanent
  auto-scrolling marquee.

### `Hero.tsx`

- Increase heading scale beyond the current desktop cap of `text-3xl`;
  give the headline real breathing room.
- Simplify the image overlay gradient; reduce eyebrow-label + CTA
  stacking so one large image and confident type carry the section
  instead of competing decorative elements.

### `ProductCard.tsx`

- Enlarge product image area and body type (remove 11–13px
  micro-type sizes).
- Apply the new card shadow/hover treatment (see Tokens above).
- Apply the desaturated badge treatment (see Badges above).
- Add-to-cart button: switch resting state to `secondary`/outline,
  keeping `primary` emphasis on price — reduces "every element is a
  blue button" sameness across a full grid. (Judgment call — revisit
  if it reads as less actionable in practice.)

### Site-wide rollout

Apply the same shadow/radius/badge/type-scale rules established above
to: PLP filters (`components/plp/*`), PDP gallery and buy box
(`components/pdp/*`, `product/[slug]/page.tsx`), cart (`cart/page.tsx`),
checkout (`checkout/page.tsx`), and footer (`SiteFooter.tsx`). No new
visual patterns are introduced per page — this is the same system
applied consistently, not bespoke redesigns of each page.

## Testing / verification plan

- Manual visual pass on desktop and mobile viewports for: home,
  category/PLP, PDP, cart, checkout, search.
- `npm run lint` and `npm run build` in `frontend/` to catch
  regressions.
- No new automated UI tests are being introduced (none exist in this
  repo today); verification is manual + lint/build, consistent with
  current project practice.

## Open judgment calls (flagged, not blocking)

- Add-to-cart button resting variant (secondary/outline vs. keeping
  primary fill) — implementer should sanity-check readability/CTR
  intuition during implementation and can revert to primary fill if
  it looks under-emphasized.
