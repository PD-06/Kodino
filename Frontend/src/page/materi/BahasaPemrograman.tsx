import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import type { User } from '../../services/api';
import './ApaItuNgoding.css';

const BahasaPemrograman = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('kodino_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const slides = [
    {
      id: 1,
      title: "Bahasa Pemrograman 🗣️",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi teacher" className="kodi-character" />
            <div className="speech-bubble">
              Seperti manusia punya bahasa daerah, komputer juga punya bahasa pemrograman!
            </div>
          </div>
          <div className="content-text">
            <h3>🎯 Yang akan kamu pelajari:</h3>
            <ul>
              <li>Apa itu bahasa pemrograman?</li>
              <li>Analogi dengan bahasa daerah Nusantara</li>
              <li>Jenis-jenis bahasa pemrograman</li>
              <li>Bahasa mana yang cocok untuk pemula?</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Bahasa Pemrograman Seperti Bahasa Daerah 🇮🇩",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi culture" className="kodi-character" />
            <div className="speech-bubble">
              Di Indonesia ada Bahasa Jawa, Batak, Sunda... Di programming juga ada Python, Java, JavaScript!
            </div>
          </div>
          <div className="content-text">
            <h3>🌏 Analogi Bahasa Daerah:</h3>
            <div className="examples-grid">
              <div className="example-card">
                <span className="example-icon">🗣️</span>
                <h4>Bahasa Jawa</h4>
                <p>Untuk komunikasi di Jawa → Java untuk aplikasi enterprise</p>
              </div>
              <div className="example-card">
                <span className="example-icon">🐍</span>
                <h4>Bahasa Batak</h4>
                <p>Lugas dan kuat → Python sederhana tapi powerful</p>
              </div>
              <div className="example-card">
                <span className="example-icon">🌐</span>
                <h4>Bahasa Sunda</h4>
                <p>Halus dan fleksibel → JavaScript untuk web yang dinamis</p>
              </div>
              <div className="example-card">
                <span className="example-icon">⚡</span>
                <h4>Bahasa Minang</h4>
                <p>Cepat dan efisien → C++ untuk performa tinggi</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Jenis-Jenis Bahasa Pemrograman 📚",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi with books" className="kodi-character" />
            <div className="speech-bubble">
              Ada ratusan bahasa pemrograman! Tapi kita fokus ke yang populer dulu ya!
            </div>
          </div>
          <div className="content-text">
            <h3>🏆 Bahasa Pemrograman Populer:</h3>
            <div className="languages-grid">
              <div className="language-card">
                <span className="lang-icon">🐍</span>
                <h4>Python</h4>
                <p>Mudah dipelajari, cocok untuk AI, data science, dan web</p>
              </div>
              <div className="language-card">
                <span className="lang-icon">☕</span>
                <h4>JavaScript</h4>
                <p>Bahasa web yang wajib dikuasai untuk frontend dan backend</p>
              </div>
              <div className="language-card">
                <span className="lang-icon">☕</span>
                <h4>Java</h4>
                <p>Stabil dan aman, banyak dipakai di perusahaan besar</p>
              </div>
              <div className="language-card">
                <span className="lang-icon">⚡</span>
                <h4>C++</h4>
                <p>Cepat dan powerful, untuk game dan sistem operasi</p>
              </div>
            </div>
            <div className="motivation-box">
              <h4>💡 Tips Memilih Bahasa:</h4>
              <ul>
                <li>🎯 <strong>Tujuan:</strong> Mau bikin apa? Web, mobile, AI?</li>
                <li>📈 <strong>Karir:</strong> Bahasa apa yang banyak dicari?</li>
                <li>🎓 <strong>Kemudahan:</strong> Seberapa mudah dipelajari?</li>
                <li>👥 <strong>Komunitas:</strong> Apakah ada banyak tutorial?</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Bahasa Pemrograman untuk Pemula 🌱",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi beginner" className="kodi-character" />
            <div className="speech-bubble">
              Untuk pemula, aku rekomendasikan Python! Kenapa? Mari kita lihat!
            </div>
          </div>
          <div className="content-text">
            <h3>🥇 Mengapa Python Cocok untuk Pemula?</h3>
            <div className="roles-list">
              <div className="role-item">
                <span className="role-icon">📖</span>
                <div>
                  <h4>Sintaks Mudah Dibaca</h4>
                  <p>Kode Python seperti bahasa Inggris, mudah dipahami</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">🚀</span>
                <div>
                  <h4>Cepat Belajar</h4>
                  <p>Bisa bikin program sederhana dalam hitungan menit</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">🌟</span>
                <div>
                  <h4>Banyak Kegunaan</h4>
                  <p>Web, AI, data science, automation - semua bisa!</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">👥</span>
                <div>
                  <h4>Komunitas Besar</h4>
                  <p>Banyak tutorial, library, dan bantuan online</p>
                </div>
              </div>
            </div>
            <div className="info-box">
              <h4>🎯 Contoh Kode Python:</h4>
              <div style={{background: '#1f2937', color: '#f9fafb', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace'}}>
                <div>print("Halo Nusantara!")</div>
                <div>nama = "Kodi"</div>
                <div>print(f"Nama saya Kodi")</div>
              </div>
              <p>Simpel kan? Bahkan tanpa belajar coding pun kamu bisa nebak apa yang dilakukan kode ini!</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const quizQuestions = [
    {
      question: "Bahasa pemrograman yang paling cocok untuk pemula adalah...",
      options: [
        "Assembly",
        "Python",
        "Machine Code",
        "C++"
      ],
      correct: 1
    },
    {
      question: "JavaScript biasanya digunakan untuk...",
      options: [
        "Sistem operasi",
        "Game mobile",
        "Website dan web aplikasi",
        "Driver hardware"
      ],
      correct: 2
    },
    {
      question: "Analogi yang tepat untuk bahasa pemrograman adalah...",
      options: [
        "Seperti bahasa daerah di Indonesia",
        "Seperti makanan tradisional",
        "Seperti alat musik",
        "Seperti transportasi"
      ],
      correct: 0
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answer: string) => {
    setQuizAnswers({ ...quizAnswers, [questionIndex]: answer });
  };

  const submitQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, index) => {
      if (quizAnswers[index] === q.options[q.correct]) {
        score++;
      }
    });
    setQuizScore(score);
    setShowResults(true);
    
    if (score >= 2) {
      completeModule();
    }
  };

  const completeModule = async () => {
    if (!user) return;

    try {
      const response = await fetch('http://localhost:8000/course-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          course_id: 'pendahuluan3',
          module_id: 'pendahuluan'
        })
      });

      if (response.ok) {
        const dikoinResponse = await fetch(`http://localhost:8000/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dikoin: user.dikoin + 100
          })
        });

        if (dikoinResponse.ok) {
          const updatedUser = { ...user, dikoin: user.dikoin + 100 };
          setUser(updatedUser);
          localStorage.setItem('kodino_user', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Error completing module:', error);
    }
  };

  if (showResults) {
    return (
      <div className="materi-page">
        <Header />
        <div className="quiz-results">
          <div className="results-content">
            <h2>🎉 Hasil Quiz</h2>
            <div className="score-display">
              <h3>Skor: {quizScore}/{quizQuestions.length}</h3>
              <div className="score-circle">
                <span>{Math.round((quizScore / quizQuestions.length) * 100)}%</span>
              </div>
            </div>
            
            {quizScore >= 2 ? (
              <div className="success-message">
                <h3>✅ Selamat! Kamu Lulus!</h3>
                <p>Kamu sudah memahami bahasa pemrograman dengan baik!</p>
                <div className="rewards">
                  <div className="reward-item">
                    <span>💰</span>
                    <p>+100 DiKoin</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="retry-message">
                <h3>📚 Hampir Berhasil!</h3>
                <p>Coba baca materi sekali lagi dan ulangi quiz-nya ya!</p>
                <button onClick={() => {
                  setShowQuiz(false);
                  setShowResults(false);
                  setCurrentSlide(0);
                  setQuizAnswers({});
                }}>
                  Ulangi Materi
                </button>
              </div>
            )}
            
            <div className="navigation-buttons">
              <button onClick={() => navigate('/materi/pendahuluan')}>
                Kembali ke Pendahuluan
              </button>
              {quizScore >= 2 && (
                <button onClick={() => navigate('/materi/belajar/pendahuluan4')}>
                  Lanjut: Ngoding itu Gimana Sih?
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showQuiz) {
    return (
      <div className="materi-page">
        <Header />
        <div className="quiz-container">
          <div className="quiz-header">
            <h2>📝 Quiz: Bahasa Pemrograman</h2>
            <p>Jawab pertanyaan berikut untuk menyelesaikan course!</p>
          </div>
          
          <div className="quiz-questions">
            {quizQuestions.map((q, index) => (
              <div key={index} className="question-card">
                <h3>Pertanyaan {index + 1}</h3>
                <p>{q.question}</p>
                <div className="options">
                  {q.options.map((option, optIndex) => (
                    <label key={optIndex} className="option-label">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        onChange={() => handleQuizAnswer(index, option)}
                        checked={quizAnswers[index] === option}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="quiz-actions">
            <button onClick={() => setShowQuiz(false)}>
              Kembali ke Materi
            </button>
            <button 
              onClick={submitQuiz}
              disabled={Object.keys(quizAnswers).length < quizQuestions.length}
              className="submit-quiz-btn"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="materi-page">
      <Header />
      
      <div className="materi-container">
        <div className="slide-navigation">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>
          <span className="slide-counter">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>

        <div className="slide-content-wrapper">
          <div className="slide-header">
            <h1>{slides[currentSlide].title}</h1>
          </div>
          
          <div className="slide-body">
            {slides[currentSlide].content}
          </div>
        </div>

        <div className="slide-controls">
          <button 
            onClick={prevSlide} 
            disabled={currentSlide === 0}
            className="nav-button prev"
          >
            ← Sebelumnya
          </button>
          
          <button 
            onClick={nextSlide}
            className="nav-button next"
          >
            {currentSlide === slides.length - 1 ? 'Quiz →' : 'Selanjutnya →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BahasaPemrograman;