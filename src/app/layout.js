import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { headers } from "next/headers";
import "./globals.css";

export const metadata = {
  title: "Église de Dieu Salut pour Tous - de Petit Paradis",
  description: "Église de Dieu Salut pour Tous - de Petit Paradis. Pr 29:18",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  // Récupérer le chemin depuis les headers
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Si le chemin commence par /admin, on ne met pas le Navbar et Footer du site
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <html lang="fr">
      <body>
        {!isAdminPage && <Navbar />}
        <main>{children}</main>
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}
