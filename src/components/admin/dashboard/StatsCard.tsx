import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  description?: string;
  iconColor?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  change,
  description,
  iconColor = "bg-primary-100 text-primary-600",
}: StatsCardProps) => {
  // Determine if change is positive, negative or neutral
  let changeDisplay = null;
  if (change !== undefined) {
    const isPositive = change >= 0;
    changeDisplay = (
      <div
        className={`flex items-center text-sm ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        <span className="mr-1 font-medium">
          {isPositive ? "+" : ""}
          {change}%
        </span>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className={`rounded-full p-3 ${iconColor}`}>{icon}</div>
      </div>
      {changeDisplay && <div className="mt-3">{changeDisplay}</div>}
    </div>
  );
};

export default StatsCard;
