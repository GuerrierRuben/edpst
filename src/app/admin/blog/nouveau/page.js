"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "Enseignement",
    image: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("excerpt", formData.excerpt);
    data.append("content", formData.content);
    data.append("author", formData.author);
    data.append("category", formData.category);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        router.push("/admin/blog"); // Retour à la liste après succès
        router.refresh();
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Rédiger un article</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Titre de l'article</label>
          <input
            required
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Ex: Les piliers de la foi..."
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Auteur</label>
            <input
              required
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="Nom du pasteur ou auteur"
              onChange={(e) => setFormData({...formData, author: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option>Enseignement</option>
              <option>Événement</option>
              <option>Témoignage</option>
              <option>Annonce</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image de couverture</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
          />
          <p className="text-xs text-gray-400 mt-1">Choisissez une image depuis votre ordinateur.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Résumé (Extrait)</label>
          <textarea
            required
            rows="2"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Bref résumé pour donner envie de lire..."
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contenu complet</label>
          <textarea
            required
            rows="10"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Développez votre message ici..."
            onChange={(e) => setFormData({...formData, content: e.target.value})}
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 bg-[#d4af37] text-white rounded-lg font-bold hover:bg-amber-600 transition disabled:opacity-50"
          >
            {loading ? "Publication..." : "Publier l'article"}
          </button>
        </div>
      </form>
    </div>
  );
}