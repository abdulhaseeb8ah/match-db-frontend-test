import { Database, Cloud, BarChart3, Shield, Zap, Globe, Cpu, Building, Factory, Heart, ShoppingCart, Gamepad2, DollarSign, Briefcase } from "lucide-react";

export const IndustryIcons = {
  // Tech Stack Icons
  databricks: Database,
  spark: Zap,
  delta: Database,
  mlflow: BarChart3,
  unity: Shield,
  
  // Cloud Providers
  aws: Cloud,
  azure: Cloud,
  gcp: Globe,
  
  // Industries
  fintech: DollarSign,
  healthcare: Heart,
  retail: ShoppingCart,
  gaming: Gamepad2,
  manufacturing: Factory,
  enterprise: Building,
  consulting: Briefcase,
  
  // Skills
  analytics: BarChart3,
  engineering: Cpu,
  security: Shield,
  infrastructure: Globe
};

interface TechStackBadgeProps {
  tech: string;
  className?: string;
}

export function TechStackBadge({ tech, className = "" }: TechStackBadgeProps) {
  const iconKey = tech.toLowerCase().replace(/\s+/g, '') as keyof typeof IndustryIcons;
  const IconComponent = IndustryIcons[iconKey] || Database;
  
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-[#FF6B35]/20 ${className}`}>
      <IconComponent className="h-4 w-4 text-[#FF6B35]" />
      <span className="text-sm font-medium text-gray-900">{tech}</span>
    </div>
  );
}

interface IndustryCardProps {
  industry: string;
  count: number;
  icon?: keyof typeof IndustryIcons;
  className?: string;
}

export function IndustryCard({ industry, count, icon, className = "" }: IndustryCardProps) {
  const IconComponent = icon ? IndustryIcons[icon] : Building;
  
  return (
    <div className={`group p-4 rounded-xl bg-gradient-to-br from-background to-muted/30 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <IconComponent className="h-6 w-6 text-[#FF6B35]" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{industry}</h3>
          <p className="text-sm text-gray-600">{count} professionals</p>
        </div>
      </div>
    </div>
  );
}
