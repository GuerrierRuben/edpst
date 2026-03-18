"use client";
import { useState, useEffect } from 'react';

const CATEGORIES = ["Tous", "Foi", "Espoir", "Vie Chrétienne", "Famille"];

export default function SermonsPage() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [selectedSermon, setSelectedSermon] = useState(null);

  useEffect(() => {
    fetch('/api/sermons')
      .then(res => res.json())
      .then(data => {
        setSermons(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement sermons:', err);
        setLoading(false);
      });
  }, []);

  const categories = ["Tous", ...new Set(sermons.map(s => s.category))];

  const filteredSermons = activeFilter === "Tous" 
    ? sermons 
    : sermons.filter(s => s.category === activeFilter);

  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement des sermons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#0f172a] mb-8">Archives des Messages</h1>

        {/* Barre de Filtres */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === cat 
                ? "bg-[#d4af37] text-white shadow-lg shadow-[#d4af37]/20" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille de Sermons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSermons.map(sermon => (
            <div key={sermon.id} className="group cursor-pointer" onClick={() => setSelectedSermon(sermon)}>
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                <img src={sermon.thumbnail} alt={sermon.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">{sermon.category}</span>
              <h3 className="text-xl font-bold text-[#0f172a] mt-1 group-hover:text-[#d4af37] transition-colors">{sermon.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{sermon.speaker} • {sermon.date}</p>
            </div>
          ))}
        </div>

        {/* Modal de lecture vidéo */}
        {selectedSermon && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSermon(null)}>
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-bold text-[#d4af37] uppercase tracking-widest">{selectedSermon.category}</span>
                    <h2 className="text-2xl font-bold text-[#0f172a] mt-1">{selectedSermon.title}</h2>
                    <p className="text-gray-600 mt-1">{selectedSermon.speaker} • {selectedSermon.date}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedSermon(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(selectedSermon.videoUrl)}?rel=0&modestbranding=1&showinfo=0`}
                  className="w-full h-full"
                  allowFullScreen
                  title={selectedSermon.title}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}