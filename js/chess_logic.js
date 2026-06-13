// Unified Chess Rules Engine for Standard, Bughouse, and 4-Player Chess.
// Written in pure ES6 Javascript.

export class ChessLogic {
  constructor(variant = "standard", mode = "ffa") {
    this.variant = variant; // 'standard', 'bughouse', '4player'
    this.mode = mode;       // 'ffa', 'teams' (relevant for 4player)
    
    // Active player colors & turn tracking
    if (this.variant === "4player") {
      this.players = ["red", "blue", "yellow", "green"];
      this.turnIndex = 0; // Starts with Red (0)
      this.turns = { board: "red" };
    } else if (this.variant === "bughouse") {
      this.players = ["white", "black"];
      this.turns = { board1: "white", board2: "white" }; // separate clocks/turns
    } else {
      this.players = ["white", "black"];
      this.turns = { board: "white" };
    }

    this.eliminated = {
      white: false, black: false,
      red: false, blue: false, yellow: false, green: false
    };

    this.scores = { red: 0, blue: 0, yellow: 0, green: 0 };

    // Castling rights
    this.castling = {
      white: { kingside: true, queenside: true },
      black: { kingside: true, queenside: true },
      red: { kingside: true, queenside: true },
      blue: { kingside: true, queenside: true },
      yellow: { kingside: true, queenside: true },
      green: { kingside: true, queenside: true }
    };

    // Reserves for Bughouse, mapped by playerIndex (0, 1, 2, 3)
    this.reserves = {
      0: { p: 0, n: 0, b: 0, r: 0, q: 0 }, // Board 1 White
      1: { p: 0, n: 0, b: 0, r: 0, q: 0 }, // Board 1 Black
      2: { p: 0, n: 0, b: 0, r: 0, q: 0 }, // Board 2 Black
      3: { p: 0, n: 0, b: 0, r: 0, q: 0 }  // Board 2 White
    };

    // Track en passant targets
    this.enPassantSquare = null; // { row, col, playerColor }

    // Init boards
    if (this.variant === "bughouse") {
      this.board1 = this.initStandardBoard("board1");
      this.board2 = this.initStandardBoard("board2");
    } else if (this.variant === "4player") {
      this.board = this.init4PlayerBoard();
    } else {
      this.board = this.initStandardBoard("board");
    }
  }

  // Returns the active turn color for a board
  getTurnColor(boardId = "board") {
    if (this.variant === "bughouse") {
      return this.turns[boardId];
    }
    if (this.variant === "4player") {
      return this.players[this.turnIndex];
    }
    return this.turns.board;
  }

  // Next turn
  nextTurn(boardId = "board") {
    if (this.variant === "bughouse") {
      this.turns[boardId] = this.turns[boardId] === "white" ? "black" : "white";
    } else if (this.variant === "4player") {
      let limit = this.players.length;
      for (let i = 0; i < limit; i++) {
        this.turnIndex = (this.turnIndex + 1) % limit;
        const nextColor = this.players[this.turnIndex];
        if (!this.eliminated[nextColor]) {
          break; // found next active player
        }
      }
      this.turns.board = this.players[this.turnIndex];
    } else {
      this.turns.board = this.turns.board === "white" ? "black" : "white";
    }
  }

  // Standard 8x8 Board Initialization
  initStandardBoard(boardId = "board") {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    const backRow = ["r", "n", "b", "q", "k", "b", "n", "r"];
    
    // Board 1 vs Board 2 colors setup
    let whiteColor = "white";
    let blackColor = "black";

    if (this.variant === "bughouse") {
      if (boardId === "board1") {
        whiteColor = "white";
        blackColor = "black";
      } else {
        // Board 2 has Black vs White (Player C is Black, Player D is White)
        whiteColor = "white";
        blackColor = "black";
      }
    }

    // White pieces (Row 0, pawns on Row 1)
    for (let col = 0; col < 8; col++) {
      board[0][col] = { type: backRow[col], color: whiteColor, promoted: false };
      board[1][col] = { type: "p", color: whiteColor, promoted: false };
    }
    // Black pieces (Row 7, pawns on Row 6)
    for (let col = 0; col < 8; col++) {
      board[7][col] = { type: backRow[col], color: blackColor, promoted: false };
      board[6][col] = { type: "p", color: blackColor, promoted: false };
    }
    return board;
  }

  // 4-Player 14x14 Board Initialization
  init4PlayerBoard() {
    const board = Array(14).fill(null).map(() => Array(14).fill(null));
    
    // Out-of-bounds squares (3x3 corners)
    for (const r of [0, 1, 2, 11, 12, 13]) {
      for (const c of [0, 1, 2, 11, 12, 13]) {
        if ((r < 3 || r > 10) && (c < 3 || c > 10)) {
          board[r][c] = { type: "out", color: "none" }; // special out-of-bounds tag
        }
      }
    }

    const backRow = ["r", "n", "b", "q", "k", "b", "n", "r"];

    // Red (Bottom): Ranks 1 and 2 (rows 0, 1)
    for (let col = 3; col <= 10; col++) {
      board[0][col] = { type: backRow[col - 3], color: "red", promoted: false };
      board[1][col] = { type: "p", color: "red", promoted: false };
    }

    // Yellow (Top): Ranks 14 and 13 (rows 13, 12)
    for (let col = 3; col <= 10; col++) {
      board[13][col] = { type: backRow[col - 3], color: "yellow", promoted: false };
      board[12][col] = { type: "p", color: "yellow", promoted: false };
    }

    // Blue (Left): Files a and b (cols 0, 1)
    for (let row = 3; row <= 10; row++) {
      board[row][0] = { type: backRow[row - 3], color: "blue", promoted: false };
      board[row][1] = { type: "p", color: "blue", promoted: false };
    }

    // Green (Right): Files n and m (cols 13, 12)
    for (let row = 3; row <= 10; row++) {
      board[row][13] = { type: backRow[row - 3], color: "green", promoted: false };
      board[row][12] = { type: "p", color: "green", promoted: false };
    }

    return board;
  }

  // Get board array based on board id
  getBoardArray(boardId = "board") {
    if (this.variant === "bughouse") {
      return boardId === "board2" ? this.board2 : this.board1;
    }
    return this.board;
  }

  // Move validation entry point
  getValidMoves(row, col, boardId = "board") {
    const board = this.getBoardArray(boardId);
    const piece = board[row][col];
    if (!piece || piece.type === "out" || piece.color === "grey") return [];

    const rawMoves = this.getRawMoves(row, col, boardId);
    const validMoves = [];

    // Filter out moves that leave the King in check
    for (const move of rawMoves) {
      if (this.simulateMoveAndCheckKingSafety(row, col, move.row, move.col, piece.color, boardId)) {
        validMoves.push(move);
      }
    }

    // Add castling moves for King
    if (piece.type === "k") {
      validMoves.push(...this.getCastlingMoves(row, col, piece.color, boardId));
    }

    return validMoves;
  }

  // Get raw moves ignoring King safety checks (to prevent infinite loops)
  getRawMoves(row, col, boardId) {
    const board = this.getBoardArray(boardId);
    const piece = board[row][col];
    if (!piece) return [];
    
    switch (piece.type) {
      case "p": return this.getPawnMoves(row, col, piece.color, boardId);
      case "r": return this.getRookMoves(row, col, piece.color, boardId);
      case "n": return this.getKnightMoves(row, col, piece.color, boardId);
      case "b": return this.getBishopMoves(row, col, piece.color, boardId);
      case "q": return this.getQueenMoves(row, col, piece.color, boardId);
      case "k": return this.getKingBaseMoves(row, col, piece.color, boardId);
    }
    return [];
  }

  // Helper: check if a coordinate is inside board boundaries
  inBounds(row, col) {
    const size = this.variant === "4player" ? 14 : 8;
    return row >= 0 && row < size && col >= 0 && col < size;
  }

  // Standard sliding moves helper (Rook, Bishop, Queen)
  getSlidingMoves(row, col, dirs, color, boardId) {
    const board = this.getBoardArray(boardId);
    const moves = [];
    for (const [dr, dc] of dirs) {
      let r = row + dr;
      let c = col + dc;
      while (this.inBounds(r, c)) {
        const dest = board[r][c];
        if (dest && dest.type === "out") break;
        if (!dest) {
          moves.push({ row: r, col: c });
        } else {
          // Hit a piece. Can we capture?
          if (this.isEnemy(color, dest.color)) {
            moves.push({ row: r, col: c, capture: true });
          }
          break; // slide stopped
        }
        r += dr;
        c += dc;
      }
    }
    return moves;
  }

  // Helper to identify enemies vs teammates
  isEnemy(myColor, theirColor) {
    if (theirColor === "none" || theirColor === "grey") return false;
    if (this.mode === "teams" && this.variant === "4player") {
      // Red & Yellow vs Blue & Green
      const myTeam = (myColor === "red" || myColor === "yellow") ? "A" : "B";
      const theirTeam = (theirColor === "red" || theirColor === "yellow") ? "A" : "B";
      return myTeam !== theirTeam;
    }
    // FFA or regular/bughouse chess
    return myColor !== theirColor;
  }

  // ROOK MOVES
  getRookMoves(row, col, color, boardId) {
    return this.getSlidingMoves(row, col, [[1,0], [-1,0], [0,1], [0,-1]], color, boardId);
  }

  // BISHOP MOVES
  getBishopMoves(row, col, color, boardId) {
    return this.getSlidingMoves(row, col, [[1,1], [1,-1], [-1,1], [-1,-1]], color, boardId);
  }

  // QUEEN MOVES
  getQueenMoves(row, col, color, boardId) {
    return [
      ...this.getRookMoves(row, col, color, boardId),
      ...this.getBishopMoves(row, col, color, boardId)
    ];
  }

  // KNIGHT MOVES
  getKnightMoves(row, col, color, boardId) {
    const board = this.getBoardArray(boardId);
    const moves = [];
    const diffs = [
      [2, 1], [2, -1], [-2, 1], [-2, -1],
      [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];
    for (const [dr, dc] of diffs) {
      const r = row + dr;
      const c = col + dc;
      if (this.inBounds(r, c)) {
        const dest = board[r][c];
        if (dest && dest.type === "out") continue;
        if (!dest) {
          moves.push({ row: r, col: c });
        } else if (this.isEnemy(color, dest.color)) {
          moves.push({ row: r, col: c, capture: true });
        }
      }
    }
    return moves;
  }

  // KING BASE MOVES (no castling)
  getKingBaseMoves(row, col, color, boardId) {
    const board = this.getBoardArray(boardId);
    const moves = [];
    const dirs = [
      [1,0], [-1,0], [0,1], [0,-1],
      [1,1], [1,-1], [-1,1], [-1,-1]
    ];
    for (const [dr, dc] of dirs) {
      const r = row + dr;
      const c = col + dc;
      if (this.inBounds(r, c)) {
        const dest = board[r][c];
        if (dest && dest.type === "out") continue;
        if (!dest) {
          moves.push({ row: r, col: c });
        } else if (this.isEnemy(color, dest.color)) {
          moves.push({ row: r, col: c, capture: true });
        }
      }
    }
    return moves;
  }

  // PAWN MOVES
  getPawnMoves(row, col, color, boardId) {
    const board = this.getBoardArray(boardId);
    const moves = [];
    let fwdRow = 0;
    let fwdCol = 0;
    let startRow = -1;
    let startCol = -1;

    // Movement offsets relative to player color
    if (color === "white") {
      fwdRow = 1;
      startRow = 1;
    } else if (color === "black") {
      fwdRow = -1;
      startRow = 6;
    } else if (color === "red") {
      fwdRow = 1;
      startRow = 1;
    } else if (color === "yellow") {
      fwdRow = -1;
      startRow = 12;
    } else if (color === "blue") {
      fwdCol = 1;
      startCol = 1;
    } else if (color === "green") {
      fwdCol = -1;
      startCol = 12;
    }

    // Single step forward
    const nextRow = row + fwdRow;
    const nextCol = col + fwdCol;
    
    if (this.inBounds(nextRow, nextCol) && !board[nextRow][nextCol]) {
      moves.push({ row: nextRow, col: nextCol });
      
      // Double step forward (if on starting row/col)
      const doubleRow = row + 2 * fwdRow;
      const doubleCol = col + 2 * fwdCol;
      const isStart = (startRow !== -1 && row === startRow) || (startCol !== -1 && col === startCol);
      if (isStart && this.inBounds(doubleRow, doubleCol) && !board[doubleRow][doubleCol]) {
        moves.push({ row: doubleRow, col: doubleCol, doubleStep: true });
      }
    }

    // Diagonals for Capture
    const captureOffsets = [];
    if (fwdRow !== 0) {
      captureOffsets.push([fwdRow, -1], [fwdRow, 1]);
    } else {
      captureOffsets.push([-1, fwdCol], [1, fwdCol]);
    }

    for (const [dr, dc] of captureOffsets) {
      const r = row + dr;
      const c = col + dc;
      if (this.inBounds(r, c)) {
        const dest = board[r][c];
        if (dest && dest.type !== "out" && this.isEnemy(color, dest.color)) {
          moves.push({ row: r, col: c, capture: true });
        }
        
        // En Passant Capture
        if (this.enPassantSquare && this.enPassantSquare.row === r && this.enPassantSquare.col === c) {
          if (this.isEnemy(color, this.enPassantSquare.playerColor)) {
            moves.push({ row: r, col: c, capture: true, enPassant: true });
          }
        }
      }
    }

    return moves;
  }

  // CASTLING MOVES FOR KING
  getCastlingMoves(row, col, color, boardId) {
    const board = this.getBoardArray(boardId);
    const moves = [];
    const rights = this.castling[color];
    if (!rights || (!rights.kingside && !rights.queenside)) return [];
    if (this.isKingInCheck(color, boardId)) return []; // Cannot castle out of check

    if (this.variant === "4player") {
      // 4-Player castling vertical/horizontal depends on color
      if (color === "red" || color === "yellow") {
        const r = (color === "red") ? 0 : 13;
        // Kingside castling (rightwards towards Rook at col 10)
        if (rights.kingside && board[r][8] === null && board[r][9] === null) {
          if (this.isSquareSafe(r, 7, color, boardId) && this.isSquareSafe(r, 8, color, boardId) && this.isSquareSafe(r, 9, color, boardId)) {
            moves.push({ row: r, col: 9, castling: "kingside" });
          }
        }
        // Queenside castling (leftwards towards Rook at col 3)
        if (rights.queenside && board[r][6] === null && board[r][5] === null && board[r][4] === null) {
          if (this.isSquareSafe(r, 7, color, boardId) && this.isSquareSafe(r, 6, color, boardId) && this.isSquareSafe(r, 5, color, boardId)) {
            moves.push({ row: r, col: 5, castling: "queenside" });
          }
        }
      } else {
        // Blue (col 0) / Green (col 13)
        const c = (color === "blue") ? 0 : 13;
        // Kingside castling (upwards towards Rook at row 10)
        if (rights.kingside && board[8][c] === null && board[9][c] === null) {
          if (this.isSquareSafe(7, c, color, boardId) && this.isSquareSafe(8, c, color, boardId) && this.isSquareSafe(9, c, color, boardId)) {
            moves.push({ row: 9, col: c, castling: "kingside" });
          }
        }
        // Queenside castling (downwards towards Rook at row 3)
        if (rights.queenside && board[6][c] === null && board[5][c] === null && board[4][c] === null) {
          if (this.isSquareSafe(7, c, color, boardId) && this.isSquareSafe(6, c, color, boardId) && this.isSquareSafe(5, c, color, boardId)) {
            moves.push({ row: 5, col: c, castling: "queenside" });
          }
        }
      }
    } else {
      // Standard 8x8 Board Castling
      const r = (color === "white") ? 0 : 7;
      // Kingside castling (to g1/g8)
      if (rights.kingside && board[r][5] === null && board[r][6] === null) {
        if (this.isSquareSafe(r, 4, color, boardId) && this.isSquareSafe(r, 5, color, boardId) && this.isSquareSafe(r, 6, color, boardId)) {
          moves.push({ row: r, col: 6, castling: "kingside" });
        }
      }
      // Queenside castling (to c1/c8)
      if (rights.queenside && board[r][3] === null && board[r][2] === null && board[r][1] === null) {
        if (this.isSquareSafe(r, 4, color, boardId) && this.isSquareSafe(r, 3, color, boardId) && this.isSquareSafe(r, 2, color, boardId)) {
          moves.push({ row: r, col: 2, castling: "queenside" });
        }
      }
    }

    return moves;
  }

  // Check if a square is attacked by any enemy
  isSquareSafe(row, col, defenderColor, boardId) {
    const board = this.getBoardArray(boardId);
    const size = this.variant === "4player" ? 14 : 8;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const piece = board[r][c];
        if (piece && piece.type !== "out" && this.isEnemy(defenderColor, piece.color)) {
          const raw = this.getRawMoves(r, c, boardId);
          const attacks = raw.some(m => m.row === row && m.col === col);
          if (attacks) return false;
        }
      }
    }
    return true;
  }

  // Find King coordinates
  findKing(color, boardId) {
    const board = this.getBoardArray(boardId);
    const size = this.variant === "4player" ? 14 : 8;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const piece = board[r][c];
        if (piece && piece.type === "k" && piece.color === color) {
          return { row: r, col: c };
        }
      }
    }
    return null;
  }

  // Check if King is currently in check
  isKingInCheck(color, boardId) {
    const kingPos = this.findKing(color, boardId);
    if (!kingPos) return false; // King eliminated
    return !this.isSquareSafe(kingPos.row, kingPos.col, color, boardId);
  }

  // Simulate move and evaluate if King is safe
  simulateMoveAndCheckKingSafety(fromRow, fromCol, toRow, toCol, color, boardId) {
    const board = this.getBoardArray(boardId);
    const piece = board[fromRow][fromCol];
    const originalDest = board[toRow][toCol];

    // Simulate
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = null;

    // Check check
    const isSafe = !this.isKingInCheck(color, boardId);

    // Revert
    board[fromRow][fromCol] = piece;
    board[toRow][toCol] = originalDest;

    return isSafe;
  }

  // Drop validation for Bughouse
  getValidDrops(pieceType, boardId = "board1") {
    if (this.variant !== "bughouse") return [];
    const board = this.getBoardArray(boardId);
    const activeColor = this.getTurnColor(boardId);

    // Get correct player index based on board and color
    let pIndex = -1;
    if (boardId === "board1") {
      pIndex = activeColor === "white" ? 0 : 1;
    } else {
      pIndex = activeColor === "black" ? 2 : 3;
    }

    // Verify if player has the piece in reserve
    if (!this.reserves[pIndex] || !this.reserves[pIndex][pieceType] || this.reserves[pIndex][pieceType] <= 0) {
      return [];
    }

    const validDrops = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] === null) {
          // Pawn cannot be dropped on rank 1 or 8
          if (pieceType === "p" && (r === 0 || r === 7)) {
            continue;
          }

          // Simulate drop and check King safety
          board[r][c] = { type: pieceType, color: activeColor, promoted: false };
          const isSafe = !this.isKingInCheck(activeColor, boardId);
          board[r][c] = null;

          if (isSafe) {
            validDrops.push({ row: r, col: c });
          }
        }
      }
    }
    return validDrops;
  }

  // Apply a drop move
  applyDrop(pieceType, toRow, toCol, boardId = "board1") {
    if (this.variant !== "bughouse") return false;
    const board = this.getBoardArray(boardId);
    const turnColor = this.getTurnColor(boardId);

    // Get player index
    let pIndex = -1;
    if (boardId === "board1") {
      pIndex = turnColor === "white" ? 0 : 1;
    } else {
      pIndex = turnColor === "black" ? 2 : 3;
    }

    if (!this.reserves[pIndex] || !this.reserves[pIndex][pieceType] || this.reserves[pIndex][pieceType] <= 0) {
      return false;
    }

    board[toRow][toCol] = { type: pieceType, color: turnColor, promoted: false };
    this.reserves[pIndex][pieceType]--;
    
    this.enPassantSquare = null; // Clear EP on drops
    this.nextTurn(boardId);
    return true;
  }

  // Apply a board move
  applyMove(fromRow, fromCol, toRow, toCol, promoType = "q", boardId = "board") {
    const board = this.getBoardArray(boardId);
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    const validMoves = this.getValidMoves(fromRow, fromCol, boardId);
    const move = validMoves.find(m => m.row === toRow && m.col === toCol);
    if (!move) return false;

    let pointsScored = 0;
    const destPiece = board[toRow][toCol];

    // Handle standard captures & scoring / Bughouse transfers
    if (destPiece && destPiece.type !== "out") {
      if (this.variant === "4player" && this.mode === "ffa") {
        pointsScored = this.getPieceScoreValue(destPiece);
      }

      // Hand over captured pieces in Bughouse to partner's reserve
      if (this.variant === "bughouse") {
        const pieceTypeToPass = destPiece.promoted ? "p" : destPiece.type;
        if (boardId === "board1") {
          if (destPiece.color === "black") {
            // White captured Black on Board 1 -> Passes to Player 2 (Black, Board 2)
            this.reserves[2][pieceTypeToPass]++;
          } else {
            // Black captured White on Board 1 -> Passes to Player 3 (White, Board 2)
            this.reserves[3][pieceTypeToPass]++;
          }
        } else {
          if (destPiece.color === "white") {
            // Black captured White on Board 2 -> Passes to Player 0 (White, Board 1)
            this.reserves[0][pieceTypeToPass]++;
          } else {
            // White captured Black on Board 2 -> Passes to Player 1 (Black, Board 1)
            this.reserves[1][pieceTypeToPass]++;
          }
        }
      }
    }

    // En Passant capture execution
    if (move.enPassant) {
      const epRow = fromRow;
      const epCol = toCol;
      const capturedPawn = board[epRow][epCol];
      if (capturedPawn) {
        if (this.variant === "4player" && this.mode === "ffa") {
          pointsScored = this.getPieceScoreValue(capturedPawn);
        }
        if (this.variant === "bughouse") {
          if (boardId === "board1") {
            if (capturedPawn.color === "black") {
              this.reserves[2]["p"]++;
            } else {
              this.reserves[3]["p"]++;
            }
          } else {
            if (capturedPawn.color === "white") {
              this.reserves[0]["p"]++;
            } else {
              this.reserves[1]["p"]++;
            }
          }
        }
        board[epRow][epCol] = null;
      }
    }

    // Castling execution
    if (move.castling) {
      const r = toRow;
      if (this.variant === "4player") {
        if (piece.color === "red" || piece.color === "yellow") {
          if (move.castling === "kingside") {
            board[r][8] = board[r][10]; // Rook
            board[r][10] = null;
          } else {
            board[r][6] = board[r][3]; // Rook
            board[r][3] = null;
          }
        } else {
          // Vertical Castling for Blue/Green
          const c = toCol;
          if (move.castling === "kingside") {
            board[8][c] = board[10][c]; // Rook
            board[10][c] = null;
          } else {
            board[6][c] = board[3][c]; // Rook
            board[3][c] = null;
          }
        }
      } else {
        if (move.castling === "kingside") {
          board[r][5] = board[r][7]; // Rook
          board[r][7] = null;
        } else {
          board[r][3] = board[r][0]; // Rook
          board[r][0] = null;
        }
      }
    }

    // Make the move
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = null;

    // Loss of castling rights
    if (piece.type === "k") {
      this.castling[piece.color].kingside = false;
      this.castling[piece.color].queenside = false;
    }
    if (piece.type === "r") {
      if (this.variant === "4player") {
        if (piece.color === "red" || piece.color === "yellow") {
          if (fromCol === 10) this.castling[piece.color].kingside = false;
          if (fromCol === 3) this.castling[piece.color].queenside = false;
        } else {
          if (fromRow === 10) this.castling[piece.color].kingside = false;
          if (fromRow === 3) this.castling[piece.color].queenside = false;
        }
      } else {
        if (fromCol === 7) this.castling[piece.color].kingside = false;
        if (fromCol === 0) this.castling[piece.color].queenside = false;
      }
    }

    // Set/Clear en passant targets
    if (move.doubleStep) {
      this.enPassantSquare = {
        row: Math.round((fromRow + toRow) / 2),
        col: Math.round((fromCol + toCol) / 2),
        playerColor: piece.color
      };
    } else {
      this.enPassantSquare = null;
    }

    // Pawn Promotion checks
    let isPromo = false;
    if (piece.type === "p") {
      let promoRank = -1;
      if (this.variant === "4player") {
        const step = this.mode === "teams" ? 11 : 8; // 11th rank in Teams, 8th in FFA
        if (piece.color === "red") promoRank = step - 1;
        if (piece.color === "yellow") promoRank = 14 - step;
        if (piece.color === "blue") {
          if (toCol === step - 1) isPromo = true;
        }
        if (piece.color === "green") {
          if (toCol === 14 - step) isPromo = true;
        }
        if (toRow === promoRank) isPromo = true;
      } else {
        // Standard promotion
        promoRank = piece.color === "white" ? 7 : 0;
        if (toRow === promoRank) isPromo = true;
      }

      if (isPromo) {
        // Promoted pieces have a 'promoted' tag so they are worth 1 pt when captured
        board[toRow][toCol] = { type: promoType.toLowerCase(), color: piece.color, promoted: true };
      }
    }

    // Update FFA scores
    if (pointsScored > 0) {
      this.scores[piece.color] += pointsScored;
    }

    this.nextTurn(boardId);
    return true;
  }

  // Get FFA captures point values
  getPieceScoreValue(piece) {
    if (piece.promoted) return 1; // Promoted Queens/Rooks/Bishops/Knights worth 1 pt
    switch (piece.type) {
      case "p": return 1;
      case "n": return 3;
      case "b": return 5;
      case "r": return 5;
      case "q": return 9;
    }
    return 0;
  }

  // Checks game end conditions
  checkGameEndStates(boardId = "board") {
    const activeColor = this.getTurnColor(boardId);
    const board = this.getBoardArray(boardId);

    // Count if there are legal moves
    let hasLegalMoves = false;
    const size = this.variant === "4player" ? 14 : 8;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const piece = board[r][c];
        if (piece && piece.type !== "out" && piece.color === activeColor) {
          const moves = this.getValidMoves(r, c, boardId);
          if (moves.length > 0) {
            hasLegalMoves = true;
            break;
          }
        }
      }
      if (hasLegalMoves) break;
    }

    // If there are valid drops in Bughouse, player has legal moves
    if (this.variant === "bughouse" && !hasLegalMoves) {
      let pIndex = -1;
      if (boardId === "board1") {
        pIndex = activeColor === "white" ? 0 : 1;
      } else {
        pIndex = activeColor === "black" ? 2 : 3;
      }

      const reserve = this.reserves[pIndex];
      if (reserve) {
        for (const [pieceType, count] of Object.entries(reserve)) {
          if (count > 0 && this.getValidDrops(pieceType, boardId).length > 0) {
            hasLegalMoves = true;
            break;
          }
        }
      }
    }

    const inCheck = this.isKingInCheck(activeColor, boardId);

    if (!hasLegalMoves) {
      if (inCheck) {
        return "checkmate";
      } else {
        return "stalemate";
      }
    }
    return null;
  }

  // Eliminate a player in 4-Player FFA
  eliminatePlayer(color) {
    this.eliminated[color] = true;
    
    // Remove their King
    const board = this.board;
    const kingPos = this.findKing(color, "board");
    if (kingPos) {
      board[kingPos.row][kingPos.col] = null;
    }

    // Turn all remaining pieces grey
    for (let r = 0; r < 14; r++) {
      for (let c = 0; c < 14; c++) {
        const piece = board[r][c];
        if (piece && piece.color === color) {
          piece.color = "grey";
        }
      }
    }
  }
}
