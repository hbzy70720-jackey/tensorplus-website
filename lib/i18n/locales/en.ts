import type { Dict } from "../dictionaries";

export const en: Dict = {
  nav: {
    home: "Home",
    perception: "3D Perception",
    robot: "Outdoor Operation Robots",
    cases: "Customer Stories",
    about: "About Us",
    bookDemo: "Book a Demo",
    languageSwitch: "中文",
  },
  footer: {
    brandDesc:
      "Beijing TensorPlus Technology Co., Ltd. — high-precision 3D perception and outdoor operation robot solutions.",
    quickLinks: "Quick Links",
    contact: "Contact",
    business: "Business",
    businessDesc:
      "Interested in our products or solutions? Reach out anytime — we respond within 24 hours.",
    bookDemo: "Book a Demo →",
    copyright: (year: number) => `© ${year} Beijing TensorPlus Technology Co., Ltd. All rights reserved.`,
  },
};
