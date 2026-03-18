"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Lock } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/admin";

    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                username: formData.username,
                password: formData.password,
            });

            if (result.error) {
                setError("Identifiants secrets incorrects");
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError("Erreur de connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-slate-100 p-4 rounded-full">
                        <Lock className="text-slate-800" size={32} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Espace Privé</h1>
                <p className="text-gray-500 text-center text-sm mb-8">Veuillez entrer vos codes d'accès secrets</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-center gap-2 border border-red-100">
                        <AlertTriangle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Identifiant Secret</label>
                        <input
                            type="text"
                            required
                            placeholder="Entrez votre nom"
                            className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none transition bg-gray-50"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Code Secret</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-800 outline-none transition bg-gray-50"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50 shadow-lg active:scale-[0.98]"
                    >
                        {loading ? "Vérification..." : "Accéder à l'Administration"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400 font-medium">Secured Administration System</p>
                </div>
            </div>
        </div>
    );
}
