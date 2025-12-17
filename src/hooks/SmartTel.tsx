export function SmartTel({ isMobile, value, hrefValue, className }) {
  if (!value) return null;
  return isMobile ? (
    <a className={className} href={`tel:${hrefValue}`} dir="ltr">
      {value}
    </a>
  ) : (
    <span className={className} dir="ltr">
      {value}
    </span>
  );
}
