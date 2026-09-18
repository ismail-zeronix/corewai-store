This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Storefront UI

- Cart notifications are shared across product cards and product detail pages. They dismiss after five seconds and pause while hovered or focused.
- Mobile filters use a bottom sheet; selected filters can also be removed above the product grid.
- WhatsApp links appear only when `NEXT_PUBLIC_WHATSAPP_NUMBER` is set to a real international number (digits only) in `.env.local`. Restart the development server after changing it.
- Account, wishlist, newsletter signup, app downloads, and unfinished footer destinations are hidden until those features are implemented. The homepage instead links to new arrivals.
- Product reviews are labeled as sample content. Review submission is unavailable until it has a working backend.
- Payment integration is unchanged.

UI checks: run `npm run lint` and `npm run build`. Browser checks should cover narrow phones, tablets and desktop widths, keyboard focus, search, filters and price validation, cart notifications, and shipping form validation. Do not place an order as part of a UI-only check.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
