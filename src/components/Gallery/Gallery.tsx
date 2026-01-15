import React, { useEffect, useRef, useState } from "react";
import { urlFor } from "@/lib/sanity/image";
import { useIsMobile } from "@/hooks/useIsMobile";
import "./Gallery.css";

type GalleryItem = {
  image: { asset: { _id: string; url: string; metadata?: any } } | null;
  alt?: string;
  caption?: string;
};

export default function Gallery({
  items,
  title,
  lang,
}: {
  items: GalleryItem[];
  title?: string;
  lang?: string;
}) {
  const isMobile = useIsMobile(768);
  const cols = isMobile ? 2 : 3;
  const rowsPerLoad = 2; // configurable default
  const chunkSize = cols * rowsPerLoad;

  const [visibleCount, setVisibleCount] = useState(
    Math.min(chunkSize, items.length)
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const liveRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastActiveRef = useRef<Element | null>(null);

  useEffect(() => {
    setVisibleCount(Math.min(chunkSize, items.length));
  }, [isMobile, items.length]);

  function loadMore() {
    setVisibleCount((v) => Math.min(items.length, v + chunkSize));
  }

  function openAt(i: number) {
    lastActiveRef.current = document.activeElement;
    setOpenIndex(i);
    if (liveRef.current) {
      liveRef.current.textContent = `Image ${i + 1} of ${items.length}`;
    }
  }

  function close() {
    setOpenIndex(null);
    if (liveRef.current) liveRef.current.textContent = "";
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (openIndex === null) return;
      if (e.key === "Escape" || e.key === "Enter") close();
      if (e.key === "ArrowLeft")
        setOpenIndex((i) =>
          i === null ? null : (i - 1 + items.length) % items.length
        );
      if (e.key === "ArrowRight")
        setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, items.length]);

  // focus trap + restore focus on close
  useEffect(() => {
    if (openIndex === null) return;
    const content = contentRef.current;
    const closeBtn = closeBtnRef.current;
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusable = content
      ? Array.from(content.querySelectorAll<HTMLElement>(focusableSelector))
      : [];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // focus close button first
    setTimeout(() => closeBtn?.focus(), 0);

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (!first || !last) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleTab);
    return () => {
      window.removeEventListener("keydown", handleTab);
      // restore focus
      if (
        lastActiveRef.current &&
        (lastActiveRef.current as HTMLElement).focus
      ) {
        (lastActiveRef.current as HTMLElement).focus();
      }
    };
  }, [openIndex]);

  // basic swipe support
  useEffect(() => {
    if (openIndex === null) return;
    let startX: number | null = null;
    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX;
    }
    function onTouchEnd(e: TouchEvent) {
      if (startX === null) return;
      const endX = e.changedTouches[0].clientX;
      const dx = endX - startX;
      if (dx > 50)
        setOpenIndex((i) =>
          i === null ? null : (i - 1 + items.length) % items.length
        );
      if (dx < -50)
        setOpenIndex((i) => (i === null ? null : (i + 1) % items.length));
      startX = null;
    }
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [openIndex, items.length]);

  return (
    <section className="tk-gallery">
      <div className="tk-gallery__titles">
        {title && (
          <h2
            className={`tk-gallery__title ${lang === "ar" ? "ar" : "en"}`}
            lang={lang === "ar" ? "ar" : "en"}
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            {title}
          </h2>
        )}
      </div>

      <div
        className="tk-gallery__grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {items.slice(0, visibleCount).map((item, idx) => {
          const asset = item.image?.asset as any;
          const alt =
            item.alt || item.caption || asset?.metadata?.altText || "";
          const widths = [320, 640, 1024];
          const srcSet = widths
            .map((w) => `${urlFor(asset).width(w).auto("format").url()} ${w}w`)
            .join(", ");
          const src = urlFor(asset).width(640).auto("format").url();
          const lqip = asset?.metadata?.lqip;

          return (
            <button
              key={asset?._id || idx}
              className="tk-gallery__thumb"
              onClick={() => (openIndex === idx ? close() : openAt(idx))}
              aria-label={`Open image ${idx + 1} of ${items.length}`}
            >
              <div
                className="tk-gallery__thumb-inner"
                style={{ backgroundImage: lqip ? `url(${lqip})` : undefined }}
              >
                <img
                  src={src}
                  srcSet={srcSet}
                  sizes={isMobile ? "(max-width:767px) 50vw, 100vw" : "33vw"}
                  alt={alt}
                  loading="lazy"
                />
              </div>
              {item.caption && (
                <div className="tk-gallery__caption">{item.caption}</div>
              )}
            </button>
          );
        })}
      </div>

      {visibleCount < items.length && (
        <div className="tk-gallery__actions">
          <button onClick={loadMore} className="tk-btn">
            Load more
          </button>
        </div>
      )}

      {openIndex !== null && (
        <div
          className="tk-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${openIndex + 1} of ${items.length}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="tk-lightbox__content" ref={contentRef}>
            <button
              className="tk-lightbox__close"
              onClick={close}
              aria-label="Close image"
              ref={closeBtnRef}
            >
              ×
            </button>
            <div className="tk-lightbox__figure">
              <img
                src={urlFor(items[openIndex].image?.asset)
                  .width(1200)
                  .auto("format")
                  .url()}
                alt={
                  items[openIndex].alt ||
                  items[openIndex].caption ||
                  items[openIndex].image?.asset?.metadata?.altText ||
                  ""
                }
              />
              {items[openIndex].caption && (
                <figcaption className="tk-lightbox__figcaption">
                  {items[openIndex].caption}
                </figcaption>
              )}
            </div>
            <div className="tk-lightbox__nav">
              <button
                onClick={() =>
                  setOpenIndex((i) =>
                    i === null ? null : (i - 1 + items.length) % items.length
                  )
                }
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={() =>
                  setOpenIndex((i) =>
                    i === null ? null : (i + 1) % items.length
                  )
                }
                aria-label="Next image"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}

      <div aria-live="polite" ref={liveRef} className="sr-only" />
    </section>
  );
}
