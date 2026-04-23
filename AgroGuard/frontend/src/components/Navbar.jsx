import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Upload, Search, Home, Menu, X } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/diagnose', label: 'Diagnose', icon: Upload },
    { to: '/wiki', label: 'Agro-Wiki', icon: Search },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-brand-dark text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-brand-green/20 p-2 rounded-lg group-hover:bg-brand-green/30 transition">
              <Leaf className="w-6 h-6 text-brand-green" />
            </div>
            <span className="text-2xl font-bold tracking-wide">AgroGuard</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition font-medium text-sm
                  ${isActive(to)
                    ? 'bg-brand-green/20 text-brand-green'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-2 border-t border-white/10 pt-4 space-y-1 animate-fade-in">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition font-medium
                  ${isActive(to)
                    ? 'bg-brand-green/20 text-brand-green'
                    : 'text-white/80 hover:bg-white/10'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="mobile-menu-overlay active md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;
