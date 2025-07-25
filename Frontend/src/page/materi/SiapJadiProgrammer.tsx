import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './ApaItuNgoding.css';

interface User {
  id: string;
  nama_panjang: string;
  username: string;
  dikoin: number;
  progress?: {
    section: number;
    level: number;
  };
}

const SiapJadiProgrammer = () => {
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
      title: "Siap Jadi Programmer! 🚀",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi excited" className="kodi-character" />
            <div className="speech-bubble">
              Wah! Perjalanan kita hampir selesai! Sekarang kamu sudah siap jadi programmer sejati!
            </div>
          </div>
          <div className="content-text">
            <h3>🎯 Apa yang akan kita bahas:</h3>
            <ul>
              <li>Langkah-langkah menjadi programmer</li>
              <li>Tips memulai coding pertama</li>
              <li>Mindset programmer yang sukses</li>
              <li>Resources untuk belajar lanjutan</li>
              <li>Membangun portfolio pertama</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Mindset Programmer Indonesia 🇮🇩",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi proud" className="kodi-character" />
            <div className="speech-bubble">
              Sebagai programmer Indonesia, kita punya keunggulan unik! Mari kita bahas mindset yang tepat!
            </div>
          </div>
          <div className="content-text">
            <h3>🧠 Mindset Programmer Nusantara:</h3>
            <div className="roles-list">
              <div className="role-item">
                <span className="role-icon">🤝</span>
                <div>
                  <h4>Gotong Royong Digital</h4>
                  <p>Saling membantu sesama programmer, berbagi ilmu, dan membangun komunitas yang kuat</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">🌱</span>
                <div>
                  <h4>Continuous Learning</h4>
                  <p>Teknologi terus berkembang, kita harus terus belajar seperti pepatah "Tuntutlah ilmu hingga ke negeri Cina"</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">💡</span>
                <div>
                  <h4>Problem Solver Kreatif</h4>
                  <p>Menggunakan kreativitas Indonesia untuk memecahkan masalah dengan solusi yang unik</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">🏆</span>
                <div>
                  <h4>Pride in Quality</h4>
                  <p>Bangga dengan kualitas kerja, seperti filosofi "alon-alon waton kelakon" - pelan tapi berkualitas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Langkah Pertama: Mulai Coding! 💻",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi coding" className="kodi-character" />
            <div className="speech-bubble">
              Yuk mulai coding pertama! Seperti belajar naik sepeda, yang penting berani memulai!
            </div>
          </div>
          <div className="content-text">
            <h3>🚴‍♂️ Steps to Start Coding:</h3>
            <div className="analogy-section">
              <h4>📝 Action Plan:</h4>
              <ol>
                <li><strong>Pilih Bahasa Pertama:</strong> Python untuk pemula, JavaScript untuk web</li>
                <li><strong>Setup Environment:</strong> Install code editor (VS Code) dan Python/Node.js</li>
                <li><strong>Hello World:</strong> Buat program pertama yang menampilkan "Hello, Indonesia!"</li>
                <li><strong>Practice Daily:</strong> 30 menit setiap hari, konsisten lebih penting dari lama</li>
                <li><strong>Build Projects:</strong> Mulai dari kalkulator sederhana, lalu website profil</li>
                <li><strong>Join Community:</strong> Bergabung dengan komunitas programmer Indonesia</li>
              </ol>
            </div>
            <div className="motivation-box">
              <h4>💪 Tips Sukses:</h4>
              <ul>
                <li>Jangan takut error - error adalah guru terbaik!</li>
                <li>Google dan StackOverflow adalah teman dekat programmer</li>
                <li>Mulai dari yang sederhana, kompleksitas akan datang seiring waktu</li>
                <li>Dokumentasikan perjalanan belajar di GitHub</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Resources & Tools 🛠️",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi with tools" className="kodi-character" />
            <div className="speech-bubble">
              Ini dia tools dan resources yang akan membantu perjalanan coding kamu!
            </div>
          </div>
          <div className="content-text">
            <h3>🎒 Programming Toolkit:</h3>
            <div className="examples-grid">
              <div className="example-card">
                <span className="example-icon">💻</span>
                <h4>Code Editors</h4>
                <p>VS Code, Sublime Text, Atom - pilih yang nyaman</p>
              </div>
              <div className="example-card">
                <span className="example-icon">🌐</span>
                <h4>Learning Platforms</h4>
                <p>Codecademy, freeCodeCamp, Dicoding, Udemy</p>
              </div>
              <div className="example-card">
                <span className="example-icon">📚</span>
                <h4>Documentation</h4>
                <p>MDN Web Docs, Python.org, W3Schools</p>
              </div>
              <div className="example-card">
                <span className="example-icon">🤝</span>
                <h4>Communities</h4>
                <p>GitHub, Stack Overflow, Reddit, Discord</p>
              </div>
            </div>
            <div className="languages-grid">
              <div className="language-card">
                <span className="lang-icon">🐍</span>
                <h4>Python Path</h4>
                <p>Data Science, AI, Backend Development</p>
              </div>
              <div className="language-card">
                <span className="lang-icon">🌐</span>
                <h4>Web Development</h4>
                <p>HTML, CSS, JavaScript, React</p>
              </div>
              <div className="language-card">
                <span className="lang-icon">📱</span>
                <h4>Mobile Dev</h4>
                <p>React Native, Flutter, Swift, Kotlin</p>
              </div>
              <div className="language-card">
                <span className="lang-icon">🎮</span>
                <h4>Game Development</h4>
                <p>Unity, Unreal Engine, Godot</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Portfolio & Career Path 🎯",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi graduate" className="kodi-character" />
            <div className="speech-bubble">
              Sekarang saatnya membangun portfolio dan merencanakan karir programming kamu!
            </div>
          </div>
          <div className="content-text">
            <h3>🏗️ Building Your Portfolio:</h3>
            <div className="definition-box">
              <p><strong>Portfolio</strong> adalah showcase karya terbaikmu yang menunjukkan skill programming kepada dunia!</p>
            </div>
            <div className="info-box">
              <h4>📋 Portfolio Checklist:</h4>
              <ul>
                <li>✅ Personal website dengan bio dan kontak</li>
                <li>✅ 3-5 project yang menunjukkan skill berbeda</li>
                <li>✅ GitHub profile yang aktif dan rapi</li>
                <li>✅ Resume/CV yang highlight programming skills</li>
                <li>✅ LinkedIn profile yang professional</li>
              </ul>
            </div>
            <div className="examples-grid">
              <div className="example-card">
                <span className="example-icon">🌐</span>
                <h4>Web Portfolio</h4>
                <p>Showcase website projects dan skills</p>
              </div>
              <div className="example-card">
                <span className="example-icon">📱</span>
                <h4>Mobile Apps</h4>
                <p>Aplikasi di Play Store atau App Store</p>
              </div>
              <div className="example-card">
                <span className="example-icon">🤖</span>
                <h4>AI Projects</h4>
                <p>Machine learning atau chatbot projects</p>
              </div>
              <div className="example-card">
                <span className="example-icon">🎮</span>
                <h4>Game Projects</h4>
                <p>Simple games yang fun dan interactive</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Selamat! Kamu Sudah Siap! 🎉",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi celebrating" className="kodi-character" />
            <div className="speech-bubble">
              Wohoo! Perjalanan belajar dasar programming selesai! Sekarang kamu sudah siap jadi programmer Indonesia yang keren!
            </div>
          </div>
          <div className="content-text">
            <h3>🏆 Achievement Unlocked!</h3>
            <div className="success-message">
              <h3>🎓 Programmer Foundation Complete!</h3>
              <p>Kamu telah menyelesaikan modul Pendahuluan Programming dengan sempurna!</p>
              <div className="rewards">
                <div className="reward-item">
                  <span>💰</span>
                  <p>+200 DiKoin</p>
                </div>
                <div className="reward-item">
                  <span>🏆</span>
                  <p>Nusantara Coder Badge</p>
                </div>
                <div className="reward-item">
                  <span>⬆️</span>
                  <p>Level UP!</p>
                </div>
              </div>
            </div>
            <div className="motivation-box">
              <h4>🚀 What's Next?</h4>
              <ul>
                <li>Lanjut ke modul "Logika dan Variabel"</li>
                <li>Mulai coding project pertama</li>
                <li>Join komunitas programmer Indonesia</li>
                <li>Bangun portfolio github</li>
                <li>Keep learning and keep coding!</li>
              </ul>
            </div>
            <div className="info-box">
              <h4>💝 Pesan dari Kodi:</h4>
              <p>"Ingat, menjadi programmer bukan tentang menghafal kode, tapi tentang belajar cara berpikir untuk memecahkan masalah. Keep coding, keep learning, dan jadilah programmer yang membanggakan Indonesia! 🇮🇩"</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const quizQuestions = [
    {
      question: "Apa mindset terpenting seorang programmer?",
      options: [
        "Menghafal semua syntax bahasa pemrograman",
        "Continuous learning dan problem solving",
        "Bekerja sendirian tanpa bantuan orang lain",
        "Hanya fokus pada satu bahasa pemrograman"
      ],
      correct: 1
    },
    {
      question: "Langkah pertama yang sebaiknya dilakukan pemula dalam coding adalah?",
      options: [
        "Langsung belajar framework yang kompleks",
        "Membeli laptop termahal",
        "Pilih bahasa pemrograman dan buat 'Hello World'",
        "Menghafal semua algoritma yang ada"
      ],
      correct: 2
    },
    {
      question: "Apa yang dimaksud dengan portfolio programmer?",
      options: [
        "Kumpulan sertifikat programming",
        "Showcase project dan karya programming",
        "Daftar bahasa pemrograman yang dikuasai",
        "Foto-foto saat coding"
      ],
      correct: 1
    },
    {
      question: "Platform mana yang TIDAK cocok untuk belajar programming?",
      options: [
        "GitHub untuk menyimpan project",
        "Stack Overflow untuk mencari solusi",
        "TikTok untuk tutorial mendalam",
        "Codecademy untuk kursus interaktif"
      ],
      correct: 2
    },
    {
      question: "Filosofi 'Gotong Royong Digital' dalam programming berarti?",
      options: [
        "Bekerja sendiri tanpa bantuan",
        "Saling membantu dan berbagi ilmu sesama programmer",
        "Hanya membantu yang bayar",
        "Menyembunyikan ilmu dari orang lain"
      ],
      correct: 1
    },
    {
      question: "Apa yang harus dilakukan ketika menemui error dalam coding?",
      options: [
        "Langsung menyerah dan berhenti coding",
        "Menghapus semua kode dan mulai dari awal",
        "Belajar dari error dan mencari solusinya",
        "Menyalahkan komputer yang rusak"
      ],
      correct: 2
    },
    {
      question: "Berapa lama waktu ideal untuk practice coding setiap hari bagi pemula?",
      options: [
        "8 jam setiap hari",
        "30 menit secara konsisten",
        "Hanya weekend saja",
        "Sekali seminggu 5 jam"
      ],
      correct: 1
    },
    {
      question: "Apa keunggulan programmer Indonesia menurut materi ini?",
      options: [
        "Hanya bisa bahasa Indonesia",
        "Tidak suka belajar hal baru",
        "Kreativitas dan budaya gotong royong",
        "Hanya bisa coding aplikasi lokal"
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
    
    if (score >= 6) { // Need 6 out of 8 correct (75%)
      completeModule();
    }
  };

  // Replace the completeModule function with this:

const completeModule = async () => {
  if (!user) return;

  try {
    // Mark final course as completed (this will automatically level up the user)
    const response = await fetch('http://localhost:8000/course-completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        course_id: 'pendahuluan5', // Final course in pendahuluan module
        module_id: 'pendahuluan'
      })
    });

    if (response.ok) {
      // Award higher DiKoin for completion
      const dikoinResponse = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dikoin: user.dikoin + 200 // Higher reward for completing module
        })
      });

      if (dikoinResponse.ok) {
        // Fetch updated user data instead of calling level-up again
        const userResponse = await fetch(`http://localhost:8000/users/${user.id}`);
        if (userResponse.ok) {
          const updatedUserData = await userResponse.json();
          setUser(updatedUserData);
          localStorage.setItem('kodino_user', JSON.stringify(updatedUserData));
        }
      }

      // Award Nusantara Coder badge
      await awardNusantaraCoderBadge(user.id);
    }
  } catch (error) {
    console.error('Error completing module:', error);
  }
};

  const awardNusantaraCoderBadge = async (userId: string) => {
    try {
      const response = await fetch('http://localhost:8000/user-lencana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          lencana_id: 'nusantara-coder-001'
        })
      });
      
      if (response.ok) {
        console.log('Nusantara Coder badge awarded successfully!');
      }
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  if (showResults) {
    return (
      <div className="materi-page">
        <Header />
        <div className="quiz-results">
          <div className="results-content">
            <h2>🎉 Hasil Quiz Final</h2>
            <div className="score-display">
              <h3>Skor: {quizScore}/{quizQuestions.length}</h3>
              <div className="score-circle">
                <span>{Math.round((quizScore / quizQuestions.length) * 100)}%</span>
              </div>
            </div>
            
            {quizScore >= 6 ? (
              <div className="success-message">
                <h3>🏆 SELAMAT! MODULE PENDAHULUAN COMPLETE!</h3>
                <p>Kamu telah menyelesaikan seluruh modul Pendahuluan Programming dengan gemilang!</p>
                <div className="rewards">
                  <div className="reward-item">
                    <span>💰</span>
                    <p>+200 DiKoin</p>
                  </div>
                  <div className="reward-item">
                    <span>🏆</span>
                    <p>Nusantara Coder Badge</p>
                  </div>
                  <div className="reward-item">
                    <span>⬆️</span>
                    <p>Level {(user?.progress?.level || 1) + 1}!</p>
                  </div>
                </div>
                <div className="motivation-box">
                  <h4>🚀 Achievement Unlocked!</h4>
                  <ul>
                    <li>✅ Modul Pendahuluan Programming Complete</li>
                    <li>✅ Foundation Knowledge Mastered</li>
                    <li>✅ Ready for Advanced Modules</li>
                    <li>✅ Indonesian Programmer Mindset</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="retry-message">
                <h3>📚 Almost There!</h3>
                <p>Kamu perlu skor minimal 75% (6/8) untuk menyelesaikan modul. Coba lagi ya!</p>
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
              <button onClick={() => navigate('/dashboard')}>
                Kembali ke Dashboard
              </button>
              {quizScore >= 6 && (
                <button onClick={() => navigate('/materi/logika-dan-variabel')}>
                  Lanjut ke: Logika dan Variabel
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
            <h2>📝 Quiz Final: Siap Jadi Programmer!</h2>
            <p>Quiz komprehensif untuk menyelesaikan modul Pendahuluan Programming!</p>
            <div className="quiz-info">
              <p><strong>📊 Passing Score: 6/8 (75%)</strong></p>
              <p>🏆 Reward: 200 DiKoin + Nusantara Coder Badge + Level UP!</p>
            </div>
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
              Submit Final Quiz
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
            {currentSlide === slides.length - 1 ? 'Final Quiz →' : 'Selanjutnya →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiapJadiProgrammer;