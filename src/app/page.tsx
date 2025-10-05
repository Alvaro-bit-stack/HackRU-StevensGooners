import Navbar from "@/app/components/navbar";
import HeroSection from "@/app/components/HeroSection";
import GetGrades from "@/app/components/GetGrades";
import CanvasAIAssistant from "@/app/components/CanvasAIAssistant";
import CourseIdHelper from "@/app/components/CourseIdHelper";
import SetupInstructions from "@/app/components/SetupInstructions";


export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <GetGrades />
    </div>    
  );
}