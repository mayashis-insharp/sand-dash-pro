import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopHeader } from "./TopHeader";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopHeader />
          <main className="flex-1 p-6 lg:p-8 animate-fade-in">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
