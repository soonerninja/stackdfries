import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stack'd Fries | Loaded Fries in Norman, Oklahoma",
  description:
    "Premium loaded fries in Norman, OK. Buffalo chicken, carne asada, street corn & rotating specials. Open Thu–Sun. Loaded. Always.",
  openGraph: {
    title: "Stack'd Fries | Loaded Fries in Norman, Oklahoma",
    description:
      "Premium loaded fries in Norman, OK. Buffalo chicken, carne asada, street corn & rotating specials. Open Thu–Sun. Loaded. Always.",
    type: "website",
    url: "https://stackdfries.com",
    siteName: "Stack'd Fries",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stack'd Fries | Loaded Fries in Norman, Oklahoma",
    description:
      "Premium loaded fries in Norman, OK. Buffalo chicken, carne asada, street corn & rotating specials. Open Thu–Sun. Loaded. Always.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Stack'd Fries",
  description:
    "Premium loaded fries in Norman, OK. Buffalo chicken, carne asada, street corn & rotating specials. Open Thu–Sun.",
  url: "https://stackdfries.com",
  telephone: "(405) 435-1002",
  email: "stackfries@gmail.com",
  servesCuisine: "American, Loaded Fries",
  priceRange: "$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Norman",
    addressRegion: "OK",
    postalCode: "73069",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "17:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "17:00", closes: "23:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "12:00", closes: "23:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "20:00" },
  ],
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
