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
