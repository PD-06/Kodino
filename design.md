# Kodino - Design System

## Color Palette

### Primary Colors
- **Primary Brown**: `#C97336` (Used for primary buttons, success states)
- **Primary Light**: `#DA9D72` (Hover states, secondary actions)
- **Primary Dark**: `#653a1b` (Active states, important highlights)

### Secondary Colors
- **Accent Blue**: `#1976D2` (Interactive elements, links)
- **Accent Yellow**: `#FFD600` (Highlights, warnings)
- **Accent Red**: `#D32F2F` (Errors, destructive actions)

### Neutral Colors
- **Dark Gray**: `#212121` (Primary text)
- **Medium Gray**: `#757575` (Secondary text)
- **Light Gray**: `#E0E0E0` (Borders, dividers)
- **Background**: `#F5F5F5` (Page background)
- **White**: `#FFFFFF` (Cards, content backgrounds)

## Typography

### Font Family
- **Headings**: 'Alibaba Sans' (Sans)
- **Texts**: 'Gabriel Sans Condensed' (Sans)
- **Monospace**: 'Fira Code' (Code editor)

### Text Styles
- **Heading 1**: 32px, 700, -0.5px letter spacing
- **Heading 2**: 24px, 600, 0px letter spacing
- **Heading 3**: 20px, 600, 0.25px letter spacing
- **Body**: 16px, 400, 0.5px line spacing
- **Small**: 14px, 400, 0.25px line spacing
- **Code**: 14px, 400, 0.5px line spacing, monospace

## UI Components

### Buttons
- **Primary**: Green background, white text, rounded corners (8px)
- **Secondary**: White background, green border, green text, rounded corners (8px)
- **Tertiary**: Text button with underline on hover
- **Icon Button**: Circular, 40x40px, centered icon
- **Floating Action Button (FAB)**: 56x56px, primary color, drop shadow

### Cards
- **Elevation**: 0 2px 4px rgba(0,0,0,0.1)
- **Border Radius**: 12px
- **Padding**: 16px
- **Background**: White

### Input Fields
- **Height**: 48px
- **Border**: 1px solid Light Gray
- **Border Radius**: 8px
- **Padding**: 0 12px
- **Focus State**: 2px solid Primary Green
- **Error State**: 2px solid Accent Red

## Layout

### Grid System
- **Gutter**: 16px
- **Columns**: 12
- **Max Width**: 1200px (desktop), 100% (mobile)
- **Sidebar Width**: 280px (collapsed), 72px (expanded)

### Spacing
- **Base Unit**: 4px
- **Spacing Scale**: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 640, 768px

## Screen Flows

### 1. Authentication Flow
1. **Landing Page**
   - Hero section with Kodi character
   - Call-to-action buttons
   - Simple navigation

2. **Login/Signup**
   - Toggle between login and signup forms
   - Password recovery (must have email beforehand)
   - Username can use any ASCII letters; must be unique
   - Login have fields: full name, username, school, password, confirm password, and optional email

### 2. Dashboard
- **Header**: Left: Kodino icon with title; Right: navbar (Beranda, Tentang, Materi), profile picture
- **Progress Overview**: Course completion, Dicoin balance
- **Course Grid**: Cards for each course
- **Quick Actions**: Continue learning

### 3. Lesson View
- **Header**: Lesson title, progress indicator
- **Content Area**: Lesson content (material or questions)
- **Navigation**: Previous/Next buttons
- **AI Help**: Floating action button on top right

## Animations

### Micro-interactions
- **Button Hover**: Slight scale (1.02)
- **Card Hover**: Elevation increase
- **Page Transitions**: Fade and slide
- **Loading States**: Skeleton loaders

## Mobile Considerations

### Touch Targets
- Minimum 48x48px
- 8px spacing between touch targets

### Navigation
- Bottom navigation bar
- Floating action button for primary actions
- Swipe gestures for navigation

### Code Editor
- Force landscape mode
- Large touch targets for code pieces
- Accessible keyboard for special characters

## Accessibility

### Contrast
- Text contrast ratio: 4.5:1 minimum
- UI components contrast ratio: 3:1 minimum

### Screen Reader
- ARIA labels for all interactive elements
- Semantic HTML structure
- Keyboard navigation support

### Text Scaling
- Support for 200% text zoom
- Responsive layout adjustments

## Assets

### Icons
- **Source**: Material Icons, Hero Icons
- **Style**: Outlined, 24x24px
- **Color**: Primary Green or Dark Gray

### Illustrations
- **Style**: Flat, colorful, friendly
- **Format**: SVG for scalability
- **Themes**: Learning, coding, success, error

### Character Design
- **Kodi (T-Rex)**: Friendly, approachable, expressive
- **Python (Snake)**: Playful, helpful, knowledgeable
- **Color Palette**: Bright, saturated colors
- **Expressions**: Happy, thinking, confused, excited
