import Link from 'next/link';

export default function AdminLayout({ children }) {
  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Articles Blog', href: '/admin/blog', icon: '📝' },
    { name: 'Sermons', href: '/admin/sermons', icon: '🎤' },
    { name: 'Événements', href: '/admin/events', icon: '📅' },
    // AJOUT DU PROGRAMME ICI
    { name: 'Programme Culte', href: '/admin/programme', icon: '⏰' },
    { name: 'Messages', href: '/admin/contacts', icon: '📩' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white p-6 fixed h-full">
        <h2 className="text-2xl font-bold mb-8 text-[#d4af37]">Admin Église</h2>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="flex items-center space-x-3 p-3 rounded hover:bg-slate-800 transition"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-10">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        {children}
      </main>
    </div>
  );
}