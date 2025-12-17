// src/pages/TrucksPage/TrucksPage.tsx
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useOverlay } from "@/context/OverlayContext";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { TRUCKS_PAGE_QUERY } from "@/lib/sanity/queries";

import PageHero from "@/components/layout/PageHero/PageHero";
import FindMyUnitWizard from "@/components/FindMyUnitWizard/FindMyUnitWizard";
import ResultList from "@/components/FindMyUnitWizard/ResultList";

import type { Need, Vehicle, Energy, PowerChoice } from "@/types/FindMyUnit";

import "./TrucksPage.css";

export default function TrucksPage() {
  const { lang } = useLanguage();
  const { openOverlay } = useOverlay();
  const [data, setData] = useState<any>(null);

  // Wizard state (truck locked)
  const [need, setNeed] = useState<Need>("cooling");
  const [vehicle, setVehicle] = useState<Vehicle>("truck");
  const [energy, setEnergy] = useState<Energy>(null);
  const [powerChoice, setPowerChoice] = useState<PowerChoice>(null);

  useEffect(() => {
    client.fetch(TRUCKS_PAGE_QUERY).then(setData).catch(console.error);
  }, []);

  // ✅ match homepage resets (prevents weird state)
  useEffect(() => {
    setEnergy(null);
    setPowerChoice(null);
  }, [need]);

  useEffect(() => {
    if (vehicle !== "truck" || vehicle === "none") {
      setEnergy(null);
      setPowerChoice(null);
    }
  }, [vehicle]);

  useEffect(() => {
    if (need === "coolingHeating") {
      setEnergy(null);
      setPowerChoice(null);
    }
  }, [need]);

  if (!data) return null;

  const heroTitle = lang === "ar" ? data.heroTitle_ar : data.heroTitle_en;
  const heroImageUrl = data.heroImage
    ? urlFor(data.heroImage).width(2400).url()
    : "";

  const bodyTitle = lang === "ar" ? data.bodyTitle_ar : data.bodyTitle_en;
  const bodyText = lang === "ar" ? data.bodyText_ar : data.bodyText_en;
  const note = lang === "ar" ? data.note_ar : data.note_en;

  // ✅ IMPORTANT: use your real schema field names
  const exploreTitle =
    lang === "ar" ? data.exploreTruckVanTitle_ar : data.exploreTruckVanTitle_en;

  return (
    <>
      <PageHero
        className="hero--trucks"
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
          {note ? <p className="tk-body__note">{note}</p> : null}
        </div>
      </section>

      {/* EXPLORE TRUCKS (Wizard) */}
      <section className="find-my-unit">
        <div className="find-my-unit__inner">
          <div className="find-my-unit__left">
            <h2 className="find-my-unit__title">{exploreTitle}</h2>

            <FindMyUnitWizard
              mode="trucks"
              need={need}
              setNeed={setNeed}
              vehicle={vehicle}
              setVehicle={setVehicle}
              energy={energy}
              setEnergy={setEnergy}
              powerChoice={powerChoice}
              setPowerChoice={setPowerChoice}
            />
          </div>

          {/* ✅ no explore image here because your schema doesn’t have it */}
        </div>
      </section>

      {/* ✅ RESULTS (this is what you were missing) */}
      <section className="find-my-unit__full">
        <ResultList
          need={need}
          vehicle={vehicle}
          energy={energy}
          powerChoice={powerChoice}
        />
      </section>
    </>
  );
}
