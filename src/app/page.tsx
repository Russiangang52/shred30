import { Footer } from "@/components/plan/footer";
import { GoalSection } from "@/components/plan/goal";
import { Header } from "@/components/plan/header";
import { Hero } from "@/components/plan/hero";
import { NutritionSection } from "@/components/plan/nutrition";
import { RulesSection } from "@/components/plan/rules";
import { TrackerSection } from "@/components/plan/tracker";
import { TrainingSection } from "@/components/plan/workouts";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <GoalSection />
        <NutritionSection />
        <TrainingSection />
        <RulesSection />
        <TrackerSection />
      </main>
      <Footer />
    </div>
  );
}
