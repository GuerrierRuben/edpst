"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Messages', href: '/sermons' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white shadow-sm border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">

        {/* LOGO — original text, new style */}
        <Link href="/" className="flex items-center gap-2.5 relative z-50">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #7B2FBE, #E91E8C)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-[#1a1a2e] tracking-tight">
            ÉGLISE<span style={{ color: '#7B2FBE' }}>LOGO</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 font-medium text-[#1a1a2e] text-[0.9rem]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative hover:text-[#7B2FBE] transition-colors duration-200 group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E91E8C] group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-[#7B2FBE] transition" aria-label="Rechercher">
            <Search size={19} />
          </button>
          <Link
            href="/contact"
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #7B2FBE, #E91E8C)', boxShadow: '0 4px 15px rgba(233,30,140,0.30)' }}
          >
            Nous Rejoindre →
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden relative z-50 p-2 text-[#1a1a2e] hover:text-[#7B2FBE] rounded-lg transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="text-2xl font-semibold text-[#1a1a2e] hover:text-[#7B2FBE] transition-colors duration-200"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/contact"
          onClick={() => setIsOpen(false)}
          className="btn-primary text-lg mt-4"
        >
          Nous Rejoindre →
        </Link>
      </div>
    </nav>
  );
}