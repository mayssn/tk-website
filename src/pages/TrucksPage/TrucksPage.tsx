import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useOverlay } from "../../context/OverlayContext";
import { client } from "../../lib/sanity/client";
import { urlFor } from "../../lib/sanity/image";
import { TRUCKS_PAGE_QUERY } from "../../lib/sanity/queries";

import PageHero from "../../components/layout/PageHero/PageHero";
import "./TrucksPage.css";

export default function TrailersPage() {
  const { lang } = useLanguage();
  const { openOverlay } = useOverlay();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    client.fetch(TRUCKS_PAGE_QUERY).then(setData);
  }, []);

  if (!data) return null;

  const title = lang === "ar" ? data.heroTitle_ar : data.heroTitle_en;
  const imageUrl = data.heroImage
    ? urlFor(data.heroImage).width(2400).url()
    : "";

  return (
    <PageHero
      title={title}
      imageUrl={imageUrl}
      showContact
      onContactClick={() => openOverlay("contact")}
    />
  );
}
