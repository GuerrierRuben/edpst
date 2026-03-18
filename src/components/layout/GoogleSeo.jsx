export default function GoogleSeo() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "PlaceOfWorship",
    "name": "Nom de ton Église",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Avenue de la Paix",
      "addressLocality": "Paris",
      "postalCode": "75000",
      "addressCountry": "FR"
    },
    "openingHours": "Su 10:00-12:00, Su 18:00-19:30",
    "url": "https://votre-eglise.fr"
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}