import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import vianLogo from '../assets/vian logo.png';

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Handle body scroll lock when mobile nav is open
  useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  // Handle navigation link click
  const handleNavClick = (e, href) => {
    if (isHome && href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setNavOpen(false);
  };

  const NavLink = ({ to, children }) => {
    if (isHome && to.startsWith('#')) {
      return <a href={to} onClick={(e) => handleNavClick(e, to)} role="menuitem">{children}</a>;
    }
    return <Link to={`/${to}`} onClick={() => setNavOpen(false)} role="menuitem">{children}</Link>;
  };

  return (
    <header className="header simple-header">
      <div className="header-logo">
        <Link to="/" onClick={() => setNavOpen(false)}>
          <img 
            src={vianLogo} 
            alt="Vian Global Logo" 
            className="header-logo-img"
            loading="eager"
            width="200"
            height="200"
          />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className={`mobile-menu-btn ${navOpen ? 'active' : ''}`}
        onClick={() => setNavOpen(!navOpen)}
        aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={navOpen}
        type="button"
      >
        {navOpen ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Navigation Overlay */}
      <div 
        className={`nav-overlay ${navOpen ? 'active' : ''}`}
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      ></div>
      
      {/* Navigation */}
      <nav 
        className={`nav ${navOpen ? 'nav-open' : ''}`}
        id="main-navigation"
        role="navigation"
        aria-label="Main navigation"
      >
        <NavLink to="#home">Home</NavLink>
        <NavLink to="#about">About</NavLink>
        <NavLink to="#navigator">Our Products</NavLink>
        <NavLink to="#services">Services</NavLink>
        <NavLink to="#news">News</NavLink>
        <NavLink to="#contact">Contact</NavLink>
      </nav>
    </header>
  );
};

export default Header;
