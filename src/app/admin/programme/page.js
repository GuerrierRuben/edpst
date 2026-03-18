"use client";
import { useState, useEffect } from "react";

export default function AdminProgram() {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // CORRECTION : On utilise 'date_program' pour correspondre à ta base SQL
  const [formData, setFormData] = useState({ 
    date_program: "", time: "", activity: "", leader: "", reader: "", messenger: "", announcer: "", prayer: "" 
  });

  const fetchProgram = async () => {
    try {
      const res = await fetch("/api/program");
      const data = await res.json();
      console.log('Fetched data:', data);
      
      // TRI : On utilise date_program ici aussi
      const sortedData = data.sort((a, b) => {
        const aDate = a.date_program || '';
        const bDate = b.date_program || '';
        if (aDate !== bDate) return aDate.localeCompare(bDate);
        return a.time.localeCompare(b.time);
      });
      setItems(sortedData);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  useEffect(() => { fetchProgram(); }, []);

  const formatTime = (timeStr) => {
    let clean = timeStr.replace('h', ':').replace('H', ':').trim();
    if (!clean.includes(':')) clean += ':00';
    let [hours, minutes] = clean.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padEnd(2, '0')}`;
  };

  const openAddModal = () => {
    setEditingId(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({ date_program: today, time: "", activity: "", leader: "", reader: "", messenger: "", announcer: "", prayer: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = { ...formData, time: formatTime(formData.time) };
    const method = editingId ? "PUT" : "POST";
    
    const res = await fetch("/api/program", {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { ...formattedData, id: editingId } : formattedData),
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchProgram();
    } else {
      alert("Erreur lors de l'enregistrement. Vérifiez votre API.");
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await fetch("/api/program", { 
        method: "DELETE", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemToDelete.id }) 
      });
      setItemToDelete(null);
      fetchProgram();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Organisation du Culte</h1>
        <button onClick={openAddModal} className="bg-[#d4af37] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#b8962d] transition shadow-md">+ Nouvelle Étape</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-semibold text-gray-600 text-sm">Date</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Heure</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Activité</th>
              <th className="p-4 font-semibold text-gray-600 text-sm">Intervenants</th>
              <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="p-4 text-sm font-medium text-slate-500">
                  {/* Correction ici : item.date_program */}
                  {item.date_program ? new Date(item.date_program).toLocaleDateString('fr-FR') : "N/A"}
                </td>
                <td className="p-4">
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold text-sm">
                    {item.time ? item.time.replace(':', 'h') : "--h--"}
                  </span>
                </td>
                <td className="p-4 font-medium text-slate-800 uppercase text-sm tracking-wide">{item.activity}</td>
                <td className="p-4 text-xs text-gray-500">
                  <div className="flex flex-col gap-1">
                    {item.leader && <span>🎤 Dir: {item.leader}</span>}
                    {item.messenger && <span>📖 Mess: {item.messenger}</span>}
                    {item.reader && <span>📚 Lect: {item.reader}</span>}
                    {item.announcer && <span>📣 Ann: {item.announcer}</span>}
                    {item.prayer && <span>🙏 Pri: {item.prayer}</span>}
                  </div>
                </td>
                <td className="p-4 text-right space-x-4">
                  <button onClick={() => openEditModal(item)} className="text-blue-500 hover:underline text-xs font-bold uppercase">Modifier</button>
                  <button onClick={() => setItemToDelete(item)} className="text-red-500 hover:underline text-xs font-bold uppercase">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE D'AJOUT / MODIFICATION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">{editingId ? "Modifier l'étape" : "Ajouter au programme"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Date du Culte</label>
                <input 
                  type="date" 
                  className="border p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                  value={formData.date_program} 
                  onChange={(e) => setFormData({...formData, date_program: e.target.value})} 
                  required 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Heure</label>
                <input type="text" placeholder="09:00" className="border p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Activité</label>
                <input type="text" placeholder="ex: Louange" className="border p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.activity} onChange={(e) => setFormData({...formData, activity: e.target.value})} required />
              </div>
              
              <input type="text" placeholder="Dirigeant" className="border p-3 rounded-xl" value={formData.leader || ""} onChange={(e) => setFormData({...formData, leader: e.target.value})} />
              <input type="text" placeholder="Messager" className="border p-3 rounded-xl" value={formData.messenger || ""} onChange={(e) => setFormData({...formData, messenger: e.target.value})} />
              <input type="text" placeholder="Lecture" className="border p-3 rounded-xl" value={formData.reader || ""} onChange={(e) => setFormData({...formData, reader: e.target.value})} />
              <input type="text" placeholder="Annonces" className="border p-3 rounded-xl" value={formData.announcer || ""} onChange={(e) => setFormData({...formData, announcer: e.target.value})} />
              <input type="text" placeholder="Prière" className="border p-3 rounded-xl md:col-span-2" value={formData.prayer || ""} onChange={(e) => setFormData({...formData, prayer: e.target.value})} />
              
              <div className="md:col-span-2 flex gap-3 mt-4">
                <button type="submit" className="flex-1 bg-[#0f172a] text-[#d4af37] p-4 rounded-xl font-bold hover:bg-slate-800 transition">Enregistrer</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-100 text-gray-500 px-6 rounded-xl hover:bg-gray-200 transition">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE DE SUPPRESSION */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center border-t-4 border-red-500">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Supprimer ?</h3>
            <p className="text-gray-500 mb-6 text-sm">Voulez-vous supprimer l'étape de <b>{itemToDelete.time}</b> ?</p>
            <div className="flex gap-3">
              <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold">Supprimer</button>
              <button onClick={() => setItemToDelete(null)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}