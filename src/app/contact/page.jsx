"use client"; // Obligatoire pour la gestion d'état (useState)

import { useState } from 'react';

export default function ContactPage() {
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };
    
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setStatus('success');
        e.target.reset(); // Clear the form
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setStatus('error');
    }
  };

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">Contactez-nous</h1>
          <p className="text-gray-500 text-lg">Une question ? Une demande de prière ? Notre équipe est là pour vous.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Infos de contact */}
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-[#0f172a] mb-2">Notre Adresse</h3>
              <p className="text-gray-600 text-sm">123 Avenue de la Paix,<br />75000 Paris, France</p>
            </div>
            <div>
              <h3 className="font-bold text-[#0f172a] mb-2">Email</h3>
              <p className="text-gray-600 text-sm">contact@eglise-exemple.fr</p>
            </div>
          </div>

          {/* Formulaire réel */}
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input 
                type="text" name="name" placeholder="Nom complet" required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition"
              />
              <input 
                type="email" name="email" placeholder="Votre Email" required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition"
              />
            </div>
            <textarea 
              name="message" placeholder="Votre message..." rows="5" required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition"
            ></textarea>
            
            <button 
              type="submit" 
              disabled={status === 'sending'}
              className="w-full btn-primary py-4 disabled:bg-gray-400"
            >
              {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>

            {status === 'success' && (
              <p className="text-green-600 font-medium text-center bg-green-50 p-3 rounded-lg">
                Merci ! Votre message a bien été envoyé.
              </p>
            )}
            
            {status === 'error' && (
              <p className="text-red-600 font-medium text-center bg-red-50 p-3 rounded-lg">
                Erreur lors de l'envoi. Veuillez réessayer.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}