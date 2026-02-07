import { useEffect, useRef, ReactNode } from "react";
import { Button } from "@/app/components/ui/button";
import { ChevronRight } from "lucide-react";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  onVisible?: (id: string) => void;
  onComplete?: (id: string) => void;
  nextSectionId?: string;
  nextSectionName?: string;
  showNextButton?: boolean;
}

export function SectionWrapper({
  id,
  children,
  onVisible,
  onComplete,
  nextSectionId,
  nextSectionName,
  showNextButton = true,
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            onVisible?.(id);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [id, onVisible]);

  const scrollToNext = () => {
    if (nextSectionId) {
      onComplete?.(id);
      const nextElement = document.getElementById(nextSectionId);
      if (nextElement) {
        nextElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div id={id} ref={sectionRef} className="relative">
      {children}

      {/* Next Section Button */}
      {showNextButton && nextSectionId && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <Button
            onClick={scrollToNext}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-6 rounded-xl shadow-2xl border border-blue-500/50 group"
          >
            <span className="mr-2">Continue to {nextSectionName || "Next Section"}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
}
