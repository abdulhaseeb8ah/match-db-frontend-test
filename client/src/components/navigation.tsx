import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Database, User, LogOut, Settings, BarChart3, Briefcase, Building, Home, Search, Globe, Zap, Award, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    // Clear JWT token from localStorage
    localStorage.removeItem('access_token');
    // Redirect to login page
    window.location.href = "/login";
  };

  const navItems = [
    { href: "/join-signup", label: "Join as Peer", icon: User },
    { href: "/projects", label: "Find Projects", icon: Search },
    { href: "/post-job", label: "Post Jobs", icon: Briefcase },
    { href: "/solutions", label: "Solutions", icon: Settings },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group" data-testid="link-home">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Database className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MatchDB Talent</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <Button 
                    key={item.href}
                    variant={isActive ? "default" : "ghost"} 
                    className="flex items-center space-x-2"
                    data-testid={`nav-${item.label.toLowerCase()}`}
                    onClick={() => window.location.href = item.href}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user?.profile && (
                  <Badge variant="secondary" className="hidden sm:flex items-center space-x-1" data-testid="badge-profile-status">
                    <Shield className="h-3 w-3" />
                    <span>Verified</span>
                  </Badge>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="button-user-menu">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user?.profile?.profileImageUrl || user?.consultant?.profileImageUrl || user?.company?.logoUrl || undefined} 
                          alt="Profile" 
                        />
                        <AvatarFallback>
                          {user?.firstName?.[0] || user?.email?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none" data-testid="text-user-name">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-gray-600" data-testid="text-user-email">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild data-testid="menu-profile">
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild data-testid="menu-dashboard">
                      <Link href="/dashboard">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>{user?.role === 'company' ? `${user?.firstName}'s Dashboard` : 'Dashboard'}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = "/login"} 
                className="bg-orange-500 text-white hover:bg-orange-600"
                data-testid="button-signin"
              >
                Sign-in
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
