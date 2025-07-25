import { useNavigate, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Pendahuluan from './materi/Pendahuluan';
import './MateriPage.css';

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

const MateriPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const [lockedModuleTitle, setLockedModuleTitle] = useState('');

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('kodino_user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const modules = [
    {
      id: 'pendahuluan',
      title: 'Pendahuluan',
      series: 'Sumatera Series',
      description: 'Ngoding itu seru, kok! Kenalan dulu sama dunia programming dan cara kerja kode.',
      image: '/images/pendahuluan.webp',
      route: '/materi/pendahuluan',
      requiredLevel: 1
    },
    {
      id: 'logika-dan-variabel',
      title: 'Logika dan Variabel',
      series: 'Kalimantan Series',
      description: 'Belajar mikir kayak komputer! Pahami variabel, logika, dan dasar ngoding lainnya.',
      image: '/images/logika-dan-variabel.webp',
      route: '/materi/logika-dan-variabel',
      requiredLevel: 2
    },
    {
      id: 'struktur-data-dan-interaksi',
      title: 'Struktur Data dan Interaksi',
      series: 'Sulawesi Series',
      description: 'Bikin game pertamamu! Gerakin karakter, kasih skor, dan seru-seruan sambil belajar.',
      image: '/images/struktur-data-dan-interaksi.webp',
      route: '/materi/struktur-data-dan-interaksi',
      requiredLevel: 3
    },
    {
      id: 'struktur-program',
      title: 'Struktur Program & Pengulangan Kompleks',
      series: 'Papua Series',
      description: 'Menguasai struktur program dan pengulangan yang lebih kompleks.',
      image: '/images/struktur-program-pengulangan-kompleks.webp',
      route: '/materi/struktur-program',
      requiredLevel: 4
    },
    {
      id: 'pengembangan-program',
      title: 'Pengembangan Program dan Kode Modular',
      series: 'Jawa Series',
      description: 'Belajar membangun program yang lebih besar dengan kode modular.',
      image: '/images/pengembangan-program-dan-kode-modular.webp',
      route: '/materi/pengembangan-program',
      requiredLevel: 5
    },
    {
      id: 'pemrograman-bebas',
      title: 'Pemrograman Bebas',
      series: 'Pulau Komodo Series',
      description: 'Kreasikan ide kamu! Tulis kode sesukamu dan bikin proyek unikmu sendiri.',
      image: '/images/pemrograman-bebas.webp',
      route: '/materi/pemrograman-bebas',
      requiredLevel: 6
    }
  ];

  const getUserLevel = (): number => {
    if (!user) return 1; // Default level for non-logged users
    return user.progress?.level || 1;
  };

  const isModuleUnlocked = (requiredLevel: number): boolean => {
    const userLevel = getUserLevel();
    return userLevel >= requiredLevel;
  };

  const handleCardClick = (route: string, requiredLevel: number, moduleTitle: string, event?: React.MouseEvent) => {
    // Prevent default behavior for locked modules
    if (!isModuleUnlocked(requiredLevel)) {
      event?.preventDefault();
      event?.stopPropagation();
    }
  
    if (!user) {
      // Redirect to login if user is not logged in
      navigate('/login');
      return;
    }
  
    if (isModuleUnlocked(requiredLevel)) {
      navigate(route);
    } else {
      // Show locked message
      setLockedModuleTitle(moduleTitle);
      setShowLockedMessage(true);
      
      // Hide message after 3 seconds
      setTimeout(() => {
        setShowLockedMessage(false);
      }, 3000);
    }
  };
  

  const getPreviousModuleTitle = (requiredLevel: number): string => {
    const previousModule = modules.find(module => module.requiredLevel === requiredLevel - 1);
    return previousModule ? previousModule.title : 'modul sebelumnya';
  };

  return (
    <div className="materi-page">
      <Header />
  
      {/* Locked Module Message */}
      {showLockedMessage && (
        <div className="locked-message-overlay">
          <div className="locked-message">
            <div className="locked-icon">🔒</div>
            <h3>Modul Terkunci!</h3>
            <p>
              Kamu perlu menyelesaikan <strong>{getPreviousModuleTitle(modules.find(m => m.title === lockedModuleTitle)?.requiredLevel || 1)}</strong> terlebih dahulu untuk membuka <strong>{lockedModuleTitle}</strong>.
            </p>
            <div className="progress-info">
              <span>Level saat ini: {getUserLevel()}</span>
            </div>
          </div>
        </div>
      )}
  
      {/* Main Content */}
      <main className="materi-container">
        <h1 className="section-title">Materi</h1>
        
        <div className="materi-grid">
          {modules.map((module) => {
            const isUnlocked = isModuleUnlocked(module.requiredLevel);
            const isCurrentLevel = getUserLevel() === module.requiredLevel;
            
            return (
              <div 
                key={module.id} 
                className={`materi-card ${!isUnlocked ? 'locked' : ''} ${isCurrentLevel ? 'current-level' : ''}`}
                onClick={(e) => handleCardClick(module.route, module.requiredLevel, module.title, e)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCardClick(module.route, module.requiredLevel, module.title)}
                style={{
                  // Disable any CSS transitions for locked cards
                  transition: !isUnlocked ? 'none' : undefined,
                  transform: !isUnlocked ? 'none' : undefined
                }}
              >
                {/* Lock overlay for locked modules */}
                {!isUnlocked && (
                  <div className="lock-overlay">
                    <div className="lock-icon">🔒</div>
                    <span className="lock-text">Level {module.requiredLevel}</span>
                  </div>
                )}
                
                {/* Progress indicator for current level */}
                {isCurrentLevel && (
                  <div className="current-level-badge">
                    <span>⭐ Level Saat Ini</span>
                  </div>
                )}
  
                <img 
                  className="card-icon" 
                  src={module.image} 
                  alt={module.title}
                  style={{ 
                    filter: !isUnlocked ? 'grayscale(100%) brightness(0.5)' : 'none' 
                  }}
                />
                <div className="card-content">
                  <span className="series-tag">{module.series}</span>
                  <h3 className="card-title">{module.title}</h3>
                  <p className="card-description">{module.description}</p>
                  
                  {/* Level requirement indicator */}
                  <div className="level-requirement">
                    <span className={`level-badge ${isUnlocked ? 'unlocked' : 'locked'}`}>
                      Level {module.requiredLevel} {isUnlocked ? '✓' : '🔒'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
  
        {/* User Progress Info */}
        {user && (
          <div className="progress-summary">
            <h3>Progress Kamu</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(getUserLevel() / modules.length) * 100}%` }}
              ></div>
            </div>
            <p>Level {getUserLevel()} dari {modules.length} • {Math.round((getUserLevel() / modules.length) * 100)}% selesai</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MateriPage;