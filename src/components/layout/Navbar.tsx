import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { nav_links } from "@/consts";
import { useAuthStore } from "@/store/useAuthStore";
import { SVGProps } from "react";
import { Link } from "react-router";
import { JSX } from "react/jsx-runtime";
import Logo from "../Logo";

export default function Navbar() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="w-full shadow-xs bg-background">
      <div className="container max-w-4xl mx-auto flex h-16 w-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {nav_links.map((link, index) => (
              <Link
                to={link.to}
                key={index + "web"}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {link.title}
              </Link>
            ))}
            <Link
              to="/dashboard/employee/new"
              key={"employee-new" + "web"}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Button type="button" size="sm">+ New Employee</Button>
            </Link>
          </nav>
        </div>
        <div className="flex gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8 bg-[#333]">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link to="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link to="/profile/edit">
                <DropdownMenuItem className="cursor-pointer">
                  Edit Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
              >
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs px-6 py-2.5">
              <Link to="/">
                <Logo className="text-xl" />
              </Link>
              <hr />
              <nav className="grid gap-3">
                {nav_links.map((link, index) => (
                  <Link
                    to={link.to}
                    key={index + "mobile"}
                    className="flex items-center gap-4 text-muted-foreground hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
