import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Database, LogOut, Settings, User, Menu } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import * as LucideIcons from "lucide-react";

interface SubMenuItem {
  label: string;
  href: string;
  icon?: string;
  description?: string;
}

interface MenuItem {
  label: string;
  href?: string;
  icon?: string;
  subMenuItems: SubMenuItem[];
}

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Default menu items for non-authenticated users
  const defaultMenuItems: MenuItem[] = [
    {
      label: "Join as Peer",
      href: "/join",
      icon: "Users",
      subMenuItems: []
    },
    {
      label: "Find Projects",
      href: "/projects",
      icon: "Search",
      subMenuItems: []
    },
    {
      label: "Post Jobs",
      href: "/post-job",
      icon: "Briefcase",
      subMenuItems: []
    },
    {
      label: "Solutions",
      href: "/solutions",
      icon: "Lightbulb",
      subMenuItems: []
    }
  ];

  const { data: menuItems = defaultMenuItems, isLoading: isLoadingMenu } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu'],
    enabled: isAuthenticated,
  });

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = "/login";
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  // Determine which menu items to show
  const displayMenuItems = isAuthenticated 
    ? (isLoadingMenu ? [] : menuItems) 
    : defaultMenuItems;

  const renderDesktopMenu = () => (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {isAuthenticated && isLoadingMenu ? (
          // Show loading skeleton
          <div className="flex items-center gap-4">
            <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-md" />
            <div className="h-10 w-28 bg-gray-100 animate-pulse rounded-md" />
            <div className="h-10 w-20 bg-gray-100 animate-pulse rounded-md" />
            <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-md" />
          </div>
        ) : (
          displayMenuItems.map((item) => (
            <NavigationMenuItem key={item.label}>
              {item.subMenuItems && item.subMenuItems.length > 0 ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent">
                    <span className="flex items-center gap-2">
                      {getIcon(item.icon)}
                      {item.label}
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 bg-white dark:bg-slate-950">
                      {item.subMenuItems.map((subItem) => (
                        <NavigationMenuLink 
                          key={subItem.href} 
                          asChild
                        >
                          <Link href={subItem.href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">
                            <div className="flex items-center gap-2">
                              {getIcon(subItem.icon)}
                              <div className="text-sm font-medium leading-none">{subItem.label}</div>
                            </div>
                            {subItem.description && (
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1">
                                {subItem.description}
                              </p>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </>
              ) : item.href ? (
                <NavigationMenuLink asChild>
                  <Link href={item.href} className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer">
                    <span className="flex items-center gap-2">
                      {getIcon(item.icon)}
                      {item.label}
                    </span>
                  </Link>
                </NavigationMenuLink>
              ) : null}
            </NavigationMenuItem>
          ))
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );

  const renderMobileMenu = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-white dark:bg-slate-950">
        <nav className="flex flex-col gap-4 mt-8">
          {displayMenuItems.map((item) => (
            <div key={item.label} className="space-y-2">
              {item.href ? (
                <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-2 text-base font-medium px-2 py-2 rounded-md hover:bg-accent cursor-pointer">
                    {getIcon(item.icon)}
                    {item.label}
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-base font-medium px-2 py-2 text-gray-600">
                  {getIcon(item.icon)}
                  {item.label}
                </div>
              )}
              {item.subMenuItems && item.subMenuItems.length > 0 && (
                <div className="pl-6 space-y-1">
                  {item.subMenuItems.map((subItem) => (
                    <Link key={subItem.href} href={subItem.href} onClick={() => setMobileMenuOpen(false)}>
                      <div className="flex items-center gap-2 text-sm px-2 py-2 rounded-md hover:bg-accent cursor-pointer">
                        {getIcon(subItem.icon)}
                        {subItem.label}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-950 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Database className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold">MatchDB</span>
          </Link>
          
          {renderDesktopMenu()}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {renderMobileMenu()}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={user?.profile?.profileImageUrl || user?.consultant?.profileImageUrl || user?.company?.logoUrl || undefined} 
                        alt="Profile" 
                      />
                      <AvatarFallback className="bg-[#FF6B35] text-white">
                        {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-gray-600 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {/* Only show Profile and Dashboard for consultants and companies */}
                    {(user?.role === UserRole.CONSULTANT || user?.role === UserRole.COMPANY) && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {/* Show admin-specific links for admin and staff */}
                    {(user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF) && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/approvals">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
