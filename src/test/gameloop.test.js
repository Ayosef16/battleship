/* eslint-env jest */
import gameLoopFactory from "../modules/gameloop";

test("check that you can get the player gameboard", () => {
  const game = gameLoopFactory();
  expect(game.getPlayerBoard()).toEqual([
    ["1", "1", "1", "1", "1", "", "", "", "", ""],
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

test("check that the player have the first turn", () => {
  const game = gameLoopFactory();
  expect(game.getCurrentPlayerName()).toBe("player");
});

test("check that the computer have the second turn if the player misson the first round", () => {
  const game = gameLoopFactory();
  game.playerTurn(9, 9);
  expect(game.getCurrentPlayerName()).toBe("computer");
});

test("check that the player have the second turn if the player hit a ship on the first round", () => {
  const game = gameLoopFactory();
  game.playerTurn(0, 0);
  expect(game.getCurrentPlayerName()).toBe("player");
});

test("check that the player have consecutive turns as long as it keeps hitting a ship", () => {
  const game = gameLoopFactory();
  expect(game.getCurrentPlayerName()).toBe("player");
  game.playerTurn(0, 0);
  expect(game.getCurrentPlayerName()).toBe("player");
  game.playerTurn(1, 0);
  expect(game.getCurrentPlayerName()).toBe("player");
  game.playerTurn(2, 0);
  expect(game.getCurrentPlayerName()).toBe("player");
});

test("check that there is no winner on the first turn", () => {
  const game = gameLoopFactory();
  expect(game.checkWinner()).toBeFalsy();
});

test("check that the player wins when the computer have all it's ship sunk", () => {
  const game = gameLoopFactory();
  game.playerTurn(1, 1);
  game.playerTurn(1, 2);
  game.playerTurn(1, 3);
  game.playerTurn(1, 4);
  game.playerTurn(1, 5);
  game.playerTurn(4, 2);
  game.playerTurn(5, 2);
  game.playerTurn(6, 2);
  game.playerTurn(7, 2);
  game.playerTurn(0, 0);
  game.playerTurn(1, 0);
  game.playerTurn(2, 0);
  game.playerTurn(9, 1);
  game.playerTurn(9, 2);
  game.playerTurn(9, 3);
  game.playerTurn(8, 7);
  game.playerTurn(8, 8);
  game.playerTurn(5, 3);
  game.playerTurn(5, 4);
  game.playerTurn(3, 7);
  game.playerTurn(4, 7);
  game.playerTurn(9, 8);
  game.playerTurn(0, 9);
  game.playerTurn(3, 3);
  game.playerTurn(2, 8);
  expect(game.checkWinner()).toBeTruthy();
  expect(game.declareWinner()).toBe("player wins!");
});
