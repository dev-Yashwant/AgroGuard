import React, { useState, useRef, useCallback } from 'react';
import { Upload, Leaf, X, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

function DiagnosePage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback((selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPrediction(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPrediction(response.data);
    } catch (err) {
      console.error(err);
      setPrediction({
        disease: 'Connection Error',
        confidence: 0,
        treatment: 'Could not reach the backend server. Make sure it is running on port 5001.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setPrediction(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const isHealthy = prediction && prediction.disease?.toLowerCase().includes('healthy');
  const isError = prediction && prediction.confidence === 0;
  const confidencePct = prediction ? `${(prediction.confidence * 3.6).toFixed(0)}deg` : '0deg';

  return (
    <div className="page-enter min-h-[calc(100vh-140px)]">
      {/* Header */}
      <section className="bg-gradient-to-r from-brand-dark to-emerald-800 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Plant Disease Diagnosis</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Upload a clear photo of a plant leaf, and our AI will analyze it for diseases in seconds.
          </p>
        </div>
      </section>

      {/* Main Card */}
      <main className="max-w-5xl mx-auto -mt-6 relative z-10 px-4 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* ── Left: Upload Area ──────────────────────────────── */}
            <div className="flex-1 p-8 border-b lg:border-b-0 lg:border-r border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-brand-green" />
                <span>Upload Leaf Image</span>
              </h2>

              {!preview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-3 border-dashed rounded-xl p-10 text-center cursor-pointer
                    flex flex-col items-center justify-center h-72 transition-all duration-300
                    ${dragOver
                      ? 'border-brand-green bg-brand-surface scale-[1.02]'
                      : 'border-slate-200 bg-slate-50 hover:border-brand-green hover:bg-brand-surface'
                    }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors
                    ${dragOver ? 'bg-brand-green/20' : 'bg-slate-100'}`}>
                    <Upload className={`w-8 h-8 transition-colors ${dragOver ? 'text-brand-green' : 'text-slate-400'}`} />
                  </div>
                  <p className="text-slate-600 font-semibold mb-1">Drag & drop your leaf image</p>
                  <p className="text-sm text-slate-400 mb-4">or click to browse files</p>
                  <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    PNG, JPG, JPEG, WEBP
                  </span>
                  <input
                    ref={inputRef}
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Image preview */}
                  <div className="image-preview h-56 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <img src={preview} alt="Selected leaf" className="w-full h-full object-cover" />
                  </div>
                  {/* File info */}
                  <div className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center shrink-0">
                        <Leaf className="w-5 h-5 text-brand-green" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-slate-700 truncate">{file.name}</p>
                        <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={handleReset}
                      className="p-2 rounded-lg hover:bg-slate-200 transition text-slate-400 hover:text-red-500"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center space-x-2
                    ${!file
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : loading
                        ? 'bg-brand-green/80 cursor-wait'
                        : 'bg-brand-green hover:bg-emerald-600 shadow-md hover:shadow-lg active:scale-[0.98]'
                    }`}
                >
                  {loading ? (
                    <>
                      <div className="spinner" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <span>🔬 Run Diagnostics</span>
                  )}
                </button>
                {prediction && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-3.5 rounded-xl border-2 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 transition font-semibold"
                    title="Start over"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* ── Right: Results Area ────────────────────────────── */}
            <div className="flex-1 p-8 flex flex-col justify-center">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-brand-green" />
                <span>Diagnosis Result</span>
              </h2>

              {prediction ? (
                <div className="animate-fade-in space-y-5">
                  {/* Disease name + confidence */}
                  <div className={`rounded-xl p-6 border ${
                    isError
                      ? 'bg-red-50 border-red-100'
                      : isHealthy
                        ? 'bg-emerald-50 border-emerald-100'
                        : 'bg-amber-50 border-amber-100'
                  }`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {isError ? (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          ) : isHealthy ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                          )}
                          <span className={`text-xs font-bold uppercase tracking-wider ${
                            isError ? 'text-red-600' : isHealthy ? 'text-emerald-600' : 'text-amber-600'
                          }`}>
                            {isError ? 'Error' : isHealthy ? 'Healthy' : 'Disease Detected'}
                          </span>
                        </div>
                        <p className="text-2xl font-extrabold text-slate-800">
                          {prediction.disease}
                        </p>
                      </div>
                      
                      {/* Confidence ring */}
                      {!isError && (
                        <div
                          className="confidence-ring shrink-0"
                          style={{ '--pct': `${(prediction.confidence * 3.6).toFixed(1)}deg` }}
                        >
                          <span>{prediction.confidence}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Treatment */}
                  <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                    <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                      💊 Recommended Treatment
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {prediction.treatment}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-12 px-6 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 animate-float">
                    <Leaf className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="font-medium text-slate-500 mb-1">No results yet</p>
                  <p className="text-sm text-slate-400">Upload a leaf image and hit <strong>Run Diagnostics</strong> to see AI-powered results here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DiagnosePage;
