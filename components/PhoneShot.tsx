import Image, { type StaticImageData } from "next/image";

/* A real product screenshot (app.tophand.ag, demo farm) in a device frame.
   Replaced the hand-built placeholder shots once the app's Today / Tasks /
   Farm screens shipped. Screenshots are captured at 375×812 logical px,
   DPR 3 — re-capture with the same viewport when screens change. */

export default function PhoneShot({
  src,
  alt,
  width = 290,
  priority = false,
}: {
  src: StaticImageData;
  alt: string;
  width?: number;
  priority?: boolean;
}) {
  const bezel = Math.round(width * 0.037);
  const radius = Math.round(width * 0.147);
  return (
    <div
      style={{
        width,
        flex: "none",
        background: "#1a1712",
        borderRadius: radius,
        padding: bezel,
        boxShadow:
          "0 30px 60px -20px rgba(31,61,43,.5), 0 0 0 2px rgba(0,0,0,.35), inset 0 0 0 2px rgba(255,255,255,.06)",
      }}
    >
      <Image
        src={src}
        alt={alt}
        priority={priority}
        sizes={`${width}px`}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          borderRadius: radius - bezel,
        }}
      />
    </div>
  );
}
