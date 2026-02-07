import { useState, useEffect } from "react";
import { IntroPage } from "@/app/components/IntroPage";
import { DevelopmentIntro } from "@/app/components/DevelopmentIntro";
import { HeartLabeling } from "@/app/components/HeartLabeling";
import { SeptationTransition } from "@/app/components/SeptationTransition";
import { InteractiveDevelopment } from "@/app/components/InteractiveDevelopment";
import { InteractiveHemodynamics } from "@/app/components/InteractiveHemodynamics";
import { ClinicalPresentation } from "@/app/components/ClinicalPresentation";
import { ClinicalVignettes } from "@/app/components/ClinicalVignettes";
import { NavigationHeader } from "@/app/components/NavigationHeader";
import { SectionWrapper } from "@/app/components/SectionWrapper";
import { DocumentHead } from "@/app/components/DocumentHead";
import { CompletionCelebration } from "@/app/components/CompletionCelebration";
import { useProgress } from "@/app/hooks/useProgress";
import { cn } from "@/lib/utils";

export default function App() {
  const {
    completedSections,
    currentSection,
    markSectionComplete,
    setCurrentSectionId,
    resetProgress,
  } = useProgress();

  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [showCompletion, setShowCompletion] = useState(false);

  const allSections = [
    "intro",
    "development-intro",
    "heart-labeling",
    "septation-transition",
    "interactive-development",
    "hemodynamics",
    "clinical-presentation",
    "clinical-vignettes"
  ];

  // Check if all sections are complete
  useEffect(() => {
    const allComplete = allSections.every((section) =>
      completedSections.includes(section)
    );
    if (allComplete && completedSections.length === allSections.length) {
      setShowCompletion(true);
    }
  }, [completedSections]);

  const handleNavigate = (sectionId: string) => {
    setCurrentSectionId(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleSectionVisible = (sectionId: string) => {
    setCurrentSectionId(sectionId);
  };

  const handleSectionComplete = (sectionId: string) => {
    markSectionComplete(sectionId);
  };

  return (
    <div className={cn("min-h-screen bg-[#0F172A]", `font-size-${fontSize}`)}>
      <DocumentHead />
      <NavigationHeader
        currentSection={currentSection}
        completedSections={completedSections}
        onNavigate={handleNavigate}
        onResetProgress={resetProgress}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

      {/* Add padding-top to account for fixed header */}
      <div className="pt-20">
        <SectionWrapper
          id="intro"
          onVisible={handleSectionVisible}
          onComplete={handleSectionComplete}
          nextSectionId="development-intro"
          nextSectionName="Development Timeline"
          showNextButton={false}
        >
          <IntroPage onBeginClick={() => handleNavigate("development-intro")} />
        </SectionWrapper>

        <SectionWrapper
          id="development-intro"
          onVisible={handleSectionVisible}
          onComplete={handleSectionComplete}
          nextSectionId="heart-labeling"
          nextSectionName="Heart Labeling"
        >
          <DevelopmentIntro />
        </SectionWrapper>

        <SectionWrapper
          id="heart-labeling"
          onVisible={handleSectionVisible}
          onComplete={handleSectionComplete}
          nextSectionId="septation-transition"
          nextSectionName="Septation Overview"
          showNextButton={false}
        >
          <HeartLabeling onComplete={() => markSectionComplete("heart-labeling")} />
        </SectionWrapper>

        <SectionWrapper
          id="septation-transition"
          onVisible={handleSectionVisible}
          onComplete={handleSectionComplete}
          nextSectionId="interactive-development"
          nextSectionName="Interactive Development"
        >
          <SeptationTransition />
        </SectionWrapper>

        <SectionWrapper
          id="interactive-development"
          onVisible={handleSectionVisible}
          onComplete={handleSectionComplete}
          nextSectionId="hemodynamics"
          nextSectionName="Hemodynamics"
          showNextButton={false}
        >
          <InteractiveDevelopment
            onComplete={() => markSectionComplete("interactive-development")}
          />
        </SectionWrapper>

        <SectionWrapper
          id="hemodynamics"
          onVisible={handleSectionVisible}
          onComplete={handleSectionComplete}
          nextSectionId="clinical-presentation"
          nextSectionName="Clinical Presentation"
          showNextButton={false}
        >
          <InteractiveHemodynamics
            onComplete={() => markSectionComplete("hemodynamics")}
          />
        </SectionWrapper>

        <SectionWrapper
          id="clinical-presentation"
          onVisible={handleSectionVisible}
          onComplete={handleSectionComplete}
          nextSectionId="clinical-vignettes"
          nextSectionName="Clinical Vignettes"
        >
          <ClinicalPresentation />
        </SectionWrapper>

        <SectionWrapper
          id="clinical-vignettes"
          onVisible={handleSectionVisible}
          onComplete={handleSectionComplete}
          showNextButton={false}
        >
          <ClinicalVignettes onComplete={() => markSectionComplete("clinical-vignettes")} />
        </SectionWrapper>
      </div>

      {showCompletion && (
        <CompletionCelebration
          onClose={() => setShowCompletion(false)}
          onRestart={() => {
            resetProgress();
            setShowCompletion(false);
            handleNavigate("intro");
          }}
        />
      )}
    </div>
  );
}