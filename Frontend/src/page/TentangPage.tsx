import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TentangPage.css';

const TentangPage = () => {
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
    const elementsToAnimate = document.querySelectorAll(
      '.about-section, .team-section, .section-title, .mission, .goals, .story-section, .team-intro, .what-makes-different, .collaboration'
    );
    elementsToAnimate.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="tentang">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <Link to="/">
            <img src="/images/kodino-mascot.png" alt="Kodino Mascot" className="mascot" />
            <span className="logo-text">Kodino</span>
          </Link>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-link">Beranda</Link>
          <Link to="/tentang" className="nav-link active">Tentang</Link>
          <a href="#materi" className="nav-link">Materi</a>
          <button className="cta-button">Daftar/Masuk</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section with Kodi Character */}
        <section className="hero-section">
          <div className="hero-character">
            <img src="/images/kodi-character.png" alt="Kodi Character" className="kodi-img" />
          </div>
          <div className="hero-text">
            <h1 className="hero-title">Halo! Aku Kodi! 🦖</h1>
            <div className="hero-description">
              <p>Perkenalkan, aku Kodi! Dino dari masa depan yang hobi ngoding dan suka banget menjelajahi budaya Indonesia!</p>
              
              <p>Aku akan menemani kamu belajar pemrograman dengan cara yang seru dan menyenangkan, lewat petualangan interaktif, permainan seru, dan dunia yang penuh warna. Tapi bukan cuma soal coding, loh! Di setiap langkah, kamu juga akan menjelajahi nilai-nilai budaya Indonesia, dari batik, angklung, hingga cerita rakyat dari berbagai daerah.</p>
              
              <p>Di Kodino, aku percaya bahwa setiap anak Indonesia bisa jadi kreator hebat, dan lewat bahasa pemrograman, kita bisa membangun masa depan yang keren, berbudaya, dan penuh imaijnasi.</p>
              
              <p>Yuk, belajar bareng aku! Mulai dari dasar, bikin game sederhana, sampai jadi programmer andal dengan kearifan lokal! 🇮🇩💻📱</p>
              
              <p className="greeting">Salam hangat dari aku, Kodi!</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section">
          <h2 className="section-title">Tentang kami</h2>
          
          <div className="mission-vision">
            <div className="mission">
              <div className="icon-wrapper">
                <span className="icon">🎯</span>
              </div>
              <h3>Visi</h3>
              <p>Menjadi platform pembelajaran programming yang menyenangkan, inklusif, dan berakar pada budaya Indonesia untuk generasi muda Nusantara.</p>
            </div>

            <div className="goals">
              <div className="icon-wrapper">
                <span className="icon">🎯</span>
              </div>
              <h3>Misi</h3>
              <ul>
                <li>Membuat pembelajaran programming menjadi mudah, interaktif, dan seru.</li>
                <li>Menggabungkan teknologi dan budaya lokal untuk pengalaman belajar yang unik.</li>
                <li>Mendorong anak-anak dan remaja Indonesia untuk tidak hanya menjadi pengguna teknologi, tetapi juga pencipta.</li>
              </ul>
            </div>
          </div>

          <div className="story-section">
            <div className="icon-wrapper">
              <span className="icon">💡</span>
            </div>
            <h3>Cerita Kami</h3>
            <p>Kodino berawal dari mimpi sederhana: gimana caranya ngajarin ngoding yang nggak bikin bosan? Di saat kebanyakan platform belajar coding pakai bahasa dan pendekatan internasional, kami mikir.. kenapa nggak pakai cara Indonesia aja?</p>
            
            <p>Akhirnya, lahirlah Kodino: dino imut dari desa Dinonesia yang siap nemenin kamu belajar ngoding sambil eksplor budaya Nusantara. Mulai dari tantangan seru, cerita rakyat digital, sampai badge budaya yang bisa kamu kumpulin, semua ada di sini!</p>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2 className="section-title">Tim kami</h2>
          
          <div className="team-intro">
            <div className="icon-wrapper">
              <span className="icon">👥</span>
            </div>
            <h3>Tim Kami</h3>
            <ul className="team-list">
              <li><strong>Ariel</strong> - Founder & Entrepreneur</li>
              <li><strong>Alfin</strong> - Website Builder & Front-End specialist</li>
              <li><strong>Raka</strong> - Back-End Specialist</li>
              <li><strong>Devin</strong> - Designer & Curriculum</li>
              <li><strong>Masyarakat Komunitas:</strong> Guru, pelajar, dan teman-teman developer yang berkontribusi mengembangkan platform ini bareng-bareng.</li>
            </ul>
          </div>

          <div className="what-makes-different">
            <div className="icon-wrapper">
              <span className="icon">❄️</span>
            </div>
            <h3>Apa yang Membuat Kami Berbeda?</h3>
            <ul className="difference-list">
              <li><span className="bullet">✨</span> <strong>Personalized learning</strong> untuk tiap pelajar.</li>
              <li><span className="bullet">🎮</span> <strong>Pengalaman belajar gamified.</strong></li>
              <li><span className="bullet">🏛️</span> <strong>Sentuhan lokal:</strong> batik, sarung, cerita rakyat, dan budaya Indonesia lainnya.</li>
            </ul>
          </div>

          <div className="collaboration">
            <div className="icon-wrapper">
              <span className="icon">❤️</span>
            </div>
            <h3>Kerja Sama & Dukungan</h3>
            <p>Kodino terbuka untuk kolaborasi dengan sekolah, komunitas, dan instansi yang ingin memperluas akses pembelajaran teknologi di Indonesia.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TentangPage;