"use client";
import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 60%, #2d1b4e 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left: Title */}
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight uppercase tracking-wide">
              Abonnez-vous à notre{' '}
              <span style={{ WebkitTextStroke: '2px #E91E8C', color: 'transparent' }}>Newsletter !</span>
            </h2>
          </div>

          {/* Right: Form */}
          <div className="md:w-1/2 w-full">
            {submitted ? (
              <div className="bg-white/10 border border-[#7B2FBE]/40 rounded-full px-8 py-4 text-center text-white font-semibold text-lg">
                ✓ Merci, vous êtes abonné(e) !
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex items-center gap-0 w-full max-w-lg">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse e-mail"
                  required
                  className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-400 px-6 py-4 rounded-full rounded-r-none focus:outline-none focus:border-[#E91E8C] transition text-sm font-medium"
                  style={{ borderRight: 'none' }}
                />
                <button
                  type="submit"
                  className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #E91E8C, #7B2FBE)', boxShadow: '0 4px 15px rgba(233,30,140,0.5)' }}
                  aria-label="S'abonner"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
