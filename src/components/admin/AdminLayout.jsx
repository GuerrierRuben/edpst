"use client";
import { useState } from 'react';
import Link from 'next/link';
import { BarChart3, FileText, Mic, Calendar, Image, Users, Clock, Mail, Menu, X } from 'lucide-react';

const iconMap = {
  '📊': BarChart3,
  '📝': FileText,
  '🎤': Mic,
  '📅': Calendar,
  '🖼️': Image,
  '👥': Users,
  '⏰': Clock,
  '📩': Mail,
};

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Articles Blog', href: '/admin/blog', icon: '📝' },
    { name: 'Sermons', href: '/admin/sermons', icon: '🎤' },
    { name: 'Événements', href: '/admin/events', icon: '📅' },
    { name: 'Galerie', href: '/admin/gallery', icon: '🖼️' },
    { name: 'Ministères', href: '/admin/ministeres', icon: '👥' },
    { name: 'Programme Culte', href: '/admin/programme', icon: '⏰' },
    { name: 'Messages', href: '/admin/contacts', icon: '📩' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0f172a] text-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#0f172a] text-white p-6
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-full overflow-y-auto
      `}>
        <h2 className="text-2xl font-bold mb-8 text-[#d4af37]">Admin Église</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = iconMap[item.icon];
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-3 p-3 rounded hover:bg-slate-800 transition"
              >
                {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-10">
          <Link 
            href="/" 
            onClick={() => setSidebarOpen(false)}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Retour au site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-10">
        <div className="pt-12 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}