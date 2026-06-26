"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Upload, X, Image as ImageIcon, Users, CheckCircle, Star, User } from 'lucide-react';

export default function AdminMinistriesPage() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leaderName: '',
    leaderRole: 'Responsable',
    leaderImage: '',
    isActive: true
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      const res = await fetch('/api/ministries');
      const data = await res.json();
      // Vérifier si c'est un tableau (données) ou un objet (erreur)
      if (Array.isArray(data)) {
        setMinistries(data);
      } else if (data.error) {
        console.error('Erreur API:', data.error);
        setMinistries([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ministères:', error);
      setMinistries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingMinistry 
        ? `/api/ministries/${editingMinistry.id}`
        : '/api/ministries';
      
      const method = editingMinistry ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchMinistries();
        closeModal();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEdit = (ministry) => {
    setEditingMinistry(ministry);
    setFormData({
      name: ministry.name,
      description: ministry.description || '',
      leaderName: ministry.leaderName,
      leaderRole: ministry.leaderRole || 'Responsable',
      leaderImage: ministry.leaderImage || '',
      isActive: ministry.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce ministère ?')) return;
    
    try {
      const res = await fetch(`/api/ministries/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchMinistries();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMinistry(null);
    setFormData({
      name: '',
      description: '',
      leaderName: '',
      leaderRole: 'Responsable',
      leaderImage: '',
      isActive: true
    });
    setImagePreview(null);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Vérifier la taille de chaque fichier (8MB max)
    for (const file of files) {
      if (file.size > 8 * 1024 * 1024) {
        alert(`Le fichier ${file.name} est trop volumineux. Taille maximum: 8MB`);
        return;
      }
    }

    setUploading(true);
    try {
      // Upload du premier fichier (pour le responsable)
      const formData = new FormData();
      formData.append('file', files[0]);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      
      if (data.success) {
        setFormData({...formData, leaderImage: data.url});
        setImagePreview(data.url);
        
        // Si plusieurs fichiers, informer l'utilisateur
        if (files.length > 1) {
          alert(`${files.length} photos sélectionnées. Seule la première a été ajoutée comme photo du responsable.`);
        }
      } else {
        alert(data.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData({...formData, leaderImage: ''});
    setImagePreview(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Gestion des Ministères</h1>
          <p className="text-gray-600 mt-2">Gérez les ministères et leurs responsables</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
        >
          + Nouveau Ministère
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Ministères</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{ministries.length}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ministères Actifs</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {ministries.filter(m => m.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Responsables</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{ministries.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Ministries List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Chargement...</p>
        </div>
      ) : ministries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Aucun ministère</h3>
          <p className="text-gray-600 mb-6">Commencez par créer votre premier ministère</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            Créer un ministère
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministries.map((ministry) => (
            <div
              key={ministry.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition"
            >
              {/* Header Card */}
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{ministry.name}</h3>
                    {ministry.description && (
                      <p className="text-indigo-100 text-sm line-clamp-2">{ministry.description}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    ministry.isActive 
                      ? 'bg-green-400 text-green-900' 
                      : 'bg-gray-400 text-gray-900'
                  }`}>
                    {ministry.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              {/* Leader Info */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {ministry.leaderImage ? (
                    <img
                      src={ministry.leaderImage}
                      alt={ministry.leaderName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="w-8 h-8 text-indigo-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-slate-800">{ministry.leaderName}</p>
                    <p className="text-sm text-gray-600">{ministry.leaderRole || 'Responsable'}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleEdit(ministry)}
                    className="flex-1 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(ministry.id)}
                    className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingMinistry ? 'Modifier le Ministère' : 'Nouveau Ministère'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Nom du ministère */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nom du Ministère *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Ex: Jeunesse, Dames, Hommes..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                  rows="3"
                  placeholder="Description du ministère..."
                />
              </div>

              {/* Nom du responsable */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nom du Responsable *
                </label>
                <input
                  type="text"
                  required
                  value={formData.leaderName}
                  onChange={(e) => setFormData({...formData, leaderName: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Nom complet du responsable"
                />
              </div>

              {/* Rôle du responsable */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Rôle du Responsable
                </label>
                <input
                  type="text"
                  value={formData.leaderRole}
                  onChange={(e) => setFormData({...formData, leaderRole: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Ex: Responsable, Coordinateur, Leader..."
                />
              </div>

              {/* Image du responsable */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Photo du Responsable
                </label>
                
                {/* Preview de l'image */}
                {(imagePreview || formData.leaderImage) && (
                  <div className="mb-4 relative inline-block">
                    <img
                      src={imagePreview || formData.leaderImage}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Upload button */}
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-indigo-500 hover:bg-indigo-50 transition">
                      <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                      <p className="text-sm text-slate-600">
                        {uploading ? 'Upload en cours...' : 'Cliquez pour uploader une photo'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WebP (max 8MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                      multiple
                    />
                  </label>
                </div>

                {/* Ou saisie d'URL */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Ou collez une URL :</p>
                  <input
                    type="url"
                    value={formData.leaderImage}
                    onChange={(e) => {
                      setFormData({...formData, leaderImage: e.target.value});
                      setImagePreview(e.target.value);
                    }}
                    className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="https://exemple.com/photo.jpg"
                  />
                </div>
              </div>

              {/* Statut */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                  Ministère actif
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
                >
                  {editingMinistry ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}