// Cloudflare Worker — Real-time WebSocket Chess sync server supporting Regular, Bughouse, and 4-Player Chess.
// Real-time synchronization + reconnection caching + spectator support + open lobby listing.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // HTTP API (Public Room Browser)
    if (request.headers.get("Upgrade") !== "websocket") {
      const store = env.GLOBAL_STORE.get(env.GLOBAL_STORE.idFromName("global"));

      if (path === "/rooms/list" && request.method === "GET") {
        const variant = url.searchParams.get("variant") || "";
        try {
          const res = await store.fetch(`http://global/rooms-list?variant=${encodeURIComponent(variant)}`);
          return new Response(await res.text(), { headers: { ...CORS, "Content-Type": "application/json" } });
        } catch (e) {
          return new Response("[]", { headers: { ...CORS, "Content-Type": "application/json" } });
        }
      }

      if (path === "/rooms/register" && request.method === "POST") {
        try {
          const body = await request.json();
          const res = await store.fetch("http://global/rooms-register", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
          });
          return new Response(await res.text(), { headers: { ...CORS, "Content-Type": "application/json" } });
        } catch (e) {
          return json({ error: String(e) }, 500);
        }
      }

      if (path === "/rooms/heartbeat" && request.method === "POST") {
        try {
          const body = await request.json();
          const res = await store.fetch("http://global/rooms-heartbeat", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
          });
          return new Response(await res.text(), { headers: { ...CORS, "Content-Type": "application/json" } });
        } catch (e) {
          return json({ error: String(e) }, 500);
        }
      }

      if (path === "/rooms/unregister" && request.method === "POST") {
        try {
          const body = await request.json();
          const res = await store.fetch("http://global/rooms-unregister", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
          });
          return new Response(await res.text(), { headers: { ...CORS, "Content-Type": "application/json" } });
        } catch (e) {
          return json({ error: String(e) }, 500);
        }
      }

      return new Response("Chess Multiplayer Sync Server Active.", {
        status: 200, headers: { ...CORS, "Content-Type": "text/plain" }
      });
    }

    // WebSocket Multiplayer / Spectator Lobbies
    if (url.pathname.startsWith("/ws/")) {
      let code = (url.searchParams.get("code") || "").toUpperCase().trim();
      const type = url.pathname.includes("create") ? "create" : "join";
      
      if (type === "create") {
        code = generateRoomCode();
        const newUrl = new URL(request.url);
        newUrl.searchParams.set("code", code);
        request = new Request(newUrl.toString(), request);
      }
      
      if (!code || (type === "join" && code.length !== 4)) {
        return new Response("Invalid room code.", { status: 400 });
      }

      const doId = env.ROOM_LOBBY.idFromName(code);
      return env.ROOM_LOBBY.get(doId).fetch(request);
    }

    return new Response("Not Found", { status: 404 });
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...CORS, "Content-Type": "application/json" }
  });
}

function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"; // No O or 0 to prevent confusion
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ── ChessGlobalStore Durable Object ──
// SQLite backed open room manager
export class ChessGlobalStore {
  constructor(state) {
    this.state = state;
    // Set up database table if it doesn't exist
    this.state.blockConcurrencyWhile(async () => {
      await this.state.storage.sql`
        CREATE TABLE IF NOT EXISTS rooms (
          code TEXT PRIMARY KEY,
          host TEXT,
          playerCount INTEGER,
          variant TEXT,
          private INTEGER,
          lastPing INTEGER
        )
      `;
    });
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/rooms-list") {
      const variantFilter = url.searchParams.get("variant") || "";
      const now = Date.now();
      // Clean up rooms that haven't pinged in 15 seconds
      await this.state.storage.sql`DELETE FROM rooms WHERE ${now} - lastPing > 15000`;
      
      let roomsResult;
      if (variantFilter) {
        roomsResult = await this.state.storage.sql`
          SELECT * FROM rooms WHERE variant = ${variantFilter} AND private = 0
        `;
      } else {
        roomsResult = await this.state.storage.sql`
          SELECT * FROM rooms WHERE private = 0
        `;
      }
      
      const list = [];
      for (const row of roomsResult) {
        list.push({
          code: row.code,
          host: row.host,
          playerCount: row.playerCount,
          variant: row.variant,
          private: row.private === 1,
          lastPing: row.lastPing
        });
      }
      return new Response(JSON.stringify(list), { headers: { "Content-Type": "application/json" } });
    }

