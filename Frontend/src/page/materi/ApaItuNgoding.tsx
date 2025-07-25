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

const ApaItuNgoding = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
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
      title: "Apa Itu Ngoding? 💻",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi excited" className="kodi-character" />
            <div className="speech-bubble">
              Halo! Aku Kodi! Hari ini kita akan belajar tentang "ngoding" atau programming!
            </div>
          </div>
          <div className="content-text">
            <h3>🎯 Yang akan kamu pelajari:</h3>
            <ul>
              <li>Apa itu programming/ngoding?</li>
              <li>Kenapa programming itu penting?</li>
              <li>Contoh-contoh programming dalam kehidupan sehari-hari</li>
              <li>Bahasa pemrograman yang populer</li>
            </ul>
          </div>
        </div>
      )
    },
    { title: "", content: ( <div className="slide-content lore"> <img className="full-page-image" src="/images/materi/9.png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"> <img className="full-page-image" src="/images/materi/10.png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"> <img className="full-page-image" src="/images/materi/11.png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"> <img className="full-page-image" src="/images/materi/12.png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"> <img className="full-page-image" src="/images/materi/13.png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"> <img className="full-page-image" src="/images/materi/14.png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"> <img className="full-page-image" src="/images/materi/14.png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"><img className="full-page-image" src="/images/materi/Lesson%20Page%20(2).png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"><img className="full-page-image" src="/images/materi/Lesson%20Page%20(3).png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"><img className="full-page-image" src="/images/materi/Lesson%20Page%20(4).png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"><img className="full-page-image" src="/images/materi/Lesson%20Page%20(5).png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"><img className="full-page-image" src="/images/materi/Lesson%20Page%20(6).png" alt="Lore Awal"/> </div> ) },
    { title: "", content: ( <div className="slide-content lore"><img className="full-page-image" src="/images/materi/Lesson%20Page%20(7).png" alt="Lore Awal"/> </div> ) },
    {
      title: "Apa Itu Programming? 🤔",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi thinking" className="kodi-character" />
            <div className="speech-bubble">
              Programming itu seperti memberikan instruksi kepada komputer!
            </div>
          </div>
          <div className="content-text">
            <h3>Programming adalah...</h3>
            <div className="definition-box">
              <p><strong>Programming</strong> atau <strong>ngoding</strong> adalah proses membuat instruksi untuk komputer agar bisa menyelesaikan tugas tertentu.</p>
            </div>
            <div className="analogy-section">
              <h4>📖 Analogi Sederhana:</h4>
              <p>Bayangkan kamu sedang mengajarkan teman cara membuat nasi goreng. Kamu harus memberikan instruksi yang jelas dan urut:</p>
              <ol>
                <li>Panaskan minyak di wajan</li>
                <li>Masukkan bawang putih</li>
                <li>Tambahkan nasi</li>
                <li>Aduk rata</li>
              </ol>
              <p>Programming juga seperti itu - memberikan instruksi step-by-step ke komputer!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Mengapa Programming Penting? 🌟",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi happy" className="kodi-character" />
            <div className="speech-bubble">
              Programming ada di mana-mana! Mari kita lihat contohnya!
            </div>
          </div>
          <div className="content-text">
            <h3>🔥 Programming dalam Kehidupan Sehari-hari:</h3>
            <div className="examples-grid">
              <div className="example-card">
                <span className="example-icon">📱</span>
                <h4>Aplikasi Mobile</h4>
                <p>WhatsApp, Instagram, TikTok, game mobile</p>
              </div>
              <div className="example-card">
                <span className="example-icon">🌐</span>
                <h4>Website</h4>
                <p>Google, YouTube, Facebook, e-commerce</p>
              </div>
              <div className="example-card">
                <span className="example-icon">🎮</span>
                <h4>Game</h4>
                <p>Mobile Legends, Free Fire, Genshin Impact</p>
              </div>
              <div className="example-card">
                <span className="example-icon">🚗</span>
                <h4>Smart Devices</h4>
                <p>Mobil pintar, smart TV, ATM</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Bahasa Pemrograman 🗣️",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi teaching" className="kodi-character" />
            <div className="speech-bubble">
              Ada banyak bahasa pemrograman, seperti bahasa manusia!
            </div>
          </div>
          <div className="content-text">
            <h3>🌍 Bahasa Pemrograman Populer:</h3>
            <div className="languages-grid">
              <div className="language-card">
                <span className="lang-icon">🐍</span>
                <h4>Python</h4>
                <p>Mudah dipelajari, untuk AI dan data science</p>
              </div>
              <div className="language-card">
                <span className="lang-icon">☕</span>
                <h4>JavaScript</h4>
                <p>Untuk website interaktif</p>
              </div>
              <div className="language-card">
                <span className="lang-icon">☕</span>
                <h4>Java</h4>
                <p>Untuk aplikasi enterprise dan Android</p>
              </div>
              <div className="language-card">
                <span className="lang-icon">⚡</span>
                <h4>C++</h4>
                <p>Untuk game dan sistem performa tinggi</p>
              </div>
            </div>
            <div className="info-box">
              <h4>💡 Fun Fact:</h4>
              <p>Setiap bahasa pemrograman punya kegunaan dan kelebihan masing-masing, seperti bahasa daerah di Indonesia!</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Programmer Adalah... 👨‍💻",
      content: (
        <div className="slide-content">
          <div className="character-section">
            <img src="/images/kodi-character.webp" alt="Kodi proud" className="kodi-character" />
            <div className="speech-bubble">
              Programmer itu seperti problem solver dan creator!
            </div>
          </div>
          <div className="content-text">
            <h3>🎯 Apa yang Dilakukan Programmer?</h3>
            <div className="roles-list">
              <div className="role-item">
                <span className="role-icon">🧩</span>
                <div>
                  <h4>Problem Solver</h4>
                  <p>Memecahkan masalah dengan kode</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">🎨</span>
                <div>
                  <h4>Creator</h4>
                  <p>Membuat aplikasi, website, dan game</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">🔧</span>
                <div>
                  <h4>Builder</h4>
                  <p>Membangun solusi digital</p>
                </div>
              </div>
              <div className="role-item">
                <span className="role-icon">🚀</span>
                <div>
                  <h4>Innovator</h4>
                  <p>Menciptakan teknologi baru</p>
                </div>
              </div>
            </div>
            <div className="motivation-box">
              <h4>✨ Kenapa Belajar Programming?</h4>
              <ul>
                <li>Peluang karir yang luas</li>
                <li>Gaji yang menarik</li>
                <li>Bisa bekerja dari mana saja</li>
                <li>Melatih logika dan kreativitas</li>
                <li>Bisa bikin aplikasi sendiri!</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const quizQuestions = [
    {
      question: "Sekarang, Kodi, Ngoding itu mirip seperti apa?",
      options: [
        "A. Menulis lagu untuk komputer",
        "B. Memberi perintah jelas ke komputer",
        "C. Membaca pikiran komputer",
        "D. Menghancurkan Komputer"
      ],
      correct: 1
    },
    {
      question: "Nah, karena kamu sudah mengerti, Ibu Dina akan memberikan kamu sebuah kuis. Dalam memasak rendang, yang menjadi keluaran adalah…",
      options: [
        "A. Daging Mentah",
        "B. Panci",
        "C. Rendang Matang",
        "D. Api"
      ],
      correct: 2
    },
    {
      question: "Sekarang, kita pengen nanya ke kamu, Kodi!! Dari bahasa-bahasa dibawah ini yang bukan merupakan bahasa pemrograman yang mana?",
      options: [
        "A. Python",
        "B. Javascript",
        "C. Bahasa Jawa",
        "D. C++"
      ],
      correct: 2
    },
    {
      question: "Suku Batak memiliki sebuah kata ajaib yang bisa diucapkan menggunakan syntax pemrograman yang sudah disebutkan. Jika program yang ditulis adalah cetak(\"Horas!\"), maka akan mengeluarkan ",
      options: [
        "A. Horas!",
        "B. Error",
        "C. cetak(\"Horas!\")",
        "D. Komputer akan rusak"
      ],
      correct: 0
    },
    {
      question: "Sebelum kita melanjutkan ke bab selanjutnya, Kodi ingin tahu kunci kesuksesan kamu sebagai programmer. Menurut kamu, programmer yang baik adalah programmer yang",
      options: [
        "A. Ga pernah salah",
        "B. Hapal semua kode",
        "C. Mau belajar dan coba terus",
        "D. Bisa meretas NASA"
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
    
    if (score >= 2) { // Pass if 2 out of 3 correct
      completeModule();
    }
  };

  // Update the completeModule function:

const completeModule = async () => {
    if (!user) return;
  
    try {
      // Mark course as completed with the correct course_id
      const response = await fetch('http://localhost:8000/course-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          course_id: 'pendahuluan1', // This matches the backend module courses
          module_id: 'pendahuluan'
        })
      });
  
      if (response.ok) {
        // Award DiKoin
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
  
        // Award First Steps badge for completing first course
        await awardFirstStepsBadge(user.id);
  
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error completing module:', error);
    }
  };
  
  // Add function to award badge
  const awardFirstStepsBadge = async (userId: string) => {
    try {
      const response = await fetch('http://localhost:8000/user-lencana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          lencana_id: 'first-steps-001' // Make sure this ID exists in database
        })
      });
      
      if (response.ok) {
        console.log('First Steps badge awarded successfully!');
      }
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };
  
  // ...rest of the component remains the same

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
                <p>Kamu telah memahami dasar-dasar programming dengan baik!</p>
                <div className="rewards">
                  <div className="reward-item">
                    <span>💰</span>
                    <p>+100 DiKoin</p>
                  </div>
                  <div className="reward-item">
                    <span>🏆</span>
                    <p>Lencana "First Steps"</p>
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
            <button onClick={() => { completeModule();  navigate('/dashboard')}}>
                Kembali ke Dashboard
              </button>
              {quizScore >= 2 && (
                <button onClick={() => { completeModule(); navigate('/materi/pendahuluan')}}>
                  Lanjut ke Modul Berikutnya
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
            <h2>📝 Quiz: Apa Itu Ngoding?</h2>
            <p>Jawab pertanyaan berikut untuk menyelesaikan modul!</p>
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

export default ApaItuNgoding;