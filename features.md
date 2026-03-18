# SmartScheme AI - Project Features

SmartScheme AI is a cutting-edge, AI-powered platform designed to simplify government scheme discovery and accessibility for citizens of India. Built with a futuristic purple-white gradient aesthetic, it combines modern web technologies with intelligent automation.

## 🚀 Core Features

### 1. AI Assistant (Gemini Powered)
*   **Intelligent Chat**: A fully conversational interface powered by Google Gemini (flash model).
*   **Natural Language Processing**: Understands user descriptions (e.g., "I am a 22-year-old student from Maharashtra") to suggest matching schemes.
*   **Contextual Awareness**: Remembers conversation history and provides specific scheme links.
*   **Speech-to-Text**: Integration with web speech API for voice-controlled queries.

### 2. Smart Scheme Directory
*   **Fuzzy Search**: Real-time fuzzy searching using Fuse.js across multiple languages (English, Hindi, Marathi).
*   **Dynamic Filtering**: Filter schemes by category (Agriculture, Education, etc.) and state.
*   **AI Profile Matcher**: A quick-select profile matcher that uses tag-based logic to suggest schemes instantly.
*   **Pagination & Localization**: Efficiently handles large datasets with full i18n support.

### 3. Eligibility Assessment
*   **Guided Form**: A multi-step form to collect user demographics securely.
*   **Voice-Enabled Auto-Fill**: "Speak to Fill" feature that extracts Age, Gender, Occupation, State, and Income from speech using NLP heuristics.
*   **Secure Validation**: Real-time validation and data encryption indicators.

### 4. Scheme Detail & Application
*   **Comprehensive View**: Detailed benefits, eligibility criteria, and required document checklists.
*   **Smart Document Setup**: Integrated dropzone for document management (UI-only for now).
*   **PDF Generation**: Export scheme details as professional PDF documents using jsPDF.

### 5. Personalized User Experience
*   **Save Schemes**: Bookmark important schemes to your personal profile.
*   **Compare Tool**: Side-by-side comparison of multiple schemes to help decision-making.
*   **Application Tracking**: Dashboard to view and track the status of submitted applications.

## 🎨 Design & UI
*   **Futuristic Aesthetic**: Dark/Light mode support with purple-white gradients.
*   **Glassmorphism**: Subtle blur effects and glowing accents for a premium feel.
*   **Animations**: Staggered entrance animations, smooth page transitions, and tactile feedback using Framer Motion.
*   **Responsive Layout**: Optimized for desktop, tablet, and mobile viewing.

## 🛠️ Technical Stack
*   **Frontend**: React + Vite
*   **Styling**: Vanilla CSS + Tailwind (Utility classes)
*   **Animations**: Framer Motion
*   **AI Integration**: Google Generative AI (@google/generative-ai)
*   **Internationalization**: react-i18next
*   **Icons**: Lucide React