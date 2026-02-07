import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Menu, X, ChevronDown, RotateCcw, Type } from "lucide-react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  name: string;
  shortName: string;
}

const sections: Section[] = [
  { id: "intro", name: "Introduction", shortName: "Intro" },
  { id: "development-intro", name: "Development Timeline", shortName: "Timeline" },
  { id: "heart-labeling", name: "Heart Labeling", shortName: "Labeling" },
  { id: "septation-transition", name: "Septation Overview", shortName: "Septation" },
  { id: "interactive-development", name: "Interactive Development", shortName: "Development" },
  { id: "hemodynamics", name: "Cardiac Catheterization", shortName: "Hemodynamics" },
  { id: "clinical-presentation", name: "Clinical Presentation", shortName: "Clinical" },
  { id: "clinical-vignettes", name: "Clinical Vignettes", shortName: "Vignettes" },
];

interface NavigationHeaderProps {
  currentSection: string;
  completedSections: string[];
  onNavigate: (sectionId: string) => void;
  onResetProgress: () => void;
  fontSize: "small" | "medium" | "large";
  onFontSizeChange: (size: "small" | "medium" | "large") => void;
}

export function NavigationHeader({
  currentSection,
  completedSections,
  onNavigate,
  onResetProgress,
  fontSize,
  onFontSizeChange,
}: NavigationHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentIndex = sections.findIndex((s) => s.id === currentSection);
  const progress = ((completedSections.length) / sections.length) * 100;

  return (
    <>
      {/* Sticky Navigation Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-[#0F172A]/95 backdrop-blur-md shadow-lg border-b border-slate-700/50"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => onNavigate("intro")}
              className="text-xl font-bold text-[#E2E8F0] hover:text-blue-400 transition-colors"
            >
              EAST
            </button>

            {/* Desktop Progress Dots */}
            <nav className="hidden lg:flex items-center gap-2">
              {sections.map((section, index) => {
                const isCompleted = completedSections.includes(section.id);
                const isCurrent = section.id === currentSection;

                return (
                  <button
                    key={section.id}
                    onClick={() => onNavigate(section.id)}
                    className="group relative flex flex-col items-center"
                    aria-label={section.name}
                  >
                    {/* Dot */}
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300",
                        isCurrent
                          ? "bg-blue-500 ring-4 ring-blue-500/30 scale-125"
                          : isCompleted
                          ? "bg-emerald-500"
                          : "bg-slate-600 hover:bg-slate-500"
                      )}
                    />

                    {/* Connector Line */}
                    {index < sections.length - 1 && (
                      <div
                        className={cn(
                          "absolute left-full top-1/2 -translate-y-1/2 w-8 h-0.5 transition-colors",
                          isCompleted ? "bg-emerald-500" : "bg-slate-600"
                        )}
                      />
                    )}

                    {/* Tooltip */}
                    <div className="absolute top-full mt-2 px-3 py-1 bg-slate-800 text-[#E2E8F0] text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-slate-700">
                      {section.name}
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Font Size Control */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFontMenu(!showFontMenu)}
                  className="hidden md:flex items-center gap-2 text-[#94A3B8] hover:text-[#E2E8F0]"
                  aria-label="Font size"
                >
                  <Type className="w-4 h-4" />
                  <ChevronDown className="w-3 h-3" />
                </Button>

                {showFontMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-[#1E293B] border border-slate-700 rounded-lg shadow-xl overflow-hidden min-w-[140px]">
                    {(["small", "medium", "large"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          onFontSizeChange(size);
                          setShowFontMenu(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left transition-colors",
                          fontSize === size
                            ? "bg-blue-500/20 text-blue-400"
                            : "text-[#94A3B8] hover:bg-slate-700/50"
                        )}
                      >
                        {size === "small" && "A- Small"}
                        {size === "medium" && "A Medium"}
                        {size === "large" && "A+ Large"}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Progress */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetProgress}
                className="hidden md:flex items-center gap-2 text-[#94A3B8] hover:text-[#E2E8F0]"
                aria-label="Reset progress"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden text-[#E2E8F0]"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-[73px] bg-[#0F172A]/98 backdrop-blur-md z-40 lg:hidden overflow-y-auto">
          <div className="max-w-md mx-auto px-6 py-8">
            <div className="space-y-2">
              {sections.map((section) => {
                const isCompleted = completedSections.includes(section.id);
                const isCurrent = section.id === currentSection;

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      onNavigate(section.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3",
                      isCurrent
                        ? "bg-blue-500/20 border border-blue-500/50 text-blue-400"
                        : isCompleted
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                        : "bg-slate-800/50 border border-slate-700/50 text-[#94A3B8] hover:bg-slate-700/50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        isCurrent
                          ? "bg-blue-500"
                          : isCompleted
                          ? "bg-emerald-500"
                          : "bg-slate-600"
                      )}
                    />
                    <span>{section.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Controls */}
            <div className="mt-8 pt-8 border-t border-slate-700/50 space-y-3">
              <div>
                <p className="text-[#94A3B8] text-sm mb-2">Font Size</p>
                <div className="flex gap-2">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => onFontSizeChange(size)}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-lg text-sm transition-colors",
                        fontSize === size
                          ? "bg-blue-500/20 border border-blue-500/50 text-blue-400"
                          : "bg-slate-800/50 border border-slate-700/50 text-[#94A3B8]"
                      )}
                    >
                      {size === "small" && "A-"}
                      {size === "medium" && "A"}
                      {size === "large" && "A+"}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={onResetProgress}
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Progress
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
