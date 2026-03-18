# 🛡️ SmartScheme AI

SmartScheme AI is a comprehensive, advanced, AI-powered government scheme discovery platform built to assist citizens of India in navigating, discovering, and applying for government schemes effortlessly. Powered by modern web technologies, AI, and a visually stunning glassmorphism UI, this application ensures government benefits are accessible to everyone.

![SmartScheme AI Banner](https://via.placeholder.com/1200x400.png?text=SmartScheme+AI+-+Powered+by+AI+for+Digital+India) <!-- Feel free to replace this with an actual screenshot of the app -->

## ✨ Key Features

### 🔍 Explore & Discover
- **Browse the Scheme Directory**: Explore active government initiatives grouped by category or state.
- **Fuzzy Search Integration**: Find precisely what you're looking for with lightning-fast fuzzy search powered by `fuse.js`.
- **Trending Schemes**: Quick access to highly popular and trending schemes directly on the home page.

### 🧠 Advanced AI Capabilities
- **AI Chat Assistant**: A fully integrated Gemini-powered AI chatbot ready to answer scheme-related queries contextually. Identifies eligibility and renders matching scheme cards inline with direct "Apply" and "View Details" buttons!
- **AI Profile Matching**: Check eligibility instantly by securely providing basic demographic and financial information.
- **Smart Scoring Mechanism**: Evaluates profile data natively and calculates accurate Match Scores and Approval Probabilities.
- **Missed & Future Benefit Predictor**: Detects schemes you might have missed historically and estimates countdowns for upcoming scheme eligibilities based on age/income.

### 💼 Built for the User
- **Scheme Comparison Tool**: Compare up to three schemes side-by-side to find the best fit based on benefits, criteria, and documentation.
- **Save & Bookmark**: Securely bookmark schemes in a personal vault (`/saved-schemes`) for later review.
- **Application Tracker**: Built-in timeline (`/my-applications`) to track application progression (Applied → Under Review → Verified → Approved).
- **Smart Document Checklist**: Fully functional drag & drop document uploader for prerequisite documents before finalizing an application.
- **Multi-Language Accessibility**: Dynamic on-the-fly translation bridging the language divide. Fully supporting **English, Hindi (हिंदी), Marathi (मराठी), and Tamil (தமிழ்)**.

### 🎨 Stunning UI/UX
- **Dynamic Theme Engine (Dark & Light Mode)**: Global context-driven theme system featuring a default immersive deep space theme (Galaxy Mode) and a sleek, clean "government-service" Light Mode.
- **Premium Glassmorphism Design**: Frosted glass containers (`backdrop-filter`) across floating navigation bars and feature cards, bringing extreme depth and a futuristic, hackathon-winning aesthetic.
- **Smooth Animations & Micro-interactions**: High-fidelity transitions utilizing `framer-motion`, including a continuous floating animation for the 3D Hero character, staggered fades for rendering elements, and elevated hover responses on sleek gradient CTA buttons.
- **Visually Powerful Hero Section**: Breathtaking entrance with radial gradient glows, 3D components, and crisp modern typography powered by Poppins and Inter fonts.

---

## 🛠️ Technology Stack

**Core**
- [React 18](https://reactjs.org/) - UI Library
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling (Bundler/Dev Server)
- [React Router DOM](https://reactrouter.com/) - Client-side Routing

**Styling & UI**
- **Vanilla CSS / Inline Extensibility** - Building bespoke glassmorphic interfaces without heavy UI libraries.
- [Framer Motion](https://www.framer.com/motion/) - Production-ready animations.
- [Lucide React](https://lucide.dev/) - Beautiful and consistent SVG icons.

**Functionality & Utilities**
- [Google Generative AI](https://ai.google.dev/) - `@google/generative-ai` for intelligent chat orchestration.
- [Fuse.js](https://fusejs.io/) - Powerful, lightweight fuzzy-search.
- [React Dropzone](https://react-dropzone.js.org/) - HTML5-compliant drag 'n' drop zone for files.
- [jsPDF](https://parall.ax/products/jspdf) - Client-side generation for downloading detailed Scheme PDFs.

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
Make sure you have Node.js and npm installed.
- [Node.js](https://nodejs.org/en/) (v16.x or later)
- npm (Local package manager)

### Installation

1. **Clone the repository** (or extract the project files)
   ```bash
   git clone <repository_url>
   cd "SmartScheme AI"
   ```

2. **Install the dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   You need a Google Gemini API Key for the AI features.
   - Create a `.env` file in the root directory.
   - Add your API key: `VITE_GEMINI_API_KEY=your_api_key_here`
   *(Note: The current API key might be hardcoded in ChatAssistant.jsx for testing purposes, but moving it to .env is highly recommended for production security!)*

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application!

### Building for Production
To build the optimized application for deployment, run:
```bash
npm run build
```
You can preview the built files using:
```bash
npm run preview
```

---

## 📂 Project Structure

```text
SmartScheme AI/
├── src/
│   ├── components/       # Reusable UI components (Navbar, Footer, SchemeCard, GalaxyBackground)
│   ├── context/          # Global application state (LanguageContext, UserContext)
│   ├── data/             # Central mockup database of schemes and seeders
│   ├── locales/          # Translation JSON files (en, hi, mr, ta)
│   ├── pages/            # View-level components mapped to Routes
│   │   ├── Home.jsx             # Landing page with Trending, Impact, Success sections
│   │   ├── Results.jsx          # Custom AI matching scheme results
│   │   ├── SchemeDetail.jsx     # Deepdive with drag-&-drop upload verification
│   │   ├── CompareSchemes.jsx   # Side-by-side comparison tables
│   │   ├── MyApplications.jsx   # Timeline app tracker
│   │   ├── ChatAssistant.jsx    # The AI Hub
│   │   └── ...
│   ├── services/         # API abstraction and fetching logic (schemeApi.js)
│   ├── App.jsx           # Master route configuration and Context wrappers
│   ├── App.css           # Global typography and base styles
│   └── index.css         # Styling vars, glassmorphism utilities, resets
├── public/               # Static assets (Not parsed by Webpack/Vite)
├── .env                  # Environment Variables
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite bundler configuration
```

---

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request if you'd like to help improve SmartScheme AI.

## 📝 License
This project is open-source and available under the [MIT License](LICENSE). 


