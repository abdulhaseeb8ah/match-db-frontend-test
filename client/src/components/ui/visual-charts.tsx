import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface VisualBarChartProps {
  data: DataPoint[];
  className?: string;
  animated?: boolean;
  showValues?: boolean;
}

export function VisualBarChart({ data, className, animated = true, showValues = true }: VisualBarChartProps) {
  const [animatedData, setAnimatedData] = useState(data.map(d => ({ ...d, value: 0 })));
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedData(data);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setAnimatedData(data);
    }
  }, [data, animated]);

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={cn("space-y-4", className)}>
      {animatedData.map((item, index) => {
        const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">{item.label}</span>
              {showValues && (
                <span className="text-sm text-gray-600">{item.value}</span>
              )}
            </div>
            <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-1000 ease-out rounded-full",
                  item.color || "bg-gradient-to-r from-primary to-primary/80"
                )}
                style={{ width: `${height}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface VisualStatCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function VisualStatCard({ title, value, change, trend, icon, className }: VisualStatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className={cn(
      "p-6 rounded-xl bg-gradient-to-br from-background to-muted/30 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-[#FF6B35]">{icon}</div>}
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {change !== undefined && (
          <div className={cn("flex items-center text-sm font-medium", getTrendColor())}>
            {getTrendIcon()}
            <span className="ml-1">
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
