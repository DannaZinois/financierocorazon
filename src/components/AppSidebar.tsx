import { Users, DollarSign, Copy, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const items: SidebarItem[] = [
  { label: "Gestión de usuarios", icon: <Users className="w-5 h-5" />, active: true },
  { label: "Financiero", icon: <DollarSign className="w-5 h-5" /> },
  { label: "Financiero: Duplicar y aislar", icon: <Copy className="w-5 h-5" /> },
];

const AppSidebar = () => {
  return (
    <aside className="w-44 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border">
      <nav className="flex-1 py-4 space-y-1">
        {items.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
              item.active && "bg-sidebar-accent font-medium"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <button className="flex items-center gap-3 px-4 py-4 text-sm text-sidebar-foreground hover:bg-sidebar-accent border-t border-sidebar-border">
        <LogOut className="w-5 h-5" />
      </button>
    </aside>
  );
};

export default AppSidebar;
