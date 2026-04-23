import React, { useState, useEffect } from 'react';
import { Search, Leaf, Filter, AlertTriangle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

// Fallback data if backend isn't running
const FALLBACK_DISEASES = [
  { id: 'Tomato_Bacterial_spot', name: 'Tomato Bacterial spot', crop: 'Tomato', treatment: 'Apply copper-based bactericides. Remove and destroy infected plant parts. Avoid overhead irrigation and ensure proper spacing.', is_healthy: false },
  { id: 'Tomato_Early_blight', name: 'Tomato Early blight', crop: 'Tomato', treatment: 'Apply fungicide (chlorothalonil or mancozeb). Remove lower infected leaves. Mulch to prevent soil splash. Practice crop rotation.', is_healthy: false },
  { id: 'Tomato_Late_blight', name: 'Tomato Late blight', crop: 'Tomato', treatment: 'Apply systemic fungicide immediately. Remove and destroy all infected plants. Improve air circulation. Avoid watering late in the day.', is_healthy: false },
  { id: 'Tomato_Leaf_Mold', name: 'Tomato Leaf Mold', crop: 'Tomato', treatment: 'Improve ventilation in greenhouses. Apply fungicides like mancozeb. Remove infected leaves. Reduce humidity levels.', is_healthy: false },
  { id: 'Tomato_Healthy', name: 'Tomato Healthy', crop: 'Tomato', treatment: 'Your tomato plant looks healthy! Continue regular watering, proper fertilization, and monitoring for early signs of disease.', is_healthy: true },
  { id: 'Potato_Early_blight', name: 'Potato Early blight', crop: 'Potato', treatment: 'Apply fungicide (chlorothalonil). Remove lower infected leaves. Practice 2-3 year crop rotation. Maintain adequate soil fertility.', is_healthy: false },
  { id: 'Potato_Late_blight', name: 'Potato Late blight', crop: 'Potato', treatment: 'Apply systemic fungicide (metalaxyl). Destroy all infected plant debris. Improve drainage. Avoid planting near previously infected fields.', is_healthy: false },
  { id: 'Potato_Healthy', name: 'Potato Healthy', crop: 'Potato', treatment: 'Your potato plant is in great shape! Maintain consistent watering and watch for common pests like Colorado potato beetle.', is_healthy: true },
  { id: 'Pepper_bell_Bacterial_spot', name: 'Pepper bell Bacterial spot', crop: 'Pepper', treatment: 'Apply copper hydroxide sprays. Remove infected plant material. Use certified disease-free seeds. Rotate crops every 2-3 years.', is_healthy: false },
  { id: 'Pepper_bell_Healthy', name: 'Pepper bell Healthy', crop: 'Pepper', treatment: 'Your bell pepper plant is thriving! Keep up with regular fertilization and consistent watering schedules.', is_healthy: true },
  { id: 'Apple_scab', name: 'Apple scab', crop: 'Apple', treatment: 'Apply fungicide in early spring. Rake and destroy fallen leaves. Prune for better air circulation. Plant resistant varieties.', is_healthy: false },
  { id: 'Apple_Black_rot', name: 'Apple Black rot', crop: 'Apple', treatment: 'Prune out dead wood and mummified fruit. Apply captan fungicide. Remove cankers from branches. Maintain tree vigor.', is_healthy: false },
  { id: 'Apple_Healthy', name: 'Apple Healthy', crop: 'Apple', treatment: 'Your apple tree looks excellent! Continue annual pruning and maintain a spray schedule during bloom season.', is_healthy: true },
  { id: 'Corn_Common_rust', name: 'Corn Common rust', crop: 'Corn', treatment: 'Apply foliar fungicides (pyraclostrobin). Plant resistant hybrids. Monitor fields regularly during warm, humid conditions.', is_healthy: false },
  { id: 'Corn_Healthy', name: 'Corn Healthy', crop: 'Corn', treatment: 'Your corn crop is looking strong! Ensure adequate nitrogen fertilization and maintain consistent soil moisture.', is_healthy: true },
  { id: 'Grape_Black_rot', name: 'Grape Black rot', crop: 'Grape', treatment: 'Apply mancozeb or myclobutanil before bloom. Remove and destroy mummified berries. Prune for good air circulation.', is_healthy: false },
  { id: 'Grape_Healthy', name: 'Grape Healthy', crop: 'Grape', treatment: 'Your grapevine is healthy! Continue proper canopy management and preventive fungicide sprays during the growing season.', is_healthy: true },
];

function WikiPage() {
  const [diseases, setDiseases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [showHealthy, setShowHealthy] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const res = await axios.get(`${apiBaseUrl}/diseases`);
        setDiseases(res.data.diseases);
      } catch {
        setDiseases(FALLBACK_DISEASES);
      } finally {
        setLoading(false);
      }
    };
    fetchDiseases();
  }, []);

  // Get unique crops
  const crops = ['All', ...new Set(diseases.map(d => d.crop))];

  // Filter diseases
  const filtered = diseases.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.treatment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = selectedCrop === 'All' || d.crop === selectedCrop;
    const matchesHealthy = showHealthy || !d.is_healthy;
    return matchesSearch && matchesCrop && matchesHealthy;
  });

  const diseaseCount = filtered.filter(d => !d.is_healthy).length;
  const healthyCount = filtered.filter(d => d.is_healthy).length;

  return (
    <div className="page-enter min-h-[calc(100vh-140px)]">
      {/* Header */}
      <section className="bg-gradient-to-r from-brand-dark to-emerald-800 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Agro-Wiki</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Browse our comprehensive database of plant diseases with symptoms and treatment recommendations.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 py-8 -mt-6 relative z-10">
        {/* Search & Filters */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search diseases, treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition bg-white text-slate-700"
              />
            </div>

            {/* Crop filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-xl border border-slate-200 focus:border-brand-green outline-none bg-white text-slate-700 font-medium appearance-none cursor-pointer"
              >
                {crops.map(c => (
                  <option key={c} value={c}>{c === 'All' ? 'All Crops' : c}</option>
                ))}
              </select>
            </div>

            {/* Toggle healthy */}
            <button
              onClick={() => setShowHealthy(!showHealthy)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl border-2 font-semibold transition text-sm
                ${showHealthy
                  ? 'border-brand-green text-brand-green bg-brand-green/5'
                  : 'border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
            >
              <Leaf className="w-4 h-4" />
              <span>Healthy</span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4 text-sm text-slate-500">
            <span className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{diseaseCount} diseases</span>
            </span>
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{healthyCount} healthy</span>
            </span>
          </div>
        </div>

        {/* Disease list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner border-brand-green border-t-transparent" style={{ width: 40, height: 40, borderWidth: 4 }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-semibold text-lg">No results found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((disease) => (
              <div
                key={disease.id}
                className={`disease-card ${disease.is_healthy ? 'healthy' : 'diseased'} bg-white rounded-xl p-5 border border-slate-100 shadow-sm cursor-pointer`}
                onClick={() => setExpandedId(expandedId === disease.id ? null : disease.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      disease.is_healthy ? 'bg-emerald-100' : 'bg-red-100'
                    }`}>
                      {disease.is_healthy ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{disease.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Crop: {disease.crop}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    disease.is_healthy
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {disease.is_healthy ? 'Healthy' : 'Disease'}
                  </span>
                </div>

                {/* Expanded treatment */}
                {expandedId === disease.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
                    <h4 className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
                      💊 {disease.is_healthy ? 'Care Tips' : 'Treatment'}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg">
                      {disease.treatment}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default WikiPage;
