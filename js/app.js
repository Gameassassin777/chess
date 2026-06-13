// Main Frontend Application Orchestrator for Chess Variants
import { ChessLogic } from "./chess_logic.js";
import { PIECE_THEMES } from "./pieces_svg.js";

const HTTP_BASE = "https://lakehouse-chess-sync.gameassassin777.workers.dev";
const WS_BASE = "wss://lakehouse-chess-sync.gameassassin777.workers.dev";

class ChessApp {
  constructor() {
    this.roomCode = null;
    this.role = "player"; // 'player' or 'spectator'
    this.playerIndex = -1; // 0-3, or -1 for spectator
    this.username = localStorage.getItem("chess_username") || "ChessFan";
    this.variant = "standard";
    this.mode = "ffa"; // 'ffa' or 'teams' (relevant for 4player)
    
    this.clients = []; // { name, role, index }
    this.game = null;
    this.socket = null;
    
    // UI selections
    this.selectedCell = null; // { row, col }
    this.selectedReservePiece = null; // type e.g. 'p', 'n'
    this.legalMoves = [];
    this.lastMoveSquares = []; // [{row, col}, {row, col}]

    // Co-play move suggestion states
    this.activeSuggestion = null;
    this.partnerSuggestion = null;

    // Bughouse specific board IDs mapping
    this.myBoardId = "board1";
    this.partnerBoardId = "board2";
    this.bughouseActiveBoard = "board1"; // currently viewed board

    // Theme selections
    this.boardTheme = localStorage.getItem("chess_board_theme") || "emerald";
    this.piecesTheme = localStorage.getItem("chess_pieces_theme") || "classic";

    // Timer settings
    this.timeLimitMinutes = parseInt(localStorage.getItem("chess_time_limit") || "5"); // 0 for untimed
    this.timeIncrementSeconds = parseInt(localStorage.getItem("chess_time_increment") || "0");
    this.clocks = {}; // clock values mapped by: colors for Standard/4P, indices 0-3 for Bughouse
    this.clockInterval = null;
    this.lastClockTick = null;

    // Open Rooms Cache
    this.publicLobbies = [];
    
    this.init();
  }

