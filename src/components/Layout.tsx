import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ThemeSelector } from "@/components/ThemeSelector";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="flex-shrink-0 sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xl font-bold">
                App Name
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <ThemeSelector />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
