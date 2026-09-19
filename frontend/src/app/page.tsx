import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FaqAndSearches } from "@/components/home/FaqAndSearches";
import { Newsletter } from "@/components/home/Newsletter";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { getProducts } from "@/lib/vendure/products";

/**
 * The homepage ran twelve stacked sections over a five-product catalogue, so the same
 * five products appeared three times (Featured Products, Today's Deals, Recommended For
 * You) alongside a brand strip of logos with nothing behind them, fabricated promo
 * banners, a "shoppable setups" grid and a hardcoded brand campaign.
 *
 * What is left is the set that stays true at five products and still works at five
 * hundred: what the store is, why to trust it, how to browse it, what is in it, and the
 * answers people actually ask. Each section removes itself when it has no content.
 */
export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <main id="main-content" tabIndex={-1} className="flex-1">
        <Hero />
        <TrustStrip />
        <FeaturedCategories />
        <FeaturedProducts products={products} />
        <FaqAndSearches />
        <Newsletter />
      </main>

      <WhatsAppButton />
    </>
  );
}
