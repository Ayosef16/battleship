/* eslint-env jest */

import shipFactory from "../modules/ship";

test("checks that it creates a ship", () => {
  const ship = shipFactory(2);
  expect(ship).toBeDefined();
});

test("checks that the hit method is increasing the hits", () => {
  const ship = shipFactory(2);
  ship.hit();
  expect(ship.getHits()).toBe(1);
});

test("checks that the ship is not sunk when created", () => {
  const ship = shipFactory(2);
  expect(ship.isSunk()).toBe(false);
});

test("checks that the ship can be sunk", () => {
  const ship = shipFactory(2);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test("checks that the ship has a name", () => {
  const ship = shipFactory(5);
  expect(ship.getName()).toBe("Carrier");
});
