// src/lib/sanity/queries.ts

// =========================
// SITE SETTINGS (logo + nav only)
// =========================
export const SITE_SETTINGS_QUERY = /* groq */ `
*[_type=="siteSettings"][0]{
  logo,
  navLinks[] { label_en, label_ar, href }
}
`;

// =========================
// CONTACT SETTINGS (footer + contact overlay)
// =========================
export const CONTACT_SETTINGS_QUERY = /* groq */ `
*[_type=="contactSettings"][0]{
  contactPageImage,
  ConactPageTitle_en,
  ContactPageTitle_ar,
  ContactPageIntro_en,
  ContactPageIntro_ar,

  ContactFooterTitle_en,
  ContactFooterTitle_ar,

  emailAddress,
  phoneNumber_en,
  phoneNumber_ar,

  whatsappLabel_en,
  whatsappLabel_ar,
  whatsappNumber,

  address_en,
  address_ar,
  mapLinkLabel_en,
  mapLinkLabel_ar,
  mapUrl
}
`;

// =========================
// HOME PAGE
// =========================
export const HOME_PAGE_QUERY = /* groq */ `
*[_type=="homePage"][0]{
  heroTitle_en,
  heroTitle_ar,
  heroImage,
  industriesTitle_en,
  industriesTitle_ar,
  industries[]{
    name_en,
    name_ar,
    icon
  },
  servicesTitle_en,
  servicesTitle_ar,
  services[]{
    title_en,
    title_ar,
    body_en,
    body_ar,
    image,
    linkLabel_en,
    linkLabel_ar,
    linkUrl,
    linkLabel2_en,
    linkLabel2_ar,
    linkUrl2
  },
  findTitle_en,
  findTitle_ar,
  findIntro_en,
  findIntro_ar,
  findImage,
  aboutTitle_en,
  aboutTitle_ar,
  aboutBody_en,
  aboutBody_ar,
  partnersTitle_en,
  partnersTitle_ar,
  partners[]{
    name,
    logo
  }
}
`;

// =========================
// UNITS (used everywhere)
// =========================
export const UNITS_QUERY = /* groq */ `
*[_type=="unit"] | order(sortOrder asc, name asc){
  _id,
  name,
  "slug": slug.current,

  vehicleType,
  vehicleEnergy,
  powerType,
  hasStandby,
  coolingAndHeating,

  image,
  summary_en,
  summary_ar,
  description_en,
  description_ar,
  brochureUrl,
  sortOrder
}
`;

// =========================
// FIND MY UNIT LABELS
// =========================
export const FIND_LABELS_QUERY = /* groq */ `
*[_type=="findMyUnitLabels"][0]
`;

// =========================
// TRAILERS PAGE
// =========================
export const TRAILERS_PAGE_QUERY = /* groq */ `
*[_type=="trailersPage"][0]{
  heroImage,
  heroTitle_en,
  heroTitle_ar,
  bodyTitle_en,
  bodyTitle_ar,
  bodyText_en,
  bodyText_ar,
  note_en,
  note_ar
}
`;

// =========================
// TRUCKS PAGE
// =========================
export const TRUCKS_PAGE_QUERY = /* groq */ `
*[_type=="trucksPage"][0]{
  heroImage,
  heroTitle_en,
  heroTitle_ar,
  bodyTitle_en,
  bodyTitle_ar,
  bodyText_en,
  bodyText_ar,
  note_en,
  note_ar
}
`;

// =========================
// SIMPLE PAGE (parameterized safely)
// IMPORTANT: assumes your simplePage has slug field as { current: string }
// =========================
export const SIMPLE_PAGE_QUERY = /* groq */ `
*[_type=="simplePage" && slug.current == $slug][0]{
  heroImage,
  heroTitle_en,
  heroTitle_ar,
  bodyTitle_en,
  bodyTitle_ar,
  bodyText_en,
  bodyText_ar,
  note_en,
  note_ar
}
`;

// =========================
// MARINE PAGE
// =========================
export const MARINE_PAGE_QUERY = /* groq */ `
*[_type=="marinePage"][0]
`;

// =========================
// EXPLANATION PAGE
// =========================
export const EXPLANATION_PAGE_QUERY = /* groq */ `
*[_type=="explanationPage"][0]
`;
