export function SmartWhatsApp({ isMobile, value, digitsOnly, className }) {
  if (!value) return null;
  return isMobile ? (
    <a
      className={className}
      href={`https://wa.me/${digitsOnly}`}
      target="_blank"
      rel="noreferrer"
      dir="ltr"
    >
      {value}
    </a>
  ) : (
    <span className={className} dir="ltr">
      {value}
    </span>
  );
}