    if (url.pathname === "/rooms-register" && request.method === "POST") {
      const room = await request.json();
      const now = Date.now();
      const isPrivate = room.private ? 1 : 0;
      await this.state.storage.sql`
        INSERT OR REPLACE INTO rooms (code, host, playerCount, variant, private, lastPing)
        VALUES (${room.code}, ${room.host}, ${room.playerCount}, ${room.variant}, ${isPrivate}, ${now})
      `;
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }

    if (url.pathname === "/rooms-heartbeat" && request.method === "POST") {
      const { code, playerCount } = await request.json();
      const now = Date.now();
      await this.state.storage.sql`
        UPDATE rooms SET lastPing = ${now}, playerCount = COALESCE(${playerCount}, playerCount) WHERE code = ${code}
      `;
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }

    if (url.pathname === "/rooms-unregister" && request.method === "POST") {
      const { code } = await request.json();
      await this.state.storage.sql`DELETE FROM rooms WHERE code = ${code}`;
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response("Not Found", { status: 404 });
  }
}

// ── ChessRoom Durable Object ──
// Manages real-time sync for a specific lobby/room.
export class ChessRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = new Map(); // ws -> { id, name, role: 'player'|'spectator', index: -1 }
    this.lastState = null;
    this.lastStateSender = null;
    this.variant = "standard"; // default
    this.mode = "ffa"; // default (relevant for 4player)
    this.nextClientId = 1; // monotonic id so clients can identify themselves reliably
  }

  async fetch(request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const name = url.searchParams.get("name") || "Guest";
    const variant = url.searchParams.get("variant") || "standard";
    const mode = url.searchParams.get("mode") || "ffa";
    const type = url.pathname.includes("create") ? "create" : "join";
    let requestedRole = url.searchParams.get("role") || "player";
    let requestedIndex = parseInt(url.searchParams.get("index") || "-1");

    this.variant = variant;
    this.mode = mode;

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    await this.handleSession(server, code, name, variant, type, requestedRole, requestedIndex);
    return new Response(null, { status: 101, webSocket: client });
  }

  async handleSession(ws, code, name, variant, type, requestedRole, requestedIndex) {
    ws.accept();

    // Unique per-connection id so the client can find itself in the room list
    // even when multiple players share the same display name.
    const clientId = `c${this.nextClientId++}`;

    // Max players checks
    let playerLimit = 2; // standard chess
    if (variant === "bughouse" || variant === "4player") {
      playerLimit = 4;
    }

    let currentPlayerCount = 0;
    this.sessions.forEach(s => {
      if (s.role === "player") currentPlayerCount++;
    });

    let assignedRole = requestedRole;
    if (assignedRole === "player" && currentPlayerCount >= playerLimit * 2) {
      assignedRole = "spectator"; // Force spectator if full
    }

    // Helper: how many players currently occupy a given slot index.
    const occupantsAt = (idx) => {
      let count = 0;
      this.sessions.forEach(s => {
        if (s.role === "player" && s.index === idx) count++;
      });
      return count;
    };

    // Assign a player index if player role
    let playerIndex = -1;
    if (assignedRole === "player") {
      if (requestedIndex >= 0 && requestedIndex < playerLimit && occupantsAt(requestedIndex) < 2) {
        // Honor an explicitly requested slot (e.g. reconnection / co-op claim).
        playerIndex = requestedIndex;
      } else {
        // Prefer a completely empty slot first so distinct colors fill before
        // anyone doubles up as a co-op partner (otherwise everyone piles into
        // slot 0 and a 2-player game can never start).
        for (let i = 0; i < playerLimit; i++) {
          if (occupantsAt(i) === 0) { playerIndex = i; break; }
        }
        // All slots have at least one player — allow co-op doubling (max 2/slot).
        if (playerIndex === -1) {
          for (let i = 0; i < playerLimit; i++) {
            if (occupantsAt(i) < 2) { playerIndex = i; break; }
          }
        }
      }
      if (playerIndex === -1) {
        assignedRole = "spectator";
      }
    }

    this.sessions.set(ws, { id: clientId, name, role: assignedRole, index: playerIndex });

    // Inform the client about successful connection and role assignment
    ws.send(JSON.stringify({
      type: "connected",
      clientId,
      code,
      role: assignedRole,
      index: playerIndex,
      variant,
      mode: this.mode
    }));

    // Broadcast current client list to the room
    this.broadcastClientList();

    // Play back cached game state so late arrivals or reconnecting players sync up instantly
    if (this.lastState) {
      ws.send(JSON.stringify({
        type: "relay",
        sender: this.lastStateSender || "Server",
        action: this.lastState
      }));
    }

    // WebSocket Message Handling
    ws.addEventListener("message", async (msg) => {
      try {
        const data = JSON.parse(msg.data);

        // 1. Claim Slot index (Co-op slots)
        if (data.type === "claim_slot") {
          const session = this.sessions.get(ws);
          const targetIndex = parseInt(data.index);
          
          let occupants = 0;
          this.sessions.forEach(s => {
            if (s.role === "player" && s.index === targetIndex) {
              occupants++;
            }
          });

          if (targetIndex >= 0 && targetIndex < playerLimit && occupants < 2) {
            session.role = "player";
            session.index = targetIndex;
            this.broadcastClientList();

            ws.send(JSON.stringify({
              type: "connected",
              clientId,
              code,
              role: "player",
              index: targetIndex,
              variant,
              mode: this.mode
            }));
          } else {
            ws.send(JSON.stringify({
              type: "toast",
              message: "Slot is full! Max 2 players per slot."
            }));
          }
          return;
        }

        // 2. Claim Spectator role
        if (data.type === "claim_spectator") {
          const session = this.sessions.get(ws);
          session.role = "spectator";
          session.index = -1;
          this.broadcastClientList();

          ws.send(JSON.stringify({
            type: "connected",
            clientId,
            code,
            role: "spectator",
            index: -1,
            variant,
            mode: this.mode
          }));
          return;
        }

        // 3. Relays are messages passed through to everyone else
        if (data.type === "relay") {
          const session = this.sessions.get(ws);
          
          // SECURITY check: Spectators cannot send game-modifying actions (moves, setup, start, restarts)
          if (session.role === "spectator" && data.action && data.action.type !== "chat") {
            return; // Ignore unauthorized actions
          }

          // Cache game state updates to support re-sync on refresh/disconnect
          if (data.action && (
            data.action.type === "state_update" || 
            data.action.type === "start_game" || 
            data.action.type === "move" ||
            data.action.type === "drop" ||
            data.action.type === "lobby_sync"
          )) {
            this.lastState = data.action;
            this.lastStateSender = data.sender || name;
          }

          const payload = JSON.stringify({
            type: "relay",
            sender: data.sender || name,
            role: session.role,
            index: session.index,
            action: data.action
          });

          // Broadcast to everyone EXCEPT the sender
          this.broadcast(payload, ws);
        }
      } catch (err) {
        console.error("WebSocket message processing error:", err);
      }
    });

    // Cleanup on disconnect
    const onClose = () => {
      this.sessions.delete(ws);
      this.broadcastClientList();

      // If room is completely empty, clean it up
      if (this.sessions.size === 0) {
        // Unregister room from GlobalStore
        const id = this.env.GLOBAL_STORE.idFromName("global");
        const store = this.env.GLOBAL_STORE.get(id);
        store.fetch("http://global/rooms-unregister", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code })
        }).catch(err => console.error("GlobalStore unregister failed:", err));
      }
    };

    ws.addEventListener("close", onClose);
    ws.addEventListener("error", onClose);
  }

  broadcast(message, excludeWs = null) {
    this.sessions.forEach((session, ws) => {
      if (ws !== excludeWs) {
        try {
          ws.send(message);
        } catch (e) {
          this.sessions.delete(ws);
        }
      }
    });
  }

  broadcastClientList() {
    const clients = [];
    this.sessions.forEach((s) => {
      clients.push({ id: s.id, name: s.name, role: s.role, index: s.index });
    });

    const payload = JSON.stringify({
      type: "room_list",
      variant: this.variant,
      mode: this.mode,
      clients
    });

    this.broadcast(payload);
  }
}
