import gameBoardFactory from "./gameboard";
import playerFactory, { computerFactory } from "./player";

export default function gameLoopFactory() {
  // Create gameboards, player and computer
  const playerGameBoard = gameBoardFactory();
  const computerGameBoard = gameBoardFactory();
  const player = playerFactory("player");
  const computer = computerFactory();

  // Get player and computer board
  const getPlayerBoard = () => playerGameBoard;
  const getComputerBoard = () => computerGameBoard;

  // Place player ships
  playerGameBoard.placeShip(0, 0, 5);
  playerGameBoard.placeShip(3, 5, 4, "col");
  playerGameBoard.placeShip(7, 0, 3, "col");
  playerGameBoard.placeShip(9, 4, 3);
  playerGameBoard.placeShip(6, 7, 2);
  playerGameBoard.placeShip(6, 1, 2);
  playerGameBoard.placeShip(2, 2, 2, "col");
  playerGameBoard.placeShip(9, 9, 1);
  playerGameBoard.placeShip(4, 7, 1);
  playerGameBoard.placeShip(8, 3, 1);
  playerGameBoard.placeShip(1, 8, 1);

  // Place computer ships
  computerGameBoard.placeShip(1, 1, 5);
  computerGameBoard.placeShip(4, 2, 4, "col");
  computerGameBoard.placeShip(0, 0, 3, "col");
  computerGameBoard.placeShip(9, 1, 3);
  computerGameBoard.placeShip(8, 7, 2);
  computerGameBoard.placeShip(5, 3, 2);
  computerGameBoard.placeShip(3, 7, 2, "col");
  computerGameBoard.placeShip(9, 8, 1);
  computerGameBoard.placeShip(0, 9, 1);
  computerGameBoard.placeShip(3, 3, 1);
  computerGameBoard.placeShip(2, 8, 1);

  // Define a turn variable, starting with the player
  let isPlayerTurn = true;

  // Get the name of whoever is playing in the current turn
  const getCurrentPlayerName = () => {
    if (isPlayerTurn) return player.getName();
    return computer.getName();
  };

  // Define the player turn
  const playerTurn = (x, y) => {
    if (checkWinner()) {
      declareWinner();
      return;
    }
    if (isPlayerTurn) {
      player.attack(x, y, computerGameBoard);

      // Check if the player plays again or not
      isPlayerTurn = computerGameBoard.isShipHitted(x, y);
    }
  };

  // Define the computer turn
  const computerTurn = () => {
    if (checkWinner()) {
      declareWinner();
      return;
    }
    if (!isPlayerTurn) {
      const result = computer.attack(playerGameBoard);
      const compX = result.x;
      const compY = result.y;

      // Check if the computer plays again or not
      isPlayerTurn = !playerGameBoard.isShipHitted(compX, compY);
    }
  };

  // Check for a winner
  const checkWinner = () => {
    if (
      playerGameBoard.isAllShipsSunk() ||
      computerGameBoard.isAllShipsSunk()
    ) {
      return true;
    }
    return false;
  };

  // Declare the winner
  const declareWinner = () => {
    if (playerGameBoard.isAllShipsSunk()) return `${computer.getName()} wins!`;
    return `${player.getName()} wins!`;
  };
  return {
    getPlayerBoard,
    getComputerBoard,
    playerTurn,
    computerTurn,
    getCurrentPlayerName,
    declareWinner,
    checkWinner,
  };
}
