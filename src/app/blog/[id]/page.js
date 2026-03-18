import { query } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PageDetailBlog({ params }) {
  const { id } = await params;

  try {
    // On utilise "Post" ou "posts" selon ton nom de table SQL
    const result = await query('SELECT * FROM "Post" WHERE id = $1', [id]);
    const post = result.rows[0];

    if (!post) return notFound();

    return (
      <article className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="text-emerald-600 hover:underline mb-8 inline-block">
          ← Retour
        </Link>
        
        {post.image && (
          <img src={post.image} alt={post.title} className="w-full h-[400px] object-cover rounded-3xl mb-10 shadow-lg" />
        )}

        <h1 className="text-4xl font-bold text-slate-900 mb-6">{post.title}</h1>

        <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
          {post.content || post.description}
        </div>
      </article>
    );
  } catch (error) {
    return <p className="text-center py-20 text-red-500">Erreur de base de données.</p>;
  }
}