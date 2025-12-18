import { useState } from "react";
import "./CopyText.css";

type CopyTextProps = {
  text?: string;
  label?: string;
  copiedLabel?: string;
};

export default function CopyText({ text, label, copiedLabel }: CopyTextProps) {
  const [show, setShow] = useState(false);

  async function onCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setShow(true);
      setTimeout(() => setShow(false), 1400);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <span className="copytext">
      {label && <span className="copytext__label">{label} </span>}
      <button className="copytext__btn" type="button" onClick={onCopy}>
        {text}
      </button>
      {show && (
        <span className="copytext__toast">{copiedLabel || "Copied"}</span>
      )}
    </span>
  );
}
