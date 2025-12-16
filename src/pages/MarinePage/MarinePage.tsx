import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useOverlay } from "../../context/OverlayContext";
import { client } from "../../lib/sanity/client";
import { urlFor } from "../../lib/sanity/image";
import { MARINE_PAGE_QUERY } from "../../lib/sanity/queries";

import PageHero from "../../components/layout/PageHero/PageHero";
import "./MarinePage.css";

export default function MarinePage() {
  const { lang } = useLanguage();
  const { openOverlay } = useOverlay();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    client.fetch(MARINE_PAGE_QUERY).then(setData);
  }, []);

  if (!data) return null;

  const heroTitle = lang === "ar" ? data.heroTitle_ar : data.heroTitle_en;
  const heroImageUrl = data.heroImage
    ? urlFor(data.heroImage).width(2400).url()
    : "";

  const bodyTitle = lang === "ar" ? data.bodyTitle_ar : data.bodyTitle_en;
  const intro = lang === "ar" ? data.intro_ar : data.intro_en;

  const productTypes = Array.isArray(data.productTypes)
    ? data.productTypes
    : [];

  return (
    <>
      <PageHero
        title={heroTitle}
        imageUrl={heroImageUrl}
        showContact
        onContactClick={() => openOverlay("contact")}
      />

      <section className="marine-body">
        <div className="marine-body__wrap">
          {bodyTitle && <h1 className="marine-body__title">{bodyTitle}</h1>}
          {intro && <p className="marine-body__intro">{intro}</p>}

          <div className="marine-body__list">
            {productTypes.map((p: any, idx: number) => {
              const t = lang === "ar" ? p.title_ar : p.title_en;
              const d = lang === "ar" ? p.description_ar : p.description_en;
              const brochureLabel =
                lang === "ar" ? p.brochureLabel_ar : p.brochureLabel_en;

              return (
                <div className="marine-body__item" key={idx}>
                  {t && <h3 className="marine-body__itemTitle">{t}</h3>}
                  {d && <p className="marine-body__itemDesc">{d}</p>}

                  {p.brochureUrl && brochureLabel && (
                    <a
                      className="marine-body__link"
                      href={p.brochureUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {arrow} {brochureLabel}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
