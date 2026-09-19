# UI Polish — Deferred Follow-Ups

Date: 2026-09-19
Source: final whole-branch review of `worktree-ui-polish`
Parent spec: `2026-09-19-ui-polish-design.md`
Parent plan: `../plans/2026-09-19-ui-polish.md`

The UI polish branch shipped its 8 planned tasks. The final whole-branch
review surfaced work that was deliberately deferred rather than bolted onto
that branch. Each item below is real and was consciously postponed — none of
it is a discovered bug in what shipped.

## 1. Site-wide rollout to cart, checkout and footer (largest gap)

The design spec's §"Site-wide rollout" named the PDP buy box, cart page,
checkout page and footer. The implementation plan narrowed this to the PLP
controls without recording the narrowing, so the following still carry the
pre-polish "loud" treatment:

- `frontend/src/components/home/SiteFooter.tsx:26` — full-bleed `bg-blue`
  slab on every page. The branch removed the equivalent solid blue bar from
  the header, so this is now the loudest element on the site.
- Solid lime accents: `frontend/src/app/cart/page.tsx:75`,
  `frontend/src/app/checkout/page.tsx` (~155, 239, 329, 429),
  `frontend/src/components/cart/CartToast.tsx:36`,
  `frontend/src/components/home/Newsletter.tsx:12`, and the two header cart
  badges in `SiteHeader.tsx`.

Consequence: the spec's principle #2 ("brand colour appears in at most 1-2
deliberate places per view") holds on the homepage, PLP and PDP, but not on
`/cart` or `/checkout`. Restyling the footer is a visible brand-level
decision and deserves its own design pass.

## 2. Radius convention sweep

Task 7 converted 9 controls across 4 PLP files. Branch-wide there remain ~49
`rounded-lg` occurrences across ~24 files, so a few views are now less
internally uniform than before. Candidates: `plp/ActiveFilters.tsx` (chips —
arguably should be `rounded-full` per the convention), `ProductCardSkeleton`,
`pdp/Gallery`, `pdp/AddToCartPanel`, and `home/ProductCard.tsx:157` (its
button is `rounded-lg` while the PLP buttons are now `rounded-xl`).
The reviewer's suggestion — change `ui/button.tsx`'s base radius once — would
carry most of the tail, but it is a design decision, not a mechanical edit.

## 3. Type-scale floor only half-applied

Spec principle #1 asked for a ~13px floor. Task 4 raised the ProductCard
brand/title text, but micro-labels remain below it: `ProductCard.tsx:87`
badge (`text-[10px]`), `ProductCard.tsx:142` countdown (`text-[11px]`),
`SiteHeader.tsx` cart badges (`text-[10px]`), `pdp/Reviews.tsx:69`.
Either raise them or amend the principle to "body/content type floor".
Related: `ProductCard.tsx:117` uses an off-scale `sm:text-[15px]`.

## 4. Two spec bullets not implemented

- "Enlarge product image area" (spec §ProductCard) — the image is still
  `aspect-square`, unchanged. Only the type half of "whitespace does the
  premium work" shipped. (The sibling bullet, increasing `--card-spacing`,
  WAS implemented in the fix wave.)

## 5. PromoStrip polish

`frontend/src/components/home/PromoStrip.tsx` matches its plan text exactly,
so these are design notes rather than defects:

- 24px (`size-6`) dismiss button is at the WCAG 2.2 AA minimum but out of
  step with the project's own `min-h-11`/`size-11` norm used everywhere else.
- `truncate` on the joined offer string hides the second message at phone
  widths — the single-line concatenation doesn't degrade well.
- The third offer message ("New Arrivals dropping every week") was dropped
  in the migration from the old marquee.
- Dismissal is in-memory only, so the strip returns on every full page load.
- Safe-area: `viewport.viewportFit` is `"cover"` and `globals.css` gives
  `.mobile-site-header` a `padding-top: env(safe-area-inset-top)`. PromoStrip
  now sits above the header, so the strip is the element under the notch
  while the header's inset renders as a mid-page gap. Zero impact in portrait
  mobile Safari; visible in standalone/landscape. Cheap fix: move the inset
  to `body` or onto the strip.

## 6. Smaller items

- `plp/FiltersSkeleton.tsx` placeholders are `h-9` while the real inputs in
  `Filters.tsx` are `h-11` — same "skeleton doesn't match content" family as
  the radius mismatch that WAS fixed; height was outside that fix's scope.
- `SiteHeader.tsx` nav: hovering the *currently active* link may let
  `hover:text-foreground` win over `aria-[current=page]:text-primary`
  depending on Tailwind's variant emission order. Cosmetic edge case; the
  resting active state is correctly differentiated.
- `globals.css` elevation-token comment says "tinted with brand ink instead
  of pure black", but `ui/card.tsx` pairs the token with `ring-black/[0.04]`.
- Worth a visual sanity check: the Card definition net-decreased (ring went
  `foreground/10` → `black/4%`, and `shadow-soft` is only 3-4% alpha), so on
  the `bg-cloud` page background cards may read as *less* separated than
  before, not more.
- The Hero ≤340px clipping risk was never reproduced in a browser — the
  guard shipped is `max-[340px]:` based on box-model math only. Worth one
  real check on a 320px device.
