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

const CaraKerjaKomputer = () => {
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
      title: "Cara Kerja Komputer 🖥️",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi excited" className="kodi-character" />
            <div className="speech-bubble">
              Hai lagi! Sekarang kita akan belajar bagaimana komputer bekerja seperti memasak rendang!
            </div>
          </div>
          <div className="content-text">
            <h3>🎯 Yang akan kamu pelajari:</h3>
            <ul>
              <li>Bagaimana komputer memproses informasi?</li>
              <li>Analogi komputer seperti dapur masak</li>
              <li>Input, Process, dan Output</li>
              <li>Peran CPU, Memory, dan Storage</li>
            </ul>
          </div>
        </div>
      )
    },
    { title: "", content: ( <div className="slide-content lore"><img className="full-page-image" src="/images/materi/Lesson%20Page%20(14).png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"><img className="full-page-image" src="/images/materi/Lesson%20Page%20(15).png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"><img className="full-page-image" src="/images/materi/Lesson%20Page%20(16).png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"><img className="full-page-image" src="/images/materi/Lesson%20Page%20(17).png" alt="Lore Awal"/> </div> ) },
    {
      title: "Komputer Seperti Dapur Rendang 🍛",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi cooking" className="kodi-character" />
            <div className="speech-bubble">
              Di Festival Nasi Padang, aku belajar kalau komputer itu seperti dapur yang canggih!
            </div>
          </div>
          <div className="content-text">
            <h3>🏠 Analogi Dapur Rendang:</h3>
            <div className="analogy-section">
              <h4>🥘 Memasak Rendang vs Cara Kerja Komputer:</h4>
              <div className="examples-grid">
                <div className="example-card">
                  <span className="example-icon">📦</span>
                  <h4>Bahan (Input)</h4>
                  <p>Daging, bumbu, santan → Data yang dimasukkan</p>
                </div>
                <div className="example-card">
                  <span className="example-icon">👨‍🍳</span>
                  <h4>Proses Masak (CPU)</h4>
                  <p>Memotong, menumis, merebus → Memproses data</p>
                </div>
                <div className="example-card">
                  <span className="example-icon">🍽️</span>
                  <h4>Rendang Jadi (Output)</h4>
                  <p>Makanan siap saji → Hasil yang ditampilkan</p>
                </div>
                <div className="example-card">
                  <span className="example-icon">🧠</span>
                  <h4>Resep (Memory)</h4>
                  <p>Ingatan cara masak → Tempat menyimpan instruksi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Input - Process - Output 🔄",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi explaining" className="kodi-character" />
            <div className="speech-bubble">
              Setiap komputer bekerja dengan pola: INPUT → PROCESS → OUTPUT!
            </div>
          </div>
          <div className="content-text">
            <h3>🔄 Siklus IPO (Input-Process-Output):</h3>
            <div className="definition-box">
              <p>Semua yang komputer lakukan mengikuti pola sederhana: <strong>Terima → Proses → Keluarkan</strong></p>
            </div>
            <div className="roles-list">
              <div className="role-item">
                <span className="role-icon">⌨️</span>
                <div>
                  <h4>INPUT (Masukan)</h4>
                  <p>Keyboard, mouse, mikrofon, kamera - semua cara kita "ngomong" ke komputer</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">⚙️</span>
                <div>
                  <h4>PROCESS (Pemrosesan)</h4>
                  <p>CPU bekerja seperti koki yang mengolah bahan menjadi hidangan</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">🖥️</span>
                <div>
                  <h4>OUTPUT (Keluaran)</h4>
                  <p>Monitor, speaker, printer - cara komputer "jawab" kita</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Bagian-Bagian Komputer 🔧",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi mechanic" className="kodi-character" />
            <div className="speech-bubble">
              Yuk kenalan dengan "organ tubuh" komputer yang penting!
            </div>
          </div>
          <div className="content-text">
            <h3>🏗️ Komponen Utama Komputer:</h3>
            <div className="languages-grid">
              <div className="language-card">
                <span className="lang-icon">🧠</span>
                <h4>CPU (Processor)</h4>
                <p>Otak komputer yang berpikir dan menghitung</p>
              </div>
              <div className="language-card">
                <span className="lang-icon">💾</span>
                <h4>RAM (Memory)</h4>
                <p>Meja kerja tempat data sementara</p>
              </div>
              <div className="language-card">
                <span className="lang-icon">💿</span>
                <h4>Storage (Penyimpanan)</h4>
                <p>Lemari tempat menyimpan data permanent</p>
              </div>
              <div className="language-card">
                <span className="lang-icon">🎮</span>
                <h4>GPU (Graphics)</h4>
                <p>Seniman yang menggambar di layar</p>
              </div>
            </div>
            <div className="info-box">
              <h4>💡 Analogi Rumah:</h4>
              <p>CPU = Kepala keluarga, RAM = Meja makan, Storage = Lemari pakaian, GPU = Pelukis dinding!</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const quizQuestions = [
    {
      question: "Apa yang dimaksud dengan IPO dalam komputer?",
      options: [
        "Internet Protocol Online",
        "Input - Process - Output", 
        "Indonesian Programming Office",
        "Internal Processing Operation"
      ],
      correct: 1
    },
    {
      question: "Komponen komputer yang berfungsi seperti 'otak' adalah...",
      options: [
        "RAM",
        "Storage",
        "CPU",
        "Monitor"
      ],
      correct: 2
    },
    {
      question: "Dalam analogi dapur rendang, 'bumbu dan daging' adalah...",
      options: [
        "Output",
        "Process",
        "Input",
        "Storage"
      ],
      correct: 2
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
          course_id: 'pendahuluan2',
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
                <p>Kamu sudah memahami cara kerja komputer dengan baik!</p>
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
                <button onClick={() => navigate('/materi/belajar/pendahuluan3')}>
                  Lanjut: Bahasa Pemrograman
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
            <h2>📝 Quiz: Cara Kerja Komputer</h2>
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

export default CaraKerjaKomputer;