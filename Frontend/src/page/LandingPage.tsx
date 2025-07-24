// filepath: /Users/raka/IdeaProjects/kodino/Kodino/Frontend/src/page/LandingPage.tsx
import { useEffect } from 'react';
import './LandingPage.css';

const LandingPage = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe all elements that should animate on scroll
    const elementsToAnimate = document.querySelectorAll('.feature-item, .benefit-card');
    elementsToAnimate.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <img src="/images/kodino-mascot.png" alt="Kodino Mascot" className="mascot" />
          <span className="logo-text">Kodino</span>
        </div>
        <nav className="nav">
          <a href="#beranda" className="nav-link active">Beranda</a>
          <a href="#tentang" className="nav-link">Tentang</a>
          <a href="#materi" className="nav-link">Materi</a>
          <button className="cta-button">Daftar/Masuk</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Asah ngoding lo<br />
            bareng Kodino!
          </h1>
          <p className="hero-subtitle">
            Platform Belajar Programming paling<br />
            Dipersonalisasi untuk Pelajar Nusantara!
          </p>
          <button className="start-button">Yuk, mulai!</button>
        </div>
        <div className="hero-image">
          <img src="/images/hero-illustration.png" alt="Kodino Hero" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-item">
          <div className="feature-icon">
            <img src="/images/programming-icon.png" alt="Programming" />
          </div>
          <h3 className="feature-title">Dasar Pemrograman</h3>
          <p className="feature-description">
            Kuasai dasar-dasar coding dengan latihan interaktif.
          </p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <img src="/images/achievement-icon.png" alt="Achievement" />
          </div>
          <h3 className="feature-title">Raih Penghargaan</h3>
          <p className="feature-description">
            Dapatkan lencana untuk setiap pencapaian dan pantau perkembanganmu.
          </p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">
            <img src="/images/culture-icon.png" alt="Culture" />
          </div>
          <h3 className="feature-title">Jelajahi Budaya Nusantara</h3>
          <p className="feature-description">
            Pelajari Budaya Nusantara sembari memahami logika untuk masa depan.
          </p>
        </div>
      </section>

      {/* Why Kodino Section */}
      <section className="why-kodino">
        <h2 className="section-title">Apa yang Bikin Kodino Beda?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <img src="/images/lightbulb-icon.png" alt="Learn from 0" />
            </div>
            <h3 className="benefit-title">Belajar dari 0</h3>
            <p className="benefit-description">
              Kamu SD, SMP, atau SMA yang belum punya basic komputer? Tenang! Kita bakal ajarin kamu dari awal banget!
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <img src="/images/game-icon.png" alt="Game Based" />
            </div>
            <h3 className="benefit-title">Berbasis Game</h3>
            <p className="benefit-description">
              Kamu kurang suka dengan baca materi tertulis aja? Yuk kita belajar sekalian bermain!
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <img src="/images/coding-icon.png" alt="Interactive Coding" />
            </div>
            <h3 className="benefit-title">Coding Interaktif</h3>
            <p className="benefit-description">
              Ga perlu susah-susah download aplikasi. Kamu udah bisa langsung jalanin program kamu di sini!
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <img src="/images/indonesia-flag-icon.png" alt="Indonesian Language" />
            </div>
            <h3 className="benefit-title">Berbahasa Indonesia</h3>
            <p className="benefit-description">
              Belum jago Bahasa Inggris? Gapapa, di sini kita bisa belajar logika pemrograman lewat bahasa Indonesia secara langsung.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
