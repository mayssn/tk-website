// src/components/layout/Footer/Footer.jsx
import { useEffect, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { sanityClient } from "../../../sanityClient";
import { useIsMobile } from "../../../hooks/useIsMobile";

import CopyText from "../../../hooks/CopyText.jsx";
import { SmartTel } from "../../../hooks/SmartTel";
import { SmartWhatsApp } from "../../../hooks/SmartWhatsApp";
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

  const [data, setData] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(CONTACT_SETTINGS_QUERY)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  const title = isAr ? data.ContactFooterTitle_ar : data.ContactFooterTitle_en;
  const phone = isAr ? data.phoneNumber_ar : data.phoneNumber_en;
  const whatsappLabel = isAr ? data.whatsappLabel_ar : data.whatsappLabel_en;
  const mapLabel = isAr ? data.mapLinkLabel_ar : data.mapLinkLabel_en;

  const phoneDigits = String(phone || "").replace(/[^\d+]/g, "");
  const waDigits = String(data.whatsappNumber || "").replace(/[^\d]/g, "");

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

        {/* TEL — mobile only clickable */}
        {phone && (
          <p className="tk-footer__line">
            <span className="tk-footer__label">
              {isAr ? "الهاتف:" : "Tel:"}
            </span>{" "}
            <SmartTel
              isMobile={isMobile}
              value={phone}
              hrefValue={phoneDigits}
              className="tk-footer__value"
            />
          </p>
        )}

        {/* WHATSAPP — mobile only clickable */}
        {data.whatsappNumber && (
          <p className="tk-footer__line">
            <span className="tk-footer__label">
              {whatsappLabel || (isAr ? "واتساب:" : "WhatsApp:")}
            </span>{" "}
            <SmartWhatsApp
              isMobile={isMobile}
              value={data.whatsappNumber}
              digitsOnly={waDigits}
              className="tk-footer__value"
            />
          </p>
        )}

        {/* MAP — always clickable */}
        {data.mapUrl && (
          <p className="tk-footer__line">
            <span className="tk-footer__label">
              {isAr ? "الموقع:" : "Location:"}
            </span>{" "}
            <a
              className="tk-footer__link"
              href={data.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              {mapLabel || (isAr ? "افتح في الخرائط" : "Open in Maps")}
            </a>
          </p>
        )}
      </div>
    </footer>
  );
}
