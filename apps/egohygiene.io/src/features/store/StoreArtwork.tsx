import { useId, useState } from "react";

import type { StoreDesign } from "@egohygiene/schemas";

type StoreArtworkProps = {
  readonly design?: StoreDesign | undefined;
  readonly hero?: boolean;
};

/** Decorative studies are never presented as photographs or approved print artwork. */
export function StoreArtwork({ design, hero = false }: StoreArtworkProps) {
  const instanceId = useId().replaceAll(":", "");
  const [failedSource, setFailedSource] = useState<string>();
  const artwork = design?.artwork;
  const imageSource = artwork?.kind === "image" ? artwork.src : undefined;
  const motif = hero ? 0 : [...(design?.id ?? "preview")].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 3;
  const gradientId = `${instanceId}-ink`;
  const gridId = `${instanceId}-grid`;
  const glowId = `${instanceId}-glow`;

  if (artwork?.kind === "image" && imageSource !== failedSource) {
    return (
      <div className="store-artwork store-artwork--image">
        <img
          alt={artwork.alt}
          src={artwork.src}
          loading={hero ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailedSource(artwork.src)}
        />
      </div>
    );
  }

  const label = imageSource ? "Artwork preview unavailable" : "Concept artwork · placeholder";
  return (
    <div
      className={`store-artwork store-artwork--study store-artwork--motif-${motif}${hero ? " store-artwork--hero" : ""}`}
      role="img"
      aria-label={artwork?.kind === "placeholder" ? `${artwork.label}. ${label}.` : label}
    >
      <svg aria-hidden="true" viewBox="0 0 600 600" fill="none" focusable="false">
        <defs>
          <linearGradient id={gradientId} x1="110" y1="130" x2="490" y2="460" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F6AAD6" />
            <stop offset="0.48" stopColor="#C9BAFF" />
            <stop offset="1" stopColor="#A4EDE8" />
          </linearGradient>
          <radialGradient id={glowId}>
            <stop stopColor={motif === 1 ? "#58BDBF" : "#C269AF"} stopOpacity="0.3" />
            <stop offset="1" stopColor="#161520" stopOpacity="0" />
          </radialGradient>
          <pattern id={gridId} width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" stroke="#ECE5FB" strokeOpacity="0.055" />
          </pattern>
        </defs>
        <rect width="600" height="600" fill={`url(#${gridId})`} />
        <circle cx="300" cy="300" r="290" fill={`url(#${glowId})`} />
        <g stroke="#EFE6FA" strokeOpacity="0.2">
          <circle cx="300" cy="300" r="212" strokeDasharray="2 12" />
          <path d="M70 300h460M300 70v460" strokeOpacity="0.1" />
          <path d="M84 100v-16h16M500 84h16v16M516 500v16h-16M100 516H84v-16" />
        </g>
        {motif === 0 && (
          <g stroke={`url(#${gradientId})`} strokeWidth="2">
            <ellipse cx="300" cy="312" rx="245" ry="74" transform="rotate(-29 300 312)" opacity="0.55" />
            <ellipse cx="300" cy="290" rx="232" ry="94" transform="rotate(35 300 290)" opacity="0.3" />
            <path d="M300 420 170 290C90 208 214 107 300 210 386 107 510 208 430 290Z" fill={`url(#${gradientId})`} fillOpacity="0.09" strokeWidth="3" />
            <path d="M300 395 187 282C128 222 220 146 300 235 380 146 472 222 413 282Z" opacity="0.5" />
            <path d="M300 365 209 274C172 237 239 185 300 263 361 185 428 237 391 274Z" opacity="0.3" />
            <path d="m306 185-33 70 54 40-38 57 26 53" strokeWidth="6" />
            <path d="M152 260h59M373 298h80M223 341h56" strokeWidth="8" />
            <circle cx="498" cy="193" r="5" fill="#B6F1EC" stroke="none" />
          </g>
        )}
        {motif === 1 && (
          <g stroke={`url(#${gradientId})`} strokeWidth="2">
            {Array.from({ length: 8 }, (_, index) => (
              <ellipse key={index} cx="300" cy="238" rx="66" ry="142" transform={`rotate(${index * 45} 300 300)`} opacity={0.4 + (index % 2) * 0.3} />
            ))}
            <circle cx="300" cy="300" r="56" fill={`url(#${gradientId})`} fillOpacity="0.12" />
            <circle cx="300" cy="300" r="22" />
            <path d="M87 386h107M409 215h94M348 462h46" strokeWidth="5" />
            <circle cx="150" cy="144" r="5" fill="#F6AAD6" stroke="none" />
          </g>
        )}
        {motif === 2 && (
          <g stroke={`url(#${gradientId})`} strokeWidth="2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <rect key={index} x={160 + index * 19} y={116 + index * 25} width={280 - index * 38} height={368 - index * 50} rx="100" transform={`rotate(${index * 8 - 20} 300 300)`} opacity={1 - index * 0.1} />
            ))}
            <ellipse cx="300" cy="338" rx="234" ry="55" transform="rotate(-15 300 338)" opacity="0.4" />
            <path d="M108 224h71M403 395h94" strokeWidth="6" />
            <circle cx="423" cy="147" r="5" fill="#B6F1EC" stroke="none" />
          </g>
        )}
        <g fill="#F4D7ED">
          <path d="m448 92 2 8 8 2-8 2-2 8-2-8-8-2 8-2Z" />
          <path d="m114 420 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" />
          <circle cx="486" cy="451" r="2" /><circle cx="192" cy="104" r="2" /><circle cx="98" cy="184" r="2" />
        </g>
      </svg>
      <span className="store-artwork__label">{label}</span>
    </div>
  );
}
