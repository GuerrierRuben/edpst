import Link from "next/link";

const socialLinks = [
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer style={{ background: '#0d0d1a' }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Col 1 : Logo + description originale */}
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #7B2FBE, #E91E8C)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              ÉGLISE<span style={{ color: '#7B2FBE' }}>LOGO</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Une église au cœur de la ville, passionnée par Jésus et dévouée à servir notre communauté.
          </p>
        </div>

        {/* Col 2 : Liens Rapides — liens originaux */}
        <div>
          <h4 className="font-semibold mb-5 text-white text-sm tracking-wide uppercase">Liens Rapides</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>
              <Link href="/a-propos" className="hover:text-[#E91E8C] transition-colors duration-200">À propos</Link>
            </li>
            <li>
              <Link href="/donner" className="hover:text-[#E91E8C] transition-colors duration-200">Donner</Link>
            </li>
            <li>
              <Link href="/ministeres" className="hover:text-[#E91E8C] transition-colors duration-200">Ministères</Link>
            </li>
          </ul>
        </div>

        {/* Col 3 : Horaires originaux + Réseaux sociaux */}
        <div>
          <h4 className="font-semibold mb-5 text-white text-sm tracking-wide uppercase">Horaires</h4>
          <p className="text-gray-400 text-sm">Dimanche : 10h00 &amp; 18h00</p>
          <p className="text-gray-400 text-sm mt-2">Mercredi : 19h30 (Prière)</p>

          <h4 className="font-semibold mt-8 mb-4 text-white text-sm tracking-wide uppercase">Nos Réseaux</h4>
          <div className="flex gap-3 flex-wrap">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#7B2FBE] hover:bg-[#7B2FBE]/20 transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 py-5">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-xs">
          © 2026 Nom de ton Église. Conçu avec excellence.
        </div>
      </div>
    </footer>
  );
}