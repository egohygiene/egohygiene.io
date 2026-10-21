import { useI18n } from "@egohygiene/i18n";
import type { StoreDesign } from "@egohygiene/schemas";
import { useEffect, useId, useRef, useState } from "react";

import { StoreArtwork } from "./StoreArtwork";
import { useStoreContent } from "./useStoreContent";

import "./store-artwork-gallery.css";

type StoreArtworkGalleryProps = {
  readonly designs: readonly StoreDesign[];
  readonly title: string;
  readonly titleLocale?: string;
};

/** Browse authored artwork without presenting it as a finished product photograph. */
export function StoreArtworkGallery({ designs, title, titleLocale }: StoreArtworkGalleryProps) {
  const { t, formatNumber } = useI18n();
  const { content } = useStoreContent();
  const [selectedId, setSelectedId] = useState<string>();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const viewerTitleId = useId();
  const selectedDesign = designs.find((design) => design.id === selectedId) ?? designs[0];
  const selectedIndex = selectedDesign ? designs.indexOf(selectedDesign) : 0;
  const hasArtwork = selectedDesign !== undefined;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isViewerOpen || !hasArtwork || !dialog) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [isViewerOpen, hasArtwork]);

  if (!selectedDesign) return <StoreArtwork />;

  return (
    <div className="store-artwork-gallery">
      <button
        className="store-artwork-gallery__open"
        type="button"
        aria-label={t("storeCards.gallery.openLabel", { title })}
        aria-haspopup="dialog"
        onClick={() => setIsViewerOpen(true)}
      >
        <StoreArtwork design={selectedDesign} />
        <span className="store-artwork-gallery__expand" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true">
            <path
              d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          {t("storeCards.gallery.open")}
        </span>
      </button>

      <div className="store-artwork-gallery__caption" aria-live="polite" aria-atomic="true">
        <span lang={content(selectedDesign).title.locale}>
          {content(selectedDesign).title.value}
        </span>
        {designs.length > 1 && (
          <span>
            {t("storeCards.gallery.position", {
              position: formatNumber(selectedIndex + 1),
              total: formatNumber(designs.length),
            })}
          </span>
        )}
      </div>

      {designs.length > 1 && (
        <fieldset
          className="store-artwork-gallery__thumbnails"
          aria-label={t("storeCards.gallery.choose")}
        >
          {designs.map((design) => (
            <button
              className="store-artwork-gallery__thumbnail"
              key={design.id}
              type="button"
              aria-label={t("storeCards.gallery.selectLabel", {
                title: content(design).title.value,
              })}
              aria-pressed={design.id === selectedDesign.id}
              onClick={() => setSelectedId(design.id)}
            >
              <span aria-hidden="true">
                <StoreArtwork design={design} />
              </span>
            </button>
          ))}
        </fieldset>
      )}

      {isViewerOpen && (
        <dialog
          ref={dialogRef}
          className="store-artwork-viewer"
          aria-labelledby={viewerTitleId}
          onCancel={(event) => {
            event.preventDefault();
            setIsViewerOpen(false);
          }}
        >
          <div className="store-artwork-viewer__header">
            <div>
              <span className="store-artwork-viewer__eyebrow">
                {t("storeCards.gallery.viewer")}
              </span>
              <h2 id={viewerTitleId} lang={titleLocale}>
                {title}
              </h2>
            </div>
            <button
              className="store-artwork-viewer__close"
              ref={closeButtonRef}
              type="button"
              aria-label={t("storeCards.gallery.close")}
              onClick={() => setIsViewerOpen(false)}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="store-artwork-viewer__art">
            <StoreArtwork design={selectedDesign} />
          </div>
          <p className="store-artwork-viewer__caption" lang={content(selectedDesign).title.locale}>
            {content(selectedDesign).title.value}
          </p>
        </dialog>
      )}
    </div>
  );
}
