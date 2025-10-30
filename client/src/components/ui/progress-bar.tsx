import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
  color?: "primary" | "secondary" | "green" | "blue" | "purple";
  animated?: boolean;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className, 
  showValue = false, 
  color = "primary",
  animated = true 
}: ProgressBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value, animated]);

  const percentage = Math.min(Math.max((animatedValue / max) * 100, 0), 100);
  
  const colorClasses = {
    primary: "bg-gradient-to-r from-primary to-primary/80",
    secondary: "bg-gradient-to-r from-secondary to-secondary/80", 
    green: "bg-gradient-to-r from-green-500 to-green-400",
    blue: "bg-gradient-to-r from-blue-500 to-blue-400",
    purple: "bg-gradient-to-r from-purple-500 to-purple-400"
  };

  return (
    <div className={cn("relative", className)}>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-1000 ease-out rounded-full",
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="text-sm text-gray-600 mt-1 text-right">
          {Math.round(animatedValue)}{max === 100 ? "%" : `/${max}`}
        </div>
      )}
    </div>
  );
}

interface SkillProgressProps {
  skill: string;
  level: number;
  icon?: React.ReactNode;
}

export function SkillProgress({ skill, level, icon }: SkillProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <div className="text-[#FF6B35]">{icon}</div>}
          <span className="text-sm font-medium text-gray-900">{skill}</span>
        </div>
        <span className="text-sm text-gray-600">{level}%</span>
      </div>
      <ProgressBar value={level} color="primary" />
    </div>
  );
}
