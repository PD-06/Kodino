import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Pendahuluan.css';

const Pendahuluan = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    // Navigate to the next module (logika-dan-variabel)
    navigate('/materi/logika-dan-variabel');
  };

  const handlePrev = () => {
    // Navigate back to the materi page
    navigate('/materi');
  };

  return (
    <div className="pendahuluan-page">
      <Header />
      
      <div className="module-container">
        <div className="module-image-container">
          <img 
            src="/images/modules/sulawesi.webp"
            alt="Pendahuluan" 
            className="module-image"
          />
          
          {/* Navigation Arrows */}
          <button className="nav-arrow left-arrow" onClick={handlePrev}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <button className="nav-arrow right-arrow" onClick={handleNext}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
          
          {/* Text Overlays */}
          <div className="module-title">
            <h1 className="module-title-1">1. Apa itu ngoding?</h1>
          </div>

          <div className="module-subtitle">
            <h2>Aceh</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pendahuluan;
