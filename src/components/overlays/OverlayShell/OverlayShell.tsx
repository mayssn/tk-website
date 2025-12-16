import React from "react";
import { useOverlay } from "../../../context/OverlayContext";
import "./OverlayShell.css";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function OverlayShell({ title, children }: Props) {
  const { closeOverlay } = useOverlay();

  return (
    <div className="tk-overlay" onClick={closeOverlay}>
      <div className="tk-overlay__panel" onClick={(e) => e.stopPropagation()}>
        <button
          className="tk-overlay__close"
          type="button"
          onClick={closeOverlay}
        >
          ×
        </button>

        {title && <h2 className="tk-overlay__title">{title}</h2>}

        <div className="tk-overlay__content">{children}</div>
      </div>
    </div>
  );
}
