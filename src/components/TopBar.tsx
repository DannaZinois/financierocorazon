import { User } from "lucide-react";

const TopBar = () => {
  return (
    <header className="h-14 bg-topbar flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Corazón de Alcachofa" className="h-10" />
      </div>
      <button className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
        <User className="w-5 h-5 text-primary-foreground" />
      </button>
    </header>
  );
};

export default TopBar;
