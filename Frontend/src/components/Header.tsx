import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

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
        <button className="cta-button">Daftar/Masuk</button>
      </nav>
    </header>
  );
};

export default Header;
