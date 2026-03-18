"use client";
import { useState, useEffect } from "react";

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => {
        console.log('Contacts API response status:', res.status);
        return res.json();
      })
      .then((data) => {
        console.log('Contacts data received:', data);
        setMessages(data);
      })
      .catch((error) => {
        console.error('Error fetching contacts:', error);
      });
  }, []);

  const markAsReplied = async (id) => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: 'repondu' }),
      });
      
      if (response.ok) {
        // Update local state
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, status: 'repondu' } : msg
        ));
      } else {
        alert('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur de connexion');
    }
  };

  const sendReply = async (messageId, recipientEmail, recipientName, originalMessage) => {
    if (!replyText.trim()) {
      alert('Veuillez saisir un message de réponse');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/contacts/send-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          recipientEmail,
          recipientName,
          replyText,
          originalMessage
        }),
      });

      if (response.ok) {
        await markAsReplied(messageId);
        setReplyingTo(null);
        setReplyText("");
        alert('Réponse envoyée avec succès !');
      } else {
        const error = await response.json();
        alert(`Erreur lors de l'envoi: ${error.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Erreur de connexion lors de l\'envoi');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Messages Reçus</h1>
      
      <div className="grid gap-4">
        {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-amber-500">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Message de {msg.name}</h3>
                  <p className="text-sm text-gray-500">Email: {msg.email}</p>
                  {msg.subject && <p className="text-sm text-gray-500">Sujet: {msg.subject}</p>}
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    msg.status === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                    msg.status === 'repondu' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.status === 'en_attente' ? 'En attente' :
                     msg.status === 'repondu' ? 'Répondu' : 'Statut inconnu'}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-gray-400">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
                  </span>
                  <div className="flex gap-2">
                    {msg.status !== 'repondu' && (
                      <>
                        <button
                          onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                          className="bg-[#d4af37] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#b8962d] transition-colors"
                        >
                          {replyingTo === msg.id ? 'Annuler' : 'Répondre'}
                        </button>
                        <button
                          onClick={() => markAsReplied(msg.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Marquer comme répondu
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-gray-700 bg-gray-50 p-3 rounded">{msg.message}</p>
              
              {replyingTo === msg.id && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Répondre à {msg.name}</h4>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tapez votre réponse ici..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-transparent resize-vertical min-h-[100px]"
                    rows={4}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => sendReply(msg.id, msg.email, msg.name, msg.message)}
                      disabled={isSending || !replyText.trim()}
                      className="bg-[#d4af37] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#b8962d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSending ? 'Envoi en cours...' : 'Envoyer la réponse'}
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
        ))}
        {messages.length === 0 && <p className="text-gray-500 italic">Aucun message pour le moment.</p>}
      </div>
    </div>
  );
}