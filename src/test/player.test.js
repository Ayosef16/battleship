/* eslint-env jest */

import playerFactory, { computerFactory } from "../modules/player";
import gameBoardFactory from "../modules/gameboard";

test("check that creating a new player with a given name works", () => {
  const player = playerFactory("ayosef");
  expect(player.getName()).toBe("ayosef");
});

test("check that attack method is working on the enemy gameboard", () => {
  const gameboard = gameBoardFactory();
  const player = playerFactory("sergio");
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
  player.attack(1, 1, gameboard);
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

test("check that a new computer has a name", () => {
  const computer = computerFactory();
  expect(computer.getName()).toBe("computer");
});
