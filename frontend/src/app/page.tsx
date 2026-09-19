import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { PromoBanners } from "@/components/home/PromoBanners";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { LenovoWorkstations } from "@/components/home/LenovoWorkstations";
import { BrandStrip } from "@/components/home/BrandStrip";
import { TrustStrip } from "@/components/home/TrustStrip";
import { TodaysDeals } from "@/components/home/TodaysDeals";
import { Newsletter } from "@/components/home/Newsletter";
import { ShoppableSetups } from "@/components/home/ShoppableSetups";
import { FaqAndSearches } from "@/components/home/FaqAndSearches";
import { SiteFooter } from "@/components/home/SiteFooter";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { getProducts } from "@/lib/vendure/products";

export default async function Home() {
  const products = await getProducts();

  return (
    <>

      <main id="main-content" tabIndex={-1} className="flex-1">
        <Hero />
        <TrustStrip />
        <FeaturedCategories />
        <FeaturedProducts products={products} />
        <BrandStrip />
        <TodaysDeals products={products} />
        <PromoBanners />
        <ProductCarousel products={products} />
        <LenovoWorkstations />
        <ShoppableSetups />
        <FaqAndSearches />
        <Newsletter />
      </main>

      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
