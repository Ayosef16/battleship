/* eslint-env jest */

import gameBoardFactory from "../modules/gameboard";

test("check that the game board is a 10x10 grid", () => {
  const gameboard = gameBoardFactory();
  expect(gameboard.getGameBoard()).toEqual([
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ]);
});

test("check that you can place a ship inside the game board", () => {
  const gameboard = gameBoardFactory();
  gameboard.placeShip(0, 0, 5);
  expect(gameboard.getGameBoard()).toEqual([
    ["1", "1", "1", "1", "1", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ]);
});

test("check that you can place a ship at coordinates (3,5) on the game board", () => {
  const gameboard = gameBoardFactory();
  gameboard.placeShip(3, 5, 3);
  expect(gameboard.getGameBoard()).toEqual([
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "1", "1", "1", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ]);
});

test("check that you can place more than 1 ship on the game board", () => {
  const gameboard = gameBoardFactory();
  gameboard.placeShip(3, 5, 3);
  gameboard.placeShip(6, 2, 5);
  expect(gameboard.getGameBoard()).toEqual([
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "1", "1", "1", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "2", "2", "2", "2", "2", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ]);
});

test("check that the ship is not placed outside of the game board", () => {
  const gameboard = gameBoardFactory();
  expect(gameboard.placeShip(9, 8, 3)).toBe("Ship cannot be placed");
  expect(gameboard.getGameBoard()).toEqual([
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ]);
});

test("check that you can place ships vertically", () => {
  const gameboard = gameBoardFactory();
  gameboard.placeShip(3, 5, 3, "col");
  gameboard.placeShip(6, 2, 5);
  expect(gameboard.getGameBoard()).toEqual([
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "1", "", "", "", ""],
    ["", "", "", "", "", "1", "", "", "", ""],
    ["", "", "", "", "", "1", "", "", "", ""],
    ["", "", "2", "2", "2", "2", "2", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ]);
});

test("check that you can't overlap ships", () => {
  const gameboard = gameBoardFactory();
  gameboard.placeShip(3, 5, 4, "col");
  expect(gameboard.placeShip(6, 2, 5)).toBe(
    "Ships are overlapping, cannot be placed"
  );
  expect(gameboard.getGameBoard()).toEqual([
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "1", "", "", "", ""],
    ["", "", "", "", "", "1", "", "", "", ""],
    ["", "", "", "", "", "1", "", "", "", ""],
    ["", "", "", "", "", "1", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
  ]);
});

test("check that receive attack can hit empty cells", () => {
  const gameboard = gameBoardFactory();
  gameboard.placeShip(0, 0, 5);
  gameboard.placeShip(3, 5, 4, "col");
  gameboard.placeShip(7, 0, 3, "col");
  gameboard.placeShip(9, 4, 3);
  gameboard.placeShip(6, 7, 2);
  gameboard.placeShip(6, 1, 2);
  gameboard.placeShip(2, 2, 2, "col");
  gameboard.placeShip(9, 9, 1);
  gameboard.placeShip(4, 7, 1);
  gameboard.placeShip(8, 3, 1);
  gameboard.placeShip(1, 8, 1);
  gameboard.receiveAttack(1, 1);
  expect(gameboard.getGameBoard()).toEqual([
    ["1", "1", "1", "1", "1", "", "", "", "", ""],
    ["", "x", "", "", "", "", "", "", "11", ""],
    ["", "", "7", "", "", "", "", "", "", ""],
    ["", "", "7", "", "", "2", "", "", "", ""],
    ["", "", "", "", "", "2", "", "9", "", ""],
    ["", "", "", "", "", "2", "", "", "", ""],
    ["", "6", "6", "", "", "2", "", "5", "5", ""],
    ["3", "", "", "", "", "", "", "", "", ""],
    ["3", "", "", "10", "", "", "", "", "", ""],
    ["3", "", "", "", "4", "4", "4", "", "", "8"],
  ]);
});

test("check that receive attack can hit ships", () => {
  const gameboard = gameBoardFactory();
  gameboard.placeShip(0, 0, 5);
  gameboard.placeShip(3, 5, 4, "col");
  gameboard.placeShip(7, 0, 3, "col");
  gameboard.placeShip(9, 4, 3);
  gameboard.placeShip(6, 7, 2);
  gameboard.placeShip(6, 1, 2);
  gameboard.placeShip(2, 2, 2, "col");
  gameboard.placeShip(9, 9, 1);
  gameboard.placeShip(4, 7, 1);
  gameboard.placeShip(8, 3, 1);
  gameboard.placeShip(1, 8, 1);
  gameboard.receiveAttack(0, 0);
  expect(gameboard.getGameBoard()).toEqual([
    ["x", "1", "1", "1", "1", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "11", ""],
    ["", "", "7", "", "", "", "", "", "", ""],
    ["", "", "7", "", "", "2", "", "", "", ""],
    ["", "", "", "", "", "2", "", "9", "", ""],
    ["", "", "", "", "", "2", "", "", "", ""],
    ["", "6", "6", "", "", "2", "", "5", "5", ""],
    ["3", "", "", "", "", "", "", "", "", ""],
    ["3", "", "", "10", "", "", "", "", "", ""],
    ["3", "", "", "", "4", "4", "4", "", "", "8"],
  ]);
});

test("check that you cannot hit the same spot twice", () => {
  const gameboard = gameBoardFactory();
  gameboard.placeShip(0, 0, 5);
  gameboard.placeShip(3, 5, 4, "col");
  gameboard.placeShip(7, 0, 3, "col");
  gameboard.placeShip(9, 4, 3);
  gameboard.placeShip(6, 7, 2);
  gameboard.placeShip(6, 1, 2);
  gameboard.placeShip(2, 2, 2, "col");
  gameboard.placeShip(9, 9, 1);
  gameboard.placeShip(4, 7, 1);
  gameboard.placeShip(8, 3, 1);
  gameboard.placeShip(1, 8, 1);
  gameboard.receiveAttack(0, 0);
  expect(gameboard.receiveAttack(0, 0)).toBe(
    "Cannot attack the same spot twice"
  );
});

test("check that you cannot outside the gameboard", () => {
  const gameboard = gameBoardFactory();
  expect(gameboard.receiveAttack(0, 10)).toBe("Invalid coordinates");
});
