import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DiagnosePage from './pages/DiagnosePage';
import WikiPage from './pages/WikiPage';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/diagnose" element={<DiagnosePage />} />
          <Route path="/wiki" element={<WikiPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
