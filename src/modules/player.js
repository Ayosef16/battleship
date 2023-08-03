import { createGameBoardGrid } from "./gameboard";

export default function playerFactory(name) {
  const getName = () => name;
  const attack = (x, y, gameboard) => gameboard.receiveAttack(x, y);
  return { getName, attack };
}

export function computerFactory() {
  const getName = () => "computer";
  const coordinates = generateCoordinate();
  const attack = (gameboard) => {
    const { x, y } = coordinates.getValidCoordinates();
    gameboard.receiveAttack(x, y);
  };
  return { getName, attack };
}

function randomNumber(size = 10) {
  const number = Math.floor(Math.random() * size);
  return number;
}

function generateCoordinate(size = 10) {
  const coordinates = createGameBoardGrid(size);
  let availableCoordinates = size * size;
  const getValidCoordinates = () => {
    const x = randomNumber(size);
    const y = randomNumber(size);
    if (availableCoordinates === 0) return "No more coordinates to attack";
    if (coordinates[x][y] === "") {
      coordinates[x][y] = "attacked";
      availableCoordinates--;
      return { x, y };
    }

    const result = getValidCoordinates();
    return result;
  };
  return { getValidCoordinates, getCoordinates: () => coordinates };
}
