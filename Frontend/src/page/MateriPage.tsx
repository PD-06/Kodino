import { useNavigate, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Pendahuluan from './materi/Pendahuluan';
import './MateriPage.css';

const MateriPage = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'pendahuluan',
      title: 'Pendahuluan',
      series: 'Sumatera Series',
      description: 'Ngoding itu seru, kok! Kenalan dulu sama dunia programming dan cara kerja kode.',
      image: '/images/pendahuluan.webp',
      route: '/materi/pendahuluan'
    },
    {
      id: 'logika-dan-variabel',
      title: 'Logika dan Variabel',
      series: 'Kalimantan Series',
      description: 'Belajar mikir kayak komputer! Pahami variabel, logika, dan dasar ngoding lainnya.',
      image: '/images/logika-dan-variabel.webp',
      route: '/materi/logika-dan-variabel'
    },
    {
      id: 'struktur-data-dan-interaksi',
      title: 'Struktur Data dan Interaksi',
      series: 'Sulawesi Series',
      description: 'Bikin game pertamamu! Gerakin karakter, kasih skor, dan seru-seruan sambil belajar.',
      image: '/images/struktur-data-dan-interaksi.webp',
      route: '/materi/struktur-data-dan-interaksi'
    },
    {
      id: 'struktur-program',
      title: 'Struktur Program & Pengulangan Kompleks',
      series: 'Papua Series',
      description: 'Menguasai struktur program dan pengulangan yang lebih kompleks.',
      image: '/images/struktur-program-pengulangan-kompleks.webp',
      route: '/materi/struktur-program'
    },
    {
      id: 'pengembangan-program',
      title: 'Pengembangan Program dan Kode Modular',
      series: 'Jawa Series',
      description: 'Belajar membangun program yang lebih besar dengan kode modular.',
      image: '/images/pengembangan-program-dan-kode-modular.webp',
      route: '/materi/pengembangan-program'
    },
    {
      id: 'pemrograman-bebas',
      title: 'Pemrograman Bebas',
      series: 'Pulau Komodo Series',
      description: 'Kreasikan ide kamu! Tulis kode sesukamu dan bikin proyek unikmu sendiri.',
      image: '/images/pemrograman-bebas.webp',
      route: '/materi/pemrograman-bebas'
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="materi-page">
      <Header />

      {/* Main Content */}
      <main className="materi-container">
        <Routes>
          <Route path="/materi/pendahuluan" element={<Pendahuluan />} />
          {/* Add other routes here if needed */}
        </Routes>

        <h1 className="section-title">Materi</h1>
        
        <div className="materi-grid">
          {modules.map((module) => (
            <div 
              key={module.id} 
              className="materi-card"
              onClick={() => handleCardClick(module.route)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCardClick(module.route)}
            >
              <img className="card-icon" src={module.image} alt={module.title} />
              <div className="card-content">
                <span className="series-tag">{module.series}</span>
                <h3 className="card-title">{module.title}</h3>
                <p className="card-description">{module.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MateriPage;
