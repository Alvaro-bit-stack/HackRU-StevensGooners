import SetupInstructions from "@/app/components/SetupInstructions";
import CourseIdHelper from "@/app/components/CourseIdHelper";
import CanvasAIAssistant from "@/app/components/CanvasAIAssistant";

export default function ExtensionPage() {
    return (
        <div className="container mx-auto px-4">
        <SetupInstructions />
        <CourseIdHelper />
        <CanvasAIAssistant />
        </div>
    )
}