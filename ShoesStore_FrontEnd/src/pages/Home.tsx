import Footer from "@/components/footer/Footer";
import BrandSection from "@/components/home/BrandSection";
import CategorySection from "@/components/home/CategorySection";
import HeroSection from "@/components/home/HeroSection";
import TrendingSection from "@/components/home/TrendingSection";

function Home() {
  return (
    <div>
      <HeroSection />
      <BrandSection />
      <CategorySection />
      <TrendingSection />
      <Footer />
    </div>
  );
}

export default Home;
