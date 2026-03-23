"use client";
import { useState, useEffect } from "react";

export default function AdminSermons() {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    category: "",
    date: "",
    videoUrl: "",
    thumbnail: null
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Si c'est déjà formatté ou invalide
    return date.toLocaleDateString('fr-FR');
  };

  const fetchSermons = () => {
    fetch("/api/sermons")
      .then((res) => res.json())
      .then((data) => {
        setSermons(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setSermons([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      speaker: "",
      category: "Culte Dominical",
      date: new Date().toISOString().split('T')[0],
      videoUrl: "",
      thumbnail: null
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sermon) => {
    setEditingId(sermon.id);
    setFormData({
      title: sermon.title,
      speaker: sermon.speaker,
      category: sermon.category,
      date: sermon.date ? new Date(sermon.date).toISOString().split('T')[0] : "",
      videoUrl: sermon.videoUrl,
      thumbnail: null // On ne pré-remplit pas le fichier
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("speaker", formData.speaker);
    data.append("category", formData.category);
    data.append("date", formData.date);
    data.append("videoUrl", formData.videoUrl);

    if (formData.thumbnail) {
      data.append("thumbnail", formData.thumbnail);
    }

    if (editingId) {
      data.append("id", editingId);
    }

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch("/api/sermons", {
        method: method,
        body: data,
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSermons();
      } else {
        const err = await res.json();
        alert("Erreur : " + (err.error || "Une erreur est survenue"));
      }
    } catch (error) {
      alert("Erreur de connexion au serveur");
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await fetch(`/api/sermons?id=${itemToDelete.id}`, { method: "DELETE" });
      setItemToDelete(null);
      fetchSermons();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gestion des Sermons</h1>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          + Nouveau Sermon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Titre</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Prédicateur</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sermons.map((sermon) => (
              <tr key={sermon.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(sermon.date)}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{sermon.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{sermon.speaker}</td>
                <td className="px-6 py-4 text-sm text-right space-x-3">
                  <button
                    onClick={() => openEditModal(sermon)}
                    className="text-indigo-600 hover:text-indigo-800 font-bold uppercase text-xs"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => setItemToDelete(sermon)}
                    className="text-red-600 hover:text-red-800 font-bold uppercase text-xs"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-10 text-center text-gray-500">Chargement des messages...</p>}
        {!loading && sermons.length === 0 && (
          <p className="p-10 text-center text-gray-500">Aucun sermon enregistré.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
              {editingId ? "Modifier le sermon" : "Ajouter un sermon"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Titre du message</label>
                <input
                  required
                  type="text"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Prédicateur</label>
                  <input
                    required
                    type="text"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.speaker}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Date</label>
                  <input
                    required
                    type="date"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Catégorie</label>
                <select
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Culte Dominical</option>
                  <option>Étude Biblique</option>
                  <option>Jeûne et Prière</option>
                  <option>Conférence</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Lien Vidéo (YouTube)</label>
                <input
                  required
                  type="url"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="https://youtube.com/..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl border-2 border-dashed border-indigo-200">
                <label className="block text-xs font-bold uppercase text-indigo-800 mb-2 text-center">
                  Miniature (Image)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                />
                {editingId && !formData.thumbnail && (
                  <p className="text-xs text-gray-500 mt-2 text-center italic">Laissez vide pour conserver l'image actuelle</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
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
            <h3 className="text-xl font-bold text-slate-800 mb-2">Supprimer ce sermon ?</h3>
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