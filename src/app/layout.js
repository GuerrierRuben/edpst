import ClientLayout from "@/components/layout/ClientLayout";
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
  return (
    <html lang="fr">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
