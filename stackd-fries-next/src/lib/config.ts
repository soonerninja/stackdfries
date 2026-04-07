export const siteConfig = {
  name: "Stack'd Fries",
  tagline: "Loaded. Always.",
  subtitle: "Oklahoma's premium loaded fries",
  contact: {
    email: "stackdfries@gmail.com",
    phone: "(405) 310-9971",
  },
  orderUrl: process.env.NEXT_PUBLIC_SQUARE_ORDER_URL || "https://stackdfries.square.site",
  social: {
    instagram: "https://www.instagram.com/stackdfries",
    tiktok: "https://www.tiktok.com/@stackdfries",
    facebook: "https://www.facebook.com/profile.php?id=61580845964760",
    // Paste the full Google Maps place URL once the profile is claimed.
    // Example: "https://g.page/r/abc123xyz"
    googleBusiness: "",
  },
  location: {
    address: "123 Main St, Norman, OK 73069",
    coordinates: {
      lat: 35.2226,
      lng: -97.4395,
    },
  },
  hours: {
    default: {
      thu: { open: "17:00", close: "22:00" },
      fri: { open: "17:00", close: "23:00" },
      sat: { open: "12:00", close: "23:00" },
      sun: { open: "12:00", close: "20:00" },
    },
    seasonalOverrides: [
      {
        label: "OU Football Season",
        months: [9, 10, 11],
        overrides: { sat: { open: "12:00", close: "02:00" } },
      },
      {
        label: "OU Spring Season",
        months: [2, 3, 4],
        overrides: { sat: { open: "12:00", close: "02:00" } },
      },
    ],
  },
};
