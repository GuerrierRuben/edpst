import { query } from "@/lib/db";
import Link from "next/link";
import {
  Calendar, Mic, FileText, MessageSquare,
  Plus, AlertTriangle, CheckCircle, Video,
  ArrowRight, Users, Activity
} from "lucide-react";

export default async function AdminDashboard() {
  // Récupération parallèle des données
  const [
    postsCount,
    eventsCount,
    sermonsCount,
    contactsCount,
    latestEvents,
    latestSermons,
    latestPosts,
    incompleteSermons
  ] = await Promise.all([
    query('SELECT count(*) FROM "Post"'),
    query('SELECT count(*) FROM "Event"'),
    query('SELECT count(*) FROM "Sermon"'),
    query('SELECT count(*) FROM "Contact" WHERE status = \'en_attente\''),
    query('SELECT id, title, date, location FROM "Event" ORDER BY date DESC LIMIT 5'),
    query('SELECT id, title, speaker, date, "videoUrl", thumbnail FROM "Sermon" ORDER BY id DESC LIMIT 5'),
    query('SELECT id, title, category, author, "createdAt" FROM "Post" ORDER BY "createdAt" DESC LIMIT 5'),
    query('SELECT count(*) FROM "Sermon" WHERE "videoUrl" IS NULL OR "videoUrl" = \'\'')
  ]);

  const stats = [
    { label: 'Articles', value: postsCount.rows[0].count, icon: <FileText size={24} />, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/blog' },
    { label: 'Événements', value: eventsCount.rows[0].count, icon: <Calendar size={24} />, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/events' },
    { label: 'Sermons', value: sermonsCount.rows[0].count, icon: <Mic size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/sermons' },
    { label: 'Messages', value: contactsCount.rows[0].count, icon: <MessageSquare size={24} />, color: 'text-red-600', bg: 'bg-red-50', link: '/admin/messages' },
  ];

  const incompleteSermonsValue = parseInt(incompleteSermons.rows[0].count);

  return (
    <div className="space-y-8 pb-10">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bonjour, Admin 👋</h1>
          <p className="text-gray-500 text-sm">Voici un aperçu de l'activité de votre église aujourd'hui.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
            <Users size={16} /> Voir le site
          </Link>
          <form action={async () => {
            "use server";
            const { signOut } = await import("@/auth");
            await signOut();
          }}>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium border border-red-100">
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Insights */}
      {incompleteSermonsValue > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl flex items-center gap-4 shadow-sm">
          <AlertTriangle className="text-orange-500" size={24} />
          <div>
            <h4 className="font-bold text-orange-900">Attention Requise</h4>
            <p className="text-sm text-orange-800">
              Il y a <b>{incompleteSermonsValue} sermons</b> sans lien vidéo. Pensez à ajouter les liens YouTube.
            </p>
          </div>
          <Link href="/admin/sermons" className="ml-auto text-sm font-bold text-orange-600 hover:text-orange-800 px-4 py-2 bg-white rounded-lg shadow-sm">
            Corriger
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity size={20} className="text-indigo-600" /> Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickActionCard
            title="Nouvel Événement"
            color="bg-blue-600"
            icon={<Calendar className="text-white" />}
            link="/admin/events"
            createLink="/admin/events"
          />
          <QuickActionCard
            title="Nouveau Sermon"
            color="bg-emerald-600"
            icon={<Mic className="text-white" />}
            link="/admin/sermons"
            createLink="/admin/sermons"
          />
          <QuickActionCard
            title="Nouvel Article"
            color="bg-amber-600"
            icon={<FileText className="text-white" />}
            link="/admin/blog"
            createLink="/admin/blog"
          />
          <QuickActionCard
            title="Lire Messages"
            color="bg-red-500"
            icon={<MessageSquare className="text-white" />}
            link="/admin/messages"
            createLink="/admin/messages"
            hideCreate
          />
        </div>
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Événements Récents */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" /> Calendrier
            </h3>
            <Link href="/admin/events" className="text-xs text-blue-600 hover:underline">Voir tout</Link>
          </div>
          <div className="divide-y divide-gray-100 flex-1">
            {latestEvents.rows.length === 0 ? <EmptyState /> : latestEvents.rows.map(event => {
              const isPast = new Date(event.date) < new Date();
              const dateObj = new Date(event.date);
              return (
                <div key={event.id} className="p-4 hover:bg-gray-50 transition group">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${isPast ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                      {isPast ? 'Passé' : 'À venir'}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <h4 className="font-medium text-slate-800 text-sm group-hover:text-blue-600 transition truncate">{event.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{event.location}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sermons Récents */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Mic size={16} className="text-emerald-500" /> Prédications
            </h3>
            <Link href="/admin/sermons" className="text-xs text-emerald-600 hover:underline">Voir tout</Link>
          </div>
          <div className="divide-y divide-gray-100 flex-1">
            {latestSermons.rows.length === 0 ? <EmptyState /> : latestSermons.rows.map(sermon => (
              <div key={sermon.id} className="p-4 hover:bg-gray-50 transition group flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs border-2 border-white shadow-sm shrink-0">
                  {sermon.speaker ? sermon.speaker.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-slate-800 text-sm group-hover:text-emerald-600 transition truncate">{sermon.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 truncate">{sermon.speaker}</span>
                    {!sermon.videoUrl && (
                      <span className="text-[10px] bg-red-100 text-red-600 px-1.5 rounded flex items-center gap-1" title="Vidéo manquante">
                        <Video size={10} /> Manquant
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blog Récents */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <FileText size={16} className="text-amber-500" /> Blog
            </h3>
            <Link href="/admin/blog" className="text-xs text-amber-600 hover:underline">Voir tout</Link>
          </div>
          <div className="divide-y divide-gray-100 flex-1">
            {latestPosts.rows.length === 0 ? <EmptyState /> : latestPosts.rows.map(post => (
              <div key={post.id} className="p-4 hover:bg-gray-50 transition group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                    Publié
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full truncate max-w-[100px]">
                    {post.category || 'Général'}
                  </span>
                </div>
                <h4 className="font-medium text-slate-800 text-sm group-hover:text-amber-600 transition line-clamp-2">{post.title}</h4>
                <p className="text-xs text-gray-400 mt-1">
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Date inconnue'} par {post.author}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function QuickActionCard({ title, color, icon, link, createLink, hideCreate }) {
  return (
    <div className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex`}>
      <Link href={link} className={`flex-1 p-4 ${color} text-white flex items-center gap-3 hover:opacity-90 transition`}>
        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
        <span className="font-bold text-sm">{title}</span>
      </Link>
      {!hideCreate && (
        <Link href={createLink} className={`${color} border-l border-white/20 p-4 text-white hover:bg-white/20 flex items-center justify-center transition w-14`} title="Créer rapidement">
          <Plus size={20} />
        </Link>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-6 text-center text-gray-400 text-xs italic">
      Aucune activité récente.
    </div>
  );
}