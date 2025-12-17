import "./TrustedBy.css";
import { urlFor } from "@/lib/sanity/image";
import { useLanguage } from "@/context/LanguageContext";

type Partner = {
  name?: string;
  logo?: any;
};

type Props = {
  title: string;
  partners?: Partner[];
};

export default function TrustedBy({ title, partners = [] }: Props) {
  const { lang } = useLanguage();

  // duplicate list for seamless loop
  const looped = [...partners, ...partners];

  return (
    <section className="trusted">
      <h3 className="trusted__title">{title}</h3>

      <div className="trusted__marquee">
        <div className="trusted__track">
          {looped.map((p, i) => {
            const logoUrl = p.logo
              ? urlFor(p.logo).width(260).format("png").url()
              : "";

            return (
              <div className="trusted__logo" key={i}>
                {logoUrl && <img src={logoUrl} alt={p.name || ""} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
