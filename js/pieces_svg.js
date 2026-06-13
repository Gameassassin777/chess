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


const NEO = {
  P: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 11,38 C 11,38 33,38 33,38 C 33,38 31,33 31,33 C 31,33 13,33 13,33 C 13,33 11,38 11,38 Z" fill="var(--piece-stroke)" />
    <path d="M 14,33 C 14,23 17,19 22,19 C 27,19 30,23 30,33 Z" fill="var(--piece-fill)" />
    <circle cx="22" cy="13" r="5" fill="var(--piece-fill)" />
    <circle cx="22" cy="13" r="1.5" fill="var(--piece-detail)" stroke="none" />
  </g>`,

  R: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 11,38 L 33,38 L 31,33 L 13,33 Z" fill="var(--piece-stroke)" />
    <rect x="14" y="19" width="16" height="14" fill="var(--piece-fill)" />
    <path d="M 12,19 L 12,11 L 16,11 L 16,15 L 20,15 L 20,11 L 24,11 L 24,15 L 28,15 L 28,11 L 32,11 L 32,19 Z" fill="var(--piece-fill)" />
    <line x1="14" y1="19" x2="30" y2="19" stroke="var(--piece-detail)" stroke-width="1.5" />
    <line x1="22" y1="22" x2="22" y2="30" stroke="var(--piece-detail)" stroke-width="1.5" />
  </g>`,

  N: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 11,38 L 33,38 L 31,33 L 13,33 Z" fill="var(--piece-stroke)" />
    <path d="M 30,33 C 30,25 28,19 23,17 C 26,14 26,9 22,6 C 18,3 15,6 12,9 C 10,12 8,16 8,20 C 8,24 10,25 12,25 C 15,25 16,21 19,21 C 21,21 20,25 19,27 C 17,29 13,30 13,33 Z" fill="var(--piece-fill)" />
    <path d="M 14,14 C 17,17 21,18 23,17" stroke="var(--piece-detail)" stroke-width="2" />
    <circle cx="14" cy="18" r="1.5" fill="var(--piece-detail)" stroke="none" />
  </g>`,

  B: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 11,38 L 33,38 L 31,33 L 13,33 Z" fill="var(--piece-stroke)" />
    <path d="M 14,33 C 12,23 16,14 22,12 C 28,14 32,23 30,33 Z" fill="var(--piece-fill)" />
    <circle cx="22" cy="7" r="2" fill="var(--piece-fill)" stroke="var(--piece-stroke)" stroke-width="1.5" />
    <path d="M 18,19 C 20,23 24,23 26,19" stroke="var(--piece-detail)" stroke-width="2" />
    <path d="M 17,15 L 27,25" stroke="var(--piece-detail)" stroke-width="1.5" />
  </g>`,

  Q: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 11,38 L 33,38 L 31,33 L 13,33 Z" fill="var(--piece-stroke)" />
    <path d="M 13,33 L 9,19 L 16,24 L 22,12 L 28,24 L 35,19 L 31,33 Z" fill="var(--piece-fill)" />
    <circle cx="9" cy="19" r="2" fill="var(--piece-detail)" stroke="none" />
    <circle cx="22" cy="12" r="2" fill="var(--piece-detail)" stroke="none" />
    <circle cx="35" cy="19" r="2" fill="var(--piece-detail)" stroke="none" />
    <circle cx="22" cy="23" r="3.5" fill="var(--piece-detail)" stroke="none" />
  </g>`,

  K: `<g fill="none" stroke="var(--piece-stroke)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
    <path d="M 11,38 L 33,38 L 31,33 L 13,33 Z" fill="var(--piece-stroke)" />
    <path d="M 13,33 L 9,20 L 17,23 L 22,14 L 27,23 L 35,20 L 31,33 Z" fill="var(--piece-fill)" />
    <path d="M 22,14 L 22,6 M 18,9 L 26,9" stroke="var(--piece-stroke)" stroke-width="2" />
    <line x1="14" y1="29" x2="30" y2="29" stroke="var(--piece-detail)" stroke-width="1.5" />
    <line x1="17" y1="25" x2="27" y2="25" stroke="var(--piece-detail)" stroke-width="1.5" />
  </g>`
};

const ALPHA = {
  viewBox: "0 0 2048 2048",
  P: `<path fill="var(--alpha-fill)" d="m734 981 196-193s-189-82-79-288c79-149 303-114 361 50 63 179-113 240-113 240l226 197Zm-235 799s-8-107 50-154c196-173 338-386 371-599l210 2c33 206 182 447 321 561 101 59 99 199 99 199z"/><path fill="var(--alpha-stroke)" d="M520 1769h1008q8-97-132-182-132-101-196-239t-80-309H928q-15 170-79 309t-197 239q-141 85-132 182m504 74H446v-74q-4-80 42-137t125-108q117-91 172-217t78-268H576l284-239q-86-74-86-188 0-103 73-177t177-74q103 0 177 74t73 177q0 114-86 188l284 239h-287q23 141 78 268t172 217q79 51 125 108t42 137v74zM756 974h536l-225-191q134-31 134-171 0-76-52-126t-125-51q-73 0-125 51t-52 126q0 140 134 171z"/>`,
  
  R: `<path fill="var(--alpha-fill)" d="m435 1804 16-212 152-115 51-688-148-115-7-276 210-2 4 138 198 2 7-140 212-3 14 145 193-4 5-138h204l-7 285-145 106 42 693 172 124 19 207z"/><path fill="var(--alpha-stroke)" d="M1024 1501H643l5-74h752l5 74zm0-661H692l5-74h654l5 74zm0 1003H383l29-264 159-118 50-659-149-107-17-341h289v147h137V354h286v147h137V354h289l-17 341-149 107 50 659 159 118 29 264zm0-74h557l-15-149-161-119-54-735 152-109 13-230h-138v148h-285V427H955v148H670V427H532l13 230 152 109-54 735-161 119-15 149z"/>`,
  
  N: `<path fill="var(--alpha-fill)" d="m352 861 787-569 94 148s336 103 398 388c63 286 51 974 51 974l-1088 9s-37-290 184-460c221-171 221-212 221-212s-226-71-295-16-117 138-117 138l-129-67 74-85-88-97-94 56z"/><path fill="var(--alpha-stroke)" d="m1151 178-115 154c-74 50-147 98-220 144-73 45-112 81-116 107L304 846l12 297 122-86 51 50-115 82 217 121 56-102c37-68 135-88 292-60l-55 85c-25 37-63 60-115 71a608 608 0 0 0-183 238c-32 82-45 182-39 301h1242c-23-55-42-118-57-190-15-73-17-152-5-237 29-239 13-440-47-603-61-164-205-303-433-418zm-17 145 59 133a664 664 0 0 1 262 188c55 72 100 150 134 234 27 97 40 181 41 253 0 71-3 140-9 205-7 65-11 131-13 199-2 67 9 145 32 234H621c-4-84 12-158 48-223s85-124 146-177c78-22 129-56 152-102s53-90 90-131c13-10 27-15 38-15 10-1 21 0 33-2 52-7 95-36 129-85 33-49 51-104 52-165l-19-67c-37 159-99 245-188 257l-45 6c-16 1-33 10-52 26-41-25-87-35-138-31q-111 9-165 27l-108 73-39 45-47-28 78-65-138-144-64 41-4-125 366-241c15-34 58-74 131-120l208-131zM960 564c-6 0-12 2-18 7L826 671l212 2c23 0 17-21-16-63-24-31-44-46-62-46M502 868l-33 4-33 56 57 26 46-55z"/>`,
  
  B: `<path fill="var(--alpha-fill)" d="m948 366 1-139 148-7 1 147zM564 860c114-267 456-443 456-443s392 176 476 502c-9 209-183 332-183 332l27 221-653 6 46-233s-230-171-169-385m-101 790c175 6 355 23 425-142h92s0 190-88 246c-163 103-625 38-625 38s-15-146 196-142m631 37-36-185 102 5s22 153 315 131c381-17 318 153 318 153l-483 5z"/><path fill="var(--alpha-stroke)" d="M1024 356q66 0 64-66 1-55-64-55-66 0-64 55-3 66 64 66m0 1204q0 114-101 199t-223 84H205q0-117 65-179t142-62h250q51 0 88-7t71-60l10-16h76q-7 21-3 13-45 105-109 125t-146 19H409q-52 0-86 40t-34 53h424q66 0 159-65t93-185H624q67-116 72-229-114-119-162-223t-6-224q33-96 118-189t312-247q-17-11-46-36t-29-79q0-58 41-96t100-38q58 0 100 38t41 96q0 54-29 79t-46 36q226 153 311 247t119 189q42 119-6 224t-162 223q4 113 72 229h-341q0 120 93 185t159 65h424q0-13-34-53t-86-40h-240q-83 0-146-19t-109-125q4 8-3-13h76l10 16q33 53 70 60t89 7h250q76 0 142 62t65 179h-495q-123 0-223-84t-101-199m0-114h283q-28-84-29-154-120-41-254-38-135-3-254 38-2 70-29 154zm0-267q159-1 285 42 189-180 142-346-60-193-427-431-368 238-427 431-48 166 142 346 125-43 285-42m-47-361V714h94v104h95v89h-95v165h-94V907h-95v-89z"/>`,
  
  Q: `<path fill="var(--alpha-fill)" d="m508.5 1815.6 48.4-356.7-216.3-554.6-135.8-20.7-16.1-126.5 112.7-43.8 78.3 73.7-18.4 99 246.2 197.8 112.8-568.3L635 428l78.3-108 112.8 43.7-23 161 223.2 474 244-490-66.8-105.9 92-92 105.9 73.6L1337 534l103.5 529.2 260-161-16-142.7 131-46 57.6 131.1-207 103.6-175 529.2 48.4 308.4z"/><path fill="var(--alpha-stroke)" d="M1024 1769h478q-53-130-43-280-100-39-213-67.5t-222-28.5q-110 0-223 28.5T589 1489q9 150-43 280zm0-450q111 0 223.5 26.5T1468 1413q17-105 60.5-212.5T1634 988l-220 155-123-601-267 555-267-555-123 601-220-155q61 105 104.5 212.5T580 1413q108-41 220.5-67.5T1024 1319m0 524H441q114-231 57.5-456.5T296 937q-12 2-19 2-54 0-92.5-38.5T146 808t38.5-92.5T277 677t92.5 38.5T408 808q0 20-6 38-4 14-15 33l196 139 100-486q-64-31-72-103-5-44 29-91t88-53q54-5 96 29t48 88q7 68-46 114l198 412 198-412q-54-46-46-114 6-54 48-88t96-29q54 6 87.5 53t29.5 91q-9 72-72 103l100 486 196-139q-12-19-15-33-6-18-6-38 0-54 38.5-92.5T1771 677t92.5 38.5T1902 808t-38.5 92.5T1771 939q-7 0-19-2-147 224-203 449.5t58 456.5zM276 746q-62 0-62 62t62 62q63 0 63-62t-63-62m466-394q-62 0-62 62t62 62 62-62-62-62M590 1519l119 72-134 86q19-86 15-158m1182-773q-63 0-63 62t63 62q62 0 62-62t-62-62m-466-394q-62 0-62 62t62 62 62-62-62-62m152 1167-119 72 134 86q-20-86-15-158m-573 47 139-83 139 86-139 84z"/>`,
  
  K: `<path fill="var(--alpha-fill)" d="m501.6 1811 48.4-354.4-260-269.2s-166.4-288.2 29.9-481C582.2 448.7 826 727.2 826 727.2l195.6-165.7 184 165.7s216.4-232.5 430.4-76 255.4 317.6 117.4 531.6c-138.1 214-250.9 280.7-250.9 280.7L1558 1811z"/><path fill="var(--alpha-stroke)" d="M977 298v-95h94v95h107v95h-107v153q-48-16-94 0V393H870v-95zm47 314q-47 0-136 121-31-36-50-55 93-140 186-140 92 0 186 140-20 19-50 55-90-121-136-121m-447 907-26 156 145-84zm410-206q-1-147-36.5-274.5T870 845q-45-88-131.5-153T570 627q-103 0-208 93T257 949q0 109 86.5 236T546 1408q212-88 441-95m37 530H448l61-365q-325-280-326-535-1-159 125-274.5T575 553q78 0 158.5 47T876 719q61 74 98.5 164.5T1024 1034q12-60 49-150.5t99-164.5q61-72 142-119t159-47q140 0 266 115.5T1865 943q-2 255-326 535l61 365zm0-74h489l-50-298q-216-84-439-84t-439 84l-50 298zm447-250 26 156-145-84zm-410-206q229 7 441 95 115-96 202-223t87-236q0-136-105.5-229T1478 627q-83 0-169.5 65T1178 845q-46 66-81.5 193.5T1061 1313m-176 233 141-84 137 86-141 84z"/>`
};

export const PIECE_THEMES = {
  classic: CLASSIC,
  cyber: CYBER,
  metallic: METALLIC,
  neo: NEO,
  alpha: ALPHA
};
