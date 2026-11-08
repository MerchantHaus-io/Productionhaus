import { Button } from "./ui/button";
import shieldLogo from "@/assets/shield.webp";
import { useState, useEffect } from "react";
import { ContactDialog } from "./ContactDialog";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showShimmer, setShowShimmer] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/device-catalog", label: "Devices" },
    { href: "/supported-processors", label: "Processors" },
    { href: "/blog", label: "Blog" },
    { href: "/#pricing", label: "Pricing" }
  ];
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const isCurrent = (href: string) => !href.includes("#") && currentPath === href;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);

    // Trigger shimmer animation on mount
    setTimeout(() => setShowShimmer(true), 600);
    setTimeout(() => setShowShimmer(false), 5600);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 bg-background border-b border-border transition-shadow duration-200 ${
        isScrolled ? 'shadow-xs' : ''
      }`}
    >
      <div className="px-6 md:px-16 lg:px-24 h-[76px] flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          {/* Logo with Shield and Animation - Shield always on top */}
          <a href="/" className="flex items-center gap-3 group relative">
            <img
              src={shieldLogo}
              alt="MerchantHaus Shield"
              className={`transition-all duration-200 relative z-20 ${isScrolled ? 'h-8 w-8' : 'h-9 w-9'}`}
            />
            <div className="relative z-10">
              <h1 className="font-sans text-xl font-black leading-6 tracking-[0.02em] text-heading uppercase">
                Merchant Haus
              </h1>
              {showShimmer && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-40 z-0"
                  style={{
                    animation: 'shimmer 5s linear forwards'
                  }}
                />
              )}
            </div>
          </a>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              aria-current={isCurrent(href) ? "page" : undefined}
              className={`text-sm transition-colors duration-[120ms] hover:text-foreground ${
                isCurrent(href) ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Theme Toggle and CTA */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-foreground hover:bg-accent"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <a
              href="https://merchanthausio.transactiongateway.com/merchants/login.php?cookie_check=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Client login
            </a>
          </Button>
          <Button variant="cta" onClick={() => setIsContactOpen(true)} className="hidden md:inline-flex">
            Contact us
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4">
          <nav className="flex flex-col gap-4">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                aria-current={isCurrent(href) ? "page" : undefined}
                className={`text-sm transition-colors hover:text-foreground ${
                  isCurrent(href) ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
                }`}
                onClick={handleNavClick}
              >
                {label}
              </a>
            ))}
            <Button asChild variant="ghost" className="justify-center">
              <a
                href="https://merchanthausio.transactiongateway.com/merchants/login.php?cookie_check=1"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavClick}
              >
                Client login
              </a>
            </Button>
            <Button
              variant="cta"
              onClick={() => {
                setIsContactOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Contact us
            </Button>
          </nav>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      <ContactDialog open={isContactOpen} onOpenChange={setIsContactOpen} />
    </header>
  );
};
