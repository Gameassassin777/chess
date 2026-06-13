// Detailed Vector Definitions for Chess Pieces (Classic, Cyber, and Metallic Themes).
// Classic: High-fidelity traditional Staunton silhouettes.
// Cyber: Futuristic sci-fi vectors with panel-grid lines, visor glows, and capacitor slots.
// Metallic: Exquisitely ornate royal vectors with filigree carvings, stone masonry, chainmail, and jewel accents.

const CLASSIC = {
  P: `<g class="piece-g">
    <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="var(--piece-fill)" stroke="var(--piece-stroke)" stroke-width="1.5" stroke-linecap="round"/>
  </g>`,

  R: `<g fill="var(--piece-fill)" fill-rule="evenodd" stroke="var(--piece-stroke)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt"/>
    <path d="M34 14l-3 3H14l-3-3" stroke-linecap="round"/>
    <path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter"/>
    <path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/>
    <path d="M11 14h23" fill="none" stroke-linejoin="miter"/>
    <path d="M12 35.5h21M13 31.5h19M14 29.5h17" fill="none" stroke="var(--piece-detail)" stroke-width="1"/>
  </g>`,

  N: `<g fill="none" fill-rule="evenodd" stroke="var(--piece-stroke)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="var(--piece-fill)" stroke="var(--piece-stroke)"/>
    <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" fill="var(--piece-fill)" stroke="var(--piece-stroke)"/>
    <path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" fill="var(--piece-detail)" stroke="var(--piece-detail)"/>
    <path d="M 15 15.5 A 0.5 1.5 0 1 1 14,15.5 A 0.5 1.5 0 1 1 15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" fill="var(--piece-detail)" stroke="var(--piece-detail)"/>
  </g>`,

  B: `<g fill="none" fill-rule="evenodd" stroke="var(--piece-stroke)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <g fill="var(--piece-fill)" stroke-linecap="butt">
      <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
    </g>
    <path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="var(--piece-detail)" stroke-linejoin="miter"/>
  </g>`,

  Q: `<g fill="var(--piece-fill)" fill-rule="evenodd" stroke="var(--piece-stroke)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/>
    <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12zM9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt"/>
    <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" stroke="var(--piece-detail)"/>
  </g>`,

  K: `<g fill="none" fill-rule="evenodd" stroke="var(--piece-stroke)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22.5 11.63V6M20 8h5" stroke="var(--piece-stroke)" stroke-linejoin="miter"/>
    <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="var(--piece-fill)" stroke="var(--piece-stroke)" stroke-linecap="butt" stroke-linejoin="miter"/>
    <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="var(--piece-fill)" stroke="var(--piece-stroke)"/>
    <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="var(--piece-detail)"/>
  </g>`
};

const CYBER = {
  // Drone pawn with hovering core and capacitor plates
  P: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 12,38 L 32,38 L 30,34 L 14,34 Z" fill="var(--piece-stroke)" />
    <path d="M 15,34 C 13,26 15,22 22,20 C 29,22 31,26 29,34 Z" fill="var(--piece-fill)" />
    <circle cx="22" cy="14" r="5" fill="var(--piece-fill)" />
    <line x1="22" y1="20" x2="22" y2="34" stroke="var(--piece-detail)" stroke-width="1.5" />
    <path d="M 17,25 L 27,25" stroke="var(--piece-detail)" stroke-width="1.5" />
    <circle cx="22" cy="14" r="2" fill="var(--piece-detail)" stroke="none" />
  </g>`,

  // Heavy cyber pylon rook with vertical energy vents
  R: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 11,38 L 33,38 L 31,32 L 13,32 Z" fill="var(--piece-stroke)" />
    <rect x="14" y="18" width="16" height="14" fill="var(--piece-fill)" />
    <path d="M 12,18 L 12,10 L 16,10 L 16,14 L 20,14 L 20,10 L 24,10 L 24,14 L 28,14 L 28,10 L 32,10 L 32,18 Z" fill="var(--piece-fill)" />
    <line x1="18" y1="22" x2="18" y2="28" stroke="var(--piece-detail)" stroke-width="2" />
    <line x1="26" y1="22" x2="26" y2="28" stroke="var(--piece-detail)" stroke-width="2" />
    <line x1="14" y1="18" x2="30" y2="18" stroke="var(--piece-detail)" stroke-width="1.5" />
  </g>`,

  // Mecha-knight with sharp angled visor and robotic mane plates
  N: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 10,38 L 34,38 L 32,34 L 12,34 Z" fill="var(--piece-stroke)" />
    <path d="M 31,34 C 31,26 29,20 25,17 C 28,14 29,9 25,7 C 20,5 17,8 14,10 C 11,13 9,17 9,21 C 9,24 11,26 13,26 C 15,26 15,23 18,23 C 21,23 20,27 19,29 C 17,31 13,32 13,34 Z" fill="var(--piece-fill)" />
    <path d="M 14,13 L 23,17" stroke="var(--piece-detail)" stroke-width="2.5" />
    <path d="M 23,7 C 22,9 21,12 21,15" stroke="var(--piece-detail)" stroke-width="1.5" />
    <polygon points="25,9 29,7 27,11" fill="var(--piece-detail)" stroke="none" />
    <circle cx="15" cy="18" r="1.5" fill="var(--piece-detail)" stroke="none" />
  </g>`,

  // Bishop with split core and floating energy sphere
  B: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 11,38 L 33,38 L 31,34 L 13,34 Z" fill="var(--piece-stroke)" />
    <path d="M 14,34 C 12,24 16,14 22,11 C 28,14 32,24 30,34 Z" fill="var(--piece-fill)" />
    <path d="M 22,11 L 22,5 M 19,8 L 25,8" stroke="var(--piece-stroke)" stroke-width="2" />
    <path d="M 17,20 C 19,25 25,25 27,20" stroke="var(--piece-detail)" stroke-width="2" />
    <line x1="22" y1="16" x2="22" y2="30" stroke="var(--piece-detail)" stroke-width="1.5" />
    <circle cx="22" cy="18" r="3" fill="var(--piece-detail)" stroke="none" />
  </g>`,

  // Cyber queen with command orbit rings and core columns
  Q: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 11,38 L 33,38 L 31,34 L 13,34 Z" fill="var(--piece-stroke)" />
    <path d="M 14,34 L 10,20 L 17,25 L 22,12 L 27,25 L 34,20 L 30,34 Z" fill="var(--piece-fill)" />
    <circle cx="10" cy="20" r="2" fill="var(--piece-detail)" stroke="none" />
    <circle cx="22" cy="12" r="2" fill="var(--piece-detail)" stroke="none" />
    <circle cx="34" cy="20" r="2" fill="var(--piece-detail)" stroke="none" />
    <line x1="15" y1="30" x2="29" y2="30" stroke="var(--piece-detail)" stroke-width="1.5" />
    <path d="M 17,26 L 27,26" stroke="var(--piece-detail)" stroke-width="1.5" />
    <circle cx="22" cy="22" r="3" fill="var(--piece-detail)" stroke="none" />
  </g>`,

  // Cyber King power cell tower with complex stabilizer rails
  K: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 11,38 L 33,38 L 31,34 L 13,34 Z" fill="var(--piece-stroke)" />
    <path d="M 13,34 L 9,20 L 17,23 L 22,15 L 26,23 L 35,20 L 31,34 Z" fill="var(--piece-fill)" />
    <path d="M 22,15 L 22,6 M 18,9 L 26,9" stroke="var(--piece-stroke)" stroke-width="2.5" />
    <line x1="14" y1="30" x2="30" y2="30" stroke="var(--piece-detail)" stroke-width="1.5" />
    <line x1="16" y1="26" x2="28" y2="26" stroke="var(--piece-detail)" stroke-width="1.5" />
    <rect x="20" y="19" width="4" height="5" fill="var(--piece-detail)" stroke="none" />
  </g>`
};

const METALLIC = {
  // Ornate Royal Shield Pawn
  P: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 10,38 L 34,38 L 34,35 L 10,35 Z" fill="var(--piece-stroke)" />
    <path d="M 12,35 L 32,35 L 30,31 L 14,31 Z" fill="var(--piece-fill)" />
    <path d="M 15,31 C 15,22 17,19 22,18 C 27,19 29,22 29,31 Z" fill="var(--piece-fill)" />
    <circle cx="22" cy="11.5" r="5.5" fill="var(--piece-fill)" />
    <path d="M 22,18 C 18,22 18,28 22,31 C 26,28 26,22 22,18" fill="var(--piece-detail)" stroke="none" />
    <path d="M 18,11.5 H 26" stroke="var(--piece-detail)" stroke-width="1.2" />
  </g>`,

  // Citadel Bastion Rook with stone-masonry lines and arched windows
  R: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 9,39 L 35,39 L 35,36 L 9,36 Z" fill="var(--piece-stroke)" />
    <path d="M 12,36 L 32,36 L 30,32 L 14,32 Z" fill="var(--piece-fill)" />
    <path d="M 13,32 L 14.5,18 L 29.5,18 L 31,32 Z" fill="var(--piece-fill)" />
    <path d="M 11,18 L 11,8 L 15,8 L 15,12 L 20,12 L 20,8 L 24,8 L 24,12 L 29,12 L 29,8 L 33,8 L 33,18 Z" fill="var(--piece-fill)" />
    <!-- Gothic details and stone carvings -->
    <path d="M 17,28 L 17,22 C 17,20 20,20 20,22 L 20,28" stroke="var(--piece-detail)" stroke-width="1.2" />
    <path d="M 24,28 L 24,22 C 24,20 27,20 27,22 L 27,28" stroke="var(--piece-detail)" stroke-width="1.2" />
    <line x1="14.5" y1="18" x2="29.5" y2="18" stroke="var(--piece-detail)" stroke-width="1.5" />
    <line x1="13" y1="32" x2="31" y2="32" stroke="var(--piece-detail)" stroke-width="1.2" />
  </g>`,

  // Armored warhorse knight with chainmail drape, bridle details, and flowing mane
  N: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 9,39 L 35,39 L 33,35 L 11,35 Z" fill="var(--piece-stroke)" />
    <path d="M 31,35 C 31,24 28,18 24,15 C 28,11 29,6 24,4 C 18,2 14,6 12,9 C 9,12 8,16 8,20 C 8,24 10,26 12,26 C 14,26 15,22 18,22 C 21,22 20,26 19,28 C 17,31 12,32 12,35 Z" fill="var(--piece-fill)" />
    <!-- Detailed bridle and mane carvings -->
    <path d="M 13,9 C 14,13 16,16 19,17 C 22,18 24,15 25,12" stroke="var(--piece-detail)" stroke-width="1.5" />
    <circle cx="16" cy="11" r="1.2" fill="var(--piece-detail)" stroke="none" />
    <path d="M 20,5 C 21,7 23,8 25,7 M 18,7 C 19,9 21,10 23,9 M 16,9 C 17,11 19,12 21,11" stroke="var(--piece-detail)" stroke-width="1.2" />
    <path d="M 28,19 C 27,23 27,27 28,31 M 25,18 C 24,22 24,26 25,30 M 22,17 C 21,21 21,25 22,29" stroke="var(--piece-detail)" stroke-width="1" />
  </g>`,

  // High Mitre Bishop with Celtic engraving and vestment loops
  B: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 9,39 L 35,39 L 33,35 L 11,35 Z" fill="var(--piece-stroke)" />
    <path d="M 12,35 L 32,35 L 30,31 L 14,31 Z" fill="var(--piece-stroke)" />
    <path d="M 14,31 C 11,21 15,11 22,8 C 29,11 33,21 30,31 Z" fill="var(--piece-fill)" />
    <path d="M 22,8 L 22,3 M 19,5 L 25,5" stroke="var(--piece-stroke)" stroke-width="2" />
    <!-- Intricate ceremonial details -->
    <path d="M 17,21 C 19,25 25,25 27,21" stroke="var(--piece-detail)" stroke-width="1.5" fill="none" />
    <path d="M 22,8 C 19,12 19,17 22,21 C 25,17 25,12 22,8" fill="var(--piece-detail)" stroke="none" />
    <circle cx="22" cy="27" r="1.5" fill="var(--piece-detail)" stroke="none" />
    <path d="M 14,31 H 30" stroke="var(--piece-detail)" stroke-width="1.2" />
  </g>`,

  // Exquisite Tiara Queen with detailed crown arches and robe drapery
  Q: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 9,39 L 35,39 L 33,35 L 11,35 Z" fill="var(--piece-stroke)" />
    <path d="M 12,35 L 32,35 L 30,31 L 14,31 Z" fill="var(--piece-stroke)" />
    <path d="M 14,31 L 10,16 L 16.5,23 L 22,9 L 27.5,23 L 34,16 L 30,31 Z" fill="var(--piece-fill)" />
    <circle cx="10" cy="16" r="1.8" fill="var(--piece-fill)" />
    <circle cx="16.5" cy="23" r="1.2" fill="var(--piece-fill)" />
    <circle cx="22" cy="9" r="2" fill="var(--piece-fill)" />
    <circle cx="27.5" cy="23" r="1.2" fill="var(--piece-fill)" />
    <circle cx="34" cy="16" r="1.8" fill="var(--piece-fill)" />
    <!-- Royal necklace/gown detail carvings -->
    <path d="M 15,26 C 18,29 26,29 29,26" stroke="var(--piece-detail)" stroke-width="1.5" />
    <path d="M 13,31 C 16,34 28,34 31,31" stroke="var(--piece-detail)" stroke-width="1.2" />
    <line x1="22" y1="13" x2="22" y2="25" stroke="var(--piece-detail)" stroke-width="1" />
  </g>`,

  // Imposing Imperial King with detailed crown, cross finial, and robe trims
  K: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 9,39 L 35,39 L 33,35 L 11,35 Z" fill="var(--piece-stroke)" />
    <path d="M 12,35 L 32,35 L 30,31 L 14,31 Z" fill="var(--piece-stroke)" />
    <path d="M 13,31 C 9,18 16,19 22,12 C 28,19 35,18 31,31 Z" fill="var(--piece-fill)" />
    <path d="M 22,12 L 22,3 M 18,6 L 26,6" stroke="var(--piece-stroke)" stroke-width="2.5" />
    <!-- Imperial jewels and robe lines -->
    <path d="M 17,21 C 20,23 24,23 27,21" stroke="var(--piece-detail)" stroke-width="1.8" />
    <circle cx="22" cy="16" r="2" fill="var(--piece-detail)" stroke="none" />
    <circle cx="16" cy="19" r="1" fill="var(--piece-detail)" stroke="none" />
    <circle cx="28" cy="19" r="1" fill="var(--piece-detail)" stroke="none" />
    <path d="M 13,27 C 18,30 26,30 31,27" stroke="var(--piece-detail)" stroke-width="1.2" />
    <path d="M 12,31 C 17,34 27,34 32,31" stroke="var(--piece-detail)" stroke-width="1.2" />
  </g>`
};

export const PIECE_THEMES = {
  classic: CLASSIC,
  cyber: CYBER,
  metallic: METALLIC
};
