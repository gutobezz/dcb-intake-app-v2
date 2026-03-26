"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ClipboardList,
  Library,
  FileText,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navItems = [
  {
    label: "New Proposal",
    href: "/intake",
    icon: ClipboardList,
  },
  {
    label: "Pipeline",
    href: "/library",
    icon: Library,
    hideOnIntake: true,
  },
  {
    label: "Change Orders",
    href: "/change-orders",
    icon: FileText,
    hideOnIntake: true,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    adminOnly: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function handleSignOut() {
    try {
      const { signOut } = await import("@/lib/actions/auth");
      await signOut();
      router.push("/login");
    } catch {
      router.push("/login");
    }
  }

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:flex",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/intake" className="flex items-center gap-2.5">
          {/* Gold square logo mark — matches design system */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-dcb-gold text-sm font-bold text-white">
            DC
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-widest text-white">
                D&C
              </span>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-dcb-gold">
                Builders
              </span>
            </div>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {navItems.filter((item) => {
          // Hide Pipeline and Change Orders when on the intake page (they're tabs now)
          if (item.hideOnIntake && (pathname === "/intake" || pathname.startsWith("/intake/"))) {
            return false;
          }
          return true;
        }).map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          const linkContent = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-dcb-gold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  isActive
                    ? "text-dcb-gold"
                    : "text-muted-foreground group-hover:text-sidebar-foreground"
                )}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger render={<div />}>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Footer */}
      <div className="flex flex-col gap-2 p-3">
        {!collapsed && (
          <div className="px-1 text-[10px] text-muted-foreground">
            License #1116111
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={cn(
            "justify-start gap-3 text-muted-foreground hover:text-foreground",
            collapsed && "justify-center px-0"
          )}
          size="default"
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && <span className="text-sm">Sign out</span>}
        </Button>
      </div>
    </aside>
  );
}
