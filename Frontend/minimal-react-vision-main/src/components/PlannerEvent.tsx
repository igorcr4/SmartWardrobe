
import { ChevronRight } from "lucide-react";

interface PlannerEventProps {
  day: number;
  type: string;
  description: string;
}

const PlannerEvent = ({ day, type, description }: PlannerEventProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-start gap-4">
        <span className="text-2xl font-bold text-wardrobe-blue">{day}</span>
        <div>
          <h4 className="text-sm font-bold uppercase text-wardrobe-blue">{type}</h4>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  );
};

export default PlannerEvent;
