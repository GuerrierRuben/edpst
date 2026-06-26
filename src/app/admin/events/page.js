"use client";
import { useState, useEffect } from "react";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    image: ""
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('fr-FR');
  };

  const fetchEvents = () => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setEvents([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      image: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingId(event.id);
    const formattedDate = event.date ? new Date(event.date).toISOString().split('T')[0] : "";
    setFormData({
      ...event,
      date: formattedDate,
      image: event.image || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image && !editingId) {
      alert("Veuillez sélectionner une image pour un nouvel événement.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const bodyData = editingId ? { ...formData, id: editingId } : formData;

    try {
      const res = await fetch("/api/events", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchEvents();
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
      await fetch(`/api/events?id=${itemToDelete.id}`, { method: "DELETE" });
      setItemToDelete(null);
      fetchEvents();
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Calendrier des Événements</h1>
        <button
          onClick={openAddModal}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition shadow-md text-sm md:text-base w-full sm:w-auto"
        >
          + Nouvel Événement
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold text-gray-600">Date</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold text-gray-600">Événement</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold text-gray-600">Lieu</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-emerald-600">
                    {formatDate(event.date)}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-slate-900">
                    <div className="flex items-center gap-2 md:gap-3">
                      {event.image && (
                        <img src={event.image} alt="" className="w-8 h-8 md:w-10 md:h-10 rounded object-cover border" />
                      )}
                      <span className="truncate">{event.title}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-500 truncate">{event.location}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-right space-x-2 md:space-x-3">
                    <button
                      onClick={() => openEditModal(event)}
                      className="text-blue-600 hover:text-blue-800 font-bold uppercase text-xs"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => setItemToDelete(event)}
                      className="text-red-600 hover:text-red-800 font-bold uppercase text-xs"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <p className="p-6 md:p-10 text-center text-gray-500 text-sm md:text-base">Chargement du calendrier...</p>}
        {!loading && events.length === 0 && (
          <p className="p-6 md:p-10 text-center text-gray-500 text-sm md:text-base">Aucun événement prévu.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-4 md:p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-800">
              {editingId ? "Modifier l'événement" : "Planifier un événement"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nom de l'événement</label>
                <input
                  required
                  type="text"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Ex: Grand Culte de Louange"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Date</label>
                  <input
                    required
                    type="date"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Heure</label>
                  <input
                    required
                    type="time"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Lieu</label>
                <input
                  required
                  type="text"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Ex: Sanctuaire Principal"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Détails de l'événement..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="bg-emerald-50/50 p-4 rounded-xl border-2 border-dashed border-emerald-200">
                <label className="block text-xs font-bold uppercase text-emerald-800 mb-2 text-center">
                  Photo de l'événement
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                  onChange={handleFileUpload}
                />

                {formData.image && (
                  <div className="mt-3 relative">
                    <img src={formData.image} alt="Preview" className="h-32 w-full object-cover rounded-lg border shadow-sm" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600 shadow-md w-6 h-6 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition text-sm md:text-base"
                >
                  {editingId ? "Enregistrer les modifications" : "Publier l'événement"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition text-sm md:text-base"
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
            <h3 className="text-xl font-bold text-slate-800 mb-2">Supprimer cet événement ?</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Êtes-vous sûr de vouloir supprimer <b>{itemToDelete.title}</b> ? Cette action est irréversible.
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