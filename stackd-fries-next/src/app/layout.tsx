import type { Metadata, Viewport } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import PageTracker from '@/components/PageTracker';
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
    default: "Stack'd Fries | Oklahoma's Premium Loaded Fries",
    template: "%s | Stack'd Fries",
  },
  description: "Oklahoma's premium loaded fries — buffalo chicken, carne asada, street corn & more. Founded in Norman, served statewide. Open Thu–Sun. Order online now.",
  keywords: [
    "loaded fries", "Stack'd Fries", "Norman Oklahoma", "Oklahoma food truck",
    "food trailer Norman", "loaded fries Oklahoma", "buffalo chicken fries",
    "carne asada fries", "street corn fries", "best fries Oklahoma",
    "food truck Norman OK", "late night food Norman", "OU campus food",
    "Oklahoma City food truck", "premium fries"
  ],
  openGraph: {
    title: "Stack'd Fries | Oklahoma's Premium Loaded Fries",
    description: "Oklahoma's premium loaded fries — buffalo chicken, carne asada, street corn & more. Founded in Norman, served statewide.",
    type: "website",
    url: "https://stackdfries.com",
    siteName: "Stack'd Fries",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stack'd Fries | Oklahoma's Premium Loaded Fries",
    description: "Oklahoma's premium loaded fries. Founded in Norman, served statewide. Loaded. Always.",
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
  },
  verification: {},
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "@id": "https://stackdfries.com",
  name: "Stack'd Fries",
  description: "Oklahoma's premium loaded fries — buffalo chicken, carne asada, street corn & more. Founded in Norman, served statewide.",
  url: "https://stackdfries.com",
  telephone: "(405) 435-1002",
  email: "stackfries@gmail.com",
  servesCuisine: ["American", "Street Food", "Loaded Fries"],
  priceRange: "$",
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card, Square",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Norman",
    addressRegion: "OK",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "State",
    name: "Oklahoma",
  },
  foundingLocation: {
    "@type": "Place",
    name: "Norman, Oklahoma",
  },
  sameAs: [
    "https://www.tiktok.com/@stackdfries",
    "https://www.instagram.com/stackdfries",
    "https://www.facebook.com/profile.php?id=61580845964760",
  ],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Thursday", "Friday"], opens: "17:00", closes: "23:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday"], opens: "12:00", closes: "23:00" },
  ],
  hasMenu: {
    "@type": "Menu",
    url: "https://stackdfries.com/#menu",
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: "Loaded Fries",
        hasMenuItem: [
          { "@type": "MenuItem", name: "Buffalo Chicken Fries", description: "Crispy fries, shredded buffalo chicken, ranch, blue cheese crumbles" },
          { "@type": "MenuItem", name: "Carne Asada Fries", description: "Seasoned steak, pico, guacamole, sour cream, cilantro" },
          { "@type": "MenuItem", name: "Mexican Street Corn Fries", description: "Elote-style corn, cotija, tajin, lime crema" },
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
        <link rel="manifest" href="/manifest.json" />
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
      <body>
        {children}
        <PageTracker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
