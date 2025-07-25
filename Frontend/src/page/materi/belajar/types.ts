// Common types for the belajar page
export interface Character {
  image: string; // URL to character image (3:4 aspect ratio)
  name?: string; // Optional character name
  dialog?: string; // Optional one-line dialog text
  x: number; // X-coordinate for positioning
  y: number; // Y-coordinate for positioning
  direction?: 'left' | 'right'; // Direction the character is facing (default: 'right')
}

export interface PageIllustration {
  character: Character[];
}

export interface LorePage {
  type: 'lore';
  heading: string;
  content: {
    text: string[]; // Array of paragraphs for the lore text
    illustration: PageIllustration;
  };
}

export interface SpeakPage {
  type: 'speak';
  heading: string;
  content: {
    character?: {
      character: Character;
      position: 'left' | 'right';
    };
    dialog: {
      name?: string;
      text: string;
    };
  };
  isFirstPage?: boolean;
}

// Union type for different page types
export interface QuizPage {
  type: 'quiz';
  heading: string;
  content: {
    character: {
      image: string;
      name: string;
      direction?: 'left' | 'right';
    };
    question: {
      text: string;
      correctText: string;
      wrongText: string;
      answers: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
      }>;
    };
  };
}

export type LessonPage = LorePage | SpeakPage | QuizPage;

export interface LessonPages {
  id: string; // Matches the lesson.id from the URL
  title: string; // Lesson title
  pages: LessonPage[];
}

// Sample data structure for a lesson with a single lore page
export const sampleLesson: LessonPages = {
  id: 'apa-itu-ngoding',
  title: 'Apa Itu Ngoding?',
  pages: [
    {
      type: 'lore',
      heading: 'Apa itu Ngoding?',
      content: {
        text: [
          'Di masa depan, dunia sudah sangat maju. Manusia, hewan, dan bahkan robot hidup berdampingan. Teknologi canggih bukan lagi sesuatu yang sulit ... siapa pun bisa membuat program hanya dengan menjentikkan jari!',
          'Di tengah kota Digital Indonesia, atau Dinonesia, tinggal dua sahabat: Kodi, seekor Dinosaurus kecil yang punya rasa ingin tahu tinggi, dan Komo, satu-satunya Komodo yang masih hidup di zamannya.'
        ],
        illustration: {
          character: [
            {
              image: '/images/characters/kodi.webp',
              name: 'Kodi',
              dialog: '',
              direction: 'right',
              x: 30, // percentage from left
              y: 60  // percentage from top; 60 if no dialog, else 90
            },
            {
              image: '/images/characters/komo.webp',
              name: 'Komo',
              direction: 'left',
              dialog: '',
              x: 70,
              y: 60
            }
          ]
        }
      }
    },
    {
      type: 'speak',
      heading: 'Apa itu Ngoding?',
      content: {
        character: {
          character: {
            image: '/images/characters/kodi.webp',
            name: 'Kodi',
            direction: 'right', // or 'right'
            x: 0, // position values (not used in SpeakPage but required by Character type)
            y: 0
          },
          position: 'right' // or 'right'
        },
        dialog: {
          name: 'Kodi', // optional
          text: 'Hmm.. Aku bingung mengenai cara kerja komputer untuk ngoding. Kok sepertinya rumit sekali?!'
        }
      }
    },
    {
      type: 'quiz',
      heading: 'Kuis: Dasar-dasar Pemrograman',
      content: {
        character: {
          image: '/images/characters/kodi.webp',
          name: 'Komo',
          direction: 'right'
        },
        question: {
          text: 'Apa yang dimaksud dengan variabel dalam pemrograman?',
          correctText: 'Tepat sekali! Variabel digunakan untuk menyimpan data yang dapat berubah-ubah nilainya selama program berjalan.',
          wrongText: 'Yah, jawabanmu belum tepat. Variabel digunakan untuk menyimpan data yang dapat berubah-ubah nilainya selama program berjalan.',
          answers: [
            {
              id: 'a1', isCorrect: true,
              text: 'Tempat untuk menyimpan data yang dapat berubah-ubah nilainya'
            },
            {
              id: 'a2', isCorrect: false,
              text: 'Fungsi untuk menampilkan teks ke layar'
            },
            {
              id: 'a3', isCorrect: false,
              text: 'Struktur data untuk menyimpan kumpulan nilai'
            },
            {
              id: 'a4', isCorrect: false,
              text: 'Perintah untuk mengulang suatu blok kode'
            }
          ]
        }
      }
    },
    {
      type: 'speak',
      heading: 'Apa itu Ngoding?',
      content: {
        character: {
          character: {
            image: '/images/characters/kodi.webp',
            name: 'Kodi',
            direction: 'right', // or 'right'
            x: 0, // position values (not used in SpeakPage but required by Character type)
            y: 0
          },
          position: 'right' // or 'right'
        },
        dialog: {
          name: 'Kodi', // optional
          text: 'Hmm.. Aku bingung mengenai cara kerja komputer untuk ngoding. Kok sepertinya rumit sekali?!'
        }
      }
    }
  ]
};

// This would be replaced with an actual API call in a real implementation
export const getLessonById = async (id: string): Promise<LessonPages | null> => {
  // In a real app, this would fetch from an API
  if (id === 'sample-lesson') {
    return sampleLesson;
  }
  return null;
};
