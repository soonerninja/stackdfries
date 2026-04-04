import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A0A0A',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://stackdfries.com'),
  title: {
    default: "Stack'd Fries | Oklahoma's Premium Loaded Fries — Norman, OK",
    template: "%s | Stack'd Fries",
  },
  description: "Stack'd Fries serves Oklahoma's best loaded fries from Norman. Buffalo chicken, carne asada, street corn & more — fresh-cut fries stacked high. Open Thu–Sun. Order online.",
  keywords: [
    "loaded fries Norman Oklahoma", "Stack'd Fries", "best loaded fries Oklahoma",
    "food truck Norman OK", "loaded fries near me", "buffalo chicken fries",
    "carne asada fries Oklahoma", "street corn fries", "fresh-cut fries Norman",
    "food trailer Norman Oklahoma", "OU campus food", "late night food Norman OK",
    "Oklahoma City food truck", "premium loaded fries", "Norman Oklahoma food",
    "food truck near University of Oklahoma"
  ],
  openGraph: {
    title: "Stack'd Fries | Oklahoma's Premium Loaded Fries",
    description: "Oklahoma's best loaded fries — buffalo chicken, carne asada, street corn & more. Fresh-cut fries stacked high. Founded in Norman, served statewide.",
    type: "website",
    url: "https://stackdfries.com",
    siteName: "Stack'd Fries",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 1024,
        alt: "Stack'd Fries — Oklahoma's Premium Loaded Fries",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stack'd Fries | Oklahoma's Premium Loaded Fries",
    description: "Oklahoma's best loaded fries. Fresh-cut. Stacked high. Founded in Norman, served statewide. Loaded. Always.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://stackdfries.com',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/og-image.png',
  },
  // Add Google Search Console verification token here when you get it:
  // verification: { google: 'YOUR_VERIFICATION_TOKEN' },
  verification: {},
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["FoodEstablishment", "LocalBusiness"],
  "@id": "https://stackdfries.com",
  name: "Stack'd Fries",
  description: "Oklahoma's premium loaded fries — buffalo chicken, carne asada, street corn & more. Fresh-cut fries stacked high. Founded in Norman, served statewide.",
  url: "https://stackdfries.com",
  logo: "https://stackdfries.com/og-image.png",
  image: "https://stackdfries.com/og-image.png",
  telephone: "(405) 310-9971",
  email: "stackfries@gmail.com",
  servesCuisine: ["American", "Street Food", "Loaded Fries", "Fast Casual"],
  priceRange: "$",
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card, Square",
  keywords: "loaded fries, food truck Norman Oklahoma, buffalo chicken fries, carne asada fries",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mobile Food Trailer",
    addressLocality: "Norman",
    addressRegion: "OK",
    postalCode: "73069",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 35.2226,
    longitude: -97.4395,
  },
  areaServed: [
    { "@type": "State", name: "Oklahoma" },
    { "@type": "City", name: "Norman", containedIn: "Oklahoma" },
    { "@type": "City", name: "Oklahoma City", containedIn: "Oklahoma" },
  ],
  foundingLocation: {
    "@type": "Place",
    name: "Norman, Oklahoma",
  },
  sameAs: [
    "https://www.tiktok.com/@stackdfries",
    "https://www.instagram.com/stackdfries",
    "https://www.facebook.com/stackdfries",
    // Add your Google Business Profile URL here, e.g.:
    // "https://g.page/r/YOUR_BUSINESS_ID"
  ],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "17:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "17:00", closes: "23:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "12:00", closes: "23:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "20:00" },
  ],
  hasMenu: {
    "@type": "Menu",
    url: "https://stackdfries.com/#menu",
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: "Stack'd Fries",
        description: "Fresh-cut loaded fries with premium toppings",
        hasMenuItem: [
          { "@type": "MenuItem", name: "Buffalo Chicken Fries", description: "Shredded buffalo chicken, house ranch, blue cheese crumbles on fresh-cut fries", offers: { "@type": "Offer", price: "13.99", priceCurrency: "USD" } },
          { "@type": "MenuItem", name: "Carne Asada Fries", description: "Seasoned steak, fresh pico, queso, cilantro-lime crema on fresh-cut fries", offers: { "@type": "Offer", price: "14.99", priceCurrency: "USD" } },
          { "@type": "MenuItem", name: "Mexican Street Corn Fries", description: "Elote-style roasted corn, cotija cheese, tajin, lime crema on fresh-cut fries", offers: { "@type": "Offer", price: "12.99", priceCurrency: "USD" } },
        ],
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500&family=Barlow+Condensed:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
