import { useEffect, useState } from "react";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { HOME_PAGE_QUERY } from "@/queries/Homepage"; // ✅ use your existing file
import { useLanguage } from "@/context/LanguageContext";

import HeroHomepage from "@/pages/HomePage/sections/HeroHomepage/HeroHomepage";
import Industries from "@/pages/HomePage/sections/Industries/Industries";
import ProductsServices from "@/pages/HomePage/sections/ProductsServices/ProductsServices";
import FindMyUnit from "@/pages/HomePage/sections/FindMyUnit/FindMyUnit";
import AboutGroup from "@/pages/HomePage/sections/AboutGroup/AboutGroup";
import TrustedBy from "@/pages/HomePage/sections/TrustedBy/TrustedBy";

import "./HomePage.css";

export default function HomePage() {
  const { lang } = useLanguage();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    client.fetch(HOME_PAGE_QUERY).then(setData);
  }, []);

  if (!data) return null;

  return (
    <div className="homepage">
      <HeroHomepage
        title={lang === "ar" ? data.heroTitle_ar : data.heroTitle_en}
        imageUrl={urlFor(data.heroImage).width(2000).url()}
      />

      <Industries
        title={
          lang === "ar" ? data.industriesTitle_ar : data.industriesTitle_en
        }
        items={data.industries}
      />

      <ProductsServices
        title={lang === "ar" ? data.servicesTitle_ar : data.servicesTitle_en}
        image={data.servicesGeneralImage}
        services={data.services}
      />

      <FindMyUnit
        title={lang === "ar" ? data.findTitle_ar : data.findTitle_en}
        image={data.findImage}
      />

      <AboutGroup
        title={lang === "ar" ? data.aboutTitle_ar : data.aboutTitle_en}
        body={lang === "ar" ? data.aboutBody_ar : data.aboutBody_en}
      />

      <TrustedBy
        title={lang === "ar" ? data.partnersTitle_ar : data.partnersTitle_en}
        partners={data.partners}
      />
    </div>
  );
}
