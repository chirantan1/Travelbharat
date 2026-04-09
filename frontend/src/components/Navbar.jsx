import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Compass,
  Home,
  MapPin,
  UserCog,
  Sparkles,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/", name: "Home", icon: Home },
    { path: "/states", name: "Explore States", icon: MapPin },
    { path: "/destinations", name: "All Destinations", icon: Compass },
    { path: "/admin", name: "Admin", icon: UserCog },
  ];

  const isActive = (path) => location.pathname === path;

  const handleBookNow = () => {
    navigate("/book-now");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
            : "bg-gradient-to-r from-orange-600 to-orange-500 py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <Link
              to="/"
              className="group relative flex items-center gap-2 overflow-hidden"
            >
              <div className="relative">
                <Sparkles
                  className={`w-6 h-6 transition-all duration-300 ${
                    scrolled ? "text-orange-500" : "text-yellow-300"
                  } group-hover:rotate-12 group-hover:scale-110`}
                />
              </div>
              <span
                className={`text-2xl font-bold tracking-wider transition-all duration-300 ${
                  scrolled
                    ? "bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
                    : "text-white"
                }`}
              >
                TravelBharat
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative group px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                      active
                        ? scrolled
                          ? "text-orange-600 bg-orange-50"
                          : "text-white bg-white/20"
                        : scrolled
                          ? "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                          : "text-white/90 hover:text-white hover:bg-white/20"
                    }`}
                  >
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span className="font-medium">{link.name}</span>
                    {active && (
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                          scrolled ? "bg-orange-500" : "bg-yellow-400"
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={handleBookNow}
                className={`relative overflow-hidden group px-5 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  scrolled
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-xl"
                    : "bg-white text-orange-600 hover:bg-orange-50"
                }`}
              >
                <span>Book Now</span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                scrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/20"
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden fixed inset-x-0 top-[72px] transition-all duration-300 transform ${
            isOpen
              ? "translate-y-0 opacity-100 visible"
              : "-translate-y-full opacity-0 invisible"
          }`}
        >
          <div
            className={`backdrop-blur-xl ${
              scrolled ? "bg-white/98" : "bg-orange-600/98"
            } shadow-2xl rounded-b-2xl mx-4 overflow-hidden`}
          >
            <div className="flex flex-col py-4">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-6 py-4 transition-all duration-300 ${
                      active
                        ? scrolled
                          ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
                          : "bg-white/20 text-white border-l-4 border-yellow-400"
                        : scrolled
                          ? "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          : "text-white/90 hover:bg-white/20 hover:text-white"
                    }`}
                    style={{
                      animation: isOpen
                        ? `slideIn 0.3s ease-out ${index * 0.05}s forwards`
                        : "none",
                      opacity: 0,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium flex-1">{link.name}</span>
                    {active && (
                      <div
                        className={`w-2 h-2 rounded-full ${
                          scrolled ? "bg-orange-500" : "bg-yellow-400"
                        }`}
                      />
                    )}
                    {link.name === "All Destinations" && (
                      <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </Link>
                );
              })}
              <div className="border-t border-gray-200 my-2 mx-4" />
              <button
                onClick={handleBookNow}
                className={`mx-4 mt-2 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  scrolled
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                    : "bg-white text-orange-600"
                }`}
              >
                Book Your Trip
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-[72px]" />

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
