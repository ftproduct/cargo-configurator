import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ScopeSelector } from "./ScopeSelector";
import { Package, ChevronRight } from "lucide-react";

function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  const crumbs: { label: string; path: string }[] = [];
  if (parts.length >= 1 && parts[0] === "charges") {
    crumbs.push({ label: "Charges", path: "/charges" });
  }
  if (parts.length >= 2 && parts[1] === "new") {
    crumbs.push({ label: "Configure New", path: "/charges/new" });
  } else if (parts.length >= 2 && parts[1] !== "new") {
    crumbs.push({ label: parts[1], path: `/charges/${parts[1]}` });
  }
  if (parts.length >= 3 && parts[2] === "rules") {
    if (parts[3] === "new") {
      crumbs.push({ label: "New Rule", path: `/charges/${parts[1]}/rules/new` });
    }
  }
  if (parts.length >= 3 && parts[2] === "bulk-upload") {
    crumbs.push({ label: "Bulk Upload", path: `/charges/${parts[1]}/bulk-upload` });
  }

  if (crumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3" />}
          {i < crumbs.length - 1 ? (
            <Link to={crumb.path} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 border-b bg-card flex items-center px-6 justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <Package className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-base font-semibold tracking-tight">Charge Master</h1>
        </div>
        <ScopeSelector />
      </header>
      <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full animate-fade-in">
        <Breadcrumbs />
        {children}
      </main>
    </div>
  );
}
