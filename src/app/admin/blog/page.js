"use client";
import { useState, useEffect } from "react";

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "Enseignement",
    image: ""
  });

  const fetchPosts = () => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      category: "Enseignement",
      image: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (post) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      image: post.image || ""
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("L'image est trop lourde (max 2Mo)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bodyData = {
      ...formData,
      id: editingId || undefined
    };

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch("/api/posts", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchPosts();
      } else {
        const err = await res.json();
        alert("Erreur : " + (err.error || "Une erreur est survenue"));
      }
    } catch (error) {
      alert("Erreur de connexion");
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      // Use query param for consistency with route.js implementation
      await fetch(`/api/posts?id=${itemToDelete.id}`, { method: "DELETE" });
      setItemToDelete(null);
      fetchPosts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gestion du Blog</h1>
        <button
          onClick={openAddModal}
          className="bg-[#d4af37] text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition shadow-md"
        >
          + Nouvel Article
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Titre</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Auteur</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Catégorie</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900 line-clamp-1">{post.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{post.author}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs font-bold">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right space-x-3">
                  <button
                    onClick={() => openEditModal(post)}
                    className="text-indigo-600 hover:text-indigo-800 font-bold uppercase text-xs"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => setItemToDelete(post)}
                    className="text-red-600 hover:text-red-800 font-bold uppercase text-xs"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-10 text-center text-gray-500">Chargement des articles...</p>}
        {!loading && posts.length === 0 && <p className="p-10 text-center text-gray-500">Aucun article trouvé.</p>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
              {editingId ? "Modifier l'article" : "Rédiger un article"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Titre</label>
                <input
                  required
                  type="text"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Auteur</label>
                  <input
                    required
                    type="text"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Catégorie</label>
                  <select
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Enseignement</option>
                    <option>Événement</option>
                    <option>Témoignage</option>
                    <option>Annonce</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image de couverture</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  onChange={handleFileUpload}
                />
                {(formData.image || editingId) && (
                   <div className="mt-3 relative">
                     {formData.image && typeof formData.image === 'string' && (
                       <img src={formData.image} alt="Preview" className="h-32 w-full object-cover rounded-lg border shadow-sm" />
                     )}
                     <p className="text-[10px] text-gray-400 mt-1 truncate">
                       {editingId && !formData.image ? "Laissez vide pour conserver l'image actuelle" : ""}
                     </p>
                   </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Résumé</label>
                <textarea
                  required
                  rows="2"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Contenu</label>
                <textarea
                  required
                  rows="6"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#d4af37] text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition"
                >
                  {editingId ? "Enregistrer" : "Publier"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center border-t-4 border-red-500">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Supprimer ?</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Supprimer <b>{itemToDelete.title}</b> ? Action irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
              >
                Confirmer
              </button>
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}