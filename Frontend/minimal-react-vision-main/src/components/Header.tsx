
import { Bell, Sun } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const Header = () => {
  return (
    <header className="p-4 flex justify-between items-center border-b">
      <h1 className="text-2xl font-semibold">Smart Wardobe</h1>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 text-gray-500">
          <Sun size={18} />
          <span>16°C</span>
        </div>
        
        <Bell size={20} />
        
        <div className="flex items-center gap-2">
          <span className="font-medium">RO</span>
          <Avatar>
            <img src="https://github.com/shadcn.png" alt="User" />
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
