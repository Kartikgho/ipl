import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  RefreshCw,
  Activity,
  Users,
  Brain,
  BarChart2 
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral" | "info";
  trendText?: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  trendDirection = "neutral",
  trendText,
  icon,
  iconBgColor,
  iconColor
}) => {
  const renderIcon = (): ReactNode => {
    switch (icon) {
      case "chart_line":
        return <Activity className="h-5 w-5" />;
      case "sports_cricket":
        return <BarChart2 className="h-5 w-5" />;
      case "person":
        return <Users className="h-5 w-5" />;
      case "psychology":
        return <Brain className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const renderTrendIcon = (): ReactNode => {
    switch (trendDirection) {
      case "up":
        return <TrendingUp className="h-3 w-3 mr-1" />;
      case "down":
        return <TrendingDown className="h-3 w-3 mr-1" />;
      case "info":
        return <RefreshCw className="h-3 w-3 mr-1" />;
      default:
        return <PlusCircle className="h-3 w-3 mr-1" />;
    }
  };

  const getTrendColor = (): string => {
    switch (trendDirection) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-green-600";
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-500 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-neutral-800">{value}</h3>
          {trend && (
            <p className={`text-xs ${getTrendColor()} flex items-center mt-1`}>
              {renderTrendIcon()}
              {trend} {trendText ? trendText : "from last week"}
            </p>
          )}
        </div>
        <div className={`${iconBgColor} rounded-full p-2`}>
          <div className={iconColor}>
            {renderIcon()}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
