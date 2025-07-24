import { useEffect, useRef } from "react";
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  // Ref to track if animation has already played
  const animationPlayedRef = useRef(false);

  useEffect(() => {
    // Only play animation on first mount (page load)
    if (!animationPlayedRef.current) {
      // ...existing animation code...
      animationPlayedRef.current = true;
    }
    // Do not re-run animation on navigation
    // eslint-disable-next-line
  }, []);
  return (
    <header className="header">
      <Link to="/" className="logo-section">
        <img src="/images/kodino-mascot.webp" alt="Kodino Mascot" className="mascot" />
        <span className="logo-text">Kodino</span>
      </Link>
      <nav className="nav">
        <Link to="/" className={`nav-link ${isActive('/')}`}>Beranda</Link>
        <Link to="/tentang" className={`nav-link ${isActive('/tentang')}`}>Tentang</Link>
        <Link to="/materi" className={`nav-link ${isActive('/materi')}`}>Materi</Link>
        <Link to="/" className="cta-button">Daftar/Masuk</Link>
      </nav>
    </header>
  );
};

export default Header;
