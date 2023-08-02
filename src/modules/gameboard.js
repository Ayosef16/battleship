import shipFactory from "./ship";

// Make a game board factory that works as a gameboard for the battleship game.
export default function gameBoardFactory() {
  // Create gameboard grid
  const gameboard = createGameBoardGrid();
  const getGameBoard = () => gameboard;

  // Variables to keep track of how many ships have been placed and to store them
  let shipCount = 0;
  const ships = new Map();

  // Function that let you place ships on the gameboard
  const placeShip = (x, y, size, direction = "row") => {
    // Increase ship count and map the new ship
    shipCount++;
    const newShip = shipFactory(size);
    ships.set(`${shipCount}`, newShip);

    // Check that the ship beeing placed at the coordinates (x, y) doesn't go beyond gameboard size
    const gameBoardSize = gameboard.length;
    const endPoint = direction === "col" ? size + x : size + y;
    if (endPoint > gameBoardSize) return "Ship cannot be placed";

    // Place the ship on the gameboard checking for it's direction
    if (direction === "col") {
      for (let i = x; i < endPoint; i++) {
        gameboard[i][y] = `${shipCount}`;
      }
    } else {
      for (let i = y; i < endPoint; i++) {
        gameboard[x][i] = `${shipCount}`;
      }
    }
  };
  return { getGameBoard, placeShip };
}

// Make a function that creates a game board grid, default size is 10x10
function createGameBoardGrid(size = 10) {
  const gameboard = [];
  for (let row = 0; row < size; row++) {
    const newRow = [];
    for (let col = 0; col < size; col++) {
      newRow.push("");
    }
    gameboard.push(newRow);
  }
  return gameboard;
}
