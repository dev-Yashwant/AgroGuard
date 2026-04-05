import React, { useState } from 'react';
import { Upload, Leaf, User, Search, Home } from 'lucide-react';

import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${apiBaseUrl}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data);
    } catch (err) {
      console.error(err);
      setPrediction({
        disease: 'Error diagnosing image',
        confidence: 0,
        treatment: 'Please make sure the backend server is running on port 5001.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation */}
      <nav className="bg-brand-dark text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="w-8 h-8 text-brand-green" />
            <span className="text-2xl font-bold tracking-wide">AgroGuard</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="flex items-center space-x-1 hover:text-brand-green transition"><Home className="w-4 h-4"/> <span>Home</span></a>
            <a href="#" className="flex items-center space-x-1 hover:text-brand-green transition"><Upload className="w-4 h-4"/> <span>Diagnose</span></a>
            <a href="#" className="flex items-center space-x-1 hover:text-brand-green transition"><Search className="w-4 h-4"/> <span>Agro-Wiki</span></a>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
              <User className="w-4 h-4"/>
              <span>Login</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-dark to-brand-green text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 shadow-sm">AI-Powered Crop Disease Diagnostics</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 opacity-90">Upload a photo of a diseased plant leaf and instantly receive a precise diagnosis along with scientifically backed treatment recommendations.</p>
        <button className="bg-white text-brand-dark font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition transform text-lg">
          Try it Now
        </button>
      </section>

      {/* Diagnosis Simulator */}
      <main className="max-w-4xl mx-auto -mt-8 relative z-10 px-4 mb-20">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
          
          <div className="flex-1 w-full flex flex-col items-center">
            <div className="relative border-4 border-dashed border-slate-200 rounded-xl p-10 text-center hover:border-brand-green transition cursor-pointer bg-slate-50 group flex flex-col items-center justify-center h-64 w-full">
              <Upload className="w-12 h-12 text-slate-400 group-hover:text-brand-green mb-4" />
              <p className="text-slate-500 font-medium">Drag & drop your leaf image here</p>
              <p className="text-sm text-slate-400 mt-2 mb-4">or click to browse</p>
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
              {file && <p className="text-brand-green font-semibold mt-2 truncate w-full px-4">{file.name}</p>}
            </div>
            <button 
              onClick={handleUpload}
              disabled={!file || loading}
              className={`w-full mt-4 py-3 rounded-xl font-bold text-white transition ${!file ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand-green hover:bg-emerald-600 shadow-md'}`}
            >
              {loading ? 'Analyzing Image...' : 'Run Diagnostics'}
            </button>
          </div>

          <div className="flex-1 w-full flex flex-col justify-center">
            {prediction ? (
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl animate-fade-in">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold tracking-wider text-emerald-800 uppercase mb-1">Diagnosis Result</h3>
                    <p className="text-2xl font-extrabold text-slate-800">{prediction.disease}</p>
                  </div>
                  <div className="bg-emerald-600 text-white font-black px-3 py-1 rounded-lg text-lg shadow-sm">
                    {prediction.confidence}%
                  </div>
                </div>
                <div className="mb-2">
                  <h4 className="font-semibold text-slate-700 mb-1">Recommended Treatment:</h4>
                  <p className="text-slate-600 leading-relaxed text-sm bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">{prediction.treatment}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8 border-2 border-slate-100 rounded-xl bg-slate-50">
                <Leaf className="w-16 h-16 mb-4 opacity-50" />
                <p>Upload a leaf image to see the diagnostic results here.</p>
              </div>
            )}
          </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center">
        <p>© 2026 AgroGuard System. Created by Vaishnavi, Noman & Yashwant.</p>
      </footer>
    </div>
  );
}

export default App;
