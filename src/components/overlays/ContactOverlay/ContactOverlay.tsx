import { useEffect, useState } from "react";
import OverlayShell from "@/components/overlays/OverlayShell/OverlayShell";
import ContactDetails from "@/components/ContactDetails/ContactDetails";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLanguage } from "@/context/LanguageContext";
import { sanityClient } from "@/sanityClient";
import { urlFor } from "@/lib/sanity/image";
import { CONTACT_SETTINGS_QUERY } from "@/lib/sanity/queries";
import "./ContactOverlay.css";

export default function ContactOverlay() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const isMobile = useIsMobile();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    sanityClient
      .fetch(CONTACT_SETTINGS_QUERY)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  // schema-driven title + intro + image
  const title = isAr ? data.ContactPageTitle_ar : data.ConactPageTitle_en;

  const intro = isAr ? data.ContactPageIntro_ar : data.ContactPageIntro_en;

  const imageUrl = data.contactPageImage
    ? urlFor(data.contactPageImage).width(1400).url()
    : "";

  return (
    <OverlayShell title={title || (isAr ? "تواصل معنا" : "Contact Us")}>
      <div className={`co ${isAr ? "co--ar" : ""}`}>
        {intro ? <p className="co__intro">{intro}</p> : null}

        <div className="co__grid">
          {imageUrl ? (
            <img className="co__img" src={imageUrl} alt="" />
          ) : (
            <div className="co__imgPlaceholder" />
          )}

          <div className="co__details">
            <ContactDetails data={data} lang={lang} isMobile={isMobile} />
          </div>
        </div>
      </div>
    </OverlayShell>
  );
}
