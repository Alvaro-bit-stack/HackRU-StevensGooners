import Navbar from "@/app/components/navbar";
import HeroSection from "@/app/components/HeroSection";
import GetGrades from "@/app/components/GetGrades";


export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <GetGrades />
    </div>    
  );
}