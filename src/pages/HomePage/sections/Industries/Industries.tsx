import "./Industries.css";
import { urlFor } from "../../../../lib/sanity/image";
import { useLanguage } from "../../../../context/LanguageContext";

type IndustryItem = {
  name_en?: string;
  name_ar?: string;
  icon?: any;
};

type Props = {
  title: string;
  items?: IndustryItem[];
};

export default function Industries({ title, items = [] }: Props) {
  const { lang } = useLanguage();

  return (
    <section className="industries">
      <h1 className="industries__title">{title}</h1>

      <div className="industries__grid">
        {items.map((it, idx) => {
          const label = lang === "ar" ? it.name_ar : it.name_en;
          const iconUrl = it.icon ? urlFor(it.icon).width(220).url() : "";

          return (
            <div className="industries__card" key={idx}>
              {iconUrl && (
                <img className="industries__icon" src={iconUrl} alt="" />
              )}
              <h3 className="industries__label">{label}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}
