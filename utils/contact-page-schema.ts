// utils/schema/contact-page-schema.ts
export const getContactPageSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Kontakt - JBeauty",
  "url": "https://jbeautysklep.pl/kontakt",
  "mainEntity": {
    "@type": "Organization",
    "name": "JBeauty",
    "url": "https://jbeautysklep.pl",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+48 792 669 926",
      "contactType": "customer support",
      "email": "info@jbeautysklep.pl",
      "areaServed": "PL",
      "availableLanguage": ["pl"]
    }
  }
});
