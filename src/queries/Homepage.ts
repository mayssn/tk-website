export const HOME_PAGE_QUERY = /* groq */ `
*[_type == "homePage"][0]{
  // HERO
  heroTitle_en,
  heroTitle_ar,
  heroImage,

  // INDUSTRIES
  industriesTitle_en,
  industriesTitle_ar,
  industries[]{
    name_en,
    name_ar,
    icon
  },

  // SERVICES
  servicesTitle_en,
  servicesTitle_ar,
  servicesGeneralImage,
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

  // FIND MY UNIT
  findTitle_en,
  findTitle_ar,
  findImage,

  //TRAILERS
  // ABOUT
  aboutTitle_en,
  aboutTitle_ar,
  aboutBody_en,
  aboutBody_ar,

  // PARTNERS
  partnersTitle_en,
  partnersTitle_ar,
  partners[]{
    name,
    logo
  }
}
`;
