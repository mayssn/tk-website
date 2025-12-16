import { useEffect, useState } from "react";
import OverlayShell from "../OverlayShell/OverlayShell";
import { useLanguage } from "../../../context/LanguageContext";
import { sanityClient } from "../../../sanityClient";
import { EXPLANATION_PAGE_QUERY } from "../../../lib/sanity/queries";
import { PortableText } from "@portabletext/react";
import "./TypesOverlay.css";

export default function TypesOverlay() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    sanityClient
      .fetch(EXPLANATION_PAGE_QUERY)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  const pageTitle = isAr ? data.pageTitle_ar : data.pageTitle_en;
  const leftBody = isAr ? data.leftBody_ar : data.leftBody_en;
  const rightBody = isAr ? data.rightBody_ar : data.rightBody_en;

  return (
    <OverlayShell title="">
      <div className={`excard ${isAr ? "excard--ar" : ""}`}>
        <div className="excard__grid">
          {/* LEFT */}
          <div className="excard__left">
            {pageTitle ? <h2 className="excard__title">{pageTitle}</h2> : null}
            {leftBody ? (
              <div className="excard__body">
                <PortableText value={leftBody} />
              </div>
            ) : null}
          </div>

          {/* DIVIDER */}
          <div className="excard__divider" aria-hidden="true" />

          {/* RIGHT */}
          <div className="excard__right">
            {rightBody ? (
              <div className="excard__body">
                <PortableText value={rightBody} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </OverlayShell>
  );
}
