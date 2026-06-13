// Detailed Premium Vector Definitions for Chess Pieces across 5 Themes.
// Classic: High-fidelity traditional Staunton profiles with contours, facial cuts, and details.
// Cyber: Futuristic robotic designs with sensor domes, glowing visors, and battery capacitor panels.
// Metallic: Extremely ornate baroque carvings, stone turrets, armored chainmail, and tiara gemstones.
// Neo: High-end contemporary geometric look with sweeping organic bezier arches and premium accents.
// Alpha: Classic publication layout with expressive knight silhouettes, flowing mane locks, and clean curves.

const CLASSIC = {
  P: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 39h22v-3.5H11V39z" fill="var(--piece-fill)"/>
    <path d="M12.5 35.5c0-1.5 1-3.5 3-4.5h13c2 1 3 3 3 4.5H12.5z" fill="var(--piece-fill)"/>
    <path d="M17 31c0-1 1-1.5 2.5-2h5c1.5.5 2.5 1 2.5 2H17z" fill="var(--piece-fill)"/>
    <path d="M18.5 29c-1-3.5-1.5-7.5-1-11h9c.5 3.5 0 7.5-1 11h-7z" fill="var(--piece-fill)"/>
    <path d="M16 18c0-1 1.5-1.5 6-1.5s6 .5 6 1.5H16z" fill="var(--piece-fill)"/>
    <circle cx="22" cy="12" r="5.5" fill="var(--piece-fill)"/>
    <path d="M20 9.5c1.2-.8 2.8-.8 4 0" stroke="var(--piece-detail)" stroke-width="1.2"/>
    <path d="M12.5 35.5h19M16.5 31h11" stroke="var(--piece-detail)" stroke-width="1"/>
  </g>`,

  R: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
    <path d="M10 39h24v-4H10v4z" fill="var(--piece-fill)"/>
    <path d="M12 35c0-2 1-3 3-3.5h14c2 .5 3 1.5 3 3.5H12z" fill="var(--piece-fill)"/>
    <path d="M14.5 31.5c-1-4-1-8 0-12h15c1 4 1 8 0 12h-15z" fill="var(--piece-fill)"/>
    <path d="M13 19.5c0-1 1-1.5 3-2h12c2 .5 3 1 3 2H13z" fill="var(--piece-fill)"/>
    <path d="M11 17.5v-8h3v3.5h4v-3.5h4v3.5h4v-3.5h4v3.5h3v8H11z" fill="var(--piece-fill)"/>
    <path d="M15 28.5h14M14.5 25.5h15M15 22.5h14" stroke="var(--piece-detail)" stroke-width="0.8"/>
    <path d="M18 28.5v-3M26 28.5v-3M22 25.5v-3M18 22.5v-3M26 22.5v-3" stroke="var(--piece-detail)" stroke-width="0.8"/>
    <path d="M12 35h20M15 31.5h14" stroke="var(--piece-detail)" stroke-width="1.2"/>
  </g>`,

  N: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
    <path d="M10 39h24c-1-3-3-4-5-4v-1.5c3-1.5 5.5-4 5-8.5-.2-2-.6-3-2-4.5 1-1.5 1.5-3 1-5-.3-1.2-1.2-2.5-2.5-3.5C28.3 10.3 26 9.8 24 10c.8-1 1-2.2.7-3.5-.2-1-.8-2-1.7-2.5-1-.5-2.2-.5-3 .2-.6.5-1 1.2-1.2 2 0-.8-.3-1.5-.8-2.2-.6-.7-1.5-1-2.3-.9-.8.1-1.5.5-2 1.2-.5.7-.7 1.5-.5 2.3-.2-.5-.5-1-1-1.3-.6-.4-1.3-.5-2-.3-.6.1-1.2.5-1.6 1.1-.4.6-.5 1.3-.4 2 .1 1.5 1 2.8 2.2 3.5-1.5 1-2.8 2.5-3.3 4.3-.6 1.8-.4 3.8.3 5.5.8 2 2.2 3.5 4 4.5.3.2.5.5.5.8 0 .8-.5 1.5-1.2 1.8-1 .4-2 0-2.8-.7-.5-.4-1-.3-1.3.2-.3.5-.2 1.2.3 1.5 1.2.8 2.8 1 4.2.5 1-.4 1.8-1.2 2-2.3.1-.4.4-.7.8-.8 1-.2 1.8.3 2.2 1.2.4.9.2 2-.5 2.7-1 1-2.5 1.5-4 1.5H10z" fill="var(--piece-fill)"/>
    <path d="M14.5 16a1 1 0 1 1 2 0 1 1 0 0 1-2 0z" fill="var(--piece-detail)" stroke="none"/>
    <path d="M13.5 14.5c1-.5 2.5-.5 3.5.5" stroke="var(--piece-detail)" stroke-width="1"/>
    <path d="M9.5 20c.5.8 1.5 1.2 2.5 1" stroke="var(--piece-detail)" stroke-width="1.2"/>
    <path d="M8.5 22.5c1 .5 2 .2 2.5-.5" stroke="var(--piece-detail)" stroke-width="1.2"/>
    <path d="M22 13c1.5 1.5 2 3.5 1.5 5.5M25 15c2 2 2.5 4.5 1.5 7M28 18c1.5 2 1.5 4.5.5 6.5" stroke="var(--piece-detail)" stroke-width="1"/>
    <path d="M11 20.5c1.5-1 3.5-2 5-1.5" stroke="var(--piece-detail)" stroke-width="1"/>
    <path d="M15 16.5l3.5 6.5" stroke="var(--piece-detail)" stroke-width="1.2"/>
    <circle cx="15.5" cy="17" r="1.5" stroke="var(--piece-detail)" stroke-width="1" fill="var(--piece-fill)"/>
    <path d="M18.5 23c-1.5 2-1 4.5.5 6" stroke="var(--piece-detail)" stroke-width="1"/>
  </g>`,

  B: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 39h22v-3.5H11V39z" fill="var(--piece-fill)"/>
    <path d="M12.5 35.5c0-2 1-3 3-4h13c2 1 3 2 3 4H12.5z" fill="var(--piece-fill)"/>
    <path d="M15.5 31.5c0-1 1.5-1.5 3.5-2h6c2 .5 3.5 1 3.5 2H15.5z" fill="var(--piece-fill)"/>
    <path d="M17.5 29.5c-.8-3-.8-7 0-10h9c.8 3 .8 7 0 10h-9z" fill="var(--piece-fill)"/>
    <path d="M16 19.5c0-.8 1.5-1.2 6-1.2s6 .4 6 1.2H16z" fill="var(--piece-fill)"/>
    <path d="M16 18.3c0-3.5 2-6.3 6-9.3 4 3 6 5.8 6 9.3H16z" fill="var(--piece-fill)"/>
    <circle cx="22" cy="7.5" r="1.5" fill="var(--piece-fill)" stroke="var(--piece-stroke)" stroke-width="1.2"/>
    <path d="M22 6V3M20.5 4.5h3" stroke="var(--piece-stroke)" stroke-width="1.2"/>
    <path d="M20 12l4 4.5" stroke="var(--piece-detail)" stroke-width="1.2"/>
    <circle cx="20" cy="12" r="0.8" fill="var(--piece-detail)" stroke="none"/>
    <circle cx="24" cy="16.5" r="0.8" fill="var(--piece-detail)" stroke="none"/>
    <path d="M22 18.3V12M17.5 29.5h9M12.5 35.5h19" stroke="var(--piece-detail)" stroke-width="1"/>
  </g>`,

  Q: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
    <path d="M10 39h24v-4H10v4z" fill="var(--piece-fill)"/>
    <path d="M12 35c0-2.5 1.5-3.5 3.5-4h13c2 .5 3.5 1.5 3.5 4H12z" fill="var(--piece-fill)"/>
    <path d="M15.5 31c0-1.2 1.5-2 3.5-2.5h6c2 .5 3.5 1.3 3.5 2.5H15.5z" fill="var(--piece-fill)"/>
    <path d="M18 28.5c-1-4-1.2-8.5 0-12.5h8c1.2 4 1 8.5 0 12.5h-8z" fill="var(--piece-fill)"/>
    <path d="M16 16c0-1 1.5-1.5 6-1.5s6 .5 6 1.5H16z" fill="var(--piece-fill)"/>
    <path d="M11 14.5l2 8h18l2-8-3.5 4.5L26 13l-4 6-4-6-3.5 6L11 14.5z" fill="var(--piece-fill)"/>
    <circle cx="11" cy="14.5" r="1" fill="var(--piece-detail)" stroke="var(--piece-stroke)" stroke-width="1"/>
    <circle cx="14.5" cy="19" r="1" fill="var(--piece-detail)" stroke="var(--piece-stroke)" stroke-width="1"/>
    <circle cx="19.5" cy="13" r="1" fill="var(--piece-detail)" stroke="var(--piece-stroke)" stroke-width="1"/>
    <circle cx="24.5" cy="13" r="1" fill="var(--piece-detail)" stroke="var(--piece-stroke)" stroke-width="1"/>
    <circle cx="29.5" cy="19" r="1" fill="var(--piece-detail)" stroke="var(--piece-stroke)" stroke-width="1"/>
    <circle cx="33" cy="14.5" r="1" fill="var(--piece-detail)" stroke="var(--piece-stroke)" stroke-width="1"/>
    <path d="M18 24.5c2 1.5 6 1.5 8 0M12 35h20M15.5 31h13" stroke="var(--piece-detail)" stroke-width="1"/>
  </g>`,

  K: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
    <path d="M10 39h24v-4H10v4z" fill="var(--piece-fill)"/>
    <path d="M11.5 35c0-2.5 1.5-3.5 3.5-4.5h14c2 1 3.5 2 3.5 4.5H11.5z" fill="var(--piece-fill)"/>
    <path d="M15 30.5c0-1.5 2-2.5 4-3h6c2 .5 4 1.5 4 3H15z" fill="var(--piece-fill)"/>
    <path d="M17.5 27.5c-1.2-4.5-1.5-9 0-13.5h9c1.5 4.5 1.2 9 0 13.5h-9z" fill="var(--piece-fill)"/>
    <path d="M15.5 14c0-1.2 1.5-1.8 6.5-1.8s6.5.6 6.5 1.8H15.5z" fill="var(--piece-fill)"/>
    <path d="M14 14v4c2 1 4 2 8 1.5s6-.5 8-1.5v-4H14z" fill="var(--piece-fill)"/>
    <path d="M14 14c-1-5 2-6.5 8-6.5s9 1.5 8 6.5H14z" fill="var(--piece-fill)"/>
    <path d="M22 7.5V3M20.5 4.5h3" stroke="var(--piece-stroke)" stroke-width="1.5"/>
    <path d="M19.5 2.5l2.5 1.5 2.5-1.5v4l-2.5-1.5-2.5 1.5v-4z" fill="var(--piece-fill)" stroke="var(--piece-stroke)" stroke-width="1.2"/>
    <path d="M17.5 23c2.5 2 6.5 2 9 0M11.5 35h21M15 30.5h14" stroke="var(--piece-detail)" stroke-width="1"/>
  </g>`
};

const CYBER = {
  P: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 38h22v-4H11v4z" fill="var(--piece-stroke)"/>
    <path d="M13 34h18l-1.5-4h-15L13 34z" fill="var(--piece-fill)"/>
    <path d="M14.5 30l1-8h13l1 8h-15z" fill="var(--piece-fill)"/>
    <circle cx="22" cy="23" r="3" fill="var(--piece-detail)" stroke="none"/>
    <path d="M17 18.5c0-3.5 2-6.5 5-6.5s5 3 5 6.5H17z" fill="var(--piece-fill)"/>
    <path d="M18.5 15.5h7" stroke="var(--piece-detail)" stroke-width="1.5"/>
    <line x1="22" y1="23" x2="22" y2="30" stroke="var(--piece-detail)" stroke-width="1.2"/>
    <line x1="17.5" y1="27" x2="26.5" y2="27" stroke="var(--piece-detail)" stroke-width="1"/>
  </g>`,

  R: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M10 38h24v-4H10v4z" fill="var(--piece-stroke)"/>
    <path d="M12.5 34l1-12h17l1 12H12.5z" fill="var(--piece-fill)"/>
    <line x1="16.5" y1="31" x2="16.5" y2="25" stroke="var(--piece-detail)" stroke-width="1.8"/>
    <line x1="22" y1="31" x2="22" y2="25" stroke="var(--piece-detail)" stroke-width="1.8"/>
    <line x1="27.5" y1="31" x2="27.5" y2="25" stroke="var(--piece-detail)" stroke-width="1.8"/>
    <path d="M12 22h20v-3H12v3z" fill="var(--piece-stroke)"/>
    <path d="M11.5 19v-8h4v3h4v-3h5v3h4v-3h3v8H11.5z" fill="var(--piece-fill)"/>
    <path d="M20.5 16h3v-5h-3v5z" fill="var(--piece-detail)" stroke="none"/>
  </g>`,

  N: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M10 38h24v-4H10v4z" fill="var(--piece-stroke)"/>
    <path d="M12.5 34c1-4 3-7 6.5-8.5v-1.5c-2-1.5-3-3-4-5.5-.3-1.5.2-3 1-4.5.8-1.5 2.5-3 4-3.5 1.5-.5 3 .2 4 .8.5-1.2 1.5-2.2 3-2.5 1.8-.3 3.5.5 4 2 .8-1 2-1.5 3.5-1.2 1.5.3 2.5 1.8 2.2 3.5-.3 2-2 3.8-3.5 4.5l-3.5 1.8c.8 1.5 1 3.5.5 5.5l-2.5 4.7H10z" fill="var(--piece-fill)"/>
    <path d="M14.5 16.5l3-1.5" stroke="var(--piece-detail)" stroke-width="2.2"/>
    <circle cx="14" cy="16.5" r="1.2" fill="var(--piece-detail)" stroke="none"/>
    <path d="M20.5 24.5l1.5-4M23.5 26l1.5-4M26.5 27.5l1.5-4" stroke="var(--piece-detail)" stroke-width="1.5"/>
    <path d="M18.5 21.5c-1 1-1 2.5.5 3.5" stroke="var(--piece-detail)" stroke-width="1.2"/>
    <path d="M13 32h18" stroke="var(--piece-detail)" stroke-width="1.2"/>
  </g>`,

  B: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 38h22v-4H11v4z" fill="var(--piece-stroke)"/>
    <path d="M13 34l1-4.5h16l1 4.5H13z" fill="var(--piece-fill)"/>
    <path d="M15 29.5L16.5 19h11L29 29.5H15z" fill="var(--piece-fill)"/>
    <line x1="22" y1="28" x2="22" y2="20" stroke="var(--piece-detail)" stroke-width="2"/>
    <path d="M15 19c0-.8 1.5-1.5 7-1.5s7 .7 7 1.5H15z" fill="var(--piece-stroke)"/>
    <path d="M16 17.5c0-4 2-7.5 6-7.5s6 3.5 6 7.5H16z" fill="var(--piece-fill)"/>
    <circle cx="22" cy="13.5" r="2.5" fill="var(--piece-detail)" stroke="none"/>
    <circle cx="22" cy="7.5" r="1.5" fill="var(--piece-fill)" stroke="var(--piece-stroke)" stroke-width="1.5"/>
    <path d="M22 6V3" stroke="var(--piece-stroke)" stroke-width="2"/>
  </g>`,

  Q: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M10 38h24v-4H10v4z" fill="var(--piece-stroke)"/>
    <path d="M12.5 34l1-5h17l1 5H12.5z" fill="var(--piece-fill)"/>
    <path d="M15.5 29c-1-4-1.2-8.5 0-12.5h13c1.2 4 1 8.5 0 12.5H15.5z" fill="var(--piece-fill)"/>
    <line x1="19" y1="27" x2="19" y2="18" stroke="var(--piece-detail)" stroke-width="1.8"/>
    <line x1="25" y1="27" x2="25" y2="18" stroke="var(--piece-detail)" stroke-width="1.8"/>
    <path d="M12.5 16.5L9 21.5l5-2.5L22 13l8 6 5 2.5-3.5-5H12.5z" fill="var(--piece-fill)"/>
    <circle cx="22" cy="21.5" r="3.5" fill="var(--piece-detail)" stroke="none"/>
    <circle cx="9" cy="21.5" r="1.2" fill="var(--piece-detail)" stroke="none"/>
    <circle cx="35" cy="21.5" r="1.2" fill="var(--piece-detail)" stroke="none"/>
  </g>`,

  K: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M10 38h24v-4H10v4z" fill="var(--piece-stroke)"/>
    <path d="M12.5 34c0-2 1-3 3-4h13c2 1 3 2 3 4H12.5z" fill="var(--piece-fill)"/>
    <path d="M15 30c-1.2-4.5-1.5-9 0-13.5h14c1.5 4.5 1.2 9 0 13.5H15z" fill="var(--piece-fill)"/>
    <line x1="18.5" y1="27" x2="25.5" y2="27" stroke="var(--piece-detail)" stroke-width="1.5"/>
    <line x1="18.5" y1="23.5" x2="25.5" y2="23.5" stroke="var(--piece-detail)" stroke-width="1.5"/>
    <line x1="18.5" y1="20" x2="25.5" y2="20" stroke="var(--piece-detail)" stroke-width="1.5"/>
    <path d="M14 16.5v4.5c2 1 4 1.5 8 1s6-.5 8-1v-4.5H14z" fill="var(--piece-fill)"/>
    <path d="M15 16.5c-1-5 2-6.5 7-6.5s8 1.5 7 6.5H15z" fill="var(--piece-fill)"/>
    <path d="M22 10V3M19 6h6" stroke="var(--piece-stroke)" stroke-width="2.5"/>
    <circle cx="22" cy="14" r="2.5" fill="var(--piece-detail)" stroke="none"/>
  </g>`
};

const METALLIC = {
  P: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 39h22v-3.5H11V39z" fill="var(--piece-fill)" stroke="var(--piece-stroke)"/>
    <path d="M12.5 35.5c0-1.5 1-3.5 3-4.5h13c2 1 3 3 3 4.5H12.5z" fill="var(--piece-fill)"/>
    <path d="M16 31c2-1 6-1 8 0" stroke="var(--piece-detail)" stroke-width="1.5"/>
    <path d="M18 29.5c-1-3.5-1.5-7.5-1-11h10c.5 3.5 0 7.5-1 11H18z" fill="var(--piece-fill)"/>
    <path d="M22 20.5c-1.5 2-1.5 5 0 7s1.5-5 0-7z" fill="var(--piece-detail)" stroke="none"/>
    <circle cx="22" cy="12" r="5.5" fill="var(--piece-fill)"/>
    <path d="M18.5 12c1.2-1.2 3.8-1.2 5 0" stroke="var(--piece-detail)" stroke-width="1.2"/>
    <circle cx="22" cy="12" r="1.5" fill="var(--piece-detail)" stroke="none"/>
  </g>`,

  R: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M9 39h26v-4H9v4z" fill="var(--piece-fill)"/>
    <path d="M11 35c0-2 1-3 3-3.5h16c2 .5 3 1.5 3 3.5H11z" fill="var(--piece-fill)"/>
    <path d="M13.5 31.5c-1-4-1-8 0-12h17c1 4 1 8 0 12h-17z" fill="var(--piece-fill)"/>
    <path d="M20 28.5v-4.5c0-1 1-1.5 2-1.5s2 .5 2 1.5v4.5" stroke="var(--piece-detail)" stroke-width="1.5"/>
    <path d="M12 19.5h20v-2H12v2z" fill="var(--piece-fill)"/>
    <path d="M10.5 17.5v-8h4v3.5h4v-3.5h4v3.5h4v-3.5h4v3.5h2v8H10.5z" fill="var(--piece-fill)"/>
    <circle cx="14.5" cy="13.5" r="1" fill="var(--piece-detail)" stroke="none"/>
    <circle cx="29.5" cy="13.5" r="1" fill="var(--piece-detail)" stroke="none"/>
  </g>`,

  N: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M10 39h24v-4H10v4z" fill="var(--piece-fill)"/>
    <path d="M12.5 35c1-3.5 2.5-5.5 5.5-6.5v-1.5c-2.5-1.5-4-3.5-4.5-6.5-.3-2 .2-4.2 1.5-6 1-1.5 2.8-3 4.5-3.5.5-1 1.2-1.8 2.2-2.2.8-.3 1.8.2 2.5.8.5-.8 1.5-1.5 2.8-1.2 1 .2 1.8 1.2 2 2.5.2 2-1.2 4-2.5 4.8l-2.8 1.8c.8 1.5.8 3.5.2 5.5l-1.8 4.2H10z" fill="var(--piece-fill)"/>
    <path d="M20.5 23.5c1 1.2 1.2 2.5 1 3.8M23 21.5c1.2 1.2 1.5 2.8 1 4.2M25.5 19.5c1.2 1.2 1.8 3 1.2 4.8" stroke="var(--piece-detail)" stroke-width="1"/>
    <path d="M13.5 17.5l4-2 3.5 6-3.5 5.5-4-9.5z" fill="var(--piece-detail)" stroke="var(--piece-stroke)" stroke-width="1.2"/>
    <circle cx="17.5" cy="20.5" r="1.5" fill="var(--piece-fill)" stroke="var(--piece-stroke)" stroke-width="1"/>
    <circle cx="14" cy="14" r="1.2" fill="var(--piece-detail)" stroke="none"/>
    <path d="M26.5 11c2 1 3.5 3 3 5" stroke="var(--piece-detail)" stroke-width="1"/>
  </g>`,

  B: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 39h22v-3.5H11V39z" fill="var(--piece-fill)"/>
    <path d="M12.5 35.5c0-2 1-3 3-4h13c2 1 3 2 3 4H12.5z" fill="var(--piece-fill)"/>
    <path d="M15.5 31.5c2-1 6-1 8 0" stroke="var(--piece-detail)" stroke-width="1.5"/>
    <path d="M17.5 29.5c-.8-3-.8-7 0-10h9c.8 3 .8 7 0 10H17.5z" fill="var(--piece-fill)"/>
    <path d="M22 20.5c-2.5 2.5 2.5 5 0 7.5s2.5-5 0-7.5z" stroke="var(--piece-detail)" stroke-width="1"/>
    <path d="M16 19.5c0-.8 1.5-1.2 6-1.2s6 .4 6 1.2H16z" fill="var(--piece-fill)"/>
    <path d="M16 18.3c0-3.5 2-6.3 6-9.3 4 3 6 5.8 6 9.3H16z" fill="var(--piece-fill)"/>
    <circle cx="22" cy="7.5" r="2.2" fill="var(--piece-fill)" stroke="var(--piece-stroke)" stroke-width="1.2"/>
    <path d="M22 9.5V4M19.5 6.5h5" stroke="var(--piece-stroke)" stroke-width="1.5"/>
  </g>`,

  Q: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M10 39h24v-4H10v4z" fill="var(--piece-fill)"/>
    <path d="M12 35c0-2.5 1.5-3.5 3.5-4h13c2 .5 3.5 1.5 3.5 4H12z" fill="var(--piece-fill)"/>
    <path d="M15.5 31c1.5-.8 5-1.2 6.5-.8s5 0 6.5.8H15.5z" fill="var(--piece-fill)"/>
    <circle cx="18.5" cy="30" r="0.8" fill="var(--piece-detail)" stroke="none"/>
    <circle cx="22" cy="29.5" r="0.8" fill="var(--piece-detail)" stroke="none"/>
    <circle cx="25.5" cy="30" r="0.8" fill="var(--piece-detail)" stroke="none"/>
    <path d="M18 28.5c-1-4-1.2-8.5 0-12.5h8c1.2 4 1 8.5 0 12.5H18z" fill="var(--piece-fill)"/>
    <path d="M22 28.5v-12.5" stroke="var(--piece-detail)" stroke-width="1.2"/>
    <path d="M11 14.5l2 8h18l2-8-3.5 4.5L26 13l-4 6-4-6-3.5 6L11 14.5z" fill="var(--piece-fill)"/>
    <circle cx="11" cy="14.5" r="1.5" fill="var(--piece-detail)" stroke="var(--piece-stroke)" stroke-width="1"/>
    <circle cx="19.5" cy="13" r="1.5" fill="var(--piece-detail)" stroke="var(--piece-stroke)" stroke-width="1"/>
    <circle cx="24.5" cy="13" r="1.5" fill="var(--piece-detail)" stroke="var(--piece-stroke)" stroke-width="1"/>
    <circle cx="33" cy="14.5" r="1.5" fill="var(--piece-detail)" stroke="var(--piece-stroke)" stroke-width="1"/>
  </g>`,

  K: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M10 39h24v-4H10v4z" fill="var(--piece-fill)"/>
    <path d="M11.5 35c0-2.5 1.5-3.5 3.5-4.5h14c2 1 3.5 2 3.5 4.5H11.5z" fill="var(--piece-fill)"/>
    <path d="M15 30.5c2-1 6-1 8 0" stroke="var(--piece-detail)" stroke-width="1.5"/>
    <path d="M17.5 27.5c-1.2-4.5-1.5-9 0-13.5h9c1.5 4.5 1.2 9 0 13.5H17.5z" fill="var(--piece-fill)"/>
    <path d="M22 25c-1.5-1.5-2.5-3.5 0-5 2.5 1.5 1.5 3.5 0 5z" fill="var(--piece-detail)" stroke="none"/>
    <path d="M14 14v4c2 1 4 2 8 1.5s6-.5 8-1.5v-4H14z" fill="var(--piece-fill)"/>
    <path d="M14 14c-1-5 2-6.5 8-6.5s9 1.5 8 6.5H14z" fill="var(--piece-fill)"/>
    <path d="M22 7.5V3M20.5 4.5h3" stroke="var(--piece-stroke)" stroke-width="1.5"/>
    <circle cx="22" cy="4.5" r="1" fill="var(--piece-detail)" stroke="none"/>
    <path d="M15.5 16.5c1.5-1 3.5-1 5 0M23.5 16.5c1.5-1 3.5-1 5 0" stroke="var(--piece-detail)" stroke-width="1.2"/>
  </g>`
};

const NEO = {
  P: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M12 38h20v-4H12v4z" fill="var(--piece-stroke)"/>
    <path d="M14 34c0-4 1.5-7.5 4-10h8c2.5 2.5 4 6 4 10H14z" fill="var(--piece-fill)"/>
    <path d="M18 24h8" stroke="var(--piece-detail)" stroke-width="1.5"/>
    <circle cx="22" cy="14" r="5" fill="var(--piece-fill)"/>
    <path d="M20 11.5c1.5-.8 3-.8 4 0" stroke="var(--piece-detail)" stroke-width="1.5"/>
  </g>`,

  R: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 38h22v-4H11v4z" fill="var(--piece-stroke)"/>
    <path d="M14 34v-14h16v14H14z" fill="var(--piece-fill)"/>
    <line x1="22" y1="34" x2="22" y2="20" stroke="var(--piece-detail)" stroke-width="1.8"/>
    <path d="M12 20v-7h4v3.5h4V13h4v3.5h4V13h4v7H12z" fill="var(--piece-fill)"/>
  </g>`,

  N: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 38h22v-4H11v4z" fill="var(--piece-stroke)"/>
    <path d="M13 34c1-4.5 3-7.5 6-10 .5-.5 1-1.2 1-2 0-1.8-1-3-2.5-4-1-.8-2-2.5-1.5-4 .5-1.5 2-2.2 3.5-2.5 1.5-.2 2.5.5 3 .8.5-.8 1.5-1.5 2.5-1.2 1 .3 1.5 1.2 1.5 2.2 0 1.5-1 3-2.2 3.8l-2.5 1.8c.8 1.5 1.2 3.5.8 5.5l-2.2 4.6H13z" fill="var(--piece-fill)"/>
    <path d="M15 15.5l3-1.5" stroke="var(--piece-detail)" stroke-width="2.2"/>
    <path d="M19 24.5c2 1.5 5 1.5 7 0" stroke="var(--piece-detail)" stroke-width="1.5"/>
  </g>`,

  B: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M12 38h20v-4H12v4z" fill="var(--piece-stroke)"/>
    <path d="M14 34c0-3 1.5-6.5 4-8.5h8c2.5 2 4 5.5 4 8.5H14z" fill="var(--piece-fill)"/>
    <path d="M16.5 25.5c0-4 2.5-7.5 5.5-7.5s5.5 3.5 5.5 7.5H16.5z" fill="var(--piece-fill)"/>
    <path d="M19.5 21l5 4" stroke="var(--piece-detail)" stroke-width="1.8"/>
    <circle cx="22" cy="14.5" r="1.5" fill="var(--piece-fill)" stroke="var(--piece-stroke)" stroke-width="1.5"/>
  </g>`,

  Q: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 38h22v-4H11v4z" fill="var(--piece-stroke)"/>
    <path d="M13.5 34c0-3 1-6.5 3-9h11c2 2.5 3 6 3 9H13.5z" fill="var(--piece-fill)"/>
    <path d="M13.5 25l-2.5-7 4.5 3.5 6.5-5 6.5 5 4.5-3.5-2.5 7H13.5z" fill="var(--piece-fill)"/>
    <circle cx="11" cy="18" r="1" fill="var(--piece-detail)" stroke="none"/>
    <circle cx="22" cy="13" r="1" fill="var(--piece-detail)" stroke="none"/>
    <circle cx="33" cy="18" r="1" fill="var(--piece-detail)" stroke="none"/>
    <circle cx="22" cy="22.5" r="2.5" fill="var(--piece-detail)" stroke="none"/>
  </g>`,

  K: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 38h22v-4H11v4z" fill="var(--piece-stroke)"/>
    <path d="M13.5 34c0-3 1.5-6 3.5-8.5h10c2 2.5 3.5 5.5 3.5 8.5H13.5z" fill="var(--piece-fill)"/>
    <path d="M15 25.5c-1-3 1.5-5 7-5s8 2 7 5H15z" fill="var(--piece-fill)"/>
    <path d="M22 20.5V11" stroke="var(--piece-stroke)" stroke-width="2.5"/>
    <path d="M19 14.5h6" stroke="var(--piece-stroke)" stroke-width="2.5"/>
    <circle cx="22" cy="22.5" r="2" fill="var(--piece-detail)" stroke="none"/>
  </g>`
};

const ALPHA = {
  P: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
    <path d="M12 37.5c0-1 1-2.5 3.5-3.5h13c2.5 1 3.5 2.5 3.5 3.5H12z" fill="var(--piece-stroke)"/>
    <path d="M14.5 34c0-2.5 1.5-4.5 4-5.5h7c2.5 1 4 3 4 5.5H14.5z" fill="var(--piece-fill)"/>
    <path d="M17 28.5c-1-3.5-1-7 0-10.5h10c1 3.5 1 7 0 10.5H17z" fill="var(--piece-fill)"/>
    <circle cx="22" cy="13.5" r="5" fill="var(--piece-fill)"/>
  </g>`,

  R: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 38h22c0-1.5-1-3-3.5-3.5h-15c-2.5.5-3.5 2-3.5 3.5z" fill="var(--piece-stroke)"/>
    <path d="M13.5 34.5c0-3.5 1-6.5 2-10h13c1 3.5 2 6.5 2 10H13.5z" fill="var(--piece-fill)"/>
    <path d="M12 24.5v-8h3.5v3.5h4v-3.5h5v3.5h4v-3.5h3.5v8H12z" fill="var(--piece-fill)"/>
    <line x1="13.5" y1="24.5" x2="30.5" y2="24.5" stroke="var(--piece-detail)" stroke-width="1.5"/>
  </g>`,

  N: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 38h22c0-1.5-1-3-3.5-3.5h-15c-2.5.5-3.5 2-3.5 3.5z" fill="var(--piece-stroke)"/>
    <path d="M13 34.5c1-3.5 2.5-6.5 5.5-8.5v-1.5c-2.5-1.5-4.5-3.5-4-6.5.3-2.5 1.5-4.5 3.5-6 1-.8 2.5-1.5 4-1.8 1.5-.3 2.5.5 3 .8.5-1.2 1.5-2 3-2 1.5 0 2.5 1.2 2 2.5-.2 1.5-1.5 3-2.5 3.5l-2.5 1.5c.8 1.5 1 3.5.8 5.5l-2.2 4.7H13z" fill="var(--piece-fill)"/>
    <circle cx="15.5" cy="15.5" r="1.2" fill="var(--piece-detail)" stroke="none"/>
    <path d="M22 13c1.5 1.5 2 3.5 1.5 5M25 15.5c2 2 2.5 4 1.5 6M27.5 18c1.5 2 1.5 4.5.5 6" stroke="var(--piece-detail)" stroke-width="1.2"/>
  </g>`,

  B: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 38c0-1.5 1-3 3.5-3.5h15c2.5.5 3.5 2 3.5 3.5H11z" fill="var(--piece-stroke)"/>
    <path d="M14.5 34.5c0-3.5 1.5-6.5 4-7.5h7c2.5 1 4 4 4 7.5H14.5z" fill="var(--piece-fill)"/>
    <path d="M16 27c0-4.5 2.5-7.5 6-7.5s6 3 6 7.5H16z" fill="var(--piece-fill)"/>
    <circle cx="22" cy="18" r="1.5" fill="var(--piece-fill)" stroke="var(--piece-stroke)" stroke-width="1.2"/>
    <path d="M22 16.5v-3.5M20.5 14.5h3" stroke="var(--piece-stroke)" stroke-width="1.5"/>
    <path d="M20 22l4 4" stroke="var(--piece-detail)" stroke-width="1.5"/>
  </g>`,

  Q: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 38c0-1.5 1-3 3.5-3.5h15c2.5.5 3.5 2 3.5 3.5H11z" fill="var(--piece-stroke)"/>
    <path d="M14.5 34.5c0-4 1.2-8 3.2-11.5h8.6c2 3.5 3.2 7.5 3.2 11.5H14.5z" fill="var(--piece-fill)"/>
    <path d="M14.5 23L11 17l4.5 3.5 6.5-5 6.5 5 4.5-3.5-3.5 6H14.5z" fill="var(--piece-fill)"/>
    <circle cx="11" cy="17" r="1.2" fill="var(--piece-fill)" stroke="var(--piece-stroke)" stroke-width="1.2"/>
    <circle cx="22" cy="12" r="1.5" fill="var(--piece-fill)" stroke="var(--piece-stroke)" stroke-width="1.2"/>
    <circle cx="33" cy="17" r="1.2" fill="var(--piece-fill)" stroke="var(--piece-stroke)" stroke-width="1.2"/>
  </g>`,

  K: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">
    <path d="M11 38c0-1.5 1-3 3.5-3.5h15c2.5.5 3.5 2 3.5 3.5H11z" fill="var(--piece-stroke)"/>
    <path d="M14.5 34.5c0-4.5 1.5-8 3.5-11h8c2 3 3.5 6.5 3.5 11H14.5z" fill="var(--piece-fill)"/>
    <path d="M15 23.5c-1-5 2-6.5 7-6.5s8 1.5 7 6.5H15z" fill="var(--piece-fill)"/>
    <path d="M22 17V8M19.5 11.5h5" stroke="var(--piece-stroke)" stroke-width="2.2"/>
    <circle cx="22" cy="17" r="2.2" fill="var(--piece-detail)" stroke="none"/>
  </g>`
};

export const PIECE_THEMES = {
  classic: CLASSIC,
  cyber: CYBER,
  metallic: METALLIC,
  neo: NEO,
  alpha: ALPHA
};
