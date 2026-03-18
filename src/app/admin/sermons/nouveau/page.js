"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NouveauSermon() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    speaker: "",
    category: "",
    date: "",
    videoUrl: "",
    thumbnail: null // Changé en null pour le fichier
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('speaker', formData.speaker);
      submitData.append('category', formData.category);
      submitData.append('date', formData.date);
      submitData.append('videoUrl', formData.videoUrl);
      if (formData.thumbnail) {
        submitData.append('thumbnail', formData.thumbnail);
      }
      
      console.log('Sending FormData...');
      const res = await fetch("/api/sermons", {
        method: "POST",
        body: submitData,
      });
      console.log('Fetch response status:', res.status);
      
      if (res.ok) {
        console.log('Success, redirecting...');
        router.push("/admin/sermons");
      } else {
        const errorData = await res.json();
        console.error('Error response:', errorData);
        alert("Erreur lors de l'enregistrement: " + (errorData.error || "Erreur inconnue"));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Erreur de connexion: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Ajouter un Sermon</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre du message</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded-md" 
            placeholder="Ex: La puissance de la prière"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Orateur</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded-md" 
            placeholder="Ex: Pasteur Jean"
            value={formData.speaker}
            onChange={(e) => setFormData({...formData, speaker: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Catégorie</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded-md" 
            placeholder="Ex: Foi, Espérance, Amour"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded-md" 
            placeholder="Ex: 15 Jan 2026"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lien YouTube</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded-md" 
            placeholder="https://www.youtube.com/watch?v=..." 
            value={formData.videoUrl}
            onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image miniature</label>
          <input 
            type="file" 
            accept="image/*"
            className="w-full p-2 border rounded-md" 
            onChange={(e) => setFormData({...formData, thumbnail: e.target.files[0]})}
            required
          />
        </div>

        {/* Petit bonus : On affiche la vidéo si le lien est rempli */}
        {formData.videoUrl && (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed">
            <p className="text-gray-400 text-sm">Aperçu vidéo disponible après publication</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-gray-500" disabled={loading}>Annuler</button>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer le sermon"}
          </button>
        </div>
      </form>
    </div>
  );
}