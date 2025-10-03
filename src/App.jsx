import {useState} from "react";
import { GameBoard, Button, Players } from "gomoku-components";

function App() {
  const BOARD_SIZE = 15;
  const WIN_CONDITION = 5;

  const [board, setBoard] = useState(
    Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState("black");
  const [gameStatus, setGameStatus] = useState("ongoing"); // 'ongoing', 'won', 'draw'
  const [winner, setWinner] = useState(null);

  const players = [
    { id: "black", name: "Player 1", color: "black" },
    { id: "white", name: "Player 2", color: "white" },
  ];

  const checkWin = (boardState, col, row, color) => {
    const directions = [
      { dx: 1, dy: 0 }, // horizontal
      { dx: 0, dy: 1 }, // vertical
      { dx: 1, dy: 1 }, // diagonal \
      { dx: 1, dy: -1 }, // diagonal /
    ];

    for (let { dx, dy } of directions) {
      let count = 1;

      // Check in positive direction
      let x = col + dx;
      let y = row + dy;
      while (
        x >= 0 &&
        x < BOARD_SIZE &&
        y >= 0 &&
        y < BOARD_SIZE &&
        boardState[y][x] === color
      ) {
        count++;
        x += dx;
        y += dy;
      }

      // Check in negative direction
      x = col - dx;
      y = row - dy;
      while (
        x >= 0 &&
        x < BOARD_SIZE &&
        y >= 0 &&
        y < BOARD_SIZE &&
        boardState[y][x] === color
      ) {
        count++;
        x -= dx;
        y -= dy;
      }

      if (count >= WIN_CONDITION) {
        return true;
      }
    }

    return false;
  };

  const checkDraw = (boardState) => {
    return boardState.every((row) => row.every((cell) => cell !== null));
  };

  const makeMove = (col, row) => {
    // Can't make move if game is over
    if (gameStatus !== "ongoing") return;

    // Can't place stone on occupied cell
    if (board[row][col] !== null) return;

    // Create new board with the move
    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? currentPlayer : cell
      )
    );

    setBoard(newBoard);

    // Check for win
    if (checkWin(newBoard, col, row, currentPlayer)) {
      setGameStatus("won");
      setWinner(currentPlayer);
      return;
    }

    // Check for draw
    if (checkDraw(newBoard)) {
      setGameStatus("draw");
      return;
    }

    // Switch player
    setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
  };

  const resetGame = () => {
    setBoard(
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => Array(BOARD_SIZE).fill(null))
    );
    setCurrentPlayer("black");
    setGameStatus("ongoing");
    setWinner(null);
  };

  return (
    <div className="app-container">
      <h1>Gomoku</h1>

      <Players
        players={players}
        currentPlayer={currentPlayer}
        winner={winner}
      />

      <GameBoard
        size={BOARD_SIZE}
        cells={board}
        onCellClick={makeMove}
        disabled={gameStatus !== "ongoing"}
        currentPlayer={currentPlayer}
      />

      {gameStatus !== "ongoing" && (
        <div className="game-over">
          <h2>Game Over</h2>
          {winner && (
            <p>Winner: {players.find((p) => p.id === winner)?.name}</p>
          )}
          {gameStatus === "draw" && <p>It's a draw!</p>}
          <Button onClick={resetGame} variant="primary">
            New Game
          </Button>
        </div>
      )}

      {gameStatus === "ongoing" && (
        <Button onClick={resetGame} variant="secondary">
          Reset Game
        </Button>
      )}
    </div>
  );
}

export default App;
