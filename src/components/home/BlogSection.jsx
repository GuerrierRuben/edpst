"use client";

import Link from 'next/link';

export default function BlogSection({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-gray-400 text-lg">Aucun article disponible pour le moment.</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="section-title">Derniers Articles</h2>
          <div className="mt-3 mx-auto w-16 h-1 rounded-full" style={{ background: 'linear-gradient(135deg, #7B2FBE, #E91E8C)' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link href={`/blog/${post.id}`} key={post.id} className="group block">
              {/* Image */}
              <div className="relative h-56 rounded-2xl overflow-hidden mb-5 bg-gray-100">
                <img
                  src={post.image && post.image.trim() !== "" ? post.image : "/images/placeholder.jpg"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = "/images/placeholder.jpg"; }}
                />
                {/* Category badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="badge-category">Article</span>
                </div>
              </div>

              {/* Meta date */}
              <p className="text-xs text-gray-400 font-medium mb-2">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
              </p>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-2 leading-snug group-hover:text-[#7B2FBE] transition-colors duration-200">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>

              {/* Read more link */}
              <span className="inline-flex items-center gap-1 text-[#E91E8C] text-sm font-semibold mt-3 group-hover:gap-2 transition-all duration-200">
                Lire la suite
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}