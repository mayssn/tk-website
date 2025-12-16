import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useOverlay } from "../../context/OverlayContext";
import { client } from "../../lib/sanity/client";
import { urlFor } from "../../lib/sanity/image";
import { TRAILERS_PAGE_QUERY, UNITS_QUERY } from "../../lib/sanity/queries";

import PageHero from "../../components/layout/PageHero/PageHero";
import UnitCard from "../../components/UnitCard/UnitCard";
import "./TrailersPage.css";

export default function TrailersPage() {
  const { lang } = useLanguage();
  const { openOverlay } = useOverlay();

  const [page, setPage] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    client.fetch(TRAILERS_PAGE_QUERY).then(setPage).catch(console.error);
    client.fetch(UNITS_QUERY).then(setUnits).catch(console.error);
  }, []);

  if (!page) return null;

  const heroTitle = lang === "ar" ? page.heroTitle_ar : page.heroTitle_en;
  const heroImageUrl = page.heroImage
    ? urlFor(page.heroImage).width(2400).url()
    : "";

  const bodyTitle = lang === "ar" ? page.bodyTitle_ar : page.bodyTitle_en;
  const bodyText = lang === "ar" ? page.bodyText_ar : page.bodyText_en;
  const note = lang === "ar" ? page.note_ar : page.note_en;

  // ✅ FILTER TO TRAILERS ONLY
  const trailerUnits = units.filter((u) => u.vehicleType === "trailer");

  return (
    <>
      <PageHero
        title={heroTitle}
        imageUrl={heroImageUrl}
        showContact
        onContactClick={() => openOverlay("contact")}
      />

      {/* BODY SECTION */}
      <section className="tk-body">
        <div className="tk-body__inner">
          {bodyTitle ? <h2 className="tk-body__title">{bodyTitle}</h2> : null}
          {bodyText ? <p className="tk-body__text">{bodyText}</p> : null}
        </div>
      </section>

      {/* RESULTS */}
      <section className="tk-results">
        <div className="tk-results__inner">
          {trailerUnits.map((unit) => (
            <UnitCard
              key={unit._id}
              unit={unit}
              lang={lang}
              onContact={() => openOverlay("contact")}
            />
          ))}

          {note ? <p className="tk-body__note">{note}</p> : null}
        </div>
      </section>
    </>
  );
}
