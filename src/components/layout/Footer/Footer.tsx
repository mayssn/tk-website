import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { sanityClient } from "@/sanityClient";
import { useIsMobile } from "@/hooks/useIsMobile.ts";

import CopyText from "@/hooks/CopyText.jsx";
import { SmartTel } from "@/hooks/SmartTel";
import "./Footer.css";

const CONTACT_SETTINGS_QUERY = /* groq */ `
*[_type == "contactSettings"][0]{
  ContactFooterTitle_en,
  ContactFooterTitle_ar,
  emailAddress,
  phoneNumber_en,
  phoneNumber_ar,
  whatsappLabel_en,
  whatsappLabel_ar,
  whatsappNumber,
  mapLinkLabel_en,
  mapLinkLabel_ar,
  mapUrl
}
`;

export default function Footer() {
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

  const title = isAr ? data.ContactFooterTitle_ar : data.ContactFooterTitle_en;

  const phone = isAr ? data.phoneNumber_ar : data.phoneNumber_en;
  const phoneDigits = String(phone || "").replace(/[^\d+]/g, "");

  // "Chat on WhatsApp" label must come from schema (no hardcode)
  const whatsappChatLabel = isAr
    ? data.whatsappLabel_ar
    : data.whatsappLabel_en;
  const waDigits = String(data.whatsappNumber || "").replace(/[^\d]/g, "");

  const mapLabel = isAr ? data.mapLinkLabel_ar : data.mapLinkLabel_en;

  return (
    <footer className={`tk-footer ${isAr ? "tk-footer--ar" : ""}`}>
      <div className="tk-footer__card">
        <h2 className="tk-footer__title">
          {title || (isAr ? "تواصل معنا" : "Contact Us")}
        </h2>

        {/* EMAIL — copy only */}
        {data.emailAddress && (
          <p className="tk-footer__line">
            <span className="tk-footer__label">
              {isAr ? "البريد الإلكتروني:" : "Email:"}
            </span>{" "}
            <CopyText
              text={data.emailAddress}
              copiedLabel={isAr ? "تم النسخ" : "Copied"}
            />
          </p>
        )}

        {/* TEL — the only number shown */}
        {phone && (
          <p className="tk-footer__line">
            <span className="tk-footer__label">{isAr ? "هاتف:" : "Tel:"}</span>{" "}
            <SmartTel
              isMobile={isMobile}
              value={phone}
              hrefValue={phoneDigits}
              className="tk-footer__value"
            />
          </p>
        )}

        {/* CHAT ON WHATSAPP — mobile only, label from schema */}
        {isMobile && whatsappChatLabel && waDigits && (
          <p className="tk-footer__line tk-footer__subline">
            <a
              className="tk-footer__chat"
              href={`https://wa.me/${waDigits}`}
              target="_blank"
              rel="noreferrer"
            >
              {whatsappChatLabel}
            </a>
          </p>
        )}

        {/* MAP — always clickable, ONLY blue link */}
        {/* MAP — always clickable, ONLY blue link */}
        {data.mapUrl && (
          <p className="tk-footer__line">
            <span className="tk-footer__label">
              {isAr ? "الموقع:" : "Location:"}
            </span>{" "}
            <a
              className="tk-footer__map"
              href={data.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              {isAr ? "← " : ""}
              {mapLabel || (isAr ? "افتح في الخرائط" : "Open in Maps")}
              {!isAr ? " →" : ""}
            </a>
          </p>
        )}
      </div>
    </footer>
  );
}
