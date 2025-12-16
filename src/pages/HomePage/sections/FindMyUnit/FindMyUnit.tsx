import { useOverlay } from "../../../../context/OverlayContext";
import { urlFor } from "../../../../lib/sanity/image";
import "./FindMyUnit.css";

type Props = {
  title: string;
  image?: any;
};

export default function FindMyUnit({ title, image }: Props) {
  const { openOverlay } = useOverlay();

  return (
    <section className="find-my-unit">
      <h2 className="find-my-unit__title">{title}</h2>

      {image && (
        <img
          className="find-my-unit__img"
          src={urlFor(image).width(1400).url()}
          alt=""
        />
      )}

      <button
        type="button"
        className="find-my-unit__btn"
        onClick={() => openOverlay("types")}
      >
        Type of Units: Explained
      </button>
    </section>
  );
}
