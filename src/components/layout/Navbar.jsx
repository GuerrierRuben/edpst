"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Galerie', href: '/galerie' },
  { label: 'Messages', href: '/sermons' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white shadow-sm border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 relative z-50">
          <img src="/logo.svg" alt="Église de Petit Paradis" className="h-16 w-auto" />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 font-medium text-[#1a1a2e] text-[0.9rem]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative hover:text-[#E07800] transition-colors duration-200 group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F79400] group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/contact"
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #FFB830, #F79400)', boxShadow: '0 4px 15px rgba(247,148,0,0.30)' }}
          >
            Nous Rejoindre →
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden relative z-50 p-2 text-[#1a1a2e] hover:text-[#E07800] rounded-lg transition"
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
            className="text-2xl font-semibold text-[#1a1a2e] hover:text-[#E07800] transition-colors duration-200"
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