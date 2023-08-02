import shipFactory from "./ship";

// Make a game board factory that works as a gameboard for the battleship game.
export default function gameBoardFactory() {
  // Create gameboard grid
  const gameboard = createGameBoardGrid();
  const getGameBoard = () => gameboard;

  // Variables to keep track of how many ships have been placed and to store them
  let shipCount = 0;
  const ships = new Map();
  const getShips = () => ships;

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

    // Check that the ships doesn't overlap
    const isShipOverlapped = shipOverlap(gameboard, x, y, size, direction);
    if (isShipOverlapped) return "Ships are overlapping, cannot be placed";

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

  const receiveAttack = (x, y) => {
    // Make sure it doesn't receive an attack outside the gameboard
    if (x >= gameboard.length || y >= gameboard.length)
      return "Invalid coordinates";

    // Update the number of hits on the ship if it's not empty or a hit already
    if (gameboard[x][y] !== "" && gameboard[x][y] !== "x") {
      ships.get(gameboard[x][y]).hit();
    }
    // Change the gameboard only if the coordinates are not a missed attack
    if (gameboard[x][y] !== "x") {
      gameboard[x][y] = "x";
    } else {
      return "Cannot attack the same spot twice";
    }
  };

  const isAllShipsSunk = () => allShipsSunk(ships);

  return { getGameBoard, placeShip, receiveAttack, getShips, isAllShipsSunk };
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

// Make a function that check if a ship is overlapping with another
function shipOverlap(gameboard, x, y, size, direction) {
  const endPoint = direction === "col" ? size + x : size + y;
  if (direction === "col") {
    for (let i = x; i < endPoint; i++) {
      if (gameboard[i][y] !== "") return true;
    }
  } else {
    for (let i = y; i < endPoint; i++) {
      if (gameboard[x][i] !== "") return true;
    }
  }
  return false;
}

// Make a function that check if all the ships have been sunk
function allShipsSunk(map) {
  const ships = [];
  map.forEach((value) => ships.push(value));
  return ships.every((ship) => ship.isSunk());
}
