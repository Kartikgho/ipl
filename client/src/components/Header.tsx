import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Trophy, Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6" />
          <h1 className="text-xl md:text-2xl font-heading font-bold">IPL Predict</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`font-medium hover:text-secondary-300 transition-colors py-2 ${isActive("/") ? "text-secondary-300" : ""}`}>
              Dashboard
            </a>
          </Link>
          <Link href="/predictions">
            <a className={`font-medium hover:text-secondary-300 transition-colors py-2 ${isActive("/predictions") ? "text-secondary-300" : ""}`}>
              Predictions
            </a>
          </Link>
          <Link href="/teams">
            <a className={`font-medium hover:text-secondary-300 transition-colors py-2 ${isActive("/teams") ? "text-secondary-300" : ""}`}>
              Teams
            </a>
          </Link>
          <Link href="/players">
            <a className={`font-medium hover:text-secondary-300 transition-colors py-2 ${isActive("/players") ? "text-secondary-300" : ""}`}>
              Players
            </a>
          </Link>
          <a href="#" className="font-medium hover:text-secondary-300 transition-colors py-2">
            Analytics
          </a>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary-400 transition-colors">
            <Info className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-full hover:bg-primary-400 transition-colors"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:block">
            <Button 
              variant="secondary" 
              className="flex items-center space-x-2 py-1 px-3 rounded-full bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary-700 text-primary-foreground text-xs">
                  U
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Sign In</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-primary-600">
          <nav className="container mx-auto px-4 py-2 flex flex-col">
            <Link href="/">
              <a className="py-2 px-4 hover:bg-primary-500 rounded transition-colors">
                Dashboard
              </a>
            </Link>
            <Link href="/predictions">
              <a className="py-2 px-4 hover:bg-primary-500 rounded transition-colors">
                Predictions
              </a>
            </Link>
            <Link href="/teams">
              <a className="py-2 px-4 hover:bg-primary-500 rounded transition-colors">
                Teams
              </a>
            </Link>
            <Link href="/players">
              <a className="py-2 px-4 hover:bg-primary-500 rounded transition-colors">
                Players
              </a>
            </Link>
            <a href="#" className="py-2 px-4 hover:bg-primary-500 rounded transition-colors">
              Analytics
            </a>
            <a href="#" className="py-2 px-4 hover:bg-primary-500 rounded transition-colors mt-2">
              Sign In
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
