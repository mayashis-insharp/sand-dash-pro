import {
  LayoutDashboard, ShoppingCart, Wallet, Boxes, Truck, Receipt,
  UsersRound, UserCircle2, ShieldCheck, Settings, LogOut, Mountain,
  PanelLeftClose, PanelLeft,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { loadColors } from "@/lib/theme";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, key: "Dashboard" },
  { title: "Orders", url: "/orders", icon: ShoppingCart, key: "Orders" },
  { title: "Payments", url: "/payments", icon: Wallet, key: "Payments" },
  { title: "Inventory", url: "/inventories", icon: Boxes, key: "Inventory" },
  { title: "Suppliers", url: "/suppliers", icon: Truck, key: "Suppliers" },
  { title: "Expenses", url: "/expenses", icon: Receipt, key: "Expenses" },
  { title: "Employees", url: "/employees", icon: UsersRound, key: "Employees" },
  { title: "Customers", url: "/customers", icon: UserCircle2, key: "Customers" },
  { title: "Users", url: "/users", icon: ShieldCheck, key: "Users" },
  { title: "Settings", url: "/settings", icon: Settings, key: "Settings" },
];

// Fixed brand color for Sand Supply logo and Admin avatar — never themed.
const BRAND = "#E48444";

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const [colors, setColors] = useState(() => loadColors());
  useEffect(() => {
    const handler = () => setColors(loadColors());
    window.addEventListener("module-colors-changed", handler);
    return () => window.removeEventListener("module-colors-changed", handler);
  }, []);

  const linkCls = (active: boolean) =>
    `group/link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-smooth ${
      active
        ? "bg-primary text-primary-foreground font-semibold shadow-glow"
        : "text-sidebar-foreground hover:bg-sidebar-accent"
    }`;

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="py-5">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl shadow-soft"
              style={{ background: BRAND }}
            >
              <Mountain className="h-5 w-5 text-white" />
            </div>
            <button
              onClick={toggleSidebar}
              className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-smooth"
              aria-label="Expand sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-soft"
              style={{ background: BRAND }}
            >
              <Mountain className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight min-w-0 flex-1">
              <span className="font-display font-bold text-foreground truncate">Sand Supply</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">ERP Console</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-smooth"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const active = isActive(item.url);
                const dot = colors[item.key];
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="hover:bg-transparent p-0 h-auto">
                      <NavLink to={item.url} end={item.url === "/"} className={linkCls(active)}>
                        <item.icon className="h-[18px] w-[18px] shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            <span
                              className="h-2.5 w-2.5 rounded-full ring-1 ring-black/5 shrink-0"
                              style={{ background: dot }}
                              aria-hidden
                            />
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className={`flex items-center gap-3 rounded-xl px-2 py-2 ${collapsed ? "justify-center" : ""}`}>
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="text-xs font-semibold text-white" style={{ background: BRAND }}>A1</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-sm font-semibold truncate">Admin</span>
              <span className="text-[11px] text-muted-foreground truncate">Super Admin</span>
            </div>
          )}
        </div>
        <button
          className={`mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive transition-smooth ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
