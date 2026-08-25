# 🧠 GenBrain

<div align="center">

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
![Zustand](https://img.shields.io/badge/State-Zustand-orange)
![Local AI](https://img.shields.io/badge/AI_Engine-Ollama-purple)

**A privacy-first, offline-ready knowledge and learning platform featuring interactive flashcard decks, contextual AI tutoring, daily general knowledge quizzes, and global news curation.**

[Features](#-key-features) • [Design System](#-design-system) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Privacy & Security](#-privacy--security)

</div>

---

## ✨ Key Features

### 🎴 1. Interactive Stacked Flashcard Deck
- **Physical Stack Aesthetics**: Realistic layered card deck with subtle tilt perspectives and elevation shadows.
- **Tap-to-Flip Motion**: Seamlessly flips between front questions and detailed explanations.
- **Smart Topic Search**: Filter the entire general knowledge catalog in real-time by category, subject, or keyword.
- **Interactive Suggestions**: Quick-tap topic chips (*Space*, *Science*, *History*, *Nature*, *Technology*, *Geography*, *Language*, etc.).
- **Spaced Repetition Engine**: SM-2 algorithmic scheduling tracks card review intervals.

### 🤖 2. Kihoro — In-App AI Tutor
- Context-aware tutor embedded into each knowledge card.
- Ask questions, request simple analogies, or dive into deep technical backgrounds.
- Powered by local LLMs via **Ollama** (`llama3.1:8b`) with intelligent offline fallbacks.

### ⚡ 3. Daily Quiz Challenge
- **5-Question Time-Attack**: General knowledge trivia with a 20-second per-question countdown.
- **Full Lifecycle Controls**: Start, pause (freezes timer and blurs questions), resume, or end the quiz at any time.
- **Auto-Pause Protection**: Quiz automatically pauses when the application is backgrounded or minimized.
- **XP & Level Progression**: Earn XP based on correct answers and perfect score streaks.

### 📰 4. Daily Global News
- Curated breaking headlines across Science, Technology, World, Culture, and Economy.
- Filter chips with non-overlapping responsive badge design.
- Turn any news article into a custom knowledge card with one tap.

### 👤 5. Customizable Profile & Gamification
- Edit name, age, birthday, bio, and avatar photo directly with persistence.
- E-to-S rank progression tier system with interactive daily quest rewards.

---

## 🎨 Design System

GenBrain is built around a modern, refined aesthetic:

- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) for crisp, human-crafted readability across all displays.
- **Color Palette**:
  - `Midnight Purple` (`#191825`) — Primary dark background
  - `Electric Purple` (`#865DFF`) — Primary actions & accents
  - `Radiant Orchid` (`#E384FF`) — Secondary accents & borders
  - `Neon Pastel Pink` (`#FFA3FD`) — Highlights & active tab glow
- **UI Components**:
  - Glassmorphic floating pill bottom navigation bar.
  - Symmetrical capsule gradient action buttons.
  - Layered card stack container.

---

## 🏗 Architecture

```
GenBrain/
├── mobile/                  # React Native (Expo) Mobile Application
│   ├── app/                 # Expo Router file-based navigation
│   │   ├── (tabs)/          # Floating tab bar routes (Cards, Quiz, News, Profile)
│   │   ├── _layout.tsx      # Root provider & font loading
│   │   └── onboarding.tsx   # First-launch onboarding flow
│   ├── components/          # Reusable UI (ChatModal, SystemModal)
│   ├── constants/           # Color palettes, ranks, niches, and fonts
│   ├── db/                  # WatermelonDB models and schema
│   ├── hooks/               # Custom hooks (useFlashcards, useAITutor)
│   ├── lib/                 # Spaced repetition logic & API client
│   └── store/               # Zustand state stores (Cards, Chat, Game, Settings)
│
└── backend/                 # FastAPI Service (Optional Local AI Proxy)
    ├── app/
    │   ├── routers/         # News & LLM proxy routes
    │   ├── services/        # Ollama integration & NewsAPI crawler
    │   └── config.py        # Environment configuration
    ├── Dockerfile           # Containerized deployment
    └── requirements.txt     # Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **npm** or **yarn**
- **Python 3.10+** (only if running the local backend)
- **Expo Go** on iOS or Android (or an emulator)

---

### 1. Mobile Application Setup

```bash
# Navigate to the mobile directory
cd mobile

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

Press **`a`** for Android emulator, **`i`** for iOS simulator, or scan the QR code using the **Expo Go** app on your physical device.

---

### 2. Backend & Local AI Setup (Optional)

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
copy .env.example .env

# Launch the FastAPI server
uvicorn app.main:app --reload --port 8000
```

To enable local LLM tutoring:
```bash
# Install and serve Ollama
ollama pull llama3.1:8b
ollama serve
```

---

## 🔒 Privacy & Security

- **Zero Hardcoded Secrets**: No private keys or tokens are stored in the repository.
- **On-Device Storage**: User progress, custom profiles, and card interaction histories remain entirely on your local device.
- **Environment Isolation**: Backend credentials (such as optional NewsAPI keys) are managed purely through gitignored `.env` files.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
