/* Plat-map line texture from the handoff — parcel lines + a creek curve,
   rendered as a data-URI SVG and tiled at low opacity behind hero/story. */

const svg =
  "<svg xmlns='http://www.w3.org/2000/svg' width='340' height='340'>" +
  "<g fill='none' stroke='%231F3D2B' stroke-width='1.1'>" +
  "<path d='M0 64 H340'/><path d='M0 210 H340'/>" +
  "<path d='M116 0 V340'/><path d='M244 0 V210 H340'/>" +
  "<path d='M0 276 Q84 254 168 284 T340 272'/>" +
  "<circle cx='116' cy='210' r='2.5' fill='%231F3D2B' stroke='none'/>" +
  "<circle cx='244' cy='210' r='2.5' fill='%231F3D2B' stroke='none'/>" +
  "</g></svg>";

export const platTexture = `url("data:image/svg+xml,${svg}")`;
