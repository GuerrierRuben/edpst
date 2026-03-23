"use client";
import { useState } from 'react';

export default function LatestSermon({ sermons }) {
  const [selectedSermon, setSelectedSermon] = useState(null);

  if (!sermons || sermons.length === 0) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-[#0f172a]">Dernier Message</h2>
          <p className="text-gray-500 mt-4">Aucun sermon n'est disponible pour le moment.</p>
        </div>
      </section>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-[#0f172a]">Derniers Messages</h2>
              <p className="text-gray-500 mt-2">Redécouvrez les enseignements récents.</p>
            </div>
            <a href="/sermons" className="hidden md:block text-[#d4af37] font-bold hover:underline">Voir toutes les archives</a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="aspect-video bg-black relative group cursor-pointer" onClick={() => setSelectedSermon(sermon)}>
                  <img
                    src={sermon.thumbnail}
                    alt={sermon.title}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <span className="inline-block bg-[#0f172a]/10 text-[#0f172a] px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase">
                    {sermon.category}
                  </span>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-2">{sermon.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Par {sermon.speaker}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(sermon.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de lecture vidéo */}
      {selectedSermon && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSermon(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-bold text-[#d4af37] uppercase tracking-widest">{selectedSermon.category}</span>
                  <h2 className="text-2xl font-bold text-[#0f172a] mt-1">{selectedSermon.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedSermon.speaker} • {formatDate(selectedSermon.date)}</p>
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
    </>
  );
}