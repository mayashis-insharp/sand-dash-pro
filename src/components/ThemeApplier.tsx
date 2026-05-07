import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyAccentForRoute } from "@/lib/theme";

export function ThemeApplier() {
  const { pathname } = useLocation();
  useEffect(() => {
    applyAccentForRoute(pathname);
    const handler = () => applyAccentForRoute(pathname);
    window.addEventListener("module-colors-changed", handler);
    return () => window.removeEventListener("module-colors-changed", handler);
  }, [pathname]);
  return null;
}
