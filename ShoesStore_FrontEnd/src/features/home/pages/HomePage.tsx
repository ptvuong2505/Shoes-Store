import HomeFooter from "@/features/home/components/HomeFooter";
import BrandSection from "@/features/home/components/BrandSection";
import CategorySection from "@/features/home/components/CategorySection";
import HeroSection from "@/features/home/components/HeroSection";
import TrendingSection from "@/features/home/components/TrendingSection";

function HomePage() {
  return (
    <div>
      <HeroSection />
      <BrandSection />
      <CategorySection />
      <TrendingSection />
      <HomeFooter />
    </div>
  );
}

export default HomePage;
