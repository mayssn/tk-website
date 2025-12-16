import "./HeroHomepage.css";

type Props = {
  title: string;
  imageUrl: string;
};

export default function HeroHomepage({ title, imageUrl }: Props) {
  return (
    <section className="hero">
      <img className="hero__img" src={imageUrl} alt="" />
      <div className="hero__overlay">
        <h2 className="hero__title">{title}</h2>
      </div>
    </section>
  );
}
