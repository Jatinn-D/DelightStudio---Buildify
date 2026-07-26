import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NewArrivals from "@/components/NewArrivals";
import BentoCategories from "@/components/BentoCategories";
import WhyDelightStudio from "@/components/WhyDelightStudio";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <NewArrivals />
        <BentoCategories />
        <WhyDelightStudio />
      </main>
      <Footer />
    </>
  );
}
