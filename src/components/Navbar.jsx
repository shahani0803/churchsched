import React, { useState } from "react";
import { useParish } from "../context/ParishContext";
import {
  Calendar,
  HeartHandshake,
  Clock,
  Users,
  ScrollText,
  Lock,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  Megaphone,
  BookOpen
} from "lucide-react";

export const Navbar = ({ onOpenLogin }) => {
  const {
    currentUser,
    logout,
    activeTab,
    setActiveTab,
    theme,
    toggleTheme
  } = useParish();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="navbar-header">
      <div className="navbar-wrap">
        <div className="brand" onClick={() => handleNav("schedule")}>
          <span className="cross-icon">✝</span>
          <div className="brand-text">
            <span className="title">Nuestra Señora de la Candelaria</span>
            <span className="subtitle">PARISH PORTAL & SCHEDULER</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <button
            className={`nav-link ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => handleNav("schedule")}
          >
            <Calendar size={15} /> Mass Schedule
          </button>
          <button
            className={`nav-link ${activeTab === "request-intention" ? "active" : ""}`}
            onClick={() => handleNav("request-intention")}
          >
            <HeartHandshake size={15} /> Offer Mass Intention
          </button>
          <button
            className={`nav-link ${activeTab === "book-sacrament" ? "active" : ""}`}
            onClick={() => handleNav("book-sacrament")}
          >
            <BookOpen size={15} /> Book Sacrament
          </button>
          <button
            className={`nav-link ${activeTab === "availability" ? "active" : ""}`}
            onClick={() => handleNav("availability")}
          >
            <Clock size={15} /> Priest Availability
          </button>
          <button
            className={`nav-link ${activeTab === "intentions" ? "active" : ""}`}
            onClick={() => handleNav("intentions")}
          >
            <ScrollText size={15} /> Altar Intentions
          </button>
          <button
            className={`nav-link ${activeTab === "priests" ? "active" : ""}`}
            onClick={() => handleNav("priests")}
          >
            <Users size={15} /> Priests
          </button>
          <button
            className={`nav-link ${activeTab === "bulletin" ? "active" : ""}`}
            onClick={() => handleNav("bulletin")}
          >
            <Megaphone size={15} /> Bulletin
          </button>

          {/* Conditional Portal Tab */}
          {currentUser && (
            <button
              className={`nav-link portal-link ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => handleNav("dashboard")}
            >
              <Sparkles size={15} />
              {currentUser.role === "admin" ? "Admin Portal" : "My Dashboard"}
            </button>
          )}
        </nav>

        {/* Right side controls */}
        <div className="nav-controls">
          <button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {currentUser ? (
            <div className="user-badge">
              <span className="user-name">👤 {currentUser.name}</span>
              <button
                className="btn-sm btn-outline-danger"
                onClick={logout}
                title="Log out"
              >
                <LogOut size={14} /> Exit
              </button>
            </div>
          ) : (
            <button
              className="btn-sm btn-primary-gold"
              onClick={onOpenLogin}
            >
              <Lock size={14} /> Clergy Login
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            className="mobile-hamburger icon-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <button
            className={`mobile-nav-item ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => handleNav("schedule")}
          >
            <Calendar size={18} /> Mass Schedule
          </button>
          <button
            className={`mobile-nav-item ${
              activeTab === "request-intention" ? "active" : ""
            }`}
            onClick={() => handleNav("request-intention")}
          >
            <HeartHandshake size={18} /> Offer Mass Intention
          </button>
          <button
            className={`mobile-nav-item ${
              activeTab === "book-sacrament" ? "active" : ""
            }`}
            onClick={() => handleNav("book-sacrament")}
          >
            <BookOpen size={18} /> Book Sacrament
          </button>
          <button
            className={`mobile-nav-item ${
              activeTab === "availability" ? "active" : ""
            }`}
            onClick={() => handleNav("availability")}
          >
            <Clock size={18} /> Priest Availability
          </button>
          <button
            className={`mobile-nav-item ${
              activeTab === "intentions" ? "active" : ""
            }`}
            onClick={() => handleNav("intentions")}
          >
            <ScrollText size={18} /> Mass Intentions (Altar)
          </button>
          <button
            className={`mobile-nav-item ${activeTab === "priests" ? "active" : ""}`}
            onClick={() => handleNav("priests")}
          >
            <Users size={18} /> Our Priests
          </button>
          <button
            className={`mobile-nav-item ${activeTab === "bulletin" ? "active" : ""}`}
            onClick={() => handleNav("bulletin")}
          >
            <Megaphone size={18} /> Parish Bulletin
          </button>

          {currentUser && (
            <button
              className={`mobile-nav-item portal-item ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => handleNav("dashboard")}
            >
              <Sparkles size={18} />
              {currentUser.role === "admin" ? "Admin Portal" : "My Priest Dashboard"}
            </button>
          )}
        </div>
      )}
    </header>
  );
};
