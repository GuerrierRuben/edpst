"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery?limit=6');
      const data = await res.json();
      setImages(Array.isArray(data) ? data.slice(0, 6) : []);
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="section-title">Notre Galerie</h2>
          <div className="mt-3 mx-auto w-16 h-1 rounded-full" style={{ background: 'linear-gradient(135deg, #FFB830, #F79400)' }} />
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Revivez les moments forts de notre communauté à travers nos photos
          </p>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : images.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, i) => (
                <div
                  key={img.id || i}
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <Image
                    src={img.image}
                    alt={img.title || `Photo ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                    {img.title && (
                      <p className="text-white text-sm font-bold line-clamp-2">{img.title}</p>
                    )}
                    {img.category && (
                      <span className="text-[10px] text-gray-300 font-medium px-2 py-1 bg-white/20 backdrop-blur-md rounded-full mt-2 inline-block w-fit">
                        {img.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Voir Plus Button */}
            <div className="text-center mt-12">
              <Link
                href="/galerie"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
              >
                Voir toutes les photos
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune photo disponible pour le moment</p>
          </div>
        )}
      </div>
    </section>
  );
}