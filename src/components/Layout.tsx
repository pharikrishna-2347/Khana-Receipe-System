import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { ThemeToggle } from "@/components/ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled 
            ? "bg-background/80 backdrop-blur-lg shadow-sm" 
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-display font-bold text-2xl">
              <span className="text-foreground">Bite</span>
              <span className="text-primary-orange">Builder</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: "Home", path: "/" },
              { name: "Recipes", path: "/recipes" },
              { name: "Meal Planner", path: "/meal-planner" },
              { name: "Grocery List", path: "/grocery-list" },
              { name: "Saved Recipes", path: "/saved-recipes" },
            ].map((item) => (
              <NavLink 
                key={item.name} 
                to={item.path} 
                active={location.pathname === item.path}
              >
                {item.name}
              </NavLink>
            ))}
            <ThemeToggle />
            {user ? (
              <Button variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            )}
          </nav>
          
          <div className="md:hidden">
            <MobileMenu location={location} user={user} onSignOut={handleSignOut} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="bg-secondary py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="font-display font-bold text-xl">
                <span className="text-foreground">Bite</span>
                <span className="text-primary-orange">Builder</span>
              </span>
              <p className="text-muted-foreground mt-1 text-sm">
                Your personal recipe and meal planning assistant
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition">
                Privacy
              </Link>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition">
                Terms
              </Link>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-muted-foreground text-sm">
              © {new Date().getFullYear()} BiteBuilder. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, active, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "relative font-medium transition-colors focus-ring",
        active 
          ? "text-foreground" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
      {active && (
        <motion.div 
          className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary-orange"
          layoutId="activeNav"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
};

interface MobileMenuProps {
  location: ReturnType<typeof useLocation>;
  user: User | null;
  onSignOut: () => Promise<void>;
}

const MobileMenu = ({ location, user, onSignOut }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleAuthClick = () => {
    setIsOpen(false);
    if (user) {
      onSignOut();
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <div>
      <button 
        onClick={toggleMenu}
        className="p-2 focus-ring rounded-md"
        aria-label="Toggle menu"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-foreground"
        >
          {isOpen ? (
            <path 
              d="M18 6L6 18M6 6L18 18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          ) : (
            <path 
              d="M4 6H20M4 12H20M4 18H20" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute top-16 right-4 left-4 bg-background shadow-lg rounded-lg overflow-hidden border border-border"
        >
          <nav className="flex flex-col py-2">
            {[
              { name: "Home", path: "/" },
              { name: "Recipes", path: "/recipes" },
              { name: "Meal Planner", path: "/meal-planner" },
              { name: "Grocery List", path: "/grocery-list" },
              { name: "Saved Recipes", path: "/saved-recipes" },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "px-4 py-3 font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 py-2">
              <ThemeToggle />
            </div>
            <button
              className="px-4 py-3 font-medium transition-colors text-left text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={handleAuthClick}
            >
              {user ? 'Sign Out' : 'Sign In'}
            </button>
          </nav>
        </motion.div>
      )}
    </div>
  );
};

export default Layout;
