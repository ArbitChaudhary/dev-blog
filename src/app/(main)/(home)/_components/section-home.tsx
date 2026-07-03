import { HeroSlider } from "./hero-slider";
import { LatestSection } from "./latest-section";
import { TrendingSection } from "./trending-section";
import { NewsletterCta } from "./newsletter-cta";
import { Footer } from "./footer";
import { featuredPosts } from "../_lib/mock-home-data";

function SectionHome() {
  return (
    <>
      <HeroSlider posts={featuredPosts} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-20">
          <LatestSection />
        </div>

        <div className="py-12 md:py-20">
          <TrendingSection />
        </div>

        <div className="py-12 md:py-20">
          <NewsletterCta />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default SectionHome;
