import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, Heart } from "lucide-react";

interface SidebarProps {
  items: {
    name: string;
    icon: LucideIcon;
  }[];
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export function Sidebar({ items, activeItem, setActiveItem }: SidebarProps) {
  return (
    <div className="flex flex-col w-64 bg-[#0a0a0a] border-r border-[#18181b] text-white fixed left-0 top-16 bottom-0 overflow-y-auto">
      <nav className="flex-1 p-4">
        {items.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className={cn(
              "w-full justify-start px-4 py-5 mb-2 text-left rounded-lg transition-colors",
              activeItem === item.name
                ? "bg-[#0a0a0a] border-2 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
            onClick={() => setActiveItem(item.name)}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Button>
        ))}
      </nav>
      <div className="p-4 border-t border-[#18181b]">
        <p className="text-sm text-gray-500">
          Made with <Heart className="inline h-4 w-4 text-gray-500" /> by Ayush
        </p>
      </div>
    </div>
  );
}
