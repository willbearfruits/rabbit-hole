# GEMINI.md - The Rabbit Hole (rabbit-hole)

## Project Overview
**The Rabbit Hole** is a specialized web-based toolkit and archive designed for New Media artists, electronic synth-builders, and creative coders. It serves as a digital "Anarchist Cookbook," providing essential utilities, curated educational resources, and an archive of experimental artists.

### Core Technologies
- **Frontend:** React 19, Vite, TypeScript
- **Styling:** Tailwind CSS 4 (Utility-first CSS)
- **Routing:** React Router 7 (`react-router-dom`)
- **Backend/Services:** 
    - **Firebase:** Authentication (Email/Password) and potentially data storage.
    - **Google Gemini API:** Integrated AI teaching assistant for tutorials.
    - **Web APIs:** WebSerial API (for Serial Monitor/ESP32 flashing) and WebUSB (for Daisy DFU).
- **Deployment:** GitHub Pages via GitHub Actions.

## Building and Running
The project requires Node.js 20+.

### Key Commands
- **Install Dependencies:** `npm install`
- **Start Development Server:** `npm run dev` (Runs on Vite)
- **Build for Production:** `npm run build` (Outputs to `dist/`, configured with base path `/rabbit-hole/`)
- **Preview Production Build:** `npm run preview`

### Environment Configuration
Copy `.env.example` to `.env.local` and configure:
- `VITE_FIREBASE_API_KEY`, etc.: For Firebase Authentication.
- `VITE_GEMINI_API_KEY`: For the AI Assistant features.
- `VITE_STUDENT_PIN` / `VITE_ADMIN_PIN`: Fallback simple PIN-based access if Firebase is not used.

## Architecture and Structure

### `src/` Directory
- **`components/`**: Contains modular UI components and complex interactive tools.
    - `SerialMonitor.tsx`: Implementation of WebSerial terminal and ESP32 firmware flasher using `esptool-js`.
    - `Calculators`: Specialized tools for resistor/capacitor decoding and filter plotting.
    - `GlitchBooth.tsx`: Likely for image manipulation/destruction.
- **`pages/`**: View components for different routes (Home, Tools, Archive, Musrara, etc.).
- **`services/`**: logic for external integrations.
    - `geminiService.ts`: Wrapper for `@google/genai` to provide AI tutoring.
    - `firebase.ts`: Firebase initialization and auth logic.
- **`context/`**: React Context providers (e.g., `AuthContext.tsx`).
- **`utils/`**: Helper functions and shared utilities.

### `public/` Directory
- Contains static assets like PDFs in `public/media/`.
- **Doom:** A localized JS-DOS implementation of Doom (1993) accessible at `/doom`.

## Development Conventions
- **Routing:** Uses `BrowserRouter` with a `basename="/rabbit-hole/"`. New routes should be added in `src/App.tsx`.
- **Authentication:** Most pages are protected by an `AuthPage` gate in `AppContent`.
- **Styling:** Follows Tailwind CSS 4 conventions. Prefer utility classes over custom CSS.
- **AI Integration:** The `gemini-2.5-flash` model is used for the AI tutor.
- **Hardware Interaction:** WebSerial is used for browser-to-hardware communication. Ensure any new hardware tools respect browser security constraints (requires user gesture for connection).

## Deployment Details
- **GitHub Pages:** Deployment is automated via `.github/workflows/deploy.yml`. 
- **404 Handling:** A `public/404.html` is present to handle SPA routing on GitHub Pages.
- **Base Path:** Always ensure `vite.config.ts` has `base: '/rabbit-hole/'` for correct asset loading on the production URL.
