export const siteConfig = {
  name: "Stack'd Fries",
  tagline: "Loaded. Always.",
  subtitle: "Norman, Oklahoma's premium loaded fries",
  contact: {
    email: "stackfries@gmail.com",
    phone: "(405) 435-1002",
  },
  orderUrl: process.env.NEXT_PUBLIC_SQUARE_ORDER_URL || "https://square.link/stackdfries",
  social: {
    instagram: "https://instagram.com/stackdfries",
    tiktok: "https://tiktok.com/@stackdfries",
    facebook: "https://facebook.com/stackdfries",
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
