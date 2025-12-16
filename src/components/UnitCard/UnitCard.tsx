import { useLanguage } from "../../context/LanguageContext";
import { urlFor } from "../../lib/sanity/image";
import "./UnitCard.css";

export default function UnitCard({ unit, onContact }) {
  const { lang } = useLanguage();

  const summary = lang === "ar" ? unit?.summary_ar : unit?.summary_en;
  const description =
    lang === "ar" ? unit?.description_ar : unit?.description_en;

  const brochureHref = unit?.brochureUrl; // ✅ schema field (url string)

  return (
    <div className="unit-card">
      <div className="unit-card__media">
        {unit?.image && (
          <img
            src={urlFor(unit.image).width(900).url()}
            alt={unit?.name || ""}
          />
        )}
      </div>

      <div className="unit-card__content">
        <h3 className="unit-card__title">
          {unit?.name}{" "}
          <span className="unit-card__power">
            ({String(unit?.powerType || "").toUpperCase()})
          </span>
        </h3>

        {summary ? <p className="unit-card__summary">{summary}</p> : null}

        {description ? (
          <div className="unit-card__description">{description}</div>
        ) : null}

        <div className="unit-card__actions">
          {brochureHref ? (
            <a
              href={brochureHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn--secondary"
            >
              Download Brochure ↓
            </a>
          ) : null}

          <button
            type="button"
            className="btn btn--primary"
            onClick={onContact}
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