  init() {
    // Read App Theme
    this.appTheme = localStorage.getItem("chess_app_theme") || "light"; // Default to light mode

    // Inject global stylesheet selectors for themes and modes
    document.body.className = `theme-${this.boardTheme} pieces-${this.piecesTheme} mode-${this.appTheme}`;

    // Build and append the customization drawer to the body once
    document.body.appendChild(this.buildCustomizerDrawer());

    // Read room code from URL hash if present on load
    const hash = window.location.hash.replace("#", "").trim().toUpperCase();
    if (hash.length === 4) {
      this.role = "player";
      this.joinRoom(hash);
    } else {
      // Clear initial loader and load screen
      this.renderScreen("home");
    }

    // Hash change event listener to join rooms directly
    window.addEventListener("hashchange", () => {
      const code = window.location.hash.replace("#", "").trim().toUpperCase();
      if (code.length === 4 && code !== this.roomCode) {
        this.role = "player";
        this.joinRoom(code);
      }
    });
    
    // Periodic heartbeat to keep public list accurate if hosting
    setInterval(() => this.sendHeartbeat(), 8000);

    // Auto-reconnect if page refreshed in active game (using robust localStorage)
    const cachedCode = localStorage.getItem("active_room_code");
    const cachedName = localStorage.getItem("active_room_name");
    const cachedRole = localStorage.getItem("active_room_role");
    if (cachedCode && cachedName) {
      this.username = cachedName;
      this.role = cachedRole || "player";
      this.joinRoom(cachedCode);
    }

    // Register Service Worker and initialize update checking
    this.registerServiceWorker();
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
          .then((registration) => {
            console.log('ServiceWorker registered with scope:', registration.scope);
            
            // Check for updates on register
            this.checkForUpdates();
            
            // Setup visibility check to aggressively look for updates when app is opened/restored
            document.addEventListener('visibilitychange', () => {
              if (document.visibilityState === 'visible') {
                console.log('App visibility change: checking for updates...');
                this.checkForUpdates();
                registration.update().catch(err => console.warn('SW Update error:', err));
              }
            });

            // Also check for updates when window receives focus
            window.addEventListener('focus', () => {
              console.log('App focus: checking for updates...');
              this.checkForUpdates();
              registration.update().catch(err => console.warn('SW Update error:', err));
            });
            
            // Periodic check every 60 seconds
            setInterval(() => {
              this.checkForUpdates();
              registration.update().catch(err => console.warn('SW Update error:', err));
            }, 60000);
          })
          .catch((err) => {
            console.error('ServiceWorker registration failed:', err);
          });
      });
      
      // If controller changes, another Service Worker took over. Force reload!
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          console.log('ServiceWorker controller changed. Reloading...');
          window.location.reload();
        }
      });
    }
  }

  async checkForUpdates() {
    try {
      // Fetch version.json from GitHub Pages or current server, force bypass browser cache
      const response = await fetch('./version.json?t=' + Date.now(), { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      
      const currentVersion = localStorage.getItem("app_version");
      
      if (currentVersion && currentVersion !== data.version) {
        console.log(`New version found: ${data.version} (current: ${currentVersion})`);
        this.forceImmediateUpdate(data.version);
      } else if (!currentVersion) {
        // Initialize version tracking
        localStorage.setItem("app_version", data.version);
      }
    } catch (err) {
      console.warn("Failed to check for updates from GitHub:", err);
    }
  }

  async forceImmediateUpdate(newVersion) {
    this.showToast("Updating app to the latest version...");
    
    try {
      // Clear Cache Storage
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Unregister Service Workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }
      
      // Update saved version in localStorage
      localStorage.setItem("app_version", newVersion);
      
      // Force reload page from server bypassing browser cache
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Error during force update:", err);
      // Fallback reload
      window.location.reload();
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SCREEN ROUTER & RENDERERS
  // ──────────────────────────────────────────────────────────────────────────

  renderScreen(screen) {
    this.activeScreen = screen;
    const container = document.getElementById("app");
    container.innerHTML = "";

    if (screen === "game") {
      document.body.classList.add("game-active");
    } else {
      document.body.classList.remove("game-active");
    }

    if (screen === "home") {
      container.appendChild(this.buildHomeScreen());
    } else if (screen === "lobby") {
      container.appendChild(this.buildLobbyScreen());
    } else if (screen === "game") {
      container.appendChild(this.buildGameScreen());
    }
  }

  buildHomeScreen() {
    const root = document.createElement("div");
    root.className = "home-container fade-in";

    // Append floating settings button
    root.appendChild(this.buildFloatingSettingsButton());

    const brand = document.createElement("div");
    brand.className = "brand-section";
    brand.innerHTML = `<h1>NEXUS CHESS</h1><p>MULTIPLAYER CHESS VARIANTS</p>`;
    root.appendChild(brand);

    // Username Box
    const userBox = document.createElement("div");
    userBox.className = "glass-panel";
    userBox.style.padding = "20px";
    userBox.style.width = "100%";
    userBox.style.maxWidth = "420px";
    userBox.style.display = "flex";
    userBox.style.flexDirection = "column";
    userBox.style.gap = "8px";

    const userLabel = document.createElement("label");
    userLabel.className = "settings-label";
    userLabel.textContent = "Your Display Name";
    userBox.appendChild(userLabel);

    const userInput = document.createElement("input");
    userInput.type = "text";
    userInput.className = "input-premium";
    userInput.value = this.username;
    userInput.maxLength = 14;
    userInput.addEventListener("input", (e) => {
      this.username = e.target.value.trim() || "ChessFan";
      localStorage.setItem("chess_username", this.username);
    });
    userBox.appendChild(userInput);
    root.appendChild(userBox);

    // Variant selector
    const selector = document.createElement("div");
    selector.className = "variant-selector";

    const variants = [
      { id: "standard", title: "Regular Chess", desc: "Classic 8x8 chessboard. Compete in a traditional two-player matchup." },
      { id: "bughouse", title: "Bughouse Chess", desc: "2 boards, 4 players in teams. Captured pieces are passed to your partner's reserve for drops." },
      { id: "4player", title: "4-Player Chess", desc: "160-square cross-shaped board. Play Free-for-All or cooperatively in Teams." }
    ];

    variants.forEach(v => {
      const card = document.createElement("div");
      card.className = `glass-panel variant-card ${this.variant === v.id ? "selected" : ""}`;
      card.innerHTML = `
        <div class="variant-header">
          <div class="variant-title">${v.title}</div>
        </div>
        <div class="variant-desc">${v.desc}</div>
      `;
      card.addEventListener("click", () => {
        this.variant = v.id;
        document.querySelectorAll(".variant-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
      });
      selector.appendChild(card);
    });
    root.appendChild(selector);

    // Mode Option for 4-Player
    const modeBox = document.createElement("div");
    modeBox.className = "glass-panel";
    modeBox.style.padding = "16px";
    modeBox.style.width = "100%";
    modeBox.style.maxWidth = "420px";
    modeBox.style.display = this.variant === "4player" ? "flex" : "none";
    modeBox.style.flexDirection = "column";
    modeBox.style.gap = "8px";

    const modeLabel = document.createElement("label");
    modeLabel.className = "settings-label";
    modeLabel.textContent = "4-Player Mode";
    modeBox.appendChild(modeLabel);

    const modeSelect = document.createElement("select");
    modeSelect.className = "select-premium";
    modeSelect.innerHTML = `
      <option value="ffa">Free-For-All (Solo Points)</option>
      <option value="teams">Teams (Red/Yellow vs Blue/Green)</option>
    `;
    modeSelect.value = this.mode;
    modeSelect.addEventListener("change", (e) => {
      this.mode = e.target.value;
    });
    modeBox.appendChild(modeSelect);
    root.appendChild(modeBox);

    // Listen to variant changes to toggle mode box
    selector.addEventListener("click", () => {
      modeBox.style.display = this.variant === "4player" ? "flex" : "none";
    });

    // Action buttons
    const btnBox = document.createElement("div");
    btnBox.className = "action-buttons";

    const createBtn = document.createElement("button");
    createBtn.className = "btn-premium btn-primary";
    createBtn.textContent = "Create Lobby";
    createBtn.addEventListener("click", () => this.createRoom());
    btnBox.appendChild(createBtn);

    const browseBtn = document.createElement("button");
    browseBtn.className = "btn-premium btn-secondary lobby-browser-btn";
    browseBtn.textContent = "Join Public Room";
    browseBtn.addEventListener("click", () => this.openLobbyBrowser());
    btnBox.appendChild(browseBtn);

    root.appendChild(btnBox);
    return root;
  }

  buildLobbyScreen() {
    const root = document.createElement("div");
    root.className = "lobby-container fade-in";

    // Append floating settings button
    root.appendChild(this.buildFloatingSettingsButton());

    const header = document.createElement("div");
    header.className = "lobby-headline";
    
    const info = document.createElement("div");
    info.innerHTML = `<h2>Game Lobby</h2><p style="color: var(--text-muted); text-transform: uppercase; font-size: 0.8rem; font-weight: 600;">${this.variant} chess (${this.mode})</p>`;
    header.appendChild(info);

    const codeBox = document.createElement("div");
    codeBox.className = "lobby-code-box";
    codeBox.innerHTML = `<span class="lobby-code-label">Room Code</span><span class="lobby-code-value">${this.roomCode}</span>`;
    codeBox.style.cursor = "pointer";
    codeBox.addEventListener("click", () => {
      navigator.clipboard.writeText(this.roomCode);
      this.showToast("Room code copied to clipboard!");
    });
    header.appendChild(codeBox);
    root.appendChild(header);

    const panels = document.createElement("div");
    panels.className = "lobby-panels";

    // Panel 1: Player List
    const playerPanel = document.createElement("div");
    playerPanel.className = "glass-panel";
    playerPanel.style.padding = "20px";
    playerPanel.innerHTML = `<div class="panel-header">Players & Spectators</div>`;

    const playerList = document.createElement("div");
    playerList.className = "lobby-players-list";

    // Max players limit check
    const maxPlayers = (this.variant === "standard") ? 2 : 4;
    
    for (let i = 0; i < maxPlayers; i++) {
      const slotPlayers = this.clients.filter(c => c.role === "player" && c.index === i);
      const slotName = this.variant === "4player" 
        ? this.get4PlayerColorName(i) 
        : (this.variant === "bughouse" ? this.getBughouseColorName(i) : (i === 0 ? "White" : "Black"));
      
      const row = document.createElement("div");
      row.className = "lobby-player-row";

      const identity = document.createElement("div");
      identity.className = "player-identity";
      identity.style.display = "flex";
      identity.style.alignItems = "center";
      identity.style.gap = "8px";

      const dot = document.createElement("span");
      dot.className = `player-index-indicator player-index-${this.variant === "4player" ? this.get4PlayerColorName(i) : (this.variant === "bughouse" ? this.getBughouseColorName(i) : i)}`;
      identity.appendChild(dot);

      const slotLabel = document.createElement("span");
      slotLabel.textContent = slotName.toUpperCase() + ": ";
      slotLabel.style.color = "var(--text-muted)";
      slotLabel.style.fontSize = "0.8rem";
      slotLabel.style.fontWeight = "800";
      identity.appendChild(slotLabel);

      if (slotPlayers.length === 0) {
        const text = document.createElement("span");
        text.textContent = "Empty";
        text.style.fontStyle = "italic";
        text.style.color = "var(--text-muted)";
        identity.appendChild(text);
        row.appendChild(identity);

        if (this.playerIndex !== i) {
          const btn = document.createElement("button");
          btn.className = "btn-premium btn-secondary btn-sm";
          btn.textContent = "Claim";
          btn.addEventListener("click", () => this.sendClaimSlot(i));
          row.appendChild(btn);
        }
      } else {
        const namesContainer = document.createElement("div");
        namesContainer.style.display = "flex";
        namesContainer.style.flexDirection = "column";
        namesContainer.style.gap = "2px";
        
        slotPlayers.forEach((p, pIdx) => {
          const nameSpan = document.createElement("span");
          nameSpan.textContent = p.name + (p.name === this.username ? " (You)" : "") + (pIdx > 0 ? " [Partner]" : "");
          nameSpan.style.fontWeight = "600";
          namesContainer.appendChild(nameSpan);
        });
        identity.appendChild(namesContainer);
        row.appendChild(identity);

        const isAlreadyInThisSlot = slotPlayers.some(p => p.name === this.username);
        if (slotPlayers.length === 1 && !isAlreadyInThisSlot) {
          const btn = document.createElement("button");
          btn.className = "btn-premium btn-primary btn-sm";
          btn.textContent = "+ Co-Play";
          btn.addEventListener("click", () => this.sendClaimSlot(i));
          row.appendChild(btn);
        }
      }
      playerList.appendChild(row);
    }

    playerPanel.appendChild(playerList);

    const spectators = this.clients.filter(c => c.role === "spectator");
    if (spectators.length > 0) {
      const specHeader = document.createElement("div");
      specHeader.className = "panel-header";
      specHeader.style.marginTop = "16px";
      specHeader.textContent = "Spectators";
      playerPanel.appendChild(specHeader);

      const specList = document.createElement("div");
      specList.style.display = "flex";
      specList.style.flexWrap = "wrap";
      specList.style.gap = "8px";
      specList.style.padding = "10px 0";

      spectators.forEach(s => {
        const span = document.createElement("span");
        span.className = "player-role-badge role-spectator";
        span.textContent = s.name + (s.name === this.username ? " (You)" : "");
        specList.appendChild(span);
      });
      playerPanel.appendChild(specList);
    }

    panels.appendChild(playerPanel);

    // Panel 2: Lobby Host Settings
    const settingsPanel = document.createElement("div");
    settingsPanel.className = "glass-panel";
    settingsPanel.style.padding = "20px";
    settingsPanel.innerHTML = `<div class="panel-header">Lobby Settings</div>`;

    const isHost = this.playerIndex === 0; // index 0 is the creator/host

    const form = document.createElement("div");
    form.className = "lobby-settings-form";

    // Timer Selector
    const timerGroup = document.createElement("div");
    timerGroup.className = "settings-group";
    timerGroup.innerHTML = `<label class="settings-label">Time Control</label>`;

    const timeSelect = document.createElement("select");
    timeSelect.className = "select-premium";
    timeSelect.disabled = !isHost;
    timeSelect.innerHTML = `
      <option value="1">1 Minute (Bullet)</option>
      <option value="3">3 Minutes (Blitz)</option>
      <option value="5">5 Minutes (Blitz)</option>
      <option value="10">10 Minutes (Rapid)</option>
      <option value="custom">Custom Timer...</option>
      <option value="0">Unlimited (No Timer)</option>
    `;
    timeSelect.value = this.timeLimitMinutes === 0 ? "0" : (["1","3","5","10"].includes(String(this.timeLimitMinutes)) ? String(this.timeLimitMinutes) : "custom");
    
    const customTimeBox = document.createElement("div");
    customTimeBox.className = "custom-time-inputs";
    customTimeBox.style.display = timeSelect.value === "custom" ? "grid" : "none";

    const customMin = document.createElement("input");
    customMin.type = "number";
    customMin.className = "input-premium";
    customMin.placeholder = "Minutes";
    customMin.value = this.timeLimitMinutes;
    customMin.disabled = !isHost;

    const customInc = document.createElement("input");
    customInc.type = "number";
    customInc.className = "input-premium";
    customInc.placeholder = "Increment (s)";
    customInc.value = this.timeIncrementSeconds;
    customInc.disabled = !isHost;

    customTimeBox.appendChild(customMin);
    customTimeBox.appendChild(customInc);

    timeSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "custom") {
        customTimeBox.style.display = "grid";
      } else {
        customTimeBox.style.display = "none";
        this.timeLimitMinutes = parseInt(val);
        this.timeIncrementSeconds = 0;
        this.syncLobbySettings();
      }
    });

    customMin.addEventListener("input", (e) => {
      this.timeLimitMinutes = Math.max(1, parseInt(e.target.value) || 1);
      this.syncLobbySettings();
    });
    customInc.addEventListener("input", (e) => {
      this.timeIncrementSeconds = Math.max(0, parseInt(e.target.value) || 0);
      this.syncLobbySettings();
    });

    timerGroup.appendChild(timeSelect);
    timerGroup.appendChild(customTimeBox);
    form.appendChild(timerGroup);
    settingsPanel.appendChild(form);
    panels.appendChild(settingsPanel);

    root.appendChild(panels);

    // Footer actions
    const footer = document.createElement("div");
    footer.className = "lobby-actions-footer";

    // Determine if all slots have at least one player to enable start
    let allSlotsFilled = true;
    for (let i = 0; i < maxPlayers; i++) {
      const occupants = this.clients.filter(c => c.role === "player" && c.index === i).length;
      if (occupants === 0) allSlotsFilled = false;
    }

    if (isHost) {
      const startBtn = document.createElement("button");
      startBtn.className = "btn-premium btn-primary";
      startBtn.textContent = `Start Game`;
      startBtn.disabled = !allSlotsFilled;
      startBtn.addEventListener("click", () => this.sendStartGame());
      footer.appendChild(startBtn);
    } else {
      const waitMsg = document.createElement("div");
      waitMsg.style.textAlign = "center";
      waitMsg.style.color = "var(--text-muted)";
      waitMsg.style.fontSize = "0.9rem";
      waitMsg.style.padding = "10px";
      waitMsg.textContent = allSlotsFilled 
        ? "Waiting for Host to press Start Game..." 
        : `Waiting for all slots to be filled...`;
      footer.appendChild(waitMsg);
    }

    if (this.role === "player") {
      const specBtn = document.createElement("button");
      specBtn.className = "btn-premium btn-secondary";
      specBtn.textContent = "Become Spectator";
      specBtn.addEventListener("click", () => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type: "claim_spectator" }));
        }
      });
      footer.appendChild(specBtn);
    }

    const leaveBtn = document.createElement("button");
    leaveBtn.className = "btn-premium btn-secondary";
    leaveBtn.textContent = "Leave Lobby";
    leaveBtn.addEventListener("click", () => this.leaveRoom());
    footer.appendChild(leaveBtn);

    root.appendChild(footer);
    return root;
  }

  buildGameScreen() {
    const root = document.createElement("div");
    root.className = "game-container fade-in";

    // 1. Header Bar
    const header = document.createElement("div");
    header.className = "game-header";

    const turnColor = this.game.getTurnColor(this.variant === "bughouse" ? this.bughouseActiveBoard : "board");
    const turnName = this.getPlayerNameByColor(turnColor, this.variant === "bughouse" ? this.bughouseActiveBoard : "board");
    const isMe = this.isMyTurn(this.variant === "bughouse" ? this.bughouseActiveBoard : "board");
    const statusText = isMe ? "YOUR TURN" : `${turnName}'s Turn`;

    const info = document.createElement("div");
    info.className = "game-title-info";
    info.innerHTML = `
      <span class="game-variant-badge">${this.variant} chess — Room ${this.roomCode}</span>
      <span class="game-status-label ${isMe ? 'my-turn' : ''}">${statusText}</span>
    `;
    header.appendChild(info);

    const actions = document.createElement("div");
    actions.className = "game-actions-header";

    // Settings
    const settingsBtn = document.createElement("button");
    settingsBtn.className = "btn-premium btn-secondary btn-sm";
    settingsBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 4px;">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>Settings
    `;
    settingsBtn.addEventListener("click", () => this.toggleCustomizer(true));
    actions.appendChild(settingsBtn);

    // Exit
    const exitBtn = document.createElement("button");
    exitBtn.className = "btn-premium btn-secondary btn-sm";
    exitBtn.textContent = "Exit";
    exitBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to leave the game?")) {
        this.leaveRoom();
      }
    });
    actions.appendChild(exitBtn);
    header.appendChild(actions);
    root.appendChild(header);

    // 2. Active Game workspace
    const workspace = document.createElement("div");
    workspace.className = "game-workspace";

    // Opponent Player Tag (Standard Chess)
    if (this.variant === "standard") {
      const oppIndex = this.playerIndex === 0 ? 1 : 0;
      const oppClient = this.clients.find(c => c.index === oppIndex && c.role === "player");
      const oppName = oppClient ? oppClient.name : "Opponent";
      const oppColor = oppIndex === 0 ? "white" : "black";

      const oppTag = document.createElement("div");
      oppTag.className = `player-tag ${turnColor === oppColor ? "active" : ""}`;
      oppTag.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:4px;">
          <div class="player-info">
            <span class="player-index-indicator player-index-${oppIndex}"></span>
            <span>${oppName}</span>
          </div>
          ${this.renderCapturedPiecesList(oppColor)}
        </div>
        <div class="player-timer" id="timer-${oppColor}">00:00</div>
      `;
      workspace.appendChild(oppTag);
    }

    // 4-Player Info Panel (Upper Opponents tags)
    if (this.variant === "4player") {
      const tagsBox = document.createElement("div");
      tagsBox.style.width = "100%";
      tagsBox.style.maxWidth = "500px";
      tagsBox.style.display = "grid";
      tagsBox.style.gridTemplateColumns = "1fr 1fr";
      tagsBox.style.gap = "6px";
      tagsBox.style.marginBottom = "6px";

      const myColor = this.get4PlayerColorName(this.playerIndex);
      this.game.players.forEach(col => {
        if (col === myColor && this.playerIndex !== -1) return;
        const client = this.clients.find(c => c.role === "player" && this.get4PlayerColorName(c.index) === col);
        const name = client ? client.name : `Player ${col}`;

        const tag = document.createElement("div");
        tag.className = `player-tag ${turnColor === col ? "active" : ""}`;
        tag.style.margin = "0";
        tag.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:4px;">
            <div class="player-info" style="font-size: 0.8rem;">
              <span class="player-index-indicator player-index-${col}"></span>
              <span>${name}</span>
            </div>
            ${this.renderCapturedPiecesList(col)}
          </div>
          <div class="player-timer" id="timer-${col}" style="font-size:0.85rem; padding: 2px 6px;">00:00</div>
        `;
        tagsBox.appendChild(tag);
      });
      workspace.appendChild(tagsBox);
    }

    // Bughouse Clocks and Partner Panels
    if (this.variant === "bughouse") {
      const activeBoard = this.bughouseActiveBoard;
      const boardTurnColor = this.game.getTurnColor(activeBoard);
      
      const clocksBox = document.createElement("div");
      clocksBox.style.width = "100%";
      clocksBox.style.maxWidth = "440px";
      clocksBox.style.display = "grid";
      clocksBox.style.gridTemplateColumns = "1fr 1fr";
      clocksBox.style.gap = "6px";
      clocksBox.style.marginBottom = "6px";

      // Render players of the active board
      if (activeBoard === "board1") {
        // Players 0 (White) and 1 (Black)
        const p0Client = this.clients.find(c => c.role === "player" && c.index === 0);
        const p1Client = this.clients.find(c => c.role === "player" && c.index === 1);
        const p0Name = p0Client ? p0Client.name : "White";
        const p1Name = p1Client ? p1Client.name : "Black";

        const tag0 = document.createElement("div");
        tag0.className = `player-tag ${boardTurnColor === "white" ? "active" : ""}`;
        tag0.style.margin = "0";
        tag0.innerHTML = `
          <div class="player-info" style="font-size:0.8rem;">
            <span class="player-index-indicator player-index-white"></span>
            <span>${p0Name}</span>
          </div>
          <div class="player-timer" id="timer-0" style="font-size:0.85rem; padding:2px 6px;">00:00</div>
        `;
        clocksBox.appendChild(tag0);

        const tag1 = document.createElement("div");
        tag1.className = `player-tag ${boardTurnColor === "black" ? "active" : ""}`;
        tag1.style.margin = "0";
        tag1.innerHTML = `
          <div class="player-info" style="font-size:0.8rem;">
            <span class="player-index-indicator player-index-black"></span>
            <span>${p1Name}</span>
          </div>
          <div class="player-timer" id="timer-1" style="font-size:0.85rem; padding:2px 6px;">00:00</div>
        `;
        clocksBox.appendChild(tag1);
      } else {
        // Players 2 (Black) and 3 (White)
        const p2Client = this.clients.find(c => c.role === "player" && c.index === 2);
        const p3Client = this.clients.find(c => c.role === "player" && c.index === 3);
        const p2Name = p2Client ? p2Client.name : "Black";
        const p3Name = p3Client ? p3Client.name : "White";

        const tag2 = document.createElement("div");
        tag2.className = `player-tag ${boardTurnColor === "black" ? "active" : ""}`;
        tag2.style.margin = "0";
        tag2.innerHTML = `
          <div class="player-info" style="font-size:0.8rem;">
            <span class="player-index-indicator player-index-black"></span>
            <span>${p2Name}</span>
          </div>
          <div class="player-timer" id="timer-2" style="font-size:0.85rem; padding:2px 6px;">00:00</div>
        `;
        clocksBox.appendChild(tag2);

        const tag3 = document.createElement("div");
        tag3.className = `player-tag ${boardTurnColor === "white" ? "active" : ""}`;
        tag3.style.margin = "0";
        tag3.innerHTML = `
          <div class="player-info" style="font-size:0.8rem;">
            <span class="player-index-indicator player-index-white"></span>
            <span>${p3Name}</span>
          </div>
          <div class="player-timer" id="timer-3" style="font-size:0.85rem; padding:2px 6px;">00:00</div>
        `;
        clocksBox.appendChild(tag3);
      }
      workspace.appendChild(clocksBox);
    }

    // Bughouse: Reserve Bar of captured pieces available for dropping
    if (this.variant === "bughouse" && this.playerIndex !== -1) {
      const myReserve = this.game.reserves[this.playerIndex];
      const myColor = (this.playerIndex === 0 || this.playerIndex === 3) ? "white" : "black";

      const reserveBar = document.createElement("div");
      reserveBar.className = "reserve-bar";
      reserveBar.innerHTML = `<span style="font-size:0.7rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-right:6px;">Reserve</span>`;
      
      Object.entries(myReserve).forEach(([pType, count]) => {
        if (count > 0) {
          const item = document.createElement("div");
          item.className = `reserve-item ${this.selectedReservePiece === pType ? "selected" : ""}`;
          item.innerHTML = `
            ${this.getPieceVector(pType, myColor)}
            <span class="reserve-count">${count}</span>
          `;
          item.addEventListener("click", () => {
            if (this.isMyTurn(this.myBoardId) && this.bughouseActiveBoard === this.myBoardId) {
              if (this.selectedReservePiece === pType) {
                this.selectedReservePiece = null;
                this.legalMoves = [];
              } else {
                this.selectedReservePiece = pType;
                this.selectedCell = null;
                this.legalMoves = this.game.getValidDrops(pType, this.myBoardId);
              }
              this.refreshGameScreen();
            }
          });
          reserveBar.appendChild(item);
        }
      });
      workspace.appendChild(reserveBar);
    }

    // 3. Chessboard
    const boardWrapper = document.createElement("div");
    boardWrapper.className = `board-wrapper ${this.variant === "4player" ? "board-4player" : ""}`;
    
    if (this.variant === "4player") {
      boardWrapper.appendChild(this.build4PlayerBoardGrid());
    } else {
      const activeArr = this.variant === "bughouse" ? this.bughouseActiveBoard : "board";
      boardWrapper.appendChild(this.build8x8BoardGrid(activeArr));
    }
    workspace.appendChild(boardWrapper);

    // Bughouse Partner Board Preview (Mini-map)
    if (this.variant === "bughouse") {
      const previewBoardId = this.bughouseActiveBoard === "board1" ? "board2" : "board1";
      const partnerPreview = document.createElement("div");
      partnerPreview.className = "partner-board-preview";
      partnerPreview.appendChild(this.build8x8BoardGrid(previewBoardId, true));
      partnerPreview.addEventListener("click", () => {
        // Swap primary view and preview board
        this.bughouseActiveBoard = previewBoardId;
        this.selectedCell = null;
        this.selectedReservePiece = null;
        this.legalMoves = [];
        this.refreshGameScreen();
      });
      workspace.appendChild(partnerPreview);
    }

    // Suggestion Panel (Co-play)
    const sugPanel = this.buildSuggestionPanel();
    if (sugPanel) {
      workspace.appendChild(sugPanel);
    }

    // Self Player Tag (Standard Chess)
    if (this.variant === "standard" && this.playerIndex !== -1) {
      const myColor = this.playerIndex === 0 ? "white" : "black";
      const selfTag = document.createElement("div");
      selfTag.className = `player-tag ${turnColor === myColor ? "active" : ""}`;
      selfTag.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:4px;">
          <div class="player-info">
            <span class="player-index-indicator player-index-${this.playerIndex}"></span>
            <span>${this.username} (You)</span>
          </div>
          ${this.renderCapturedPiecesList(myColor)}
        </div>
        <div class="player-timer" id="timer-${myColor}">00:00</div>
      `;
      workspace.appendChild(selfTag);
    }

    // Self Player Tag (4-Player)
    if (this.variant === "4player" && this.playerIndex !== -1) {
      const myColor = this.get4PlayerColorName(this.playerIndex);
      const selfTag = document.createElement("div");
      selfTag.className = `player-tag ${turnColor === myColor ? "active" : ""}`;
      selfTag.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:4px;">
          <div class="player-info">
            <span class="player-index-indicator player-index-${myColor}"></span>
            <span>${this.username} (You)</span>
          </div>
          ${this.renderCapturedPiecesList(myColor)}
        </div>
        <div class="player-timer" id="timer-${myColor}">00:00</div>
      `;
      workspace.appendChild(selfTag);
    }

    // Spectator counter footer
    const specs = this.clients.filter(c => c.role === "spectator");
    if (specs.length > 0) {
      const specFoot = document.createElement("div");
      specFoot.className = "spectators-row";
      specFoot.innerHTML = `
        <span class="spectator-icon-dot"></span>
        <span>${specs.length} spectator${specs.length > 1 ? "s" : ""} watching</span>
      `;
      workspace.appendChild(specFoot);
    }

    root.appendChild(workspace);

    return root;
  }

  // 8x8 Board Builder
  build8x8BoardGrid(boardId = "board", isMiniMap = false) {
    const grid = document.createElement("div");
    grid.className = "board-grid-8x8";

    const board = this.game.getBoardArray(boardId);
    const activeColor = this.game.getTurnColor(boardId);

    // Determine perspective:
    // Board 1 flipped if PlayerIndex is 1.
    // Board 2 flipped if PlayerIndex is 2.
    let isFlipped = false;
    if (boardId === "board1" && this.playerIndex === 1 && !isMiniMap) isFlipped = true;
    if (boardId === "board2" && this.playerIndex === 2 && !isMiniMap) isFlipped = true;

    for (let r = 0; r < 8; r++) {
      const row = isFlipped ? r : 7 - r;
      for (let c = 0; c < 8; c++) {
        const col = isFlipped ? 7 - c : c;
        const square = board[row][col];
        const isLight = (row + col) % 2 !== 0;

        const cell = document.createElement("div");
        cell.className = `square-cell ${isLight ? "light" : "dark"}`;
        cell.dataset.row = row;
        cell.dataset.col = col;

        if (square) {
          cell.innerHTML = this.getPieceVector(square.type, square.color);
        }

        // Apply highlights
        if (!isMiniMap) {
          // Suggestion highlighting
          const activeS = this.partnerSuggestion || this.activeSuggestion;
          if (activeS && activeS.boardId === boardId) {
            if (activeS.type === "move" && activeS.fromRow === row && activeS.fromCol === col) {
              cell.classList.add("suggested-from");
            }
            if (activeS.toRow === row && activeS.toCol === col) {
              cell.classList.add("suggested-to");
            }
          }

          // Checked King
          if (square && square.type === "k" && this.game.isKingInCheck(square.color, boardId)) {
            cell.classList.add("check-sq");
          }

          // Selected square
          if (this.selectedCell && this.selectedCell.row === row && this.selectedCell.col === col) {
            cell.classList.add("selected-sq");
          }

          // Last move highlighting
          if (this.lastMoveSquares.some(s => s.row === row && s.col === col)) {
            cell.classList.add("last-move-sq");
          }

          // Legal moves indicator
          const isLegal = this.legalMoves.find(m => m.row === row && m.col === col);
          if (isLegal) {
            if (square) {
              const ring = document.createElement("span");
              ring.className = "capture-ring";
              cell.appendChild(ring);
            } else {
              const dot = document.createElement("span");
              dot.className = "move-dot";
              cell.appendChild(dot);
            }

            // Click listener for moving or dropping onto this cell
            cell.style.cursor = "pointer";
            cell.addEventListener("click", () => this.handleCellInteraction(row, col, boardId));
          }
        }

        // Selecting your own piece
        const canIInteract = this.variant === "bughouse" ? (boardId === this.myBoardId) : true;
        if (!isMiniMap && canIInteract && square && square.color === activeColor && this.isMyTurn(boardId)) {
          cell.style.cursor = "pointer";
          cell.addEventListener("click", () => {
            if (this.selectedCell && this.selectedCell.row === row && this.selectedCell.col === col) {
              this.selectedCell = null;
              this.legalMoves = [];
            } else {
              this.selectedCell = { row, col };
              this.selectedReservePiece = null;
              this.legalMoves = this.game.getValidMoves(row, col, boardId);
            }
            this.refreshGameScreen();
          });
        }

        grid.appendChild(cell);
      }
    }
    return grid;
  }

  // 14x14 4-Player Board Builder
  build4PlayerBoardGrid() {
    const grid = document.createElement("div");
    grid.className = "board-grid-14x14";

    const board = this.game.board;
    const activeColor = this.game.getTurnColor("board");

    // Rotation indices: Red (0), Blue (1), Yellow (2), Green (3)
    const rotationIndex = this.playerIndex === -1 ? 0 : this.playerIndex;

    for (let r = 0; r < 14; r++) {
      let row = 13 - r;
      if (rotationIndex === 1) row = r;
      if (rotationIndex === 2) row = r;
      if (rotationIndex === 3) row = 13 - r;

      for (let c = 0; c < 14; c++) {
        let col = c;
        if (rotationIndex === 1) col = 13 - c;
        if (rotationIndex === 2) col = 13 - c;
        if (rotationIndex === 3) col = c;

        // Perform rotation coordinates swap for Blue/Green
        let displayRow = row;
        let displayCol = col;
        if (rotationIndex === 1) { // Blue
          displayRow = c;
          displayCol = r;
        } else if (rotationIndex === 3) { // Green
          displayRow = 13 - c;
          displayCol = 13 - r;
        }

        const square = board[displayRow][displayCol];
        const cell = document.createElement("div");

        if (square && square.type === "out") {
          cell.className = "square-cell out-of-bounds";
        } else {
          const isLight = (displayRow + displayCol) % 2 !== 0;
          cell.className = `square-cell ${isLight ? "light" : "dark"}`;
          cell.dataset.row = displayRow;
          cell.dataset.col = displayCol;

          if (square) {
            cell.innerHTML = this.getPieceVector(square.type, square.color);
          }

          // Suggestion highlighting
          const activeS = this.partnerSuggestion || this.activeSuggestion;
          if (activeS && activeS.boardId === "board") {
            if (activeS.type === "move" && activeS.fromRow === displayRow && activeS.fromCol === displayCol) {
              cell.classList.add("suggested-from");
            }
            if (activeS.toRow === displayRow && activeS.toCol === displayCol) {
              cell.classList.add("suggested-to");
            }
          }

          // Checked King highlight
          if (square && square.type === "k" && this.game.isKingInCheck(square.color, "board")) {
            cell.classList.add("check-sq");
          }

          // Selected cell highlight
          if (this.selectedCell && this.selectedCell.row === displayRow && this.selectedCell.col === displayCol) {
            cell.classList.add("selected-sq");
          }

          // Last move highlights
          if (this.lastMoveSquares.some(s => s.row === displayRow && s.col === displayCol)) {
            cell.classList.add("last-move-sq");
          }

          // Legal moves dot
          const isLegal = this.legalMoves.find(m => m.row === displayRow && m.col === displayCol);
          if (isLegal) {
            if (square) {
              const ring = document.createElement("span");
              ring.className = "capture-ring";
              cell.appendChild(ring);
            } else {
              const dot = document.createElement("span");
              dot.className = "move-dot";
              cell.appendChild(dot);
            }
            cell.style.cursor = "pointer";
            cell.addEventListener("click", () => this.handleCellInteraction(displayRow, displayCol, "board"));
          }

          // Select your own active pieces
          const myColor = this.get4PlayerColorName(this.playerIndex);
          if (square && square.color === myColor && activeColor === myColor && this.isMyTurn("board")) {
            cell.style.cursor = "pointer";
            cell.addEventListener("click", () => {
              if (this.selectedCell && this.selectedCell.row === displayRow && this.selectedCell.col === displayCol) {
                this.selectedCell = null;
                this.legalMoves = [];
              } else {
                this.selectedCell = { row: displayRow, col: displayCol };
                this.legalMoves = this.game.getValidMoves(displayRow, displayCol, "board");
              }
              this.refreshGameScreen();
            });
          }
        }
        grid.appendChild(cell);
      }
    }
    return grid;
  }

  // Get Custom SVGs rendered dynamically with CSS variables
  getPieceVector(type, colorClass) {
    const symbol = type.toUpperCase();
    const theme = PIECE_THEMES[this.piecesTheme] || PIECE_THEMES.classic;
    const paths = theme[symbol];
    if (!paths) return "";
    return `<svg viewBox="0 0 44 44" class="piece color-${colorClass}">${paths}</svg>`;
  }

  // Handle movements or drops click interaction
  handleCellInteraction(row, col, boardId = "board") {
    // Intercept if slot is shared (Co-play suggestion flow)
    if (this.isSlotShared(this.playerIndex)) {
      if (this.selectedReservePiece) {
        const pieceType = this.selectedReservePiece;
        const suggestion = {
          type: "drop",
          pieceType,
          toRow: row,
          toCol: col,
          boardId
        };
        this.sendRelay({
          type: "suggest_move",
          action: suggestion
        });
        this.activeSuggestion = suggestion;
        this.selectedReservePiece = null;
        this.legalMoves = [];
        this.refreshGameScreen();
      } else if (this.selectedCell) {
        const fromRow = this.selectedCell.row;
        const fromCol = this.selectedCell.col;
        const boardArr = this.game.getBoardArray(boardId);
        const piece = boardArr[fromRow][fromCol];

        // Promotion check
        let isPromotion = false;
        if (piece && piece.type === "p") {
          if (this.variant === "4player") {
            const step = this.mode === "teams" ? 11 : 8;
            if (piece.color === "red" && row === step - 1) isPromotion = true;
            if (piece.color === "yellow" && row === 14 - step) isPromotion = true;
            if (piece.color === "blue" && col === step - 1) isPromotion = true;
            if (piece.color === "green" && col === 14 - step) isPromotion = true;
          } else {
            const promoRank = piece.color === "white" ? 7 : 0;
            if (row === promoRank) isPromotion = true;
          }
        }

        let promoChoice = "q";
        if (isPromotion) {
          const choice = prompt("Promote to: Q (Queen), R (Rook), B (Bishop), or N (Knight)?", "Q");
          if (choice && ["r", "n", "b", "q"].includes(choice.toLowerCase())) {
            promoChoice = choice.toLowerCase();
          }
        }

        const suggestion = {
          type: "move",
          fromRow,
          fromCol,
          toRow: row,
          toCol: col,
          promoChoice,
          boardId
        };
        this.sendRelay({
          type: "suggest_move",
          action: suggestion
        });
        this.activeSuggestion = suggestion;
        this.selectedCell = null;
        this.legalMoves = [];
        this.refreshGameScreen();
      }
      return;
    }

    if (this.selectedReservePiece) {
      // Execute Drop Move (Bughouse)
      const pieceType = this.selectedReservePiece;
      this.game.applyDrop(pieceType, row, col, boardId);
      
      this.sendRelay({
        type: "drop",
        pieceType,
        toRow: row,
        toCol: col,
        boardId,
        clocks: { ...this.clocks }
      });

      this.selectedReservePiece = null;
      this.legalMoves = [];
      this.lastMoveSquares = [{ row, col }];
      this.refreshGameScreen();
      this.checkForLocalGameEnd(boardId);
      
    } else if (this.selectedCell) {
      // Execute Normal Board Move
      const fromRow = this.selectedCell.row;
      const fromCol = this.selectedCell.col;
      const boardArr = this.game.getBoardArray(boardId);
      const piece = boardArr[fromRow][fromCol];

      // Promotion check
      let isPromotion = false;
      if (piece && piece.type === "p") {
        if (this.variant === "4player") {
          const step = this.mode === "teams" ? 11 : 8;
          if (piece.color === "red" && row === step - 1) isPromotion = true;
          if (piece.color === "yellow" && row === 14 - step) isPromotion = true;
          if (piece.color === "blue" && col === step - 1) isPromotion = true;
          if (piece.color === "green" && col === 14 - step) isPromotion = true;
        } else {
          const promoRank = piece.color === "white" ? 7 : 0;
          if (row === promoRank) isPromotion = true;
        }
      }

      let promoChoice = "q";
      if (isPromotion) {
        const choice = prompt("Promote to: Q (Queen), R (Rook), B (Bishop), or N (Knight)?", "Q");
        if (choice && ["r", "n", "b", "q"].includes(choice.toLowerCase())) {
          promoChoice = choice.toLowerCase();
        }
      }

      this.game.applyMove(fromRow, fromCol, row, col, promoChoice, boardId);
      
      // Update clocks increment
      const activeColor = this.game.getTurnColor(boardId);
      if (this.timeLimitMinutes > 0) {
        if (this.variant === "bughouse") {
          // Bughouse clocks are index-mapped
          let pIndex = -1;
          if (boardId === "board1") {
            pIndex = activeColor === "white" ? 0 : 1;
          } else {
            pIndex = activeColor === "black" ? 2 : 3;
          }
          if (this.clocks[pIndex] !== undefined) {
            this.clocks[pIndex] += this.timeIncrementSeconds;
          }
        } else {
          if (this.clocks[activeColor] !== undefined) {
            this.clocks[activeColor] += this.timeIncrementSeconds;
          }
        }
      }

      this.sendRelay({
        type: "move",
        fromRow,
        fromCol,
        toRow: row,
        toCol: col,
        promoChoice,
        boardId,
        clocks: { ...this.clocks }
      });

      this.selectedCell = null;
      this.legalMoves = [];
      this.lastMoveSquares = [{ row: fromRow, col: fromCol }, { row, col }];
      this.refreshGameScreen();
      this.checkForLocalGameEnd(boardId);
    }
  }

  // Refresh Screen elements without redrawing everything
  refreshGameScreen() {
    this.renderScreen("game");
  }

  buildFloatingSettingsButton() {
    const btn = document.createElement("button");
    btn.className = "btn-settings-icon";
    btn.title = "Settings";
    btn.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    `;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleCustomizer(true);
    });
    return btn;
  }

  // Theme Customizer builder
  buildCustomizerDrawer() {
    const backdrop = document.createElement("div");
    backdrop.className = "customizer-backdrop";
    backdrop.id = "customizer-backdrop";
    backdrop.addEventListener("click", () => this.toggleCustomizer(false));

    const drawer = document.createElement("div");
    drawer.className = "customizer-drawer";
    drawer.id = "customizer-drawer";

    drawer.innerHTML = `
      <div class="modal-header" style="margin-bottom: 16px;">
        <span class="modal-title" style="font-size: 1.15rem;">Settings & Style</span>
        <button class="modal-close-btn" id="customizer-close-btn"></button>
      </div>

      <!-- Theme Preview Area -->
      <div class="theme-preview-box">
        <div id="theme-preview-board-container"></div>
      </div>

      <div class="settings-group" style="margin-bottom: 16px;">
        <label class="settings-label">App Appearance</label>
        <div class="theme-options-grid">
          <button class="theme-option-btn ${this.appTheme === "light" ? "selected" : ""}" data-mode="light">Light Mode</button>
          <button class="theme-option-btn ${this.appTheme === "dark" ? "selected" : ""}" data-mode="dark">Dark Mode</button>
        </div>
      </div>

      <div class="settings-group" style="margin-bottom: 16px; border-top: 1px solid var(--card-border); padding-top: 16px;">
        <label class="settings-label">Board Style</label>
        <div class="theme-options-grid">
          <button class="theme-option-btn ${this.boardTheme === "emerald" ? "selected" : ""}" data-theme="emerald">Emerald</button>
          <button class="theme-option-btn ${this.boardTheme === "slate" ? "selected" : ""}" data-theme="slate">Slate</button>
          <button class="theme-option-btn ${this.boardTheme === "wood" ? "selected" : ""}" data-theme="wood">Wood</button>
          <button class="theme-option-btn ${this.boardTheme === "neon" ? "selected" : ""}" data-theme="neon">Cosmic</button>
          <button class="theme-option-btn ${this.boardTheme === "marble" ? "selected" : ""}" data-theme="marble">Marble</button>
          <button class="theme-option-btn ${this.boardTheme === "royal" ? "selected" : ""}" data-theme="royal">Royal</button>
        </div>
      </div>

      <div class="settings-group" style="border-top: 1px solid var(--card-border); padding-top: 16px;">
        <label class="settings-label">Piece Style</label>
        <div class="theme-options-grid">
          <button class="theme-option-btn ${this.piecesTheme === "classic" ? "selected" : ""}" data-piece="classic">Classic</button>
          <button class="theme-option-btn ${this.piecesTheme === "cyber" ? "selected" : ""}" data-piece="cyber">Cyber</button>
          <button class="theme-option-btn ${this.piecesTheme === "metallic" ? "selected" : ""}" data-piece="metallic">Metallic</button>
        </div>
      </div>
    `;

    setTimeout(() => {
      // Draw the initial preview board
      this.updateThemePreview();

      const close = drawer.querySelector("#customizer-close-btn");
      if (close) {
        close.appendChild(this.buildCloseSvg());
        close.addEventListener("click", () => this.toggleCustomizer(false));
      }

      drawer.querySelectorAll("[data-mode]").forEach(btn => {
        btn.addEventListener("click", () => {
          this.appTheme = btn.dataset.mode;
          localStorage.setItem("chess_app_theme", this.appTheme);
          document.body.className = `theme-${this.boardTheme} pieces-${this.piecesTheme} mode-${this.appTheme}`;
          drawer.querySelectorAll("[data-mode]").forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
          this.updateThemePreview();
        });
      });

      drawer.querySelectorAll("[data-theme]").forEach(btn => {
        btn.addEventListener("click", () => {
          this.boardTheme = btn.dataset.theme;
          localStorage.setItem("chess_board_theme", this.boardTheme);
          document.body.className = `theme-${this.boardTheme} pieces-${this.piecesTheme} mode-${this.appTheme}`;
          drawer.querySelectorAll("[data-theme]").forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
          this.updateThemePreview();
        });
      });

      drawer.querySelectorAll("[data-piece]").forEach(btn => {
        btn.addEventListener("click", () => {
          this.piecesTheme = btn.dataset.piece;
          localStorage.setItem("chess_pieces_theme", this.piecesTheme);
          document.body.className = `theme-${this.boardTheme} pieces-${this.piecesTheme} mode-${this.appTheme}`;
          drawer.querySelectorAll("[data-piece]").forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
          this.updateThemePreview();
          // Re-render the game screen to load new piece vectors
          this.refreshGameScreen();
        });
      });
    }, 50);

    const frag = document.createDocumentFragment();
    frag.appendChild(backdrop);
    frag.appendChild(drawer);
    return frag;
  }

  updateThemePreview() {
    const container = document.getElementById("theme-preview-board-container");
    if (container) {
      container.innerHTML = "";
      container.appendChild(this.buildThemePreviewBoard());
    }
  }

  buildThemePreviewBoard() {
    const board = document.createElement("div");
    board.className = "mini-preview-board";

    // 3x3 layout
    const cells = [
      [ { color: 'dark', piece: 'K', side: 'white' }, { color: 'light' }, { color: 'dark' } ],
      [ { color: 'light' }, { color: 'dark', piece: 'N', side: 'black' }, { color: 'light' } ],
      [ { color: 'dark' }, { color: 'light' }, { color: 'dark', piece: 'P', side: 'white' } ]
    ];
    
    cells.forEach((rowCells) => {
      rowCells.forEach((cellInfo) => {
        const cell = document.createElement("div");
        cell.className = `preview-cell ${cellInfo.color}`;
        if (cellInfo.piece) {
          cell.innerHTML = this.getPieceVector(cellInfo.piece, cellInfo.side);
        }
        board.appendChild(cell);
      });
    });
    return board;
  }

  toggleCustomizer(show) {
    const backdrop = document.getElementById("customizer-backdrop");
    const drawer = document.getElementById("customizer-drawer");
    if (show) {
      backdrop.classList.add("show");
      drawer.classList.add("show");
    } else {
      backdrop.classList.remove("show");
      drawer.classList.remove("show");
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CLOUD MULTIPLAYER NETWORKING & WS HANDLERS
  // ──────────────────────────────────────────────────────────────────────────

  async createRoom() {
    this.role = "player";
    const variantQuery = this.variant === "4player" ? `${this.variant}&mode=${this.mode}` : this.variant;
    
    this.socket = new WebSocket(`${WS_BASE}/ws/create?name=${encodeURIComponent(this.username)}&variant=${encodeURIComponent(variantQuery)}&role=player`);
    this.setupSocketHandlers();
  }

  async joinRoom(code, spectate = false) {
    this.roomCode = code.toUpperCase();
    this.role = spectate ? "spectator" : "player";

    this.socket = new WebSocket(`${WS_BASE}/ws/join?code=${this.roomCode}&name=${encodeURIComponent(this.username)}&role=${this.role}&index=${this.playerIndex}`);
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.socket.onopen = () => {
      console.log("[WS] Connection established.");
    };

    this.socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "connected") {
          this.roomCode = msg.code;
          this.role = msg.role;
          this.playerIndex = msg.index;
          
          localStorage.setItem("active_room_code", this.roomCode);
          localStorage.setItem("active_room_name", this.username);
          localStorage.setItem("active_room_role", this.role);

          // Update URL hash to make sharing simple
          window.location.hash = this.roomCode;

          // Configure Bughouse Board assignments
          if (this.variant === "bughouse") {
            this.myBoardId = (this.playerIndex === 2 || this.playerIndex === 3) ? "board2" : "board1";
            this.partnerBoardId = this.myBoardId === "board1" ? "board2" : "board1";
            this.bughouseActiveBoard = this.myBoardId;
          }

          this.renderScreen("lobby");
          this.registerLobbyOnCloud();
        }

        else if (msg.type === "room_list") {
          this.variant = msg.variant;
          this.clients = msg.clients;
          
          const self = this.clients.find(c => c.name === this.username);
          if (self) {
            this.role = self.role;
            this.playerIndex = self.index;
          }

          if (this.variant === "bughouse" && this.playerIndex !== -1) {
            this.myBoardId = (this.playerIndex === 2 || this.playerIndex === 3) ? "board2" : "board1";
            this.partnerBoardId = this.myBoardId === "board1" ? "board2" : "board1";
            // Set active viewed board to my board if not already initialized
            if (!this.bughouseActiveBoard) {
              this.bughouseActiveBoard = this.myBoardId;
            }
          }

          if (this.activeScreen === "lobby") {
            this.renderScreen("lobby");
          } else if (this.activeScreen === "game") {
            this.refreshGameScreen();
          }
        }

        else if (msg.type === "relay") {
          this.handleRelayedAction(msg.action, msg.sender, msg.index);
        }
      } catch (err) {
        console.error("[WS] Message processing error:", err);
      }
    };

    this.socket.onclose = () => {
      console.log("[WS] Connection closed.");
      this.stopTimerLoop();
      this.showToast("Disconnected from game server.");
    };

    this.socket.onerror = (err) => {
      console.error("[WS] Error occurred:", err);
    };
  }

  // Handle messages relayed from other players in the room
  handleRelayedAction(action, sender, senderIndex) {
    if (!action) return;

    if (action.type === "lobby_sync") {
      this.timeLimitMinutes = action.timeLimitMinutes;
      this.timeIncrementSeconds = action.timeIncrementSeconds;
      if (this.activeScreen === "lobby") {
        this.renderScreen("lobby");
      }
    }

    else if (action.type === "start_game") {
      this.timeLimitMinutes = action.timeLimitMinutes;
      this.timeIncrementSeconds = action.timeIncrementSeconds;
      
      this.game = new ChessLogic(this.variant, this.mode);
      
      // Initialize clocks
      if (this.timeLimitMinutes > 0) {
        const seconds = this.timeLimitMinutes * 60;
        if (this.variant === "bughouse") {
          // In Bughouse, map timers by player index 0-3
          [0, 1, 2, 3].forEach(idx => {
            this.clocks[idx] = seconds;
          });
        } else {
          this.game.players.forEach(col => {
            this.clocks[col] = seconds;
          });
        }
      }

      this.activeScreen = "game";
      this.renderScreen("game");
      this.startTimerLoop();
    }

    else if (action.type === "move") {
      if (action.clocks) {
        this.clocks = action.clocks;
      }
      
      this.game.applyMove(action.fromRow, action.fromCol, action.toRow, action.toCol, action.promoChoice, action.boardId);
      this.lastMoveSquares = [{ row: action.fromRow, col: action.fromCol }, { row: action.toRow, col: action.toCol }];
      
      this.refreshGameScreen();
      this.checkForLocalGameEnd(action.boardId);
    }

    else if (action.type === "drop") {
      if (action.clocks) {
        this.clocks = action.clocks;
      }

      this.game.applyDrop(action.pieceType, action.toRow, action.toCol, action.boardId);
      this.lastMoveSquares = [{ row: action.toRow, col: action.toCol }];

      this.refreshGameScreen();
      this.checkForLocalGameEnd(action.boardId);
    }

    else if (action.type === "timeout") {
      this.handleTimeoutLoss(action.color, action.index);
    }

    else if (action.type === "resign") {
      this.handleResignation(action.color, sender);
    }

    else if (action.type === "suggest_move") {
      if (senderIndex === this.playerIndex) {
        this.partnerSuggestion = action.action;
        if (this.partnerSuggestion) {
          this.partnerSuggestion.sender = sender;
        }
        this.refreshGameScreen();
      }
    }

    else if (action.type === "clear_suggestion") {
      if (senderIndex === this.playerIndex) {
        this.partnerSuggestion = null;
        this.activeSuggestion = null;
        this.refreshGameScreen();
      }
    }
  }

  // Broadcaster helper for WebSocket
  sendRelay(action) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: "relay",
        sender: this.username,
        action
      }));
    }
  }

  // Start game signal
  sendStartGame() {
    this.sendRelay({
      type: "start_game",
      timeLimitMinutes: this.timeLimitMinutes,
      timeIncrementSeconds: this.timeIncrementSeconds
    });

    // Run host actions locally
    this.game = new ChessLogic(this.variant, this.mode);
    if (this.timeLimitMinutes > 0) {
      const seconds = this.timeLimitMinutes * 60;
      if (this.variant === "bughouse") {
        [0, 1, 2, 3].forEach(idx => {
          this.clocks[idx] = seconds;
        });
      } else {
        this.game.players.forEach(col => {
          this.clocks[col] = seconds;
        });
      }
    }

    this.activeScreen = "game";
    this.renderScreen("game");
    this.startTimerLoop();

    this.registerLobbyOnCloud();
  }

  // Leave room and reset local cache
  leaveRoom() {
    this.stopTimerLoop();
    
    if (this.socket) {
      this.socket.close();
    }

    localStorage.removeItem("active_room_code");
    localStorage.removeItem("active_room_name");
    localStorage.removeItem("active_room_role");

    // Clean hash from URL bar
    history.pushState("", document.title, window.location.pathname + window.location.search);

    this.roomCode = null;
    this.playerIndex = -1;
    this.clients = [];
    this.game = null;
    this.clocks = {};

    this.activeScreen = "home";
    this.renderScreen("home");
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CLOCK / TIMERS SYNC LOOP
  // ──────────────────────────────────────────────────────────────────────────

  startTimerLoop() {
    if (this.timeLimitMinutes === 0) return; // Untimed
    this.stopTimerLoop();

    this.lastClockTick = Date.now();
    this.clockInterval = setInterval(() => {
      const now = Date.now();
      const delta = (now - this.lastClockTick) / 1000;
      this.lastClockTick = now;

      if (this.variant === "bughouse") {
        // Bughouse has two independent active clocks ticking down simultaneously!
        const activeColor1 = this.game.getTurnColor("board1");
        const activeIndex1 = activeColor1 === "white" ? 0 : 1;

        const activeColor2 = this.game.getTurnColor("board2");
        const activeIndex2 = activeColor2 === "black" ? 2 : 3;

        // Board 1 Clock Tick
        if (this.clocks[activeIndex1] !== undefined) {
          this.clocks[activeIndex1] = Math.max(0, this.clocks[activeIndex1] - delta);
          this.updateDOMTimer(activeIndex1, this.clocks[activeIndex1]);
          
          if (this.clocks[activeIndex1] <= 0 && this.playerIndex === activeIndex1) {
            this.triggerTimeoutLoss(activeColor1, activeIndex1);
          }
        }

        // Board 2 Clock Tick
        if (this.clocks[activeIndex2] !== undefined) {
          this.clocks[activeIndex2] = Math.max(0, this.clocks[activeIndex2] - delta);
          this.updateDOMTimer(activeIndex2, this.clocks[activeIndex2]);

          if (this.clocks[activeIndex2] <= 0 && this.playerIndex === activeIndex2) {
            this.triggerTimeoutLoss(activeColor2, activeIndex2);
          }
        }
      } else {
        // Standard or 4-Player clocks
        const activeColor = this.game.getTurnColor("board");
        if (this.clocks[activeColor] !== undefined) {
          this.clocks[activeColor] = Math.max(0, this.clocks[activeColor] - delta);
          
          const clockEl = document.getElementById(`timer-${activeColor}`);
          if (clockEl) {
            clockEl.textContent = this.formatTime(this.clocks[activeColor]);
            if (this.clocks[activeColor] < 15) {
              clockEl.classList.add("low-time");
            } else {
              clockEl.classList.remove("low-time");
            }
          }

          if (this.clocks[activeColor] <= 0 && this.isMyTurnColor(activeColor, "board")) {
            this.triggerTimeoutLoss(activeColor, -1);
          }
        }
      }
    }, 200);
  }

  updateDOMTimer(playerIdx, seconds) {
    const clockEl = document.getElementById(`timer-${playerIdx}`);
    if (clockEl) {
      clockEl.textContent = this.formatTime(seconds);
      if (seconds < 15) {
        clockEl.classList.add("low-time");
      } else {
        clockEl.classList.remove("low-time");
      }
    }
  }

  stopTimerLoop() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PUBLIC ROOM LOBBY DATABASE REGISTRATION
  // ──────────────────────────────────────────────────────────────────────────

  async registerLobbyOnCloud() {
    if (this.playerIndex !== 0) return;
    
    try {
      await fetch(`${HTTP_BASE}/rooms/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: this.roomCode,
          host: this.username,
          playerCount: this.clients.length,
          variant: this.variant,
          private: false
        })
      });
    } catch (err) {
      console.warn("Public room registration skipped:", err.message);
    }
  }

  async sendHeartbeat() {
    if (this.playerIndex !== 0 || !this.roomCode) return;
    
    try {
      await fetch(`${HTTP_BASE}/rooms/heartbeat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: this.roomCode,
          playerCount: this.clients.length
        })
      });
    } catch (err) {
      console.warn("Heartbeat failed:", err);
    }
  }

  async openLobbyBrowser() {
    try {
      const res = await fetch(`${HTTP_BASE}/rooms/list?variant=${encodeURIComponent(this.variant)}`);
      this.publicLobbies = await res.json();
    } catch (e) {
      this.publicLobbies = [];
      this.showToast("Failed to fetch public rooms.");
    }
    this.renderLobbyBrowserModal();
  }

  renderLobbyBrowserModal() {
    const browser = document.createElement("div");
    browser.className = "lobby-browser-modal";
    browser.id = "lobby-browser-modal";

    const content = document.createElement("div");
    content.className = "glass-panel lobby-browser-content";

    const header = document.createElement("div");
    header.className = "modal-header";
    header.innerHTML = `<span class="modal-title">Open Lobbies</span>`;
    
    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close-btn";
    closeBtn.appendChild(this.buildCloseSvg());
    closeBtn.addEventListener("click", () => browser.remove());
    header.appendChild(closeBtn);
    content.appendChild(header);

    const list = document.createElement("div");
    list.className = "lobby-list";

    this.publicLobbies.forEach(room => {
      const item = document.createElement("div");
      item.className = "lobby-item";

      const details = document.createElement("div");
      details.className = "lobby-details";
      details.innerHTML = `
        <span class="lobby-host">Host: ${room.host}</span>
        <span class="lobby-meta">${room.variant} • ${room.playerCount} active</span>
      `;
      item.appendChild(details);

      const actions = document.createElement("div");
      actions.className = "lobby-actions";

      const joinPlay = document.createElement("button");
      joinPlay.className = "btn-premium btn-primary btn-sm";
      joinPlay.textContent = "Play";
      joinPlay.addEventListener("click", () => {
        this.joinRoom(room.code, false);
        browser.remove();
      });
      actions.appendChild(joinPlay);

      const joinSpec = document.createElement("button");
      joinSpec.className = "btn-premium btn-secondary btn-sm";
      joinSpec.textContent = "Watch";
      joinSpec.addEventListener("click", () => {
        this.joinRoom(room.code, true);
        browser.remove();
      });
      actions.appendChild(joinSpec);

      item.appendChild(actions);
      list.appendChild(item);
    });

    if (this.publicLobbies.length === 0) {
      list.innerHTML = `<div class="lobby-empty">No active public rooms found. Try creating one!</div>`;
    }

    content.appendChild(list);
    browser.appendChild(content);
    document.body.appendChild(browser);
  }

  // Sync settings changes across clients (lobby phase)
  syncLobbySettings() {
    localStorage.setItem("chess_time_limit", this.timeLimitMinutes);
    localStorage.setItem("chess_time_increment", this.timeIncrementSeconds);
    this.sendRelay({
      type: "lobby_sync",
      timeLimitMinutes: this.timeLimitMinutes,
      timeIncrementSeconds: this.timeIncrementSeconds
    });
    this.registerLobbyOnCloud();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CHESS GAME END CONTEXTS & TIMEOUT LOSS
  // ──────────────────────────────────────────────────────────────────────────

  checkForLocalGameEnd(boardId) {
    const endState = this.game.checkGameEndStates(boardId);
    if (!endState) return;

    this.stopTimerLoop();

    const activeColor = this.game.getTurnColor(boardId);
    const activeName = this.getPlayerNameByColor(activeColor, boardId);

    if (endState === "checkmate") {
      if (this.variant === "4player" && this.mode === "ffa") {
        this.showToast(`${activeName} has been CHECKMATED!`);
        this.game.eliminatePlayer(activeColor);
        
        const activePlayers = this.game.players.filter(p => !this.game.eliminated[p]);
        if (activePlayers.length <= 1) {
          const winner = activePlayers[0] || "No one";
          alert(`Game Over! Winner: ${this.getPlayerNameByColor(winner, "board")}`);
        } else {
          this.game.nextTurn("board");
          this.startTimerLoop();
          this.refreshGameScreen();
        }
      } else {
        alert(`Checkmate! ${activeName} loses. Game Over.`);
      }
    } else if (endState === "stalemate") {
      alert(`Stalemate! Game drawn.`);
    }
  }

  triggerTimeoutLoss(color, playerIdx) {
    this.stopTimerLoop();
    this.sendRelay({
      type: "timeout",
      color,
      index: playerIdx
    });
    this.handleTimeoutLoss(color, playerIdx);
  }

  handleTimeoutLoss(color, playerIdx) {
    this.stopTimerLoop();
    let name = color;
    if (this.variant === "bughouse" && playerIdx !== -1) {
      const client = this.clients.find(c => c.role === "player" && c.index === playerIdx);
      name = client ? client.name : `Player ${playerIdx + 1}`;
    } else {
      name = this.getPlayerNameByColor(color, "board");
    }
    alert(`Time Out! ${name} ran out of time and lost.`);
  }

  handleResignation(color, senderName) {
    this.stopTimerLoop();
    alert(`${senderName} (${color}) has resigned. Game Over.`);
  }

  // Helper utility mappings
  isMyTurn(boardId = "board") {
    if (this.role === "spectator") return false;
    const activeColor = this.game.getTurnColor(boardId);
    return this.isMyTurnColor(activeColor, boardId);
  }

  isMyTurnColor(color, boardId = "board") {
    if (this.variant === "4player") {
      return this.get4PlayerColorName(this.playerIndex) === color;
    }
    if (this.variant === "bughouse") {
      if (this.playerIndex === 0) return boardId === "board1" && color === "white";
      if (this.playerIndex === 1) return boardId === "board1" && color === "black";
      if (this.playerIndex === 2) return boardId === "board2" && color === "black";
      if (this.playerIndex === 3) return boardId === "board2" && color === "white";
      return false;
    }
    const myColor = this.playerIndex === 0 ? "white" : "black";
    return myColor === color;
  }

  get4PlayerColorName(index) {
    const colors = ["red", "blue", "yellow", "green"];
    return colors[index] || "none";
  }

  getBughouseColorName(index) {
    // Player 0 and 3 play White (Board 1 / Board 2)
    // Player 1 and 2 play Black (Board 1 / Board 2)
    if (index === 0) return "White (B1)";
    if (index === 1) return "Black (B1)";
    if (index === 2) return "Black (B2)";
    if (index === 3) return "White (B2)";
    return "none";
  }

  getPlayerNameByColor(color, boardId = "board") {
    if (this.variant === "4player") {
      const idx = this.game.players.indexOf(color);
      const client = this.clients.find(c => c.role === "player" && c.index === idx);
      return client ? client.name : `Player ${color}`;
    }
    if (this.variant === "bughouse") {
      let idx = -1;
      if (boardId === "board1") {
        idx = color === "white" ? 0 : 1;
      } else {
        idx = color === "black" ? 2 : 3;
      }
      const client = this.clients.find(c => c.role === "player" && c.index === idx);
      return client ? client.name : `Player ${color}`;
    }
    const idx = color === "white" ? 0 : 1;
    const client = this.clients.find(c => c.role === "player" && c.index === idx);
    return client ? client.name : color;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VECTOR ICONS & GENERAL UI BUILDERS (NO EMOJIS)
  // ──────────────────────────────────────────────────────────────────────────

  buildCloseSvg() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "modal-close-svg");
    svg.innerHTML = `<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`;
    return svg;
  }

  showToast(message) {
    const container = document.getElementById("toast");
    if (!container) return;
    container.textContent = message;
    container.classList.add("show");
    
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      container.classList.remove("show");
    }, 2500);
  }

  // Claim specific slot index in lobby
  sendClaimSlot(index) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: "claim_slot",
        index: index
      }));
    }
  }

  // Check if a player index has co-players sharing the slot
  isSlotShared(index) {
    if (index === -1) return false;
    const occupants = this.clients.filter(c => c.role === "player" && c.index === index);
    return occupants.length > 1;
  }

  // Get captured pieces of a given color
  getCapturedPieces(color) {
    const startSet = { p: 8, r: 2, n: 2, b: 2, q: 1 };
    const currentCounts = { p: 0, r: 0, n: 0, b: 0, q: 0 };
    
    // Scan board
    const board = this.game.board;
    const size = this.variant === "4player" ? 14 : 8;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const sq = board[r][c];
        if (sq && sq.color === color) {
          const type = sq.type.toLowerCase();
          if (currentCounts[type] !== undefined) {
            currentCounts[type]++;
          }
        }
      }
    }
    
    // Subtract to find captured
    const captured = [];
    Object.entries(startSet).forEach(([type, count]) => {
      const diff = count - currentCounts[type];
      for (let i = 0; i < diff; i++) {
        captured.push(type);
      }
    });
    return captured;
  }

  // Render list of captured pieces next to names in profile tags
  renderCapturedPiecesList(capturedColor) {
    const list = this.getCapturedPieces(capturedColor);
    if (list.length === 0) return "";
    
    let html = `<div class="captured-pieces-list" style="display:flex; flex-wrap:wrap; gap:2px; margin-top:2px; opacity:0.8;">`;
    list.forEach(pType => {
      const theme = PIECE_THEMES[this.piecesTheme] || PIECE_THEMES.classic;
      const paths = theme[pType.toUpperCase()];
      if (paths) {
        html += `<svg viewBox="0 0 44 44" class="piece color-${capturedColor}" style="width:16px; height:16px; filter:drop-shadow(0 1px 1px rgba(0,0,0,0.4));">${paths}</svg>`;
      }
    });
    html += `</div>`;
    return html;
  }

  // Build the co-play suggestion banner panel
  buildSuggestionPanel() {
    if (!this.activeSuggestion && !this.partnerSuggestion) return null;

    const panel = document.createElement("div");
    panel.className = "glass-panel fade-in";
    panel.style.width = "100%";
    panel.style.maxWidth = "440px";
    panel.style.margin = "6px 0";
    panel.style.padding = "10px 14px";
    panel.style.display = "flex";
    panel.style.justifyContent = "space-between";
    panel.style.alignItems = "center";
    panel.style.border = "1px solid var(--accent-neon)";
    panel.style.boxShadow = "0 0 15px rgba(0, 242, 254, 0.15)";
    panel.style.borderRadius = "10px";

    const label = document.createElement("span");
    label.style.fontSize = "0.85rem";
    label.style.fontWeight = "600";

    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "8px";

    if (this.activeSuggestion) {
      const moveStr = this.getSuggestionString(this.activeSuggestion);
      label.innerHTML = `<span style="color:var(--accent-neon); font-weight:800;">Suggested:</span> ${moveStr}`;
      
      const cancelBtn = document.createElement("button");
      cancelBtn.className = "btn-premium btn-secondary btn-sm";
      cancelBtn.textContent = "Cancel";
      cancelBtn.style.padding = "6px 12px";
      cancelBtn.addEventListener("click", () => {
        this.sendRelay({ type: "clear_suggestion" });
        this.activeSuggestion = null;
        this.partnerSuggestion = null;
        this.refreshGameScreen();
      });
      btnContainer.appendChild(cancelBtn);
    } 
    
    else if (this.partnerSuggestion) {
      const moveStr = this.getSuggestionString(this.partnerSuggestion);
      label.innerHTML = `<span style="color:var(--accent-purple); font-weight:800;">${this.partnerSuggestion.sender || "Partner"} suggests:</span> ${moveStr}`;

      const agreeBtn = document.createElement("button");
      agreeBtn.className = "btn-premium btn-primary btn-sm";
      agreeBtn.textContent = "✓ Agree";
      agreeBtn.style.padding = "6px 12px";
      agreeBtn.addEventListener("click", () => {
        this.executeSuggestedMove(this.partnerSuggestion);
        this.sendRelay({ type: "clear_suggestion" });
        this.activeSuggestion = null;
        this.partnerSuggestion = null;
        this.refreshGameScreen();
      });

      const disagreeBtn = document.createElement("button");
      disagreeBtn.className = "btn-premium btn-secondary btn-sm";
      disagreeBtn.textContent = "✗ Disagree";
      disagreeBtn.style.padding = "6px 12px";
      disagreeBtn.addEventListener("click", () => {
        this.sendRelay({ type: "clear_suggestion" });
        this.activeSuggestion = null;
        this.partnerSuggestion = null;
        this.refreshGameScreen();
      });

      btnContainer.appendChild(agreeBtn);
      btnContainer.appendChild(disagreeBtn);
    }

    panel.appendChild(label);
    panel.appendChild(btnContainer);
    return panel;
  }

  // Format a suggested move into a legible string
  getSuggestionString(s) {
    const boardLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"];
    if (s.type === "drop") {
      const pieceName = s.pieceType.toUpperCase();
      const colLetter = boardLetters[s.toCol];
      const rowNum = s.boardId === "board2" ? s.toRow + 1 : 8 - s.toRow;
      return `Drop ${pieceName} @ ${colLetter}${rowNum}`;
    } else {
      const colFrom = boardLetters[s.fromCol];
      const rowFrom = this.variant === "4player" ? s.fromRow + 1 : 8 - s.fromRow;
      const colTo = boardLetters[s.toCol];
      const rowTo = this.variant === "4player" ? s.toRow + 1 : 8 - s.toRow;
      const promo = s.promoChoice && s.promoChoice !== "q" ? `=${s.promoChoice.toUpperCase()}` : "";
      return `${colFrom}${rowFrom} → ${colTo}${rowTo}${promo}`;
    }
  }

  // Execute a suggested move on the board and broadcast
  executeSuggestedMove(s) {
    if (s.type === "drop") {
      this.game.applyDrop(s.pieceType, s.toRow, s.toCol, s.boardId);
      
      this.sendRelay({
        type: "drop",
        pieceType: s.pieceType,
        toRow: s.toRow,
        toCol: s.toCol,
        boardId: s.boardId,
        clocks: { ...this.clocks }
      });
      
      this.lastMoveSquares = [{ row: s.toRow, col: s.toCol }];
      this.checkForLocalGameEnd(s.boardId);
    } else {
      this.game.applyMove(s.fromRow, s.fromCol, s.toRow, s.toCol, s.promoChoice, s.boardId);
      
      const activeColor = this.game.getTurnColor(s.boardId);
      if (this.timeLimitMinutes > 0) {
        if (this.variant === "bughouse") {
          let pIndex = -1;
          if (s.boardId === "board1") {
            pIndex = activeColor === "white" ? 0 : 1;
          } else {
            pIndex = activeColor === "black" ? 2 : 3;
          }
          if (this.clocks[pIndex] !== undefined) {
            this.clocks[pIndex] += this.timeIncrementSeconds;
          }
        } else {
          if (this.clocks[activeColor] !== undefined) {
            this.clocks[activeColor] += this.timeIncrementSeconds;
          }
        }
      }

      this.sendRelay({
        type: "move",
        fromRow: s.fromRow,
        fromCol: s.fromCol,
        toRow: s.toRow,
        toCol: s.toCol,
        promoChoice: s.promoChoice,
        boardId: s.boardId,
        clocks: { ...this.clocks }
      });

      this.lastMoveSquares = [{ row: s.fromRow, col: s.fromCol }, { row: s.toRow, col: s.toCol }];
      this.checkForLocalGameEnd(s.boardId);
    }
  }
}

// Instantiate the app
window.addEventListener("DOMContentLoaded", () => {
  window.chessApp = new ChessApp();
});
