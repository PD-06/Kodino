# Kodino - Product Specification

## 1. Product Overview
**Name**: Kodino  
**Tagline**: Asah ngoding lo bareng Kodino!  
**Domain**: kodino.id  
**Target Audience**: Indonesian primary school students (grades 4-6)  
**Platform**: Mobile-first web application  
**Core Value**: Free, culturally-relevant programming education

## 2. Educational Framework

### Learning Structure
- **Session Length**: 35 minutes per learning module
- **Pacing**: Slow-paced to accommodate young learners
- **Teaching Method**: Narrative-based learning with Kodi the T-Rex and Python the Snake
- **Pedagogical Approach**: Learn through solving local Indonesian problems

### Course Structure
1. **Sumatera**: Pendahuluan (Introduction)
2. **Kalimantan**: Logika dan Variabel (Logic & Variables)
3. **Sulawesi**: Struktur Data dan Interaksi (Data Structures & Interaction)
4. **Papua**: Struktur Program & Pengulangan Kompleks (Program Structure & Complex Loops)
5. **Jawa**: Pengembangan Program dan Kode Modular (Program Development & Modular Code)
6. **Pulau Komodo**: Pemrograman Bebas (Free Programming)

## 3. Technical Specifications

### Frontend
- **Framework**: React.js with TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Typography**:
  - Headings: 'Alibaba Sans', sans-serif
  - Body Text: 'Gabriel Sans Condensed', sans-serif
  - Code: 'Fira Code', monospace
- **Color Palette**:
  - Primary: `#C97336` (Main brand color)
  - Primary Light: `#DA9D72` (Hover states)
  - Primary Dark: `#653A1B` (Active states)
  - Accent Blue: `#1976D2`
  - Accent Yellow: `#FFD600`
  - Accent Red: `#D32F2F`
  - Text: `#212121` (Dark), `#757575` (Secondary)
  - Background: `#F5F5F5` (Light), `#FFFFFF` (Cards)
- **State Management**: React Context API
- **Routing**: React Router
- **Code Editor**: Monaco Editor
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form

### Backend
- **Framework**: Flask (Python)
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **Hosting**: Firebase Hosting
- **Code Execution**: Server-side Python execution
  - Code sent as Base64
  - Processed on server
  - Output returned to client

### Localization
- **Default Language**: Indonesian (Bahasa Indonesia)
- **Secondary Language**: English (toggleable)
- **Implementation**: i18n with language toggle in dashboard

## 4. User Experience

### Navigation Structure
- **Left**: Kodino logo + text
- **Right**: 
  - Beranda (Home)
  - Tentang (About)
  - Materi (Materials)
  - Daftar/Masuk (Sign Up/Login) button

### Core User Flows
1. **Landing Page**
   - Hero section with Kodi character and call-to-action
   - Key features highlight
   - "Apa yang Bikin Kodino Beda?" (What Makes Kodino Different?)
   - Call-to-action buttons

2. **Onboarding**
   - Sign up form with full name, username, school, password
   - Email optional
   - School field for educational tracking

3. **Dashboard**
   - Continue learning section
   - Course progress tracking
   - Dicoin balance display
   - Recommended lessons

4. **Learning Flow**
   - Clean, focused interface
   - Progress indicators
   - Clear navigation between lessons
   - Access to AI help

### UI Components
- **Buttons**: Rounded corners, primary color with hover states
- **Cards**: Clean white background with subtle shadows
- **Input Fields**: Clear labels, proper spacing, validation states
- **Navigation**: Sticky header, clear active states

### Accessibility
- Touch-friendly interface (minimum 48x48px touch targets)
- Responsive design for various screen sizes
- Clear visual hierarchy and feedback

## 5. Gamification System

### Dicoin Economy
- **Earning**: Complete lessons and challenges
- **Spending**:
  - Cultural artifacts (island cultural and historical artifacts)
  - Kodi skins (traditional costumes)

### Achievements
- **Completion Badges**: For finishing each island's course
- **Collection Badges**: For completing artifact sets

## 6. Content Strategy

### Lesson Structure
1. **Introduction**: Story hook and learning objectives
2. **Story Problem**: Engage the student with cultural narrative
3. **Programming as Solution**: Introduce concept as solution
4. **Interactive Examples**: Programming concept analogies and real-world applications
5. **Practice Exercises**: With immediate feedback
6. **Summary & Next Steps**: Recap and preview

### Cultural Integration
- Each lesson tied to regional Indonesian context
- Problems based on local scenarios
- Artifacts representing cultural heritage
- Traditional costumes for Kodi

## 7. Technical Implementation

### Code Execution Flow
1. User writes/edits code in browser
2. Code is encoded in Base64 and sent to server
3. Server decodes and executes code in sandbox
4. Output/errors captured and sent back to client
5. Result displayed to user

### Data Model
```typescript
interface User {
  id: string;
  username: string;
  fullName: string;
  school: string;
  email?: string;
  dicoin: number;
  completedLessons: string[];
  achievements: string[];
  inventory: string[];
  activeSkin: string;
  locale: 'id' | 'en';
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: LessonContent[];
  order: number;
  moduleId: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  courseId: string;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  island: string;
  order: number;
  icon: string;
}

interface Artifact {
  id: string;
  name: string;
  description: string;
  price: number;
  island: string;
  image: string;
}

interface Skin {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  region: string;
}
```

## 8. Development Roadmap

### Phase 1: MVP (Hackathon; ordered by priority)
- Indonesian localization
- Core authentication
- Basic course navigation
- Basic Dicoin system
- Artifact collection system
- Achievement system
- English localization

### Phase 2: Post-Hackathon
- Simple code editor with execution
- Enhanced code editor features
- Progress reporting

### Phase 3: Future Enhancements
- Offline support
- Parent/teacher dashboard
- Expanded course content
- Community features

## 9. Success Metrics
- Lesson completion rates
- Average session duration
- Return user rate
- Collection completion rates

## 10. Legal & Compliance
- Terms of Service
- Privacy Policy (ID law compliant)
- Data protection measures
- Content moderation guidelines

## 11. Sponsorship & Partnerships
- Dedicated section in footer for sponsors
- Partnership opportunities for educational institutions
- Recognition for contributors

## 12. Appendices

### A. Character Design
- **Kodi (T-Rex)**: Friendly, approachable, expressive
- **Python (Snake)**: Playful, helpful, knowledgeable
- **Design Guidelines**: Bright colors, clear expressions, culturally appropriate

### B. Cultural Guidelines
- Respectful representation of all Indonesian cultures
- No cultural appropriation
- Authentic representation of regional diversity
- Educational value in cultural elements

### C. Technical Dependencies
- See `package.json` and `requirements.txt` for complete lists
- External services:
  - Firebase (Auth, Firestore, Hosting)
  - Google Cloud (Speech-to-Text, TTS)

### D. Design Assets
- **Logo**: Kodi the T-Rex character
- **Illustrations**:
  - Kodi in different poses
  - Cultural elements from various Indonesian regions
  - Coding-related icons and motifs
- **Icons**: Consistent set for navigation and features

### E. Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### F. Accessibility
- Color contrast ratios meet WCAG 2.1 AA standards
- Keyboard navigation support
- Screen reader friendly components
- Proper ARIA labels

*Document Version: 1.1  
Last Updated: July 24, 2025*
