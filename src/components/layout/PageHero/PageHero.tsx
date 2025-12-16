import "./PageHero.css";

type Props = {
  title: string;
  imageUrl: string;
  showContact?: boolean;
  onContactClick?: () => void;
};

export default function PageHero({
  title,
  imageUrl,
  showContact = false,
  onContactClick,
}: Props) {
  return (
    <section className="page-hero">
      {imageUrl && <img className="page-hero__img" src={imageUrl} alt="" />}

      <div className="page-hero__content">
        <h1 className="page-hero__title">{title}</h1>

        {showContact && (
          <button className="page-hero__cta" onClick={onContactClick}>
            CONTACT US
          </button>
        )}
      </div>
    </section>
  );
}
