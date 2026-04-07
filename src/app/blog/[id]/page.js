import { query } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function PageDetailBlog({ params }) {
  const { id } = await params;

  try {
    // Si l'ID est un entier dans la DB, on s'assure de l'envoyer comme tel
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return notFound();

    const result = await query('SELECT * FROM "Post" WHERE id = $1', [numericId]);
    const post = result.rows[0];

    if (!post) return notFound();

    return (
      <article className="max-w-4xl mx-auto px-6 py-20 mt-20">
        <Link href="/" className="text-emerald-600 hover:underline mb-8 inline-block font-semibold">
          ← Retour à l'accueil
        </Link>
        
        {post.image && (
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-[300px] md:h-[450px] object-cover rounded-3xl mb-10 shadow-xl border border-gray-100" 
          />
        )}

        <div className="mb-6">
          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {post.category || "Article"}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-4 leading-tight">{post.title}</h1>
          <p className="text-gray-400 text-sm mt-4">
            Par {post.author} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
          {post.content || post.excerpt || "Aucun contenu disponible."}
        </div>
      </article>
    );
  } catch (error) {
    console.error("Détail Blog Error:", error);
    return <p className="text-center py-20 text-red-500">Erreur lors de la récupération de l'article.</p>;
  }
}