import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Upload, Search, Shield, Zap, Brain, ArrowRight } from 'lucide-react';

function HomePage() {
  const features = [
    {
      icon: Brain,
      title: 'Deep Learning AI',
      description: 'Powered by a ResNet50 Convolutional Neural Network trained on thousands of real plant images for high-accuracy detection.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get a precise diagnosis in under 2 seconds. No waiting, no appointments — just snap, upload, and know.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Shield,
      title: 'Actionable Treatment',
      description: 'Every diagnosis comes with scientifically-backed treatment steps so you can act immediately to save your crops.',
      color: 'from-blue-500 to-indigo-600',
    },
  ];

  const stats = [
    { value: '38+', label: 'Disease Classes' },
    { value: '54K+', label: 'Training Images' },
    { value: '95%+', label: 'Accuracy Target' },
    { value: '<2s', label: 'Inference Time' },
  ];

  return (
    <div className="page-enter">
      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-emerald-900 to-brand-dark text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-lime/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-8 animate-fade-in">
            <Leaf className="w-4 h-4 text-brand-green" />
            <span className="text-sm font-medium text-white/90">AI-Powered Agriculture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight mb-6 animate-slide-up tracking-tight">
            Protect Your Crops
            <br />
            <span className="gradient-text">Before It's Too Late</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-white/80 leading-relaxed animate-fade-in">
            Upload a photo of any plant leaf and get an instant AI diagnosis with precise disease identification and step-by-step treatment recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Link
              to="/diagnose"
              className="inline-flex items-center justify-center space-x-2 bg-brand-green hover:bg-emerald-400 text-brand-dark font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all text-lg"
            >
              <Upload className="w-5 h-5" />
              <span>Start Diagnosis</span>
            </Link>
            <Link
              to="/wiki"
              className="inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all text-lg"
            >
              <Search className="w-5 h-5" />
              <span>Browse Diseases</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────────────── */}
      <section className="relative -mt-8 z-10 max-w-5xl mx-auto px-4">
        <div className="glass-card rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-black text-brand-dark">{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
            How AgroGuard <span className="gradient-text">Works</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Cutting-edge computer vision meets practical agriculture in three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="feature-card bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-lg`}>
                <f.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works Steps ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-brand-surface to-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
              Three Steps to <span className="gradient-text">Save Your Harvest</span>
            </h2>
          </div>

          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
            {[
              { step: '01', title: 'Capture', desc: 'Take a clear photo of the affected plant leaf using your phone or camera.' },
              { step: '02', title: 'Upload', desc: 'Drop the image into AgroGuard\'s diagnosis tool — it takes just one click.' },
              { step: '03', title: 'Act', desc: 'Receive your AI diagnosis with confidence score and precise treatment plan.' },
            ].map((s, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 border border-emerald-100 shadow-sm text-center">
                <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand-green font-black text-lg">{s.step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/diagnose"
              className="inline-flex items-center space-x-2 bg-brand-dark hover:bg-emerald-900 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
            >
              <span>Try It Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
