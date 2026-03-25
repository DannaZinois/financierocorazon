import { useState } from "react";
import { Users, DollarSign, Copy, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: typeof Users;
}

const items: SidebarItem[] = [
  { id: "users", label: "Gestión de usuarios", icon: Users },
  { id: "finance", label: "Financiero", icon: DollarSign },
  { id: "finance-dup", label: "Financiero: Duplicar y aislar", icon: Copy },
];

const AppSidebar = () => {
  const [activeId, setActiveId] = useState("users");

  return (
    <aside className="w-44 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border">
      <nav className="flex-1 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-3 text-sm transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="w-5 h-5 text-sidebar-foreground" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <button className="flex items-center gap-3 px-4 py-4 text-sm text-sidebar-foreground hover:bg-sidebar-accent border-t border-sidebar-border">
        <LogOut className="w-5 h-5" />
      </button>
    </aside>
  );
};

export default AppSidebar;
