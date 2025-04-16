
import { ReactNode } from "react";

interface ClothingGridProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
}

const ClothingGrid = ({ children, title, action }: ClothingGridProps) => {
  return (
    <div className="mb-8">
      {(title || action) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          {action}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 md:grid-cols-6">{children}</div>
    </div>
  );
};

export default ClothingGrid;
