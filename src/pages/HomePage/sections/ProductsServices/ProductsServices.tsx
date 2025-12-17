import { useMemo, useState } from "react";
import { urlFor } from "@/lib/sanity/image";
import { useLanguage } from "@/context/LanguageContext";
import { useOverlay } from "@/context/OverlayContext";
import "./ProductsServices.css";

type Service = {
  title_en?: string;
  title_ar?: string;
  body_en?: string;
  body_ar?: string;
  image?: any;

  linkLabel_en?: string;
  linkLabel_ar?: string;
  linkUrl?: string;

  linkLabel2_en?: string;
  linkLabel2_ar?: string;
  linkUrl2?: string;
};

type Props = {
  title: string;
  image?: any; // servicesGeneralImage
  services?: Service[];
};

export default function ProductsServices({
  title,
  image,
  services = [],
}: Props) {
  const { lang } = useLanguage();
  const { openOverlay } = useOverlay();
  const arrow = lang === "ar" ? "←" : "→";
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const leftImageUrl = useMemo(() => {
    const open = openIndex >= 0 ? services[openIndex] : null;
    const img = open?.image || image;
    return img ? urlFor(img).width(1200).url() : "";
  }, [openIndex, services, image]);

  const onToggle = (idx: number) => {
    setOpenIndex((curr) => (curr === idx ? -1 : idx));
  };

  const contactLabel =
    lang === "ar"
      ? "تواصل معنا لمزيد من المعلومات"
      : "Contact us for more information";
  console.log("servicesGeneralImage prop:", image);
  console.log("leftImageUrl:", leftImageUrl);
  return (
    <section className="ps">
      <div className="ps__wrap">
        <h1 className="ps__title">{title}</h1>

        <div className="ps__grid">
          <div className="ps__left">
            {leftImageUrl && (
              <img className="ps__img" src={leftImageUrl} alt="" />
            )}
          </div>

          <div className="ps__right">
            {services.map((s, idx) => {
              const isOpen = idx === openIndex;
              const t = lang === "ar" ? s.title_ar : s.title_en;
              const b = lang === "ar" ? s.body_ar : s.body_en;

              const link1Label =
                lang === "ar" ? s.linkLabel_ar : s.linkLabel_en;
              const link2Label =
                lang === "ar" ? s.linkLabel2_ar : s.linkLabel2_en;

              return (
                <div className="ps__row" key={idx}>
                  <button
                    type="button"
                    className="ps__rowbtn"
                    onClick={() => onToggle(idx)}
                    aria-expanded={isOpen}
                  >
                    <h3 className="ps__rowtitle">{t}</h3>
                    <span className="ps__icon">{isOpen ? "×" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="ps__panel">
                      {b && <p className="ps__body">{b}</p>}

                      <div className="ps__links">
                        {(() => {
                          const links: Array<{ href: string; label: string }> =
                            [];

                          const link1Label =
                            lang === "ar" ? s.linkLabel_ar : s.linkLabel_en;
                          const link2Label =
                            lang === "ar" ? s.linkLabel2_ar : s.linkLabel2_en;

                          if (s.linkUrl && link1Label)
                            links.push({ href: s.linkUrl, label: link1Label });
                          if (s.linkUrl2 && link2Label)
                            links.push({ href: s.linkUrl2, label: link2Label });

                          // show schema links if they exist
                          if (links.length > 0) {
                            return links.map((l, i) => (
                              <a key={i} className="ps__link" href={l.href}>
                                {arrow} {l.label}
                              </a>
                            ));
                          }

                          // otherwise show contact button
                          return (
                            <button
                              type="button"
                              className="ps__link ps__link--btn"
                              onClick={() => openOverlay("contact")}
                            >
                              {arrow}{" "}
                              {lang === "ar"
                                ? "تواصل معنا لمزيد من المعلومات"
                                : "Contact us for more information"}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  <div className="ps__sep" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
