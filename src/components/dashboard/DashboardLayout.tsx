import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile-only top bar with hamburger; no global header on desktop */}
          <header className="md:hidden sticky top-0 z-30 h-14 border-b border-border bg-background/90 backdrop-blur flex items-center px-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <span className="ml-3 font-display font-bold tracking-tight">Cita ERP</span>
          </header>
          <main className="flex-1 p-5 md:p-8 animate-fade-in">{children}</main>
          <footer className="border-t border-border bg-card/40 backdrop-blur px-5 md:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} Cita ERP. All Rights Reserved.</p>
              <p className="font-medium">Crafted for modern operations</p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
