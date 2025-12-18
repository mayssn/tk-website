import CopyText from "@/hooks/CopyText";
import { SmartTel } from "@/hooks/SmartTel";
import "./ContactDetails.css";

function IconMail() {
  return (
    <svg
      className="cd__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg className="cd__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.6 10.8c1.4 2.7 3.9 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.7 3.9.7.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.1c.6 0 1 .4 1 1 0 1.4.2 2.7.7 3.9.1.4 0 .8-.3 1.1L6.6 10.8z"
      />
    </svg>
  );
}

function IconWhatsapp() {
  return (
    <svg className="cd__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.6-5.7c-.2-.1-1.2-.6-1.4-.7-.2-.1-.4-.1-.6.1l-.6.7c-.2.2-.3.2-.6.1-1-.5-1.9-1.2-2.6-2.1-.2-.2 0-.4.1-.5l.5-.6c.2-.2.2-.4.1-.6l-.6-1.4c-.1-.3-.3-.4-.6-.4H9.3c-.2 0-.5.1-.7.3-.6.6-.9 1.3-.9 2.1 0 .4.1.9.3 1.3.7 1.6 1.8 3 3.2 4.1 1.1.9 2.4 1.6 3.7 2 .4.1.9.2 1.3.1.8-.1 1.5-.4 2-.9.2-.2.3-.5.3-.7v-.7c0-.3-.1-.5-.4-.6z"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg className="cd__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
      />
    </svg>
  );
}

type ContactDetailsProps = {
  data?: any;
  lang?: string;
  isMobile?: boolean;
};

export default function ContactDetails({
  data,
  lang,
  isMobile,
}: ContactDetailsProps) {
  const isAr = lang === "ar";

  const email = data?.emailAddress;
  const phone = isAr ? data?.phoneNumber_ar : data?.phoneNumber_en;
  const phoneDigits = String(phone || "").replace(/[^\d+]/g, "");

  const waDigits = String(data?.whatsappNumber || "").replace(/[^\d]/g, "");
  const whatsappChatLabel = isAr
    ? data?.whatsappLabel_ar
    : data?.whatsappLabel_en;

  const address = isAr ? data?.address_ar : data?.address_en; // ✅ add to query/schema if not yet
  const mapLabel = isAr ? data?.mapLinkLabel_ar : data?.mapLinkLabel_en;
  const mapUrl = data?.mapUrl;

  const arrow = isAr ? "←" : "→";

  return (
    <div className={`cd ${isAr ? "cd--ar" : ""}`}>
      {/* EMAIL */}
      {email && (
        <div className="cd__row">
          <IconMail />
          <div className="cd__text">
            <div className="cd__line">
              <span className="cd__label">
                {isAr ? "البريد الإلكتروني:" : "Email:"}
              </span>{" "}
              <CopyText
                text={email}
                copiedLabel={isAr ? "تم النسخ" : "Copied"}
              />
            </div>
          </div>
        </div>
      )}

      {/* TEL */}
      {phone && (
        <div className="cd__row">
          <IconPhone />
          <div className="cd__text">
            <div className="cd__line">
              <span className="cd__label">{isAr ? "هاتف:" : "Tel:"}</span>{" "}
              <SmartTel
                isMobile={isMobile}
                value={phone}
                hrefValue={phoneDigits}
                className="cd__value"
              />
            </div>
          </div>
        </div>
      )}

      {/* CHAT ON WHATSAPP (mobile only, label from schema) */}
      {isMobile && whatsappChatLabel && waDigits && (
        <div className="cd__row">
          <IconWhatsapp />
          <div className="cd__text">
            <a
              className="cd__wa"
              href={`https://wa.me/${waDigits}`}
              target="_blank"
              rel="noreferrer"
            >
              {whatsappChatLabel}
            </a>
          </div>
        </div>
      )}

      {/* ADDRESS + OPEN IN MAPS */}
      {/* ADDRESS + OPEN IN MAPS (same line) */}
      {(address || mapUrl) && (
        <div className="cd__row">
          <IconPin />
          <div className="cd__text">
            <div className="cd__line cd__address">
              {address ? <span className="cd__addrtext">{address}</span> : null}

              {mapUrl ? (
                <a
                  className="cd__map"
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {isAr ? `${arrow} ` : ""}
                  {mapLabel || (isAr ? "افتح في الخرائط" : "Open in Maps")}
                  {!isAr ? ` ${arrow}` : ""}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
