import TopBar from "@/components/TopBar";
import AppSidebar from "@/components/AppSidebar";
import UserTable from "@/components/UserTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
      <div className="flex flex-1">
        <AppSidebar />
        <UserTable />
      </div>
    </div>
  );
};

export default Index;
