
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {icon && <div className="mb-2">{icon}</div>}
      <span className="text-4xl font-bold">{value}</span>
      <span className="text-sm text-gray-500">{title}</span>
    </div>
  );
};

export default StatCard;
