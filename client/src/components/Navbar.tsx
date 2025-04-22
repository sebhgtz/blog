import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Me", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="font-space font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary cursor-pointer">
              TechPerspectives
            </h1>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path}>
              <a className={cn(
                "relative font-medium text-foreground hover:text-secondary transition duration-300 py-2",
                "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2",
                "after:w-0 after:h-0.5 after:bg-secondary after:transition-all after:duration-300",
                location === link.path && "after:w-full"
              )}>
                {link.name}
              </a>
            </Link>
          ))}
        </div>
        
        <div className="md:hidden">
          <button 
            className="text-foreground hover:text-secondary transition duration-300"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <motion.div 
        className="md:hidden bg-background/95 backdrop-blur-md"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: mobileMenuOpen ? "auto" : 0,
          opacity: mobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {mobileMenuOpen && (
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <a 
                  className={cn(
                    "font-medium text-foreground hover:text-secondary transition duration-300 py-2",
                    location === link.path && "text-secondary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </nav>
  );
};

export default Navbar;
