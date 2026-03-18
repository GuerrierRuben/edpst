// 1. La fonction pour le titre de l'onglet (optionnel)
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  return {
    title: `Article ${id} - Notre Église`,
  };
}

// 2. LE COMPOSANT PAR DÉFAUT (C'est ce qui manque !)
export default function BlogLayout({ children }) {
  return (
    <section>
      {/* Tu peux ajouter un header spécifique ici si tu veux */}
      {children} 
    </section>
  );
}