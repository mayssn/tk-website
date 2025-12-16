import "./AboutGroup.css";
import { PortableText } from "@portabletext/react";

type Props = {
  title: string;
  body: any; // blockContent
};

export default function AboutGroup({ title, body }: Props) {
  return (
    <section className="about">
      <div className="about__wrap">
        <h3 className="about__title">{title}</h3>
        <div className="about__body">
          <PortableText value={body} />
        </div>
      </div>
    </section>
  );
}
