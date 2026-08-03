import type { NextConfig } from "next";

// Applied to every response. Deliberately conservative: no Content-Security-Policy
// yet, because this app renders inline JSON-LD and Next injects its own inline
// scripts — a CSP without nonce plumbing would break the site rather than protect
// it. That belongs in its own change, tested on a preview deploy.
const securityHeaders = [
  // Stop browsers from MIME-sniffing a response away from its declared type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs (or any path) to third parties on cross-origin requests.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disallow other sites framing us (clickjacking). We embed Google Maps
  // ourselves, which is unaffected — this only governs who may frame *us*.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Drop powerful APIs we never use. geolocation is kept on same-origin because
  // the admin tracker page uses navigator.geolocation to drop the truck's pin.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), payment=(), usb=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework/version in every response.
  poweredByHeader: false,

  images: {
    // SECURITY DEBT: `**` lets anyone pass an arbitrary URL to /_next/image and
    // use this domain as a free image-resizing proxy. Narrowing it is a separate,
    // gated change: menu/drop image_url values are free-text admin input with no
    // upload widget, so restricting hosts blanks any image hosted elsewhere —
    // silently, since the optimizer just 400s and the admin preview uses a plain
    // <img> that keeps rendering fine. Verify live image_url values first.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  async redirects() {
    return [
      {
        // Short link for printed material / QR codes ("follow us").
        // Deliberately 302 and NOT 301/308: a permanent redirect gets cached by
        // browsers and QR scanners indefinitely, so anyone who scanned an old
        // flyer would be pinned to the old destination forever. 302 keeps this
        // repointable — change `destination` and previously-scanned codes follow.
        // `statusCode` is used instead of `permanent: false`, which would emit 307.
        source: "/follow",
        destination: "/#follow",
        statusCode: 302,
      },
    ];
  },
};

export default nextConfig;
