import { ReactNode } from "react";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClinicalPearlProps {
  children: ReactNode;
  variant?: "info" | "warning" | "tip";
  className?: string;
}

export function ClinicalPearl({ children, variant = "tip", className }: ClinicalPearlProps) {
  const variants = {
    info: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      icon: "text-blue-400",
      text: "text-blue-200"
    },
    warning: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      icon: "text-amber-400",
      text: "text-amber-200"
    },
    tip: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      icon: "text-emerald-400",
      text: "text-emerald-200"
    }
  };

  const style = variants[variant];

  return (
    <div className={cn(
      "rounded-xl p-5 border",
      style.bg,
      style.border,
      className
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("flex-shrink-0 mt-0.5", style.icon)}>
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className={cn("font-semibold mb-2", style.icon)}>
            {variant === "tip" && "Clinical Pearl"}
            {variant === "info" && "Key Concept"}
            {variant === "warning" && "Important Note"}
          </h4>
          <div className={cn("text-sm leading-relaxed", style.text)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
