import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleNavClick = (e, href) => {
    if (isHome && href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NavLink = ({ href, children }) => {
    if (isHome && href.startsWith('#')) {
      return <a href={href} onClick={(e) => handleNavClick(e, href)}>{children}</a>;
    }
    return <Link to={`/${href}`}>{children}</Link>;
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-menus">
          <nav className="footer-nav" role="navigation" aria-label="Footer navigation">
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#navigator">Our Products</NavLink>
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#news">News</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </nav>
          <div className="footer-social" role="list" aria-label="Social media links">
            <a href="https://www.instagram.com/viangloballlp/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" role="listitem">
              <svg width="28" height="28" fill="none" viewBox="0 0 28 28" aria-hidden="true">
                <rect width="28" height="28" rx="6" fill="#366a82"/>
                <g transform="translate(6, 6)">
                  <rect x="0" y="0" width="16" height="16" rx="5.33" fill="none" stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="8" cy="8" r="3.5" fill="none" stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="12.5" cy="3.5" r="1" fill="#fff"/>
                </g>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/vian-global-llp/" target="_blank" rel="noopener noreferrer" aria-label="Connect with us on LinkedIn" role="listitem">
              <svg width="28" height="28" fill="none" viewBox="0 0 28 28" aria-hidden="true">
                <rect width="28" height="28" rx="6" fill="#366a82"/>
                <path d="M8.5 11.5v7h2.25v-7H8.5zm1.125-3.5a1.312 1.312 0 1 0 0 2.625 1.312 1.312 0 0 0 0-2.625zM12.25 11.5v7h2.25v-3.5c0-.966.784-1.75 1.75-1.75s1.75.784 1.75 1.75v3.5H20.5v-4.25c0-2.071-1.679-3.75-3.75-3.75s-3.75 1.679-3.75 3.75z" fill="#fff"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@vianglobal?_r=1&_t=ZS-961XpEmcH6D" target="_blank" rel="noopener noreferrer" aria-label="Follow us on TikTok" role="listitem">
              <svg width="28" height="28" fill="none" viewBox="0 0 28 28" aria-hidden="true">
                <rect width="28" height="28" rx="6" fill="#366a82"/>
                <path d="M19.5 9.5c-1.5 0-2.5-1-2.5-2.5h-2v9.5c0 1.5-1 2.5-2.5 2.5s-2.5-1-2.5-2.5 1-2.5 2.5-2.5v-2c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5v-4.5c1 1 2.5 1.5 4.5 1.5v-2.5z" fill="#fff"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Vian Global LLP. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
