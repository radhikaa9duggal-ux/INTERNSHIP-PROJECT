# Cinematic Data Explorer

A dynamic, front-end web application that allows users to discover, search, and explore movies using real cinematic data. Built as an internship project leveraging modern web technologies and best practices.

## 🚀 Live Demo
*(Your Vercel Deployment Link Goes Here)*

## 🛠️ Chosen Technologies

This project is built using a modern, fast, and scalable tech stack:

- **React (v18)**: Core framework for building the interactive user interface.
- **Vite**: Ultra-fast build tool and development server, significantly speeding up the development process.
- **Tailwind CSS**: Utility-first CSS framework for rapid and responsive UI styling.
- **Framer Motion**: Production-ready animation library used for smooth, dynamic UI transitions and micro-interactions.
- **Lucide React**: Beautiful, consistent icon pack used throughout the application interface.

## 📡 API Used

- **[TMDB (The Movie Database) API](https://developer.themoviedb.org/docs/getting-started)**: Provides comprehensive details, posters, ratings, and genre data for thousands of movies.

## 🧠 Key Architectural Decisions

1. **Custom Hooks for State Management (`useMovies`, `useGenres`)**
   - **Why**: By extracting data fetching and state logic (loading, errors, pagination) into custom hooks, the React components remain clean, purely focused on rendering the UI.
   
2. **Local Proxy & Vercel Rewrites (`vite.config.js` & `vercel.json`)**
   - **Why**: To bypass tricky CORS (Cross-Origin Resource Sharing) issues and securely handle API calls, all TMDB API requests are routed through a `/tmdb-api` proxy. This proxy is configured seamlessly for both the local Vite development server and the Vercel production edge network.
   
3. **Graceful Fallback Mechanism**
   - **Why**: Relying on third-party APIs can be risky due to rate limits or unexpected outages. If the TMDB API fails (e.g., returns an error or times out), the `useMovies` hook automatically falls back to local static JSON data (`mockMoviesData`). This guarantees that the application remains functional and aesthetically pleasing under failure conditions.

## 💻 Project Setup & Local Installation

### Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/radhikaa9duggal-ux/INTERNSHIP-PROJECT.git
   cd INTERNSHIP-PROJECT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   - Create a `.env` file in the root directory.
   - Add your TMDB API Key like this:
     ```env
     VITE_TMDB_API_KEY=your_api_key_here
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Preview locally:**
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application!

## 📦 Deployment

This app is optimized for immediate deployment on **Vercel**:
1. Push your code to GitHub.
2. Import the repository in your Vercel Dashboard.
3. Vercel automatically detects the framework (Vite) and handles everything. The custom `vercel.json` ensures API routes work right out of the box in production.
