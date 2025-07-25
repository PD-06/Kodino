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

interface AIQuestion {
  id: number;
  type: 'multiple-choice' | 'fill-in-the-blank';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
}

const AIQuizPendahuluan = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('kodino_user');
    if (userData) {
      setUser(JSON.parse(userData));
      generateAIQuestions();
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      submitQuiz();
    }
  }, [timeLeft, quizStarted, showResults]);

  // Update the generateAIQuestions function:

const generateAIQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          module: 'pendahuluan',
          topic: 'Dasar-dasar Programming dan Komputer',
          num_multiple_choice: 8,
          num_fill_in_blank: 2,
          difficulty: 'beginner',
          language: 'indonesian'
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        // Validate the data structure
        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else {
          console.warn('Invalid questions format, using fallback');
          setQuestions(getFallbackQuestions());
        }
      } else {
        console.warn('API request failed, using fallback questions');
        setQuestions(getFallbackQuestions());
      }
    } catch (error) {
      console.error('Error generating AI questions:', error);
      setQuestions(getFallbackQuestions());
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackQuestions = (): AIQuestion[] => {
    return [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'Apa yang dimaksud dengan programming?',
        options: [
          'Bermain game di komputer',
          'Memberikan instruksi kepada komputer untuk menyelesaikan tugas',
          'Memperbaiki hardware komputer',
          'Mendesain tampilan website'
        ],
        correct_answer: 'Memberikan instruksi kepada komputer untuk menyelesaikan tugas',
        explanation: 'Programming adalah proses memberikan instruksi step-by-step kepada komputer untuk menyelesaikan tugas tertentu.'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'Dalam analogi memasak rendang, apa yang dimaksud dengan "Input"?',
        options: [
          'Rendang yang sudah jadi',
          'Proses memasak',
          'Bahan-bahan seperti daging dan bumbu',
          'Kompor dan wajan'
        ],
        correct_answer: 'Bahan-bahan seperti daging dan bumbu',
        explanation: 'Input adalah data atau bahan mentah yang dimasukkan ke dalam sistem, seperti bahan-bahan masakan.'
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'Bahasa pemrograman mana yang direkomendasikan untuk pemula?',
        options: [
          'Assembly',
          'Python',
          'Machine Code',
          'Binary'
        ],
        correct_answer: 'Python',
        explanation: 'Python memiliki syntax yang mudah dipahami dan cocok untuk pemula belajar programming.'
      },
      {
        id: 4,
        type: 'multiple-choice',
        question: 'Apa fungsi utama CPU dalam komputer?',
        options: [
          'Menyimpan data permanent',
          'Menampilkan gambar di layar',
          'Memproses instruksi dan data',
          'Menghubungkan ke internet'
        ],
        correct_answer: 'Memproses instruksi dan data',
        explanation: 'CPU (Central Processing Unit) berfungsi sebagai "otak" komputer yang memproses semua instruksi dan perhitungan.'
      },
      {
        id: 5,
        type: 'multiple-choice',
        question: 'Apa perbedaan antara RAM dan Storage?',
        options: [
          'RAM lebih cepat tapi sementara, Storage lebih lambat tapi permanent',
          'RAM dan Storage sama saja',
          'RAM untuk internet, Storage untuk aplikasi',
          'RAM lebih mahal, Storage lebih murah'
        ],
        correct_answer: 'RAM lebih cepat tapi sementara, Storage lebih lambat tapi permanent',
        explanation: 'RAM menyimpan data sementara dengan akses cepat, sedangkan Storage menyimpan data secara permanent.'
      },
      {
        id: 6,
        type: 'multiple-choice',
        question: 'Mindset apa yang paling penting untuk programmer?',
        options: [
          'Menghafal semua syntax',
          'Bekerja sendirian',
          'Continuous learning dan problem solving',
          'Hanya fokus satu bahasa'
        ],
        correct_answer: 'Continuous learning dan problem solving',
        explanation: 'Programmer harus selalu belajar teknologi baru dan terampil memecahkan masalah dengan kreatif.'
      },
      {
        id: 7,
        type: 'multiple-choice',
        question: 'Apa yang sebaiknya dilakukan ketika menemui error dalam coding?',
        options: [
          'Langsung menyerah',
          'Menghapus semua kode',
          'Belajar dari error dan mencari solusinya',
          'Menyalahkan komputer'
        ],
        correct_answer: 'Belajar dari error dan mencari solusinya',
        explanation: 'Error adalah bagian normal dari programming dan merupakan kesempatan belajar yang berharga.'
      },
      {
        id: 8,
        type: 'multiple-choice',
        question: 'Platform mana yang TIDAK cocok untuk belajar programming mendalam?',
        options: [
          'GitHub',
          'Stack Overflow',
          'TikTok',
          'Codecademy'
        ],
        correct_answer: 'TikTok',
        explanation: 'Meskipun TikTok bisa memberikan tips cepat, platform lain lebih cocok untuk pembelajaran mendalam dan praktik.'
      },
      {
        id: 9,
        type: 'fill-in-the-blank',
        question: 'Siklus kerja komputer mengikuti pola: _____ → PROCESS → OUTPUT',
        correct_answer: 'INPUT',
        explanation: 'Komputer bekerja dengan menerima input, memprosesnya, lalu menghasilkan output.'
      },
      {
        id: 10,
        type: 'fill-in-the-blank',
        question: 'Filosofi gotong royong dalam programming berarti saling _____ dan berbagi ilmu sesama programmer.',
        correct_answer: 'membantu',
        explanation: 'Komunitas programming Indonesia menerapkan nilai gotong royong dengan saling membantu dan berbagi pengetahuan.'
      }
    ];
  };

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer.trim() });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    let correctAnswers = 0;
    questions.forEach(q => {
      const userAnswer = answers[q.id];
      if (q.type === 'fill-in-the-blank') {
        // Case-insensitive comparison for fill-in-the-blank
        if (userAnswer && userAnswer.toLowerCase().includes(q.correct_answer.toLowerCase())) {
          correctAnswers++;
        }
      } else {
        if (userAnswer === q.correct_answer) {
          correctAnswers++;
        }
      }
    });
    
    setScore(correctAnswers);
    setShowResults(true);
    
    if (correctAnswers >= 7) { // 70% to pass
      completeAIQuiz(correctAnswers);
    }
  };

  const completeAIQuiz = async (finalScore: number) => {
    if (!user) return;

    try {
      const response = await fetch('http://localhost:8000/ai-quiz-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          module_id: 'pendahuluan',
          score: finalScore,
          total_questions: questions.length,
          time_taken: 1800 - timeLeft
        })
      });

      if (response.ok) {
        // Award bonus DiKoin for AI Quiz
        const dikoinResponse = await fetch(`http://localhost:8000/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dikoin: user.dikoin + 300 // Premium reward for AI Quiz
          })
        });

        if (dikoinResponse.ok) {
          const updatedUser = { ...user, dikoin: user.dikoin + 300 };
          setUser(updatedUser);
          localStorage.setItem('kodino_user', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Error completing AI quiz:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Update the loading screen:

if (isLoading) {
    return (
      <div className="materi-page">
        <Header />
        <div className="quiz-container">
          <div className="loading-ai">
            <h2>🤖 Gemini AI sedang menyiapkan quiz khusus untukmu...</h2>
            <div className="loading-spinner"></div>
            <p>Sabar ya, ini akan jadi quiz yang menantang! 🚀</p>
          </div>
        </div>
      </div>
    );
  }

  // Update the quiz intro:

if (!quizStarted) {
    return (
      <div className="materi-page">
        <Header />
        <div className="quiz-container">
          <div className="quiz-intro">
            <div className="character-section">
              <img src="/images/kodi-ai.webp" alt="Kodi with AI" className="kodi-character" />
              <div className="speech-bubble">
                Halo! Aku bersama Gemini AI siap menguji pemahaman kamu tentang Pendahuluan Programming!
              </div>
            </div>
            <div className="quiz-details">
              <h2>🤖 Gemini AI Quiz Challenge: Pendahuluan Programming</h2>
              <div className="quiz-info">
                <div className="info-item">
                  <span>📊</span>
                  <p><strong>10 Pertanyaan</strong> (8 pilihan ganda + 2 isian)</p>
                </div>
                <div className="info-item">
                  <span>⏰</span>
                  <p><strong>30 Menit</strong> waktu pengerjaan</p>
                </div>
                <div className="info-item">
                  <span>🎯</span>
                  <p><strong>70%</strong> nilai minimum untuk lulus</p>
                </div>
                <div className="info-item">
                  <span>💰</span>
                  <p><strong>300 DiKoin</strong> + Special AI Badge</p>
                </div>
              </div>
              <div className="warning-box">
                <h4>⚠️ Perhatian:</h4>
                <ul>
                  <li>Quiz ini menggunakan Gemini AI untuk pertanyaan yang lebih menantang</li>
                  <li>Setelah dimulai, timer tidak bisa dihentikan</li>
                  <li>Pastikan koneksi internet stabil</li>
                  <li>Jawaban tidak bisa diubah setelah submit</li>
                </ul>
              </div>
              <button 
                className="start-quiz-btn"
                onClick={() => setQuizStarted(true)}
              >
                🚀 Mulai Gemini AI Quiz Challenge!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    const passed = score >= 7;

    return (
      <div className="materi-page">
        <Header />
        <div className="quiz-results">
          <div className="results-content">
            <h2>🤖 Hasil AI Quiz Challenge</h2>
            <div className="score-display">
              <h3>Skor: {score}/{questions.length}</h3>
              <div className="score-circle">
                <span>{Math.round(percentage)}%</span>
              </div>
            </div>
            
            {passed ? (
              <div className="success-message">
                <h3>🏆 LUAR BIASA! AI QUIZ BERHASIL!</h3>
                <p>Kamu telah menguasai materi Pendahuluan Programming dengan gemilang!</p>
                <div className="rewards">
                  <div className="reward-item">
                    <span>💰</span>
                    <p>+300 DiKoin</p>
                  </div>
                  <div className="reward-item">
                    <span>🤖</span>
                    <p>AI Master Badge</p>
                  </div>
                  <div className="reward-item">
                    <span>⏱️</span>
                    <p>Waktu: {formatTime(1800 - timeLeft)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="retry-message">
                <h3>📚 Hampir Berhasil!</h3>
                <p>Kamu perlu skor minimal 70% (7/10) untuk lulus AI Quiz. Pelajari lagi materi dan coba lagi!</p>
                <button onClick={() => navigate('/materi/pendahuluan')}>
                  Kembali ke Materi
                </button>
              </div>
            )}
            
            <div className="answers-review">
              <h4>📋 Review Jawaban:</h4>
              {questions.map((q, index) => (
                <div key={q.id} className="answer-review-card">
                  <h5>Pertanyaan {index + 1}</h5>
                  <p>{q.question}</p>
                  <div className="answer-comparison">
                    <p><strong>Jawaban Kamu:</strong> {answers[q.id] || 'Tidak dijawab'}</p>
                    <p><strong>Jawaban Benar:</strong> {q.correct_answer}</p>
                    {answers[q.id] === q.correct_answer ? (
                      <span className="correct">✅ Benar</span>
                    ) : (
                      <span className="incorrect">❌ Salah</span>
                    )}
                  </div>
                  <div className="explanation">
                    <p><strong>Penjelasan:</strong> {q.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="navigation-buttons">
              <button onClick={() => navigate('/dashboard')}>
                Kembali ke Dashboard
              </button>
              {passed && (
                <button onClick={() => navigate('/materi/logika-dan-variabel')}>
                  Lanjut ke Modul Berikutnya
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="materi-page">
      <Header />
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="quiz-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span>{currentQuestion + 1} / {questions.length}</span>
          </div>
          <div className="timer">
            <span className={timeLeft < 300 ? 'timer-warning' : ''}>
              ⏰ {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="question-container">
          <div className="question-card">
            <div className="question-type">
              {currentQ.type === 'multiple-choice' ? '📝 Pilihan Ganda' : '✏️ Isian'}
            </div>
            <h3>Pertanyaan {currentQuestion + 1}</h3>
            <p className="question-text">{currentQ.question}</p>

            {currentQ.type === 'multiple-choice' ? (
              <div className="options">
                {currentQ.options?.map((option, index) => (
                  <label key={index} className="option-label">
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={option}
                      onChange={() => handleAnswer(currentQ.id, option)}
                      checked={answers[currentQ.id] === option}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="fill-in-blank">
                <input
                  type="text"
                  placeholder="Tulis jawabanmu di sini..."
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                  className="fill-input"
                />
              </div>
            )}
          </div>
        </div>

        <div className="quiz-navigation">
          <button 
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="nav-button prev"
          >
            ← Sebelumnya
          </button>
          
          <div className="question-indicators">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`question-indicator ${index === currentQuestion ? 'active' : ''} ${answers[questions[index].id] ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <button 
              onClick={submitQuiz}
              className="submit-quiz-btn"
              disabled={Object.keys(answers).length < questions.length}
            >
              Submit Quiz 🚀
            </button>
          ) : (
            <button 
              onClick={nextQuestion}
              className="nav-button next"
            >
              Selanjutnya →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIQuizPendahuluan;