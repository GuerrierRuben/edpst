"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NouveauEvenement() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    image: ""
  });

  // Gère uniquement l'upload de fichier
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérification de la taille (Optionnel : max 2Mo pour le Base64)
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
    if (!formData.image) {
      alert("Veuillez sélectionner une image.");
      return;
    }

    setLoading(true);
    try {
      console.log("📤 Envoi de l'événement...", {
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        hasImage: !!formData.image
      });

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("📥 Réponse reçue:", res.status, res.statusText);

      if (res.ok) {
        const data = await res.json();
        console.log("✅ Événement créé avec succès:", data);
        alert("✅ Événement créé avec succès!");
        router.push("/admin/events");
        router.refresh();
      } else {
        const err = await res.json();
        console.error("❌ Erreur serveur:", err);
        alert("Erreur Serveur : " + err.error);
      }
    } catch (error) {
      console.error("❌ Erreur de connexion:", error);

      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert("❌ Impossible de se connecter au serveur.\n\nAssurez-vous que le serveur de développement est démarré avec 'npm run dev'");
      } else {
        alert("❌ Erreur de connexion au serveur: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <h1 className="text-3xl font-bold text-slate-800">Planifier un événement</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border space-y-6">

        {/* TITRE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'événement</label>
          <input
            required
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Ex: Grand Culte de Louange"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* DATE ET HEURE */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              required
              type="date"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Heure</label>
            <input
              required
              type="time"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
        </div>

        {/* LIEU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lieu</label>
          <input
            required
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Ex: Sanctuaire Principal"
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        {/* IMAGE UNIQUE (UPLOAD) */}
        <div className="bg-emerald-50/50 p-6 rounded-lg border-2 border-dashed border-emerald-200">
          <label className="block text-sm font-bold text-emerald-800 mb-3 text-center">
            Photo de l'événement
          </label>

          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
            onChange={handleFileUpload}
          />

          {formData.image && (
            <div className="mt-4 relative">
              <img src={formData.image} alt="Preview" className="h-48 w-full object-cover rounded-lg border shadow-md" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, image: "" })}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600 shadow-md"
              >
                ✕ Supprimer
              </button>
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            required
            rows="5"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Détails de l'événement..."
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            Annuler
          </button>
          <button type="submit" disabled={loading} className="px-8 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition disabled:opacity-50">
            {loading ? "Chargement..." : "Publier l'événement"}
          </button>
        </div>
      </form>
    </div>
  );
}