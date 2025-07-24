import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

interface User {
  id: string;
  nama_panjang: string;
  username: string;
  email?: string;
  dikoin: number;
  progress?: {
    section: number;
    level: number;
  };
}

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  // Ref to track if animation has already played
  const animationPlayedRef = useRef(false);

  useEffect(() => {
    // Check for user in localStorage
    const userData = localStorage.getItem('kodino_user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('kodino_user');
      }
    }

    // Only play animation on first mount (page load)
    if (!animationPlayedRef.current) {
      // ...existing animation code...
      animationPlayedRef.current = true;
    }
    // Do not re-run animation on navigation
    // eslint-disable-next-line
  }, []);

  // Listen for localStorage changes (when user logs in/out)
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem('kodino_user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-section')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('kodino_user');
    setUser(null);
    setShowDropdown(false);
    navigate('/', { replace: true });
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const formatDikoin = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
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
        
        {user ? (
          <div className="user-section">
            {/* Dikoin Display */}
            <div className="dikoin-display">
              <img src="/images/coin-icon.webp" alt="Dikoin" className="coin-icon" />
              <span className="dikoin-amount">{formatDikoin(user.dikoin)}</span>
            </div>
            
            {/* Profile Section */}
            <div className="profile-section">
              <button 
                className="profile-button"
                onClick={toggleDropdown}
                aria-expanded={showDropdown}
              >
                <div className="profile-avatar">
                  {user.nama_panjang.charAt(0).toUpperCase()}
                </div>
                <span className="profile-name">{user.username}</span>
                <svg 
                  className={`dropdown-arrow ${showDropdown ? 'open' : ''}`} 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12"
                >
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link 
                    to="/dashboard" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                    Dashboard
                  </Link>
                  <button 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link to="/login" className={`cta-button ${isActive('/login')}`}>
            Daftar/Masuk
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;