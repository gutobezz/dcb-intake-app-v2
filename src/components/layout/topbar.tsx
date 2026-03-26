"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { LogOut, Menu, ClipboardList, Library, FileText, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/intake": "New Proposal",
  "/library": "Pipeline",
  "/change-orders": "Change Orders",
  "/settings": "Settings",
};

const mobileNavItems = [
  { label: "New Proposal", href: "/intake", icon: ClipboardList },
  { label: "Pipeline", href: "/library", icon: Library },
  { label: "Change Orders", href: "/change-orders", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  const title =
    Object.entries(pageTitles).find(([path]) =>
      pathname.startsWith(path)
    )?.[1] ?? "Dashboard";

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
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-sidebar p-0">
            <SheetHeader className="border-b border-sidebar-border p-4">
              <SheetTitle className="flex items-center gap-2.5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-dcb-gold text-sm font-bold text-white">
                  DC
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-bold tracking-widest text-white">D&C</span>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-dcb-gold">Builders</span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-2">
              {mobileNavItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
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
                          : "text-muted-foreground"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <Separator className="bg-sidebar-border" />
            <div className="p-3">
              <div className="px-1 pb-2 text-[10px] text-muted-foreground">
                License #1116111
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-base font-semibold text-foreground">{title}</h1>
      </div>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="rounded-full" />
          }
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-dcb-navy-light text-xs font-semibold text-dcb-gold">
              DC
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" sideOffset={8}>
          <DropdownMenuLabel>DCB User</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
