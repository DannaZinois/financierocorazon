import { useState } from "react";
import TopBar from "@/components/TopBar";
import AppSidebar from "@/components/AppSidebar";
import UserTable from "@/components/UserTable";
import FinancePage from "@/components/FinancePage";
import FinanceDupPage from "@/components/FinanceDupPage";

const Index = () => {
  const [activeSection, setActiveSection] = useState("users");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
      <div className="flex flex-1">
        <AppSidebar activeId={activeSection} onSelect={setActiveSection} />
        {activeSection === "users" && <UserTable />}
        {activeSection === "finance" && <FinancePage />}
        {activeSection === "finance-dup" && <FinanceDupPage />}
      </div>
    </div>
  );
};

export default Index;
