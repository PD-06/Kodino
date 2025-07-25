import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './ApaItuNgoding.css';

interface User {
  id: string;
  nama_panjang: string;
  username: string;
  dikoin: number;
}

const NgodingItuGimana = () => {
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
      title: "Ngoding itu Gimana Sih? 🤔",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-curious.webp" alt="Kodi curious" className="kodi-character" />
            <div className="speech-bubble">
              Sekarang kita akan belajar proses ngoding dari awal sampai jadi aplikasi!
            </div>
          </div>
          <div className="content-text">
            <h3>🎯 Yang akan kamu pelajari:</h3>
            <ul>
              <li>Langkah-langkah dalam ngoding</li>
              <li>Analogi dengan membangun rumah</li>
              <li>Tools yang dibutuhkan programmer</li>
              <li>Proses debugging dan testing</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Ngoding Seperti Membangun Rumah 🏠",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-architect.webp" alt="Kodi architect" className="kodi-character" />
            <div className="speech-bubble">
              Ngoding itu seperti membangun rumah tradisional Indonesia! Ada tahapannya!
            </div>
          </div>
          <div className="content-text">
            <h3>🏗️ Tahapan Membangun Program:</h3>
            <div className="roles-list">
              <div className="role-item">
                <span className="role-icon">📋</span>
                <div>
                  <h4>1. Perencanaan (Planning)</h4>
                  <p>Seperti gambar blueprind rumah → Merancang fitur aplikasi</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">🏗️</span>
                <div>
                  <h4>2. Coding (Building)</h4>
                  <p>Seperti membangun rumah → Menulis kode program</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">🔍</span>
                <div>
                  <h4>3. Testing (Quality Check)</h4>
                  <p>Seperti mengecek rumah → Mencoba apakah program berjalan</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">🚀</span>
                <div>
                  <h4>4. Deployment (Moving In)</h4>
                  <p>Seperti pindahan → Meluncurkan aplikasi ke publik</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Tools Programmer 🛠️",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-tools.webp" alt="Kodi with tools" className="kodi-character" />
            <div className="speech-bubble">
              Seperti tukang kayu butuh gergaji dan palu, programmer juga butuh tools!
            </div>
          </div>
          <div className="content-text">
            <h3>🔧 Alat-Alat Programmer:</h3>
            <div className="examples-grid">
              <div className="example-card">
                <span className="example-icon">💻</span>
                <h4>Code Editor</h4>
                <p>VS Code, Sublime Text - tempat menulis kode</p>
              </div>
              <div className="example-card">
                <span className="example-icon">🌐</span>
                <h4>Browser</h4>
                <p>Chrome, Firefox - untuk testing web aplikasi</p>
              </div>
              <div className="example-card">
                <span className="example-icon">📱</span>
                <h4>Simulator</h4>
                <p>Android Emulator - untuk testing mobile app</p>
              </div>
              <div className="example-card">
                <span className="example-icon">🐙</span>
                <h4>Version Control</h4>
                <p>Git, GitHub - untuk menyimpan dan berbagi kode</p>
              </div>
            </div>
            <div className="info-box">
              <h4>💡 Tips Pemula:</h4>
              <p>Mulai dengan VS Code (gratis!) dan browser Chrome. Itu sudah cukup untuk belajar ngoding dasar!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Debugging: Ketika Ada Bug 🐛",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-detective.webp" alt="Kodi detective" className="kodi-character" />
            <div className="speech-bubble">
              Bug itu error dalam kode. Seperti mencari kerusakan di rumah!
            </div>
          </div>
          <div className="content-text">
            <h3>🔍 Proses Debugging:</h3>
            <div className="analogy-section">
              <h4>🏠 Analogi Rumah Bocor:</h4>
              <div className="languages-grid">
                <div className="language-card">
                  <span className="lang-icon">💧</span>
                  <h4>1. Temukan Masalah</h4>
                  <p>Rumah bocor → Program error/crash</p>
                </div>
                <div className="language-card">
                  <span className="lang-icon">🔍</span>
                  <h4>2. Cari Sumbernya</h4>
                  <p>Genteng mana yang bocor → Baris kode mana yang salah</p>
                </div>
                <div className="language-card">
                  <span className="lang-icon">🔧</span>
                  <h4>3. Perbaiki</h4>
                  <p>Ganti genteng → Fix kode yang error</p>
                </div>
                <div className="language-card">
                  <span className="lang-icon">✅</span>
                  <h4>4. Test Lagi</h4>
                  <p>Cek masih bocor tidak → Run program lagi</p>
                </div>
              </div>
            </div>
            <div className="motivation-box">
              <h4>💪 Mindset Debugging:</h4>
              <ul>
                <li>🧘 <strong>Sabar:</strong> Bug adalah bagian normal dari ngoding</li>
                <li>🕵️ <strong>Investigatif:</strong> Jadilah detektif yang teliti</li>
                <li>📚 <strong>Google:</strong> Stack Overflow adalah teman terbaik programmer</li>
                <li>👥 <strong>Tanya:</strong> Jangan malu bertanya ke programmer lain</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const quizQuestions = [
    {
      question: "Tahapan pertama dalam ngoding adalah...",
      options: [
        "Langsung coding",
        "Testing",
        "Perencanaan (Planning)",
        "Deployment"
      ],
      correct: 2
    },
    {
      question: "Code editor yang populer untuk pemula adalah...",
      options: [
        "MS Word",
        "VS Code",
        "PowerPoint",
        "Excel"
      ],
      correct: 1
    },
    {
      question: "Debugging adalah proses...",
      options: [
        "Membuat aplikasi baru",
        "Mencari dan memperbaiki error dalam kode",
        "Mendesain interface",
        "Menulis dokumentasi"
      ],
      correct: 1
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
          course_id: 'pendahuluan4',
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
                <p>Kamu sudah memahami proses ngoding dengan baik!</p>
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
                <button onClick={() => navigate('/materi/belajar/pendahuluan5')}>
                  Lanjut: Siap Jadi Programmer!
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
            <h2>📝 Quiz: Ngoding itu Gimana Sih?</h2>
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

export default NgodingItuGimana;