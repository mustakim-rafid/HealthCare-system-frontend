import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "../ui/mode-toggler";
import { getCookie } from "@/services/auth/tokenHandlers";
import LogoutButton from "./LogoutButton";
import { getDefaultDashboardRoute } from "@/utils/auth-utils";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function PublicNavbar() {
  const accessToken = await getCookie("accessToken");

  let decodedToken: JwtPayload | null = null;

  if (accessToken) {
    const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
    if (typeof verified === "object" && verified !== null) {
      decodedToken = verified as JwtPayload;
    }
  }

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Consultation", href: "/consultation" },
    { href: "/health-plans", label: "Health Plans" },
    { href: "/medicine", label: "Medicine" },
    { href: "/diagnostics", label: "Diagnostics" },
    { href: "/ngos", label: "NGOs" },
    ...(decodedToken
      ? [
          {
            label: "Dashboard",
            href: getDefaultDashboardRoute(decodedToken.role),
          },
        ]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                H
              </span>
            </div>
            <span className="text-xl font-bold text-foreground sm:inline">
              Health Care
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors duration-200 text-sm"
              >
                {link.label === "Dashboard" ? (
                  <Button variant="secondary">{link.label}</Button>
                ) : (
                  link.label
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {accessToken ? (
              <LogoutButton />
            ) : (
              <Link href={"/login"}>
                <Button
                  variant="outline"
                  className="w-full bg-transparent dark:hover:bg-primary cursor-pointer"
                >
                  Login
                </Button>
              </Link>
            )}
            <ModeToggle />
          </div>

          {/* Mobile Menu - Using shadcn Sheet */}
          <Sheet>
            {/* Trigger button (hamburger icon) */}
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>

            {/* Sheet content */}
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-lg font-semibold">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      H
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6 mt-2 px-2">
                {/* Navigation links */}
                <div className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href!}
                        className="text-muted-foreground font-medium px-2 py-2 rounded-lg hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>

                {/* Divider + Login button */}
                <div className="border-t pt-4">
                  <SheetClose asChild>
                    {accessToken ? (
                      <LogoutButton />
                    ) : (
                      <Link href={"/login"}>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent dark:hover:bg-primary"
                        >
                          Login
                        </Button>
                      </Link>
                    )}
                  </SheetClose>
                </div>
                <div className="text-center">
                  <ModeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
