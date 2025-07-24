// import React from 'react';
import Header from '../components/Header';
import './MateriPage.css';

const MateriPage = () => {
  return (
    <div className="materi-page">
      <Header />

      {/* Main Content */}
      <main className="materi-container">
        <h1 className="section-title">Materi</h1>
        
        <div className="materi-grid">
          {/* Sumatera Series */}
          <div className="materi-card">
            <img className="card-icon" src="/images/pendahuluan.webp" alt="pendahuluan"/>
            <div className="card-content">
              <span className="series-tag">Sumatera Series</span>
              <h3 className="card-title">Pendahuluan</h3>
              <p className="card-description">Ngoding itu seru, kok! Kenalan dulu sama dunia programming dan cara kerja kode.</p>
            </div>
          </div>

          {/* Kalimantan Series */}
          <div className="materi-card">
            <img className="card-icon" src="/images/logika-dan-variabel.webp" alt="Logika dan Variabel" />
            <div className="card-content">
              <span className="series-tag">Kalimantan Series</span>
              <h3 className="card-title">Logika dan Variabel</h3>
              <p className="card-description">Belajar mikir kayak komputer! Pahami variabel, logika, dan dasar ngoding lainnya.</p>
            </div>
          </div>

          {/* Sulawesi Series */}
          <div className="materi-card">
            <img className="card-icon" src="/images/struktur-data-dan-interaksi.webp" alt="Struktur Data dan Interaksi" />
            <div className="card-content">
              <span className="series-tag">Sulawesi Series</span>
              <h3 className="card-title">Struktur Data dan Interaksi</h3>
              <p className="card-description">Bikin game pertamamu! Gerakin karakter, kasih skor, dan seru-seruan sambil belajar.</p>
            </div>
          </div>

          {/* Papua Series */}
          <div className="materi-card">
            <img className="card-icon" src="/images/struktur-program-pengulangan-kompleks.webp" alt="Struktur Program & Pengulangan Kompleks" />
            <div className="card-content">
              <span className="series-tag">Papua Series</span>
              <h3 className="card-title">Struktur Program & Pengulangan Kompleks</h3>
              <p className="card-description">lorem ipsum sir dolor amet</p>
            </div>
          </div>

          {/* Jawa Series */}
          <div className="materi-card">
            <img className="card-icon" src="/images/pengembangan-program-dan-kode-modular.webp" alt="Pengembangan Program dan Kode Modular" />
            <div className="card-content">
              <span className="series-tag">Jawa Series</span>
              <h3 className="card-title">Pengembangan Program dan Kode Modular</h3>
              <p className="card-description">Belajar mikir kayak komputer! Pahami variabel, logika, dan dasar ngoding lainnya.</p>
            </div>
          </div>

          {/* Komodo Series */}
          <div className="materi-card">
            <img className="card-icon" src="/images/pemrograman-bebas.webp" alt="Pemrograman Bebas"/>
            <div className="card-content">
              <span className="series-tag">Pulau Komodo Series</span>
              <h3 className="card-title">Pemograman Bebas</h3>
              <p className="card-description">Kreasikan ide kamu! Tulis kode sesukamu dan bikin proyek unikmu sendiri.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MateriPage;
