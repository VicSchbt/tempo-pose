# 🎨 Tempo Pose

A modern, responsive web application for pose practice sessions with customizable timers. Upload your reference images, set your tempo, and practice with automatic image rotation.

## ✨ Features

- **Image Management**
  - Drag & drop or click to upload multiple images
  - Automatic duplicate detection
  - Responsive image gallery with collapsible view
  - Lightweight thumbnail previews for fast loading
  - Image prefetching for smooth session transitions

- **Timer System**
  - Quick presets: 30s, 1m, 2m, 5m
  - Custom timer with mm:ss format
  - Visual progress indicator
  - Audio feedback (with mute option)
  - Respects user's reduced motion preferences

- **Session Controls**
  - Pause/resume functionality
  - Navigate between images (previous/next)
  - Fullscreen mode for distraction-free practice
  - Keyboard shortcuts for all controls
  - Session statistics and completion summary

- **User Experience**
  - Dark/light theme toggle with persistence
  - English and French language support
  - Responsive design for all screen sizes
  - Accessible UI with proper ARIA labels
  - First-time user help dialog

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Routing**: React Router v7
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint + TypeScript ESLint

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tempo-pose
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory. Preview it with:

```bash
npm run preview
```

## 📖 Usage

1. **Upload Images**: Drag and drop images onto the drop zone or click to select files
2. **Set Timer**: Choose a preset or enter a custom time (mm:ss format)
3. **Start Session**: Click "Start Session" to begin your practice
4. **Navigate**: Use arrow keys or on-screen controls to move between images
5. **Pause/Resume**: Pause anytime and resume when ready
6. **Fullscreen**: Toggle fullscreen mode for an immersive experience
7. **End Session**: Complete the session or end manually to view statistics

### Keyboard Shortcuts

- `←` / `→`: Navigate to previous/next image
- `Space`: Pause/resume session
- `M`: Toggle mute/unmute sounds
- `F`: Toggle fullscreen (when supported)

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run lint:format` - Check formatting
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:watch` - Run tests in watch mode

### Project Structure

```
src/
├── components/       # React components
│   ├── count-badge/ # Reusable count badge component
│   ├── dialog/      # Dialog components
│   ├── gallery/     # Image gallery components
│   ├── help/        # Help dialogs
│   ├── images/      # Image upload and drop components
│   ├── language/    # Language toggle
│   ├── layout/      # Layout components (Header, Footer, Main)
│   ├── session/     # Session view and controls
│   ├── theme/       # Theme provider and toggle
│   ├── timer/       # Timer controls
│   └── ui/          # Base UI components (shadcn/ui)
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization
├── lib/             # Utility libraries
├── pages/           # Page components
├── store/           # Zustand store slices
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 📝 Documentation

For detailed documentation on specific features, see:

- [Image Handling Pipeline](./DOCUMENTATION.md) - Comprehensive guide on image processing and optimization

## 🧩 Key Features Explained

### Image Optimization

- Images are automatically downscaled for thumbnail previews (max 512px, 60% quality)
- Full-quality images are prefetched in the background for smooth session transitions
- Automatic memory cleanup when components unmount

### Timer System

- Drift-safe timing using `requestAnimationFrame` for accurate intervals
- Supports custom durations with validation (minimum and maximum limits)
- Visual progress bar and countdown display

### Session Management

- Queue-based image rotation with shuffle support
- Session state persistence during navigation
- Comprehensive statistics tracking (duration, images completed, average time per image)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[Add your license here]

---

Made with ❤️ for pose practice enthusiasts
