import { Search, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useCallback } from "react";
import logo from "@/assets/icon.jpg";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/", anchor: null },
    { label: "About Us", href: "/#why", anchor: "why" },
    { label: "Contact Us", href: "/#contact", anchor: "contact" },
    { label: "Help", href: "/#help", anchor: "help" },
  ];

  const handleNav = useCallback((item: typeof navItems[0]) => {
    setMobileOpen(false);
    if (!item.anchor) {
      // Home — scroll to top if already on /, else navigate
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
      return;
    }
    // Section link
    if (location.pathname === "/") {
      const el = document.getElementById(item.anchor);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(item.href);
    }
  }, [location.pathname, navigate]);

  const isActive = (item: typeof navItems[0]) => {
    if (!item.anchor) return location.pathname === "/" && !location.hash;
    return location.hash === `#${item.anchor}`;
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-10 py-4">
      <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <img src={logo} alt="tracker.com logo" className="w-12 h-12 rounded-xl" />
      </Link>

      <ul className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <li key={item.label}>
            <button
              onClick={() => handleNav(item)}
              className={`font-medium transition-colors ${
                isActive(item)
                  ? "text-accent"
                  : "text-foreground/90 hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <Link
          to={user ? "/dashboard" : "/auth"}
          className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full font-medium text-sm hover:bg-foreground/80 transition-colors"
        >
          <Search size={16} />
          {user ? "Dashboard" : "Start Tracking"}
        </Link>
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-20 left-0 right-0 bg-background border-b border-border p-4 md:hidden z-50">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleNav(item)}
                  className={`font-medium transition-colors ${
                    isActive(item) ? "text-accent" : "text-foreground/90"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
