"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar"; // Vérifie ton chemin actuel
import Footer from "@/components/layout/Footer"; // Vérifie ton chemin actuel
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Si le chemin commence par /admin, on considère que c'est l'interface admin
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <html lang="fr">
      <body>
        {/* Si c'est PAS l'admin, on met la Navbar */}
        {!isAdminPage && <Navbar />}

        <main>{children}</main>

        {/* Si c'est PAS l'admin, on met le Footer */}
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}