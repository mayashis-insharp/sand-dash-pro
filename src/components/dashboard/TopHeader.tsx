import { Bell, Search, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center gap-4 px-6">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

        <div className="relative hidden md:block w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders, customers, vehicles…"
            className="pl-9 h-10 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-border"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="relative grid h-10 w-10 place-items-center rounded-lg hover:bg-muted transition-smooth">
            <Bell className="h-4.5 w-4.5 text-muted-foreground" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </button>

          <div className="h-8 w-px bg-border mx-1" />

          <div className="flex items-center gap-3 rounded-lg p-1 pr-3 hover:bg-muted cursor-pointer transition-smooth">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-semibold">A1</AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-sm font-medium">Admin 123</span>
              <span className="text-[11px] text-muted-foreground">Super Admin</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
