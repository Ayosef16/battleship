/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/dom.js":
/*!****************************!*\
  !*** ./src/modules/dom.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   completeDomGrid: () => (/* binding */ completeDomGrid),
/* harmony export */   createCoordinateEvent: () => (/* binding */ createCoordinateEvent),
/* harmony export */   createDraggableEvents: () => (/* binding */ createDraggableEvents),
/* harmony export */   displayCurrentPlayer: () => (/* binding */ displayCurrentPlayer)
/* harmony export */ });
// Complete the grid on the website
function completeDomGrid() {
  // Get the player and computer grid
  const playerGrid = document.querySelector(".player-grid");
  const computerGrid = document.querySelector(".computer-grid");

  // Create the grid for the player and computer
  createDomGrid(playerGrid);
  createDomGrid(computerGrid);
}
function createDomGrid(grid) {
  let size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  // Create a size x size grid
  for (let i = 0; i < size; i++) {
    const newRow = document.createElement("div");
    newRow.classList.add("grid-row");
    for (let j = 0; j < size; j++) {
      const newCol = document.createElement("div");
      newCol.classList.add("grid-col");
      newCol.dataset.x = i;
      newCol.dataset.y = j;
      newRow.appendChild(newCol);
    }
    grid.appendChild(newRow);
  }
}
function createCoordinateEvent(game) {
  // Get computer grid and the coordinates from it
  const computerGrid = document.querySelector(".computer-grid");
  const coordinates = computerGrid.querySelectorAll(".grid-col");

  // Add an event listener to each coordinate
  coordinates.forEach(coordinate => coordinate.addEventListener("click", () => {
    if (coordinate.classList.contains("hit-ship") || coordinate.classList.contains("hit-miss")) return;
    const posX = parseInt(coordinate.dataset.x, 10);
    const posY = parseInt(coordinate.dataset.y, 10);

    // Check if there is a winner prevent further plays
    if (game.checkWinner()) return;

    // Check if it's the player turn
    if (game.getCurrentPlayerName() !== "computer") {
      displayCurrentPlayer(game.getCurrentPlayerName());
      game.playerTurn(posX, posY);
    }

    // Add the respective class to the hitted coordinate
    addCoordinateClass(posX, posY, game.getComputerBoard(), coordinate);

    // Let the computer play as long as it's it turn.
    while (game.getCurrentPlayerName() === "computer" && !game.checkWinner()) {
      updatePlayerGrid(game);
    }

    // Check if someone have won
    if (game.checkWinner()) {
      displayWinner(game);
    }
  }));
}

// Add a hit class to the coordinate
function addCoordinateClass(x, y, gameboard, coordinate) {
  if (gameboard.isShipHitted(x, y)) {
    coordinate.classList.add("hit-ship");
  } else {
    coordinate.classList.add("hit-miss");
  }
}

// Display the name of the current player
function displayCurrentPlayer(name) {
  const currentPlayer = document.querySelector(".current-player");
  currentPlayer.textContent = `${name} turn`;
}

// Make a function that updates the player grid when the computer attacks
function updatePlayerGrid(game) {
  // Get the player grid and it's coordinates
  const playerGrid = document.querySelector(".player-grid");
  const coordinates = playerGrid.querySelectorAll(".grid-col");

  // Get the x and y position randomly generated for the computer
  const result = game.computerTurn();

  // Check if there is no more coordinates to attack and if there is no winner
  if (result === "All coordinates have been attacked!" || !result) return;
  if (game.checkWinner()) return;

  // Split the result
  const {
    compX,
    compY
  } = result;

  // Get the index on the node list that represent the current coordinate
  let position;
  coordinates.forEach((coordinate, index) => {
    if (parseInt(coordinate.dataset.x, 10) === compX && parseInt(coordinate.dataset.y, 10) === compY) {
      position = index;
    }
  });

  // Get the coordinate
  const newCoordinate = coordinates[position];

  // Add the class to it
  addCoordinateClass(compX, compY, game.getPlayerBoard(), newCoordinate);
}

// Add a function that displays the winner
function displayWinner(game) {
  // Display the winner
  const gameWinner = document.querySelector(".game-winner");
  gameWinner.textContent = game.declareWinner();
  gameWinner.style.display = "block";

  // Hide the grids
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.style.display = "none";
}

// Create draggable events

function createDraggableEvents() {
  // Get all the ships
  const ships = document.querySelectorAll(".player-ships .ship");
  ships.forEach(ship => {
    ship.addEventListener("dragstart", dragStart);
  });

  // Get all the player grid col
  const playerCoordinates = document.querySelectorAll(".player-grid .grid-col");
  playerCoordinates.forEach(coordinate => {
    coordinate.addEventListener("dragenter", dragEnter);
    coordinate.addEventListener("dragover", dragOver);
    coordinate.addEventListener("dragleave", dragLeave);
    coordinate.addEventListener("drop", shipDrop);
  });
}
function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  console.log(e.target);
}
function dragEnter(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}
function dragOver(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}
function dragLeave(e) {
  e.target.classList.remove("drag-over");
}
function shipDrop(e) {
  e.target.classList.remove("drag-over");

  // Get the draggable element
  const id = e.dataTransfer.getData("text/plain");
  const draggable = document.getElementById(id);

  // Add it to the drop target
  e.target.appendChild(draggable);
}

/***/ }),

/***/ "./src/modules/gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/gameboard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createGameBoardGrid: () => (/* binding */ createGameBoardGrid),
/* harmony export */   "default": () => (/* binding */ gameBoardFactory)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");


// Make a game board factory that works as a gameboard for the battleship game.
function gameBoardFactory() {
  // Create gameboard and ship board to keep track of the ships
  const gameboard = createGameBoardGrid();
  const shipboard = createGameBoardGrid();
  const getGameBoard = () => gameboard;
  const getShipBoard = () => shipboard;

  // Variables to keep track of how many ships have been placed and to store them
  let shipCount = 0;
  const ships = new Map();
  const getShips = () => ships;

  // Function that let you place ships on the gameboard
  const placeShip = function (x, y, size) {
    let direction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "row";
    // Increase ship count and map the new ship
    shipCount++;
    const newShip = (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(size);
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
        shipboard[i][y] = `${shipCount}`;
      }
    } else {
      for (let i = y; i < endPoint; i++) {
        gameboard[x][i] = `${shipCount}`;
        shipboard[x][i] = `${shipCount}`;
      }
    }
  };
  const receiveAttack = (x, y) => {
    // Make sure it doesn't receive an attack outside the gameboard
    if (x >= gameboard.length || y >= gameboard.length) return "Invalid coordinates";

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
  const isShipHitted = (x, y) => {
    if (shipboard[x][y] !== "") return true;
    return false;
  };
  const isAllShipsSunk = () => allShipsSunk(ships);
  return {
    getGameBoard,
    getShipBoard,
    placeShip,
    receiveAttack,
    getShips,
    isShipHitted,
    isAllShipsSunk
  };
}

// Make a function that creates a game board grid, default size is 10x10
function createGameBoardGrid() {
  let size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
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
  map.forEach(value => ships.push(value));
  return ships.every(ship => ship.isSunk());
}

/***/ }),

/***/ "./src/modules/gameloop.js":
/*!*********************************!*\
  !*** ./src/modules/gameloop.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ gameLoopFactory)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/modules/gameboard.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/modules/player.js");


function gameLoopFactory() {
  // Create gameboards, player and computer
  const playerGameBoard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const computerGameBoard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const player = (0,_player__WEBPACK_IMPORTED_MODULE_1__["default"])("player");
  const computer = (0,_player__WEBPACK_IMPORTED_MODULE_1__.computerFactory)();

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
      console.log(declareWinner());
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
      console.log(declareWinner());
      return;
    }
    if (!isPlayerTurn) {
      const result = computer.attack(playerGameBoard);
      if (result === "All coordinates have been attacked") return "All coordinates have been attacked!";
      const compX = result.x;
      const compY = result.y;

      // Check if the computer plays again or not
      isPlayerTurn = !playerGameBoard.isShipHitted(compX, compY);
      return {
        compX,
        compY
      };
    }
  };

  // Check for a winner
  const checkWinner = () => {
    if (playerGameBoard.isAllShipsSunk() || computerGameBoard.isAllShipsSunk()) {
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
    checkWinner
  };
}

/***/ }),

/***/ "./src/modules/player.js":
/*!*******************************!*\
  !*** ./src/modules/player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computerFactory: () => (/* binding */ computerFactory),
/* harmony export */   "default": () => (/* binding */ playerFactory),
/* harmony export */   generateCoordinate: () => (/* binding */ generateCoordinate)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/modules/gameboard.js");

function playerFactory() {
  let name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "player";
  const getName = () => name;
  const attack = (x, y, gameboard) => gameboard.receiveAttack(x, y);
  return {
    getName,
    attack
  };
}
function computerFactory() {
  const getName = () => "computer";
  const coordinates = generateCoordinate();
  const attack = gameboard => {
    const result = coordinates.getValidCoordinates();
    if (result === "No more coordinates to attack") {
      return "All coordinates have been attacked";
    }
    const {
      x,
      y
    } = result;
    gameboard.receiveAttack(x, y);
    return {
      x,
      y
    };
  };
  return {
    getName,
    attack
  };
}
function randomNumber() {
  let size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  const number = Math.floor(Math.random() * size);
  return number;
}
function generateCoordinate() {
  let size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  const coordinates = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__.createGameBoardGrid)(size);
  let availableCoordinates = size * size;
  const getValidCoordinates = () => {
    const x = randomNumber(size);
    const y = randomNumber(size);
    if (availableCoordinates === 0) return "No more coordinates to attack";
    if (coordinates[x][y] === "") {
      coordinates[x][y] = "attacked";
      availableCoordinates--;
      return {
        x,
        y
      };
    }
    const result = getValidCoordinates();
    return result;
  };
  return {
    getValidCoordinates,
    getCoordinates: () => coordinates
  };
}

/***/ }),

/***/ "./src/modules/ship.js":
/*!*****************************!*\
  !*** ./src/modules/ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ shipFactory)
/* harmony export */ });
function shipFactory(size) {
  const length = size;
  let hits = 0;
  const name = getShipName(size);
  const hit = () => {
    if (hits < length) hits++;
  };
  const isSunk = () => !(length > hits);
  const getHits = () => hits;
  const getName = () => name;
  return {
    hit,
    isSunk,
    getHits,
    getName
  };
}
function getShipName(size) {
  switch (size) {
    case 5:
      return "Carrier";
    case 4:
      return "Battleship";
    case 3:
      return "Destroyer";
    case 2:
      return "Submarine";
    case 1:
      return "Patrol Boat";
    default:
      return "Invalid Ship Size";
  }
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/normalize.css/normalize.css":
/*!****************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/normalize.css/normalize.css ***!
  \****************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
  margin: 0;
}

/**
 * Render the \`main\` element consistently in IE.
 */

main {
  display: block;
}

/**
 * Correct the font size and margin on \`h1\` elements within \`section\` and
 * \`article\` contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Grouping content
   ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd \`em\` font sizing in all browsers.
 */

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
  font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd \`em\` font sizing in all browsers.
 */

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
  font-size: 80%;
}

/**
 * Prevent \`sub\` and \`sup\` elements from affecting the line height in
 * all browsers.
 */

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input { /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select { /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from \`fieldset\` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    \`fieldset\` elements in all browsers.
 */

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
  overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to \`inherit\` in Safari.
 */

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

details {
  display: block;
}

/*
 * Add the correct display in all browsers.
 */

summary {
  display: list-item;
}

/* Misc
   ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

template {
  display: none;
}

/**
 * Add the correct display in IE 10.
 */

[hidden] {
  display: none;
}
`, "",{"version":3,"sources":["webpack://./node_modules/normalize.css/normalize.css"],"names":[],"mappings":"AAAA,2EAA2E;;AAE3E;+EAC+E;;AAE/E;;;EAGE;;AAEF;EACE,iBAAiB,EAAE,MAAM;EACzB,8BAA8B,EAAE,MAAM;AACxC;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,SAAS;AACX;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;EACE,cAAc;EACd,gBAAgB;AAClB;;AAEA;+EAC+E;;AAE/E;;;EAGE;;AAEF;EACE,uBAAuB,EAAE,MAAM;EAC/B,SAAS,EAAE,MAAM;EACjB,iBAAiB,EAAE,MAAM;AAC3B;;AAEA;;;EAGE;;AAEF;EACE,iCAAiC,EAAE,MAAM;EACzC,cAAc,EAAE,MAAM;AACxB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,6BAA6B;AAC/B;;AAEA;;;EAGE;;AAEF;EACE,mBAAmB,EAAE,MAAM;EAC3B,0BAA0B,EAAE,MAAM;EAClC,iCAAiC,EAAE,MAAM;AAC3C;;AAEA;;EAEE;;AAEF;;EAEE,mBAAmB;AACrB;;AAEA;;;EAGE;;AAEF;;;EAGE,iCAAiC,EAAE,MAAM;EACzC,cAAc,EAAE,MAAM;AACxB;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;;EAEE,cAAc;EACd,cAAc;EACd,kBAAkB;EAClB,wBAAwB;AAC1B;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,WAAW;AACb;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,kBAAkB;AACpB;;AAEA;+EAC+E;;AAE/E;;;EAGE;;AAEF;;;;;EAKE,oBAAoB,EAAE,MAAM;EAC5B,eAAe,EAAE,MAAM;EACvB,iBAAiB,EAAE,MAAM;EACzB,SAAS,EAAE,MAAM;AACnB;;AAEA;;;EAGE;;AAEF;QACQ,MAAM;EACZ,iBAAiB;AACnB;;AAEA;;;EAGE;;AAEF;SACS,MAAM;EACb,oBAAoB;AACtB;;AAEA;;EAEE;;AAEF;;;;EAIE,0BAA0B;AAC5B;;AAEA;;EAEE;;AAEF;;;;EAIE,kBAAkB;EAClB,UAAU;AACZ;;AAEA;;EAEE;;AAEF;;;;EAIE,8BAA8B;AAChC;;AAEA;;EAEE;;AAEF;EACE,8BAA8B;AAChC;;AAEA;;;;;EAKE;;AAEF;EACE,sBAAsB,EAAE,MAAM;EAC9B,cAAc,EAAE,MAAM;EACtB,cAAc,EAAE,MAAM;EACtB,eAAe,EAAE,MAAM;EACvB,UAAU,EAAE,MAAM;EAClB,mBAAmB,EAAE,MAAM;AAC7B;;AAEA;;EAEE;;AAEF;EACE,wBAAwB;AAC1B;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;;EAEE,sBAAsB,EAAE,MAAM;EAC9B,UAAU,EAAE,MAAM;AACpB;;AAEA;;EAEE;;AAEF;;EAEE,YAAY;AACd;;AAEA;;;EAGE;;AAEF;EACE,6BAA6B,EAAE,MAAM;EACrC,oBAAoB,EAAE,MAAM;AAC9B;;AAEA;;EAEE;;AAEF;EACE,wBAAwB;AAC1B;;AAEA;;;EAGE;;AAEF;EACE,0BAA0B,EAAE,MAAM;EAClC,aAAa,EAAE,MAAM;AACvB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;EAEE;;AAEF;EACE,kBAAkB;AACpB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,aAAa;AACf;;AAEA;;EAEE;;AAEF;EACE,aAAa;AACf","sourcesContent":["/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\nmain {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n  display: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./images/sunny.jpg */ "./src/images/sunny.jpg"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 version=%271.1%27 preserveAspectRatio=%27none%27 viewBox=%270 0 100 100%27><path d=%27M100 0 L0 100 %27 stroke=%27red%27 stroke-width=%275%27/><path d=%27M0 0 L100 100 %27 stroke=%27red%27 stroke-width=%275%27/></svg> */ "data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 version=%271.1%27 preserveAspectRatio=%27none%27 viewBox=%270 0 100 100%27><path d=%27M100 0 L0 100 %27 stroke=%27red%27 stroke-width=%275%27/><path d=%27M0 0 L100 100 %27 stroke=%27red%27 stroke-width=%275%27/></svg>"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! ./images/ocean.png */ "./src/images/ocean.png"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `*,
*::after,
*::before {
  box-sizing: border-box;
}

:root {
  --dark-blue: #4682a9;
  --blue: #749bc2;
  --light-blue: #91c8e4;
  --white: #f6f4eb;
  --light-yellow: #fff7d4;
  --ship-block: 40px;
}

html {
  height: 100%;
}

body {
  min-height: 100vh;
  display: grid;
  font-family: "Roboto", sans-serif;
  grid:
    "header header header header" auto
    "main main main main" 1fr
    "footer footer footer footer" auto /
    1fr 1fr 1fr 1fr;
}

#header,
#footer {
  background-color: var(--blue);
}

#header {
  grid-area: header;
  font-family: "Ysabeau SC", sans-serif;
  text-align: center;
  font-size: 4rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 20px;
}

#main {
  grid-area: main;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}

.grid-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 100px;
}

.computer-container {
  display: none;
}

.player-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

.player-title {
  font-family: "Ysabeau SC", sans-serif;
  font-size: 3rem;
  font-weight: 900;
  color: var(--white);
  position: relative;
  isolation: isolate;
  padding: 20px;
}

.player-title::after {
  content: "";
  background-color: black;
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.7;
  border-radius: 1rem;
}

.player-body {
  display: flex;
  gap: 100px;
  align-items: center;
  justify-content: center;
}

.player-grid,
.computer-grid,
.player-ships {
  min-width: 400px;
  min-height: 400px;
  outline: 3px solid black;
  display: flex;
  flex-direction: column;
  position: relative;
  isolation: isolate;
}

.player-grid::after,
.computer-grid::after,
.player-ships::after {
  content: "";
  background-color: var(--light-blue);
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.8;
}

.player-ships {
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.destroyer-container,
.submarine-container,
.patrol-boat-container {
  display: flex;
  gap: 10px;
}

.ship {
  border: 2px solid var(--dark-blue);
  height: var(--ship-block);
}

.carrier {
  width: calc(var(--ship-block) * 5);
  background-color: var(--white);
}

.battleship {
  width: calc(var(--ship-block) * 4);
  background-color: lightgreen;
}

.destroyer {
  width: calc(var(--ship-block) * 3);
  background-color: lightpink;
}

.submarine {
  width: calc(var(--ship-block) * 2);
  background-color: lightslategray;
}

.patrol-boat {
  width: calc(var(--ship-block) * 1);
  background-color: plum;
}

.grid-row {
  flex: 1;
  display: flex;
}

.grid-col {
  border: 1px solid var(--white);
  flex: 1;
  transition: background-color 100ms ease-in-out;
}

.drag-over {
  border: 2px dashed red;
}

.computer-grid .grid-col:hover {
  cursor: pointer;
  background-color: var(--blue);
}

.game-winner {
  font-size: 3rem;
  color: var(--white);
  padding: 20px;
  position: absolute;
  isolation: isolate;
  display: none;
}

.game-winner::after {
  content: "";
  position: absolute;
  background-color: black;
  z-index: -1;
  inset: 0;
  opacity: 0.6;
  border-radius: 1rem;
}

.hit-ship {
  background: url(${___CSS_LOADER_URL_REPLACEMENT_1___});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%, auto;
  border: 1px solid red;
  background-color: var(--light-yellow);
}

.hit-miss {
  background: url(${___CSS_LOADER_URL_REPLACEMENT_2___});
  background-color: var(--light-yellow);
  border: 1px solid var(--dark-blue);
}

.hide {
  display: none;
}

#footer {
  grid-area: footer;
  text-align: center;
  font-weight: 700;
}

#footer a {
  text-decoration: none;
  color: var(--white);
}
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;;;EAGE,sBAAsB;AACxB;;AAEA;EACE,oBAAoB;EACpB,eAAe;EACf,qBAAqB;EACrB,gBAAgB;EAChB,uBAAuB;EACvB,kBAAkB;AACpB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,iBAAiB;EACjB,aAAa;EACb,iCAAiC;EACjC;;;;mBAIiB;AACnB;;AAEA;;EAEE,6BAA6B;AAC/B;;AAEA;EACE,iBAAiB;EACjB,qCAAqC;EACrC,kBAAkB;EAClB,eAAe;EACf,gBAAgB;EAChB,mBAAmB;EACnB,aAAa;AACf;;AAEA;EACE,eAAe;EACf,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,mBAAmB;EACnB,SAAS;EACT,mDAAmC;EACnC,sBAAsB;EACtB,4BAA4B;EAC5B,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,UAAU;AACZ;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,SAAS;EACT,mBAAmB;EACnB,uBAAuB;AACzB;;AAEA;EACE,qCAAqC;EACrC,eAAe;EACf,gBAAgB;EAChB,mBAAmB;EACnB,kBAAkB;EAClB,kBAAkB;EAClB,aAAa;AACf;;AAEA;EACE,WAAW;EACX,uBAAuB;EACvB,kBAAkB;EAClB,QAAQ;EACR,WAAW;EACX,YAAY;EACZ,mBAAmB;AACrB;;AAEA;EACE,aAAa;EACb,UAAU;EACV,mBAAmB;EACnB,uBAAuB;AACzB;;AAEA;;;EAGE,gBAAgB;EAChB,iBAAiB;EACjB,wBAAwB;EACxB,aAAa;EACb,sBAAsB;EACtB,kBAAkB;EAClB,kBAAkB;AACpB;;AAEA;;;EAGE,WAAW;EACX,mCAAmC;EACnC,kBAAkB;EAClB,QAAQ;EACR,WAAW;EACX,YAAY;AACd;;AAEA;EACE,SAAS;EACT,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;;;EAGE,aAAa;EACb,SAAS;AACX;;AAEA;EACE,kCAAkC;EAClC,yBAAyB;AAC3B;;AAEA;EACE,kCAAkC;EAClC,8BAA8B;AAChC;;AAEA;EACE,kCAAkC;EAClC,4BAA4B;AAC9B;;AAEA;EACE,kCAAkC;EAClC,2BAA2B;AAC7B;;AAEA;EACE,kCAAkC;EAClC,gCAAgC;AAClC;;AAEA;EACE,kCAAkC;EAClC,sBAAsB;AACxB;;AAEA;EACE,OAAO;EACP,aAAa;AACf;;AAEA;EACE,8BAA8B;EAC9B,OAAO;EACP,8CAA8C;AAChD;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,eAAe;EACf,6BAA6B;AAC/B;;AAEA;EACE,eAAe;EACf,mBAAmB;EACnB,aAAa;EACb,kBAAkB;EAClB,kBAAkB;EAClB,aAAa;AACf;;AAEA;EACE,WAAW;EACX,kBAAkB;EAClB,uBAAuB;EACvB,WAAW;EACX,QAAQ;EACR,YAAY;EACZ,mBAAmB;AACrB;;AAEA;EACE,mDAAwQ;EACxQ,4BAA4B;EAC5B,2BAA2B;EAC3B,gCAAgC;EAChC,qBAAqB;EACrB,qCAAqC;AACvC;;AAEA;EACE,mDAAmC;EACnC,qCAAqC;EACrC,kCAAkC;AACpC;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,iBAAiB;EACjB,kBAAkB;EAClB,gBAAgB;AAClB;;AAEA;EACE,qBAAqB;EACrB,mBAAmB;AACrB","sourcesContent":["*,\n*::after,\n*::before {\n  box-sizing: border-box;\n}\n\n:root {\n  --dark-blue: #4682a9;\n  --blue: #749bc2;\n  --light-blue: #91c8e4;\n  --white: #f6f4eb;\n  --light-yellow: #fff7d4;\n  --ship-block: 40px;\n}\n\nhtml {\n  height: 100%;\n}\n\nbody {\n  min-height: 100vh;\n  display: grid;\n  font-family: \"Roboto\", sans-serif;\n  grid:\n    \"header header header header\" auto\n    \"main main main main\" 1fr\n    \"footer footer footer footer\" auto /\n    1fr 1fr 1fr 1fr;\n}\n\n#header,\n#footer {\n  background-color: var(--blue);\n}\n\n#header {\n  grid-area: header;\n  font-family: \"Ysabeau SC\", sans-serif;\n  text-align: center;\n  font-size: 4rem;\n  font-weight: 700;\n  letter-spacing: 1px;\n  padding: 20px;\n}\n\n#main {\n  grid-area: main;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 20px;\n  background: url(./images/sunny.jpg);\n  background-size: cover;\n  background-repeat: no-repeat;\n  position: relative;\n}\n\n.grid-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 100px;\n}\n\n.computer-container {\n  display: none;\n}\n\n.player-container {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n  align-items: center;\n  justify-content: center;\n}\n\n.player-title {\n  font-family: \"Ysabeau SC\", sans-serif;\n  font-size: 3rem;\n  font-weight: 900;\n  color: var(--white);\n  position: relative;\n  isolation: isolate;\n  padding: 20px;\n}\n\n.player-title::after {\n  content: \"\";\n  background-color: black;\n  position: absolute;\n  inset: 0;\n  z-index: -1;\n  opacity: 0.7;\n  border-radius: 1rem;\n}\n\n.player-body {\n  display: flex;\n  gap: 100px;\n  align-items: center;\n  justify-content: center;\n}\n\n.player-grid,\n.computer-grid,\n.player-ships {\n  min-width: 400px;\n  min-height: 400px;\n  outline: 3px solid black;\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  isolation: isolate;\n}\n\n.player-grid::after,\n.computer-grid::after,\n.player-ships::after {\n  content: \"\";\n  background-color: var(--light-blue);\n  position: absolute;\n  inset: 0;\n  z-index: -1;\n  opacity: 0.8;\n}\n\n.player-ships {\n  gap: 10px;\n  justify-content: center;\n  align-items: center;\n}\n\n.destroyer-container,\n.submarine-container,\n.patrol-boat-container {\n  display: flex;\n  gap: 10px;\n}\n\n.ship {\n  border: 2px solid var(--dark-blue);\n  height: var(--ship-block);\n}\n\n.carrier {\n  width: calc(var(--ship-block) * 5);\n  background-color: var(--white);\n}\n\n.battleship {\n  width: calc(var(--ship-block) * 4);\n  background-color: lightgreen;\n}\n\n.destroyer {\n  width: calc(var(--ship-block) * 3);\n  background-color: lightpink;\n}\n\n.submarine {\n  width: calc(var(--ship-block) * 2);\n  background-color: lightslategray;\n}\n\n.patrol-boat {\n  width: calc(var(--ship-block) * 1);\n  background-color: plum;\n}\n\n.grid-row {\n  flex: 1;\n  display: flex;\n}\n\n.grid-col {\n  border: 1px solid var(--white);\n  flex: 1;\n  transition: background-color 100ms ease-in-out;\n}\n\n.drag-over {\n  border: 2px dashed red;\n}\n\n.computer-grid .grid-col:hover {\n  cursor: pointer;\n  background-color: var(--blue);\n}\n\n.game-winner {\n  font-size: 3rem;\n  color: var(--white);\n  padding: 20px;\n  position: absolute;\n  isolation: isolate;\n  display: none;\n}\n\n.game-winner::after {\n  content: \"\";\n  position: absolute;\n  background-color: black;\n  z-index: -1;\n  inset: 0;\n  opacity: 0.6;\n  border-radius: 1rem;\n}\n\n.hit-ship {\n  background: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' preserveAspectRatio='none' viewBox='0 0 100 100'><path d='M100 0 L0 100 ' stroke='red' stroke-width='5'/><path d='M0 0 L100 100 ' stroke='red' stroke-width='5'/></svg>\");\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 100% 100%, auto;\n  border: 1px solid red;\n  background-color: var(--light-yellow);\n}\n\n.hit-miss {\n  background: url(./images/ocean.png);\n  background-color: var(--light-yellow);\n  border: 1px solid var(--dark-blue);\n}\n\n.hide {\n  display: none;\n}\n\n#footer {\n  grid-area: footer;\n  text-align: center;\n  font-weight: 700;\n}\n\n#footer a {\n  text-decoration: none;\n  color: var(--white);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/normalize.css/normalize.css":
/*!**************************************************!*\
  !*** ./node_modules/normalize.css/normalize.css ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../css-loader/dist/cjs.js!./normalize.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/normalize.css/normalize.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 version=%271.1%27 preserveAspectRatio=%27none%27 viewBox=%270 0 100 100%27><path d=%27M100 0 L0 100 %27 stroke=%27red%27 stroke-width=%275%27/><path d=%27M0 0 L100 100 %27 stroke=%27red%27 stroke-width=%275%27/></svg>":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 version=%271.1%27 preserveAspectRatio=%27none%27 viewBox=%270 0 100 100%27><path d=%27M100 0 L0 100 %27 stroke=%27red%27 stroke-width=%275%27/><path d=%27M0 0 L100 100 %27 stroke=%27red%27 stroke-width=%275%27/></svg> ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 version=%271.1%27 preserveAspectRatio=%27none%27 viewBox=%270 0 100 100%27><path d=%27M100 0 L0 100 %27 stroke=%27red%27 stroke-width=%275%27/><path d=%27M0 0 L100 100 %27 stroke=%27red%27 stroke-width=%275%27/></svg>";

/***/ }),

/***/ "./src/images/ocean.png":
/*!******************************!*\
  !*** ./src/images/ocean.png ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "e7d8d12f84e7eded6815.png";

/***/ }),

/***/ "./src/images/sunny.jpg":
/*!******************************!*\
  !*** ./src/images/sunny.jpg ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "76bd86416afc90e61f41.jpg";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var normalize_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! normalize.css */ "./node_modules/normalize.css/normalize.css");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _modules_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/dom */ "./src/modules/dom.js");
/* harmony import */ var _modules_gameloop__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/gameloop */ "./src/modules/gameloop.js");




const game = (0,_modules_gameloop__WEBPACK_IMPORTED_MODULE_3__["default"])();
(0,_modules_dom__WEBPACK_IMPORTED_MODULE_2__.completeDomGrid)();
(0,_modules_dom__WEBPACK_IMPORTED_MODULE_2__.createCoordinateEvent)(game);
(0,_modules_dom__WEBPACK_IMPORTED_MODULE_2__.createDraggableEvents)();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLG1DQUFtQztBQUN2RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsbUNBQW1DO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2xCQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7Ozs7O1dDckJBOzs7Ozs7Ozs7Ozs7Ozs7QUNBdUI7QUFDRjtBQUtFO0FBQzBCO0FBRWpELE1BQU1nQixJQUFJLEdBQUd3Riw2REFBZSxDQUFDLENBQUM7QUFFOUIvRyw2REFBZSxDQUFDLENBQUM7QUFDakJzQixtRUFBcUIsQ0FBQ0MsSUFBSSxDQUFDO0FBQzNCb0MsbUVBQXFCLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2RvbS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lbG9vcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzcz8zNDJmIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29tcGxldGUgdGhlIGdyaWQgb24gdGhlIHdlYnNpdGVcbmV4cG9ydCBmdW5jdGlvbiBjb21wbGV0ZURvbUdyaWQoKSB7XG4gIC8vIEdldCB0aGUgcGxheWVyIGFuZCBjb21wdXRlciBncmlkXG4gIGNvbnN0IHBsYXllckdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllci1ncmlkXCIpO1xuICBjb25zdCBjb21wdXRlckdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLWdyaWRcIik7XG5cbiAgLy8gQ3JlYXRlIHRoZSBncmlkIGZvciB0aGUgcGxheWVyIGFuZCBjb21wdXRlclxuICBjcmVhdGVEb21HcmlkKHBsYXllckdyaWQpO1xuICBjcmVhdGVEb21HcmlkKGNvbXB1dGVyR3JpZCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZURvbUdyaWQoZ3JpZCwgc2l6ZSA9IDEwKSB7XG4gIC8vIENyZWF0ZSBhIHNpemUgeCBzaXplIGdyaWRcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICBjb25zdCBuZXdSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG5ld1Jvdy5jbGFzc0xpc3QuYWRkKFwiZ3JpZC1yb3dcIik7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcbiAgICAgIGNvbnN0IG5ld0NvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBuZXdDb2wuY2xhc3NMaXN0LmFkZChcImdyaWQtY29sXCIpO1xuICAgICAgbmV3Q29sLmRhdGFzZXQueCA9IGk7XG4gICAgICBuZXdDb2wuZGF0YXNldC55ID0gajtcbiAgICAgIG5ld1Jvdy5hcHBlbmRDaGlsZChuZXdDb2wpO1xuICAgIH1cbiAgICBncmlkLmFwcGVuZENoaWxkKG5ld1Jvdyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvb3JkaW5hdGVFdmVudChnYW1lKSB7XG4gIC8vIEdldCBjb21wdXRlciBncmlkIGFuZCB0aGUgY29vcmRpbmF0ZXMgZnJvbSBpdFxuICBjb25zdCBjb21wdXRlckdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyLWdyaWRcIik7XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gY29tcHV0ZXJHcmlkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1jb2xcIik7XG5cbiAgLy8gQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGVhY2ggY29vcmRpbmF0ZVxuICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlKSA9PlxuICAgIGNvb3JkaW5hdGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgY29vcmRpbmF0ZS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXQtc2hpcFwiKSB8fFxuICAgICAgICBjb29yZGluYXRlLmNsYXNzTGlzdC5jb250YWlucyhcImhpdC1taXNzXCIpXG4gICAgICApXG4gICAgICAgIHJldHVybjtcbiAgICAgIGNvbnN0IHBvc1ggPSBwYXJzZUludChjb29yZGluYXRlLmRhdGFzZXQueCwgMTApO1xuICAgICAgY29uc3QgcG9zWSA9IHBhcnNlSW50KGNvb3JkaW5hdGUuZGF0YXNldC55LCAxMCk7XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgd2lubmVyIHByZXZlbnQgZnVydGhlciBwbGF5c1xuICAgICAgaWYgKGdhbWUuY2hlY2tXaW5uZXIoKSkgcmV0dXJuO1xuXG4gICAgICAvLyBDaGVjayBpZiBpdCdzIHRoZSBwbGF5ZXIgdHVyblxuICAgICAgaWYgKGdhbWUuZ2V0Q3VycmVudFBsYXllck5hbWUoKSAhPT0gXCJjb21wdXRlclwiKSB7XG4gICAgICAgIGRpc3BsYXlDdXJyZW50UGxheWVyKGdhbWUuZ2V0Q3VycmVudFBsYXllck5hbWUoKSk7XG4gICAgICAgIGdhbWUucGxheWVyVHVybihwb3NYLCBwb3NZKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoZSByZXNwZWN0aXZlIGNsYXNzIHRvIHRoZSBoaXR0ZWQgY29vcmRpbmF0ZVxuICAgICAgYWRkQ29vcmRpbmF0ZUNsYXNzKHBvc1gsIHBvc1ksIGdhbWUuZ2V0Q29tcHV0ZXJCb2FyZCgpLCBjb29yZGluYXRlKTtcblxuICAgICAgLy8gTGV0IHRoZSBjb21wdXRlciBwbGF5IGFzIGxvbmcgYXMgaXQncyBpdCB0dXJuLlxuICAgICAgd2hpbGUgKFxuICAgICAgICBnYW1lLmdldEN1cnJlbnRQbGF5ZXJOYW1lKCkgPT09IFwiY29tcHV0ZXJcIiAmJlxuICAgICAgICAhZ2FtZS5jaGVja1dpbm5lcigpXG4gICAgICApIHtcbiAgICAgICAgdXBkYXRlUGxheWVyR3JpZChnYW1lKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgc29tZW9uZSBoYXZlIHdvblxuICAgICAgaWYgKGdhbWUuY2hlY2tXaW5uZXIoKSkge1xuICAgICAgICBkaXNwbGF5V2lubmVyKGdhbWUpO1xuICAgICAgfVxuICAgIH0pXG4gICk7XG59XG5cbi8vIEFkZCBhIGhpdCBjbGFzcyB0byB0aGUgY29vcmRpbmF0ZVxuZnVuY3Rpb24gYWRkQ29vcmRpbmF0ZUNsYXNzKHgsIHksIGdhbWVib2FyZCwgY29vcmRpbmF0ZSkge1xuICBpZiAoZ2FtZWJvYXJkLmlzU2hpcEhpdHRlZCh4LCB5KSkge1xuICAgIGNvb3JkaW5hdGUuY2xhc3NMaXN0LmFkZChcImhpdC1zaGlwXCIpO1xuICB9IGVsc2Uge1xuICAgIGNvb3JkaW5hdGUuY2xhc3NMaXN0LmFkZChcImhpdC1taXNzXCIpO1xuICB9XG59XG5cbi8vIERpc3BsYXkgdGhlIG5hbWUgb2YgdGhlIGN1cnJlbnQgcGxheWVyXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheUN1cnJlbnRQbGF5ZXIobmFtZSkge1xuICBjb25zdCBjdXJyZW50UGxheWVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jdXJyZW50LXBsYXllclwiKTtcbiAgY3VycmVudFBsYXllci50ZXh0Q29udGVudCA9IGAke25hbWV9IHR1cm5gO1xufVxuXG4vLyBNYWtlIGEgZnVuY3Rpb24gdGhhdCB1cGRhdGVzIHRoZSBwbGF5ZXIgZ3JpZCB3aGVuIHRoZSBjb21wdXRlciBhdHRhY2tzXG5mdW5jdGlvbiB1cGRhdGVQbGF5ZXJHcmlkKGdhbWUpIHtcbiAgLy8gR2V0IHRoZSBwbGF5ZXIgZ3JpZCBhbmQgaXQncyBjb29yZGluYXRlc1xuICBjb25zdCBwbGF5ZXJHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXItZ3JpZFwiKTtcbiAgY29uc3QgY29vcmRpbmF0ZXMgPSBwbGF5ZXJHcmlkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1jb2xcIik7XG5cbiAgLy8gR2V0IHRoZSB4IGFuZCB5IHBvc2l0aW9uIHJhbmRvbWx5IGdlbmVyYXRlZCBmb3IgdGhlIGNvbXB1dGVyXG4gIGNvbnN0IHJlc3VsdCA9IGdhbWUuY29tcHV0ZXJUdXJuKCk7XG5cbiAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgbm8gbW9yZSBjb29yZGluYXRlcyB0byBhdHRhY2sgYW5kIGlmIHRoZXJlIGlzIG5vIHdpbm5lclxuICBpZiAocmVzdWx0ID09PSBcIkFsbCBjb29yZGluYXRlcyBoYXZlIGJlZW4gYXR0YWNrZWQhXCIgfHwgIXJlc3VsdCkgcmV0dXJuO1xuICBpZiAoZ2FtZS5jaGVja1dpbm5lcigpKSByZXR1cm47XG5cbiAgLy8gU3BsaXQgdGhlIHJlc3VsdFxuICBjb25zdCB7IGNvbXBYLCBjb21wWSB9ID0gcmVzdWx0O1xuXG4gIC8vIEdldCB0aGUgaW5kZXggb24gdGhlIG5vZGUgbGlzdCB0aGF0IHJlcHJlc2VudCB0aGUgY3VycmVudCBjb29yZGluYXRlXG4gIGxldCBwb3NpdGlvbjtcbiAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmRpbmF0ZSwgaW5kZXgpID0+IHtcbiAgICBpZiAoXG4gICAgICBwYXJzZUludChjb29yZGluYXRlLmRhdGFzZXQueCwgMTApID09PSBjb21wWCAmJlxuICAgICAgcGFyc2VJbnQoY29vcmRpbmF0ZS5kYXRhc2V0LnksIDEwKSA9PT0gY29tcFlcbiAgICApIHtcbiAgICAgIHBvc2l0aW9uID0gaW5kZXg7XG4gICAgfVxuICB9KTtcblxuICAvLyBHZXQgdGhlIGNvb3JkaW5hdGVcbiAgY29uc3QgbmV3Q29vcmRpbmF0ZSA9IGNvb3JkaW5hdGVzW3Bvc2l0aW9uXTtcblxuICAvLyBBZGQgdGhlIGNsYXNzIHRvIGl0XG4gIGFkZENvb3JkaW5hdGVDbGFzcyhjb21wWCwgY29tcFksIGdhbWUuZ2V0UGxheWVyQm9hcmQoKSwgbmV3Q29vcmRpbmF0ZSk7XG59XG5cbi8vIEFkZCBhIGZ1bmN0aW9uIHRoYXQgZGlzcGxheXMgdGhlIHdpbm5lclxuZnVuY3Rpb24gZGlzcGxheVdpbm5lcihnYW1lKSB7XG4gIC8vIERpc3BsYXkgdGhlIHdpbm5lclxuICBjb25zdCBnYW1lV2lubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lLXdpbm5lclwiKTtcbiAgZ2FtZVdpbm5lci50ZXh0Q29udGVudCA9IGdhbWUuZGVjbGFyZVdpbm5lcigpO1xuICBnYW1lV2lubmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgLy8gSGlkZSB0aGUgZ3JpZHNcbiAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ3JpZC1jb250YWluZXJcIik7XG4gIGdyaWRDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuXG4vLyBDcmVhdGUgZHJhZ2dhYmxlIGV2ZW50c1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRHJhZ2dhYmxlRXZlbnRzKCkge1xuICAvLyBHZXQgYWxsIHRoZSBzaGlwc1xuICBjb25zdCBzaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxheWVyLXNoaXBzIC5zaGlwXCIpO1xuICBzaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgc2hpcC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIGRyYWdTdGFydCk7XG4gIH0pO1xuXG4gIC8vIEdldCBhbGwgdGhlIHBsYXllciBncmlkIGNvbFxuICBjb25zdCBwbGF5ZXJDb29yZGluYXRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxheWVyLWdyaWQgLmdyaWQtY29sXCIpO1xuICBwbGF5ZXJDb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlKSA9PiB7XG4gICAgY29vcmRpbmF0ZS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VudGVyXCIsIGRyYWdFbnRlcik7XG4gICAgY29vcmRpbmF0ZS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZHJhZ092ZXIpO1xuICAgIGNvb3JkaW5hdGUuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBkcmFnTGVhdmUpO1xuICAgIGNvb3JkaW5hdGUuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgc2hpcERyb3ApO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZHJhZ1N0YXJ0KGUpIHtcbiAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgZS50YXJnZXQuaWQpO1xuICBjb25zb2xlLmxvZyhlLnRhcmdldCk7XG59XG5cbmZ1bmN0aW9uIGRyYWdFbnRlcihlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcImRyYWctb3ZlclwiKTtcbn1cblxuZnVuY3Rpb24gZHJhZ092ZXIoZSkge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJkcmFnLW92ZXJcIik7XG59XG5cbmZ1bmN0aW9uIGRyYWdMZWF2ZShlKSB7XG4gIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJkcmFnLW92ZXJcIik7XG59XG5cbmZ1bmN0aW9uIHNoaXBEcm9wKGUpIHtcbiAgZS50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShcImRyYWctb3ZlclwiKTtcblxuICAvLyBHZXQgdGhlIGRyYWdnYWJsZSBlbGVtZW50XG4gIGNvbnN0IGlkID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHQvcGxhaW5cIik7XG4gIGNvbnN0IGRyYWdnYWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblxuICAvLyBBZGQgaXQgdG8gdGhlIGRyb3AgdGFyZ2V0XG4gIGUudGFyZ2V0LmFwcGVuZENoaWxkKGRyYWdnYWJsZSk7XG59XG4iLCJpbXBvcnQgc2hpcEZhY3RvcnkgZnJvbSBcIi4vc2hpcFwiO1xuXG4vLyBNYWtlIGEgZ2FtZSBib2FyZCBmYWN0b3J5IHRoYXQgd29ya3MgYXMgYSBnYW1lYm9hcmQgZm9yIHRoZSBiYXR0bGVzaGlwIGdhbWUuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnYW1lQm9hcmRGYWN0b3J5KCkge1xuICAvLyBDcmVhdGUgZ2FtZWJvYXJkIGFuZCBzaGlwIGJvYXJkIHRvIGtlZXAgdHJhY2sgb2YgdGhlIHNoaXBzXG4gIGNvbnN0IGdhbWVib2FyZCA9IGNyZWF0ZUdhbWVCb2FyZEdyaWQoKTtcbiAgY29uc3Qgc2hpcGJvYXJkID0gY3JlYXRlR2FtZUJvYXJkR3JpZCgpO1xuICBjb25zdCBnZXRHYW1lQm9hcmQgPSAoKSA9PiBnYW1lYm9hcmQ7XG4gIGNvbnN0IGdldFNoaXBCb2FyZCA9ICgpID0+IHNoaXBib2FyZDtcblxuICAvLyBWYXJpYWJsZXMgdG8ga2VlcCB0cmFjayBvZiBob3cgbWFueSBzaGlwcyBoYXZlIGJlZW4gcGxhY2VkIGFuZCB0byBzdG9yZSB0aGVtXG4gIGxldCBzaGlwQ291bnQgPSAwO1xuICBjb25zdCBzaGlwcyA9IG5ldyBNYXAoKTtcbiAgY29uc3QgZ2V0U2hpcHMgPSAoKSA9PiBzaGlwcztcblxuICAvLyBGdW5jdGlvbiB0aGF0IGxldCB5b3UgcGxhY2Ugc2hpcHMgb24gdGhlIGdhbWVib2FyZFxuICBjb25zdCBwbGFjZVNoaXAgPSAoeCwgeSwgc2l6ZSwgZGlyZWN0aW9uID0gXCJyb3dcIikgPT4ge1xuICAgIC8vIEluY3JlYXNlIHNoaXAgY291bnQgYW5kIG1hcCB0aGUgbmV3IHNoaXBcbiAgICBzaGlwQ291bnQrKztcbiAgICBjb25zdCBuZXdTaGlwID0gc2hpcEZhY3Rvcnkoc2l6ZSk7XG4gICAgc2hpcHMuc2V0KGAke3NoaXBDb3VudH1gLCBuZXdTaGlwKTtcblxuICAgIC8vIENoZWNrIHRoYXQgdGhlIHNoaXAgYmVlaW5nIHBsYWNlZCBhdCB0aGUgY29vcmRpbmF0ZXMgKHgsIHkpIGRvZXNuJ3QgZ28gYmV5b25kIGdhbWVib2FyZCBzaXplXG4gICAgY29uc3QgZ2FtZUJvYXJkU2l6ZSA9IGdhbWVib2FyZC5sZW5ndGg7XG4gICAgY29uc3QgZW5kUG9pbnQgPSBkaXJlY3Rpb24gPT09IFwiY29sXCIgPyBzaXplICsgeCA6IHNpemUgKyB5O1xuICAgIGlmIChlbmRQb2ludCA+IGdhbWVCb2FyZFNpemUpIHJldHVybiBcIlNoaXAgY2Fubm90IGJlIHBsYWNlZFwiO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCB0aGUgc2hpcHMgZG9lc24ndCBvdmVybGFwXG4gICAgY29uc3QgaXNTaGlwT3ZlcmxhcHBlZCA9IHNoaXBPdmVybGFwKGdhbWVib2FyZCwgeCwgeSwgc2l6ZSwgZGlyZWN0aW9uKTtcbiAgICBpZiAoaXNTaGlwT3ZlcmxhcHBlZCkgcmV0dXJuIFwiU2hpcHMgYXJlIG92ZXJsYXBwaW5nLCBjYW5ub3QgYmUgcGxhY2VkXCI7XG5cbiAgICAvLyBQbGFjZSB0aGUgc2hpcCBvbiB0aGUgZ2FtZWJvYXJkIGNoZWNraW5nIGZvciBpdCdzIGRpcmVjdGlvblxuICAgIGlmIChkaXJlY3Rpb24gPT09IFwiY29sXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSB4OyBpIDwgZW5kUG9pbnQ7IGkrKykge1xuICAgICAgICBnYW1lYm9hcmRbaV1beV0gPSBgJHtzaGlwQ291bnR9YDtcbiAgICAgICAgc2hpcGJvYXJkW2ldW3ldID0gYCR7c2hpcENvdW50fWA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSB5OyBpIDwgZW5kUG9pbnQ7IGkrKykge1xuICAgICAgICBnYW1lYm9hcmRbeF1baV0gPSBgJHtzaGlwQ291bnR9YDtcbiAgICAgICAgc2hpcGJvYXJkW3hdW2ldID0gYCR7c2hpcENvdW50fWA7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoeCwgeSkgPT4ge1xuICAgIC8vIE1ha2Ugc3VyZSBpdCBkb2Vzbid0IHJlY2VpdmUgYW4gYXR0YWNrIG91dHNpZGUgdGhlIGdhbWVib2FyZFxuICAgIGlmICh4ID49IGdhbWVib2FyZC5sZW5ndGggfHwgeSA+PSBnYW1lYm9hcmQubGVuZ3RoKVxuICAgICAgcmV0dXJuIFwiSW52YWxpZCBjb29yZGluYXRlc1wiO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBudW1iZXIgb2YgaGl0cyBvbiB0aGUgc2hpcCBpZiBpdCdzIG5vdCBlbXB0eSBvciBhIGhpdCBhbHJlYWR5XG4gICAgaWYgKGdhbWVib2FyZFt4XVt5XSAhPT0gXCJcIiAmJiBnYW1lYm9hcmRbeF1beV0gIT09IFwieFwiKSB7XG4gICAgICBzaGlwcy5nZXQoZ2FtZWJvYXJkW3hdW3ldKS5oaXQoKTtcbiAgICB9XG4gICAgLy8gQ2hhbmdlIHRoZSBnYW1lYm9hcmQgb25seSBpZiB0aGUgY29vcmRpbmF0ZXMgYXJlIG5vdCBhIG1pc3NlZCBhdHRhY2tcbiAgICBpZiAoZ2FtZWJvYXJkW3hdW3ldICE9PSBcInhcIikge1xuICAgICAgZ2FtZWJvYXJkW3hdW3ldID0gXCJ4XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIkNhbm5vdCBhdHRhY2sgdGhlIHNhbWUgc3BvdCB0d2ljZVwiO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBpc1NoaXBIaXR0ZWQgPSAoeCwgeSkgPT4ge1xuICAgIGlmIChzaGlwYm9hcmRbeF1beV0gIT09IFwiXCIpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBpc0FsbFNoaXBzU3VuayA9ICgpID0+IGFsbFNoaXBzU3VuayhzaGlwcyk7XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRHYW1lQm9hcmQsXG4gICAgZ2V0U2hpcEJvYXJkLFxuICAgIHBsYWNlU2hpcCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIGdldFNoaXBzLFxuICAgIGlzU2hpcEhpdHRlZCxcbiAgICBpc0FsbFNoaXBzU3VuayxcbiAgfTtcbn1cblxuLy8gTWFrZSBhIGZ1bmN0aW9uIHRoYXQgY3JlYXRlcyBhIGdhbWUgYm9hcmQgZ3JpZCwgZGVmYXVsdCBzaXplIGlzIDEweDEwXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlR2FtZUJvYXJkR3JpZChzaXplID0gMTApIHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gW107XG4gIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHNpemU7IHJvdysrKSB7XG4gICAgY29uc3QgbmV3Um93ID0gW107XG4gICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgc2l6ZTsgY29sKyspIHtcbiAgICAgIG5ld1Jvdy5wdXNoKFwiXCIpO1xuICAgIH1cbiAgICBnYW1lYm9hcmQucHVzaChuZXdSb3cpO1xuICB9XG4gIHJldHVybiBnYW1lYm9hcmQ7XG59XG5cbi8vIE1ha2UgYSBmdW5jdGlvbiB0aGF0IGNoZWNrIGlmIGEgc2hpcCBpcyBvdmVybGFwcGluZyB3aXRoIGFub3RoZXJcbmZ1bmN0aW9uIHNoaXBPdmVybGFwKGdhbWVib2FyZCwgeCwgeSwgc2l6ZSwgZGlyZWN0aW9uKSB7XG4gIGNvbnN0IGVuZFBvaW50ID0gZGlyZWN0aW9uID09PSBcImNvbFwiID8gc2l6ZSArIHggOiBzaXplICsgeTtcbiAgaWYgKGRpcmVjdGlvbiA9PT0gXCJjb2xcIikge1xuICAgIGZvciAobGV0IGkgPSB4OyBpIDwgZW5kUG9pbnQ7IGkrKykge1xuICAgICAgaWYgKGdhbWVib2FyZFtpXVt5XSAhPT0gXCJcIikgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGkgPSB5OyBpIDwgZW5kUG9pbnQ7IGkrKykge1xuICAgICAgaWYgKGdhbWVib2FyZFt4XVtpXSAhPT0gXCJcIikgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gTWFrZSBhIGZ1bmN0aW9uIHRoYXQgY2hlY2sgaWYgYWxsIHRoZSBzaGlwcyBoYXZlIGJlZW4gc3Vua1xuZnVuY3Rpb24gYWxsU2hpcHNTdW5rKG1hcCkge1xuICBjb25zdCBzaGlwcyA9IFtdO1xuICBtYXAuZm9yRWFjaCgodmFsdWUpID0+IHNoaXBzLnB1c2godmFsdWUpKTtcbiAgcmV0dXJuIHNoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLmlzU3VuaygpKTtcbn1cbiIsImltcG9ydCBnYW1lQm9hcmRGYWN0b3J5IGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IHBsYXllckZhY3RvcnksIHsgY29tcHV0ZXJGYWN0b3J5IH0gZnJvbSBcIi4vcGxheWVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdhbWVMb29wRmFjdG9yeSgpIHtcbiAgLy8gQ3JlYXRlIGdhbWVib2FyZHMsIHBsYXllciBhbmQgY29tcHV0ZXJcbiAgY29uc3QgcGxheWVyR2FtZUJvYXJkID0gZ2FtZUJvYXJkRmFjdG9yeSgpO1xuICBjb25zdCBjb21wdXRlckdhbWVCb2FyZCA9IGdhbWVCb2FyZEZhY3RvcnkoKTtcbiAgY29uc3QgcGxheWVyID0gcGxheWVyRmFjdG9yeShcInBsYXllclwiKTtcbiAgY29uc3QgY29tcHV0ZXIgPSBjb21wdXRlckZhY3RvcnkoKTtcblxuICAvLyBHZXQgcGxheWVyIGFuZCBjb21wdXRlciBib2FyZFxuICBjb25zdCBnZXRQbGF5ZXJCb2FyZCA9ICgpID0+IHBsYXllckdhbWVCb2FyZDtcbiAgY29uc3QgZ2V0Q29tcHV0ZXJCb2FyZCA9ICgpID0+IGNvbXB1dGVyR2FtZUJvYXJkO1xuXG4gIC8vIFBsYWNlIHBsYXllciBzaGlwc1xuICBwbGF5ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDAsIDAsIDUpO1xuICBwbGF5ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDMsIDUsIDQsIFwiY29sXCIpO1xuICBwbGF5ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDcsIDAsIDMsIFwiY29sXCIpO1xuICBwbGF5ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDksIDQsIDMpO1xuICBwbGF5ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDYsIDcsIDIpO1xuICBwbGF5ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDYsIDEsIDIpO1xuICBwbGF5ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDIsIDIsIDIsIFwiY29sXCIpO1xuICBwbGF5ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDksIDksIDEpO1xuICBwbGF5ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDQsIDcsIDEpO1xuICBwbGF5ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDgsIDMsIDEpO1xuICBwbGF5ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDEsIDgsIDEpO1xuXG4gIC8vIFBsYWNlIGNvbXB1dGVyIHNoaXBzXG4gIGNvbXB1dGVyR2FtZUJvYXJkLnBsYWNlU2hpcCgxLCAxLCA1KTtcbiAgY29tcHV0ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDQsIDIsIDQsIFwiY29sXCIpO1xuICBjb21wdXRlckdhbWVCb2FyZC5wbGFjZVNoaXAoMCwgMCwgMywgXCJjb2xcIik7XG4gIGNvbXB1dGVyR2FtZUJvYXJkLnBsYWNlU2hpcCg5LCAxLCAzKTtcbiAgY29tcHV0ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDgsIDcsIDIpO1xuICBjb21wdXRlckdhbWVCb2FyZC5wbGFjZVNoaXAoNSwgMywgMik7XG4gIGNvbXB1dGVyR2FtZUJvYXJkLnBsYWNlU2hpcCgzLCA3LCAyLCBcImNvbFwiKTtcbiAgY29tcHV0ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDksIDgsIDEpO1xuICBjb21wdXRlckdhbWVCb2FyZC5wbGFjZVNoaXAoMCwgOSwgMSk7XG4gIGNvbXB1dGVyR2FtZUJvYXJkLnBsYWNlU2hpcCgzLCAzLCAxKTtcbiAgY29tcHV0ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDIsIDgsIDEpO1xuXG4gIC8vIERlZmluZSBhIHR1cm4gdmFyaWFibGUsIHN0YXJ0aW5nIHdpdGggdGhlIHBsYXllclxuICBsZXQgaXNQbGF5ZXJUdXJuID0gdHJ1ZTtcblxuICAvLyBHZXQgdGhlIG5hbWUgb2Ygd2hvZXZlciBpcyBwbGF5aW5nIGluIHRoZSBjdXJyZW50IHR1cm5cbiAgY29uc3QgZ2V0Q3VycmVudFBsYXllck5hbWUgPSAoKSA9PiB7XG4gICAgaWYgKGlzUGxheWVyVHVybikgcmV0dXJuIHBsYXllci5nZXROYW1lKCk7XG4gICAgcmV0dXJuIGNvbXB1dGVyLmdldE5hbWUoKTtcbiAgfTtcblxuICAvLyBEZWZpbmUgdGhlIHBsYXllciB0dXJuXG4gIGNvbnN0IHBsYXllclR1cm4gPSAoeCwgeSkgPT4ge1xuICAgIGlmIChjaGVja1dpbm5lcigpKSB7XG4gICAgICBjb25zb2xlLmxvZyhkZWNsYXJlV2lubmVyKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNQbGF5ZXJUdXJuKSB7XG4gICAgICBwbGF5ZXIuYXR0YWNrKHgsIHksIGNvbXB1dGVyR2FtZUJvYXJkKTtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBsYXllciBwbGF5cyBhZ2FpbiBvciBub3RcbiAgICAgIGlzUGxheWVyVHVybiA9IGNvbXB1dGVyR2FtZUJvYXJkLmlzU2hpcEhpdHRlZCh4LCB5KTtcbiAgICB9XG4gIH07XG5cbiAgLy8gRGVmaW5lIHRoZSBjb21wdXRlciB0dXJuXG4gIGNvbnN0IGNvbXB1dGVyVHVybiA9ICgpID0+IHtcbiAgICBpZiAoY2hlY2tXaW5uZXIoKSkge1xuICAgICAgY29uc29sZS5sb2coZGVjbGFyZVdpbm5lcigpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFpc1BsYXllclR1cm4pIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbXB1dGVyLmF0dGFjayhwbGF5ZXJHYW1lQm9hcmQpO1xuICAgICAgaWYgKHJlc3VsdCA9PT0gXCJBbGwgY29vcmRpbmF0ZXMgaGF2ZSBiZWVuIGF0dGFja2VkXCIpXG4gICAgICAgIHJldHVybiBcIkFsbCBjb29yZGluYXRlcyBoYXZlIGJlZW4gYXR0YWNrZWQhXCI7XG4gICAgICBjb25zdCBjb21wWCA9IHJlc3VsdC54O1xuICAgICAgY29uc3QgY29tcFkgPSByZXN1bHQueTtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNvbXB1dGVyIHBsYXlzIGFnYWluIG9yIG5vdFxuICAgICAgaXNQbGF5ZXJUdXJuID0gIXBsYXllckdhbWVCb2FyZC5pc1NoaXBIaXR0ZWQoY29tcFgsIGNvbXBZKTtcblxuICAgICAgcmV0dXJuIHsgY29tcFgsIGNvbXBZIH07XG4gICAgfVxuICB9O1xuXG4gIC8vIENoZWNrIGZvciBhIHdpbm5lclxuICBjb25zdCBjaGVja1dpbm5lciA9ICgpID0+IHtcbiAgICBpZiAoXG4gICAgICBwbGF5ZXJHYW1lQm9hcmQuaXNBbGxTaGlwc1N1bmsoKSB8fFxuICAgICAgY29tcHV0ZXJHYW1lQm9hcmQuaXNBbGxTaGlwc1N1bmsoKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBEZWNsYXJlIHRoZSB3aW5uZXJcbiAgY29uc3QgZGVjbGFyZVdpbm5lciA9ICgpID0+IHtcbiAgICBpZiAocGxheWVyR2FtZUJvYXJkLmlzQWxsU2hpcHNTdW5rKCkpIHJldHVybiBgJHtjb21wdXRlci5nZXROYW1lKCl9IHdpbnMhYDtcbiAgICByZXR1cm4gYCR7cGxheWVyLmdldE5hbWUoKX0gd2lucyFgO1xuICB9O1xuICByZXR1cm4ge1xuICAgIGdldFBsYXllckJvYXJkLFxuICAgIGdldENvbXB1dGVyQm9hcmQsXG4gICAgcGxheWVyVHVybixcbiAgICBjb21wdXRlclR1cm4sXG4gICAgZ2V0Q3VycmVudFBsYXllck5hbWUsXG4gICAgZGVjbGFyZVdpbm5lcixcbiAgICBjaGVja1dpbm5lcixcbiAgfTtcbn1cbiIsImltcG9ydCB7IGNyZWF0ZUdhbWVCb2FyZEdyaWQgfSBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGxheWVyRmFjdG9yeShuYW1lID0gXCJwbGF5ZXJcIikge1xuICBjb25zdCBnZXROYW1lID0gKCkgPT4gbmFtZTtcbiAgY29uc3QgYXR0YWNrID0gKHgsIHksIGdhbWVib2FyZCkgPT4gZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XG4gIHJldHVybiB7IGdldE5hbWUsIGF0dGFjayB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZXJGYWN0b3J5KCkge1xuICBjb25zdCBnZXROYW1lID0gKCkgPT4gXCJjb21wdXRlclwiO1xuICBjb25zdCBjb29yZGluYXRlcyA9IGdlbmVyYXRlQ29vcmRpbmF0ZSgpO1xuICBjb25zdCBhdHRhY2sgPSAoZ2FtZWJvYXJkKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gY29vcmRpbmF0ZXMuZ2V0VmFsaWRDb29yZGluYXRlcygpO1xuICAgIGlmIChyZXN1bHQgPT09IFwiTm8gbW9yZSBjb29yZGluYXRlcyB0byBhdHRhY2tcIikge1xuICAgICAgcmV0dXJuIFwiQWxsIGNvb3JkaW5hdGVzIGhhdmUgYmVlbiBhdHRhY2tlZFwiO1xuICAgIH1cbiAgICBjb25zdCB7IHgsIHkgfSA9IHJlc3VsdDtcbiAgICBnYW1lYm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KTtcbiAgICByZXR1cm4geyB4LCB5IH07XG4gIH07XG4gIHJldHVybiB7IGdldE5hbWUsIGF0dGFjayB9O1xufVxuXG5mdW5jdGlvbiByYW5kb21OdW1iZXIoc2l6ZSA9IDEwKSB7XG4gIGNvbnN0IG51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNpemUpO1xuICByZXR1cm4gbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVDb29yZGluYXRlKHNpemUgPSAxMCkge1xuICBjb25zdCBjb29yZGluYXRlcyA9IGNyZWF0ZUdhbWVCb2FyZEdyaWQoc2l6ZSk7XG4gIGxldCBhdmFpbGFibGVDb29yZGluYXRlcyA9IHNpemUgKiBzaXplO1xuICBjb25zdCBnZXRWYWxpZENvb3JkaW5hdGVzID0gKCkgPT4ge1xuICAgIGNvbnN0IHggPSByYW5kb21OdW1iZXIoc2l6ZSk7XG4gICAgY29uc3QgeSA9IHJhbmRvbU51bWJlcihzaXplKTtcbiAgICBpZiAoYXZhaWxhYmxlQ29vcmRpbmF0ZXMgPT09IDApIHJldHVybiBcIk5vIG1vcmUgY29vcmRpbmF0ZXMgdG8gYXR0YWNrXCI7XG4gICAgaWYgKGNvb3JkaW5hdGVzW3hdW3ldID09PSBcIlwiKSB7XG4gICAgICBjb29yZGluYXRlc1t4XVt5XSA9IFwiYXR0YWNrZWRcIjtcbiAgICAgIGF2YWlsYWJsZUNvb3JkaW5hdGVzLS07XG4gICAgICByZXR1cm4geyB4LCB5IH07XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gZ2V0VmFsaWRDb29yZGluYXRlcygpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIHJldHVybiB7IGdldFZhbGlkQ29vcmRpbmF0ZXMsIGdldENvb3JkaW5hdGVzOiAoKSA9PiBjb29yZGluYXRlcyB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2hpcEZhY3Rvcnkoc2l6ZSkge1xuICBjb25zdCBsZW5ndGggPSBzaXplO1xuICBsZXQgaGl0cyA9IDA7XG4gIGNvbnN0IG5hbWUgPSBnZXRTaGlwTmFtZShzaXplKTtcbiAgY29uc3QgaGl0ID0gKCkgPT4ge1xuICAgIGlmIChoaXRzIDwgbGVuZ3RoKSBoaXRzKys7XG4gIH07XG4gIGNvbnN0IGlzU3VuayA9ICgpID0+ICEobGVuZ3RoID4gaGl0cyk7XG4gIGNvbnN0IGdldEhpdHMgPSAoKSA9PiBoaXRzO1xuICBjb25zdCBnZXROYW1lID0gKCkgPT4gbmFtZTtcbiAgcmV0dXJuIHsgaGl0LCBpc1N1bmssIGdldEhpdHMsIGdldE5hbWUgfTtcbn1cblxuZnVuY3Rpb24gZ2V0U2hpcE5hbWUoc2l6ZSkge1xuICBzd2l0Y2ggKHNpemUpIHtcbiAgICBjYXNlIDU6XG4gICAgICByZXR1cm4gXCJDYXJyaWVyXCI7XG4gICAgY2FzZSA0OlxuICAgICAgcmV0dXJuIFwiQmF0dGxlc2hpcFwiO1xuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBcIkRlc3Ryb3llclwiO1xuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBcIlN1Ym1hcmluZVwiO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBcIlBhdHJvbCBCb2F0XCI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBcIkludmFsaWQgU2hpcCBTaXplXCI7XG4gIH1cbn1cbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xuXG4vKiBEb2N1bWVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cbiAqL1xuXG5odG1sIHtcbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cbiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXG59XG5cbi8qIFNlY3Rpb25zXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5ib2R5IHtcbiAgbWFyZ2luOiAwO1xufVxuXG4vKipcbiAqIFJlbmRlciB0aGUgXFxgbWFpblxcYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cbiAqL1xuXG5tYWluIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gXFxgaDFcXGAgZWxlbWVudHMgd2l0aGluIFxcYHNlY3Rpb25cXGAgYW5kXG4gKiBcXGBhcnRpY2xlXFxgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cbiAqL1xuXG5oMSB7XG4gIGZvbnQtc2l6ZTogMmVtO1xuICBtYXJnaW46IDAuNjdlbSAwO1xufVxuXG4vKiBHcm91cGluZyBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXG4gKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cbiAqL1xuXG5ociB7XG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXG4gIGhlaWdodDogMDsgLyogMSAqL1xuICBvdmVyZmxvdzogdmlzaWJsZTsgLyogMiAqL1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgXFxgZW1cXGAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnByZSB7XG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuYSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG4vKipcbiAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxuICovXG5cbmFiYnJbdGl0bGVdIHtcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxuICovXG5cbmIsXG5zdHJvbmcge1xuICBmb250LXdlaWdodDogYm9sZGVyO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgXFxgZW1cXGAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbmNvZGUsXG5rYmQsXG5zYW1wIHtcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc21hbGwge1xuICBmb250LXNpemU6IDgwJTtcbn1cblxuLyoqXG4gKiBQcmV2ZW50IFxcYHN1YlxcYCBhbmQgXFxgc3VwXFxgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxuICogYWxsIGJyb3dzZXJzLlxuICovXG5cbnN1YixcbnN1cCB7XG4gIGZvbnQtc2l6ZTogNzUlO1xuICBsaW5lLWhlaWdodDogMDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbnN1YiB7XG4gIGJvdHRvbTogLTAuMjVlbTtcbn1cblxuc3VwIHtcbiAgdG9wOiAtMC41ZW07XG59XG5cbi8qIEVtYmVkZGVkIGNvbnRlbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cbiAqL1xuXG5pbWcge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG59XG5cbi8qIEZvcm1zXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxuICovXG5cbmJ1dHRvbixcbmlucHV0LFxub3B0Z3JvdXAsXG5zZWxlY3QsXG50ZXh0YXJlYSB7XG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuICBtYXJnaW46IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQgeyAvKiAxICovXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxuICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbixcbnNlbGVjdCB7IC8qIDEgKi9cbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5bdHlwZT1cImJ1dHRvblwiXSxcblt0eXBlPVwicmVzZXRcIl0sXG5bdHlwZT1cInN1Ym1pdFwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJidXR0b25cIl06Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cInJlc2V0XCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJzdWJtaXRcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xuICBib3JkZXItc3R5bGU6IG5vbmU7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi8qKlxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxuICovXG5cbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcblt0eXBlPVwiYnV0dG9uXCJdOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJyZXNldFwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwic3VibWl0XCJdOi1tb3otZm9jdXNyaW5nIHtcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG5maWVsZHNldCB7XG4gIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxuICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBJRS5cbiAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcbiAqICAgIFxcYGZpZWxkc2V0XFxgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5sZWdlbmQge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIGNvbG9yOiBpbmhlcml0OyAvKiAyICovXG4gIGRpc3BsYXk6IHRhYmxlOyAvKiAxICovXG4gIG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xuICBwYWRkaW5nOiAwOyAvKiAzICovXG4gIHdoaXRlLXNwYWNlOiBub3JtYWw7IC8qIDEgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxuICovXG5cbnByb2dyZXNzIHtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgMTArLlxuICovXG5cbnRleHRhcmVhIHtcbiAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAuXG4gKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXG4gKi9cblxuW3R5cGU9XCJjaGVja2JveFwiXSxcblt0eXBlPVwicmFkaW9cIl0ge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXG4gIHBhZGRpbmc6IDA7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXG4gKi9cblxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gIGhlaWdodDogYXV0bztcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cbiAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXG4gKi9cblxuW3R5cGU9XCJzZWFyY2hcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cbiAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gXFxgaW5oZXJpdFxcYCBpbiBTYWZhcmkuXG4gKi9cblxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXG4gIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cbn1cblxuLyogSW50ZXJhY3RpdmVcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxuICovXG5cbmRldGFpbHMge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdW1tYXJ5IHtcbiAgZGlzcGxheTogbGlzdC1pdGVtO1xufVxuXG4vKiBNaXNjXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cbiAqL1xuXG50ZW1wbGF0ZSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXG4gKi9cblxuW2hpZGRlbl0ge1xuICBkaXNwbGF5OiBub25lO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLDJFQUEyRTs7QUFFM0U7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7RUFDRSxpQkFBaUIsRUFBRSxNQUFNO0VBQ3pCLDhCQUE4QixFQUFFLE1BQU07QUFDeEM7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtFQUNFLFNBQVM7QUFDWDs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7OztFQUdFOztBQUVGO0VBQ0UsY0FBYztFQUNkLGdCQUFnQjtBQUNsQjs7QUFFQTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7QUFFRjtFQUNFLHVCQUF1QixFQUFFLE1BQU07RUFDL0IsU0FBUyxFQUFFLE1BQU07RUFDakIsaUJBQWlCLEVBQUUsTUFBTTtBQUMzQjs7QUFFQTs7O0VBR0U7O0FBRUY7RUFDRSxpQ0FBaUMsRUFBRSxNQUFNO0VBQ3pDLGNBQWMsRUFBRSxNQUFNO0FBQ3hCOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSw2QkFBNkI7QUFDL0I7O0FBRUE7OztFQUdFOztBQUVGO0VBQ0UsbUJBQW1CLEVBQUUsTUFBTTtFQUMzQiwwQkFBMEIsRUFBRSxNQUFNO0VBQ2xDLGlDQUFpQyxFQUFFLE1BQU07QUFDM0M7O0FBRUE7O0VBRUU7O0FBRUY7O0VBRUUsbUJBQW1CO0FBQ3JCOztBQUVBOzs7RUFHRTs7QUFFRjs7O0VBR0UsaUNBQWlDLEVBQUUsTUFBTTtFQUN6QyxjQUFjLEVBQUUsTUFBTTtBQUN4Qjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7OztFQUdFOztBQUVGOztFQUVFLGNBQWM7RUFDZCxjQUFjO0VBQ2Qsa0JBQWtCO0VBQ2xCLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxXQUFXO0FBQ2I7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtFQUNFLGtCQUFrQjtBQUNwQjs7QUFFQTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7QUFFRjs7Ozs7RUFLRSxvQkFBb0IsRUFBRSxNQUFNO0VBQzVCLGVBQWUsRUFBRSxNQUFNO0VBQ3ZCLGlCQUFpQixFQUFFLE1BQU07RUFDekIsU0FBUyxFQUFFLE1BQU07QUFDbkI7O0FBRUE7OztFQUdFOztBQUVGO1FBQ1EsTUFBTTtFQUNaLGlCQUFpQjtBQUNuQjs7QUFFQTs7O0VBR0U7O0FBRUY7U0FDUyxNQUFNO0VBQ2Isb0JBQW9CO0FBQ3RCOztBQUVBOztFQUVFOztBQUVGOzs7O0VBSUUsMEJBQTBCO0FBQzVCOztBQUVBOztFQUVFOztBQUVGOzs7O0VBSUUsa0JBQWtCO0VBQ2xCLFVBQVU7QUFDWjs7QUFFQTs7RUFFRTs7QUFFRjs7OztFQUlFLDhCQUE4QjtBQUNoQzs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLDhCQUE4QjtBQUNoQzs7QUFFQTs7Ozs7RUFLRTs7QUFFRjtFQUNFLHNCQUFzQixFQUFFLE1BQU07RUFDOUIsY0FBYyxFQUFFLE1BQU07RUFDdEIsY0FBYyxFQUFFLE1BQU07RUFDdEIsZUFBZSxFQUFFLE1BQU07RUFDdkIsVUFBVSxFQUFFLE1BQU07RUFDbEIsbUJBQW1CLEVBQUUsTUFBTTtBQUM3Qjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLHdCQUF3QjtBQUMxQjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7OztFQUdFOztBQUVGOztFQUVFLHNCQUFzQixFQUFFLE1BQU07RUFDOUIsVUFBVSxFQUFFLE1BQU07QUFDcEI7O0FBRUE7O0VBRUU7O0FBRUY7O0VBRUUsWUFBWTtBQUNkOztBQUVBOzs7RUFHRTs7QUFFRjtFQUNFLDZCQUE2QixFQUFFLE1BQU07RUFDckMsb0JBQW9CLEVBQUUsTUFBTTtBQUM5Qjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLHdCQUF3QjtBQUMxQjs7QUFFQTs7O0VBR0U7O0FBRUY7RUFDRSwwQkFBMEIsRUFBRSxNQUFNO0VBQ2xDLGFBQWEsRUFBRSxNQUFNO0FBQ3ZCOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSxjQUFjO0FBQ2hCOztBQUVBOztFQUVFOztBQUVGO0VBQ0Usa0JBQWtCO0FBQ3BCOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSxhQUFhO0FBQ2ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyohIG5vcm1hbGl6ZS5jc3MgdjguMC4xIHwgTUlUIExpY2Vuc2UgfCBnaXRodWIuY29tL25lY29sYXMvbm9ybWFsaXplLmNzcyAqL1xcblxcbi8qIERvY3VtZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBsaW5lIGhlaWdodCBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXFxuICovXFxuXFxuaHRtbCB7XFxuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcbiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxufVxcblxcbi8qIFNlY3Rpb25zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuYm9keSB7XFxuICBtYXJnaW46IDA7XFxufVxcblxcbi8qKlxcbiAqIFJlbmRlciB0aGUgYG1haW5gIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxcbiAqL1xcblxcbm1haW4ge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIGBoMWAgZWxlbWVudHMgd2l0aGluIGBzZWN0aW9uYCBhbmRcXG4gKiBgYXJ0aWNsZWAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmgxIHtcXG4gIGZvbnQtc2l6ZTogMmVtO1xcbiAgbWFyZ2luOiAwLjY3ZW0gMDtcXG59XFxuXFxuLyogR3JvdXBpbmcgY29udGVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cXG4gKiAyLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlIGFuZCBJRS5cXG4gKi9cXG5cXG5ociB7XFxuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xcbiAgaGVpZ2h0OiAwOyAvKiAxICovXFxuICBvdmVyZmxvdzogdmlzaWJsZTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5wcmUge1xcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxcbiAqL1xcblxcbmEge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxufVxcblxcbi8qKlxcbiAqIDEuIFJlbW92ZSB0aGUgYm90dG9tIGJvcmRlciBpbiBDaHJvbWUgNTctXFxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5hYmJyW3RpdGxlXSB7XFxuICBib3JkZXItYm90dG9tOiBub25lOyAvKiAxICovXFxuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsgLyogMiAqL1xcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYixcXG5zdHJvbmcge1xcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuY29kZSxcXG5rYmQsXFxuc2FtcCB7XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnNtYWxsIHtcXG4gIGZvbnQtc2l6ZTogODAlO1xcbn1cXG5cXG4vKipcXG4gKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cXG4gKiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc3ViLFxcbnN1cCB7XFxuICBmb250LXNpemU6IDc1JTtcXG4gIGxpbmUtaGVpZ2h0OiAwO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG5zdWIge1xcbiAgYm90dG9tOiAtMC4yNWVtO1xcbn1cXG5cXG5zdXAge1xcbiAgdG9wOiAtMC41ZW07XFxufVxcblxcbi8qIEVtYmVkZGVkIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXFxuICovXFxuXFxuaW1nIHtcXG4gIGJvcmRlci1zdHlsZTogbm9uZTtcXG59XFxuXFxuLyogRm9ybXNcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENoYW5nZSB0aGUgZm9udCBzdHlsZXMgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5idXR0b24sXFxuaW5wdXQsXFxub3B0Z3JvdXAsXFxuc2VsZWN0LFxcbnRleHRhcmVhIHtcXG4gIGZvbnQtZmFtaWx5OiBpbmhlcml0OyAvKiAxICovXFxuICBmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cXG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuICBtYXJnaW46IDA7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXFxuICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cXG4gKi9cXG5cXG5idXR0b24sXFxuaW5wdXQgeyAvKiAxICovXFxuICBvdmVyZmxvdzogdmlzaWJsZTtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXFxuICogMS4gUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmJ1dHRvbixcXG5zZWxlY3QgeyAvKiAxICovXFxuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5idXR0b24sXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXSB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XFxuICBib3JkZXItc3R5bGU6IG5vbmU7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG5cXG4vKipcXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXFxuICovXFxuXFxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXTotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl06LW1vei1mb2N1c3Jpbmcge1xcbiAgb3V0bGluZTogMXB4IGRvdHRlZCBCdXR0b25UZXh0O1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXFxuICovXFxuXFxuZmllbGRzZXQge1xcbiAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSB0ZXh0IHdyYXBwaW5nIGluIEVkZ2UgYW5kIElFLlxcbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBJRS5cXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XFxuICogICAgYGZpZWxkc2V0YCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxubGVnZW5kIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG4gIGNvbG9yOiBpbmhlcml0OyAvKiAyICovXFxuICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xcbiAgbWF4LXdpZHRoOiAxMDAlOyAvKiAxICovXFxuICBwYWRkaW5nOiAwOyAvKiAzICovXFxuICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxuICovXFxuXFxucHJvZ3Jlc3Mge1xcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cXG4gKi9cXG5cXG50ZXh0YXJlYSB7XFxuICBvdmVyZmxvdzogYXV0bztcXG59XFxuXFxuLyoqXFxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gSUUgMTAuXFxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxcbiAqL1xcblxcblt0eXBlPVxcXCJjaGVja2JveFxcXCJdLFxcblt0eXBlPVxcXCJyYWRpb1xcXCJdIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXG4gIHBhZGRpbmc6IDA7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxcbiAqL1xcblxcblt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xcbiAgaGVpZ2h0OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBvZGQgYXBwZWFyYW5jZSBpbiBDaHJvbWUgYW5kIFNhZmFyaS5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwic2VhcmNoXFxcIl0ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi9cXG4gIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cXG4gKi9cXG5cXG5bdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAqIDIuIENoYW5nZSBmb250IHByb3BlcnRpZXMgdG8gYGluaGVyaXRgIGluIFNhZmFyaS5cXG4gKi9cXG5cXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAxICovXFxuICBmb250OiBpbmhlcml0OyAvKiAyICovXFxufVxcblxcbi8qIEludGVyYWN0aXZlXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXFxuICovXFxuXFxuZGV0YWlscyB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLypcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc3VtbWFyeSB7XFxuICBkaXNwbGF5OiBsaXN0LWl0ZW07XFxufVxcblxcbi8qIE1pc2NcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwKy5cXG4gKi9cXG5cXG50ZW1wbGF0ZSB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cXG4gKi9cXG5cXG5baGlkZGVuXSB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4vaW1hZ2VzL3N1bm55LmpwZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8xX19fID0gbmV3IFVSTChcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9JTI3aHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmclMjcgdmVyc2lvbj0lMjcxLjElMjcgcHJlc2VydmVBc3BlY3RSYXRpbz0lMjdub25lJTI3IHZpZXdCb3g9JTI3MCAwIDEwMCAxMDAlMjc+PHBhdGggZD0lMjdNMTAwIDAgTDAgMTAwICUyNyBzdHJva2U9JTI3cmVkJTI3IHN0cm9rZS13aWR0aD0lMjc1JTI3Lz48cGF0aCBkPSUyN00wIDAgTDEwMCAxMDAgJTI3IHN0cm9rZT0lMjdyZWQlMjcgc3Ryb2tlLXdpZHRoPSUyNzUlMjcvPjwvc3ZnPlwiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8yX19fID0gbmV3IFVSTChcIi4vaW1hZ2VzL29jZWFuLnBuZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMl9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzJfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqLFxuKjo6YWZ0ZXIsXG4qOjpiZWZvcmUge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG46cm9vdCB7XG4gIC0tZGFyay1ibHVlOiAjNDY4MmE5O1xuICAtLWJsdWU6ICM3NDliYzI7XG4gIC0tbGlnaHQtYmx1ZTogIzkxYzhlNDtcbiAgLS13aGl0ZTogI2Y2ZjRlYjtcbiAgLS1saWdodC15ZWxsb3c6ICNmZmY3ZDQ7XG4gIC0tc2hpcC1ibG9jazogNDBweDtcbn1cblxuaHRtbCB7XG4gIGhlaWdodDogMTAwJTtcbn1cblxuYm9keSB7XG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xuICBkaXNwbGF5OiBncmlkO1xuICBmb250LWZhbWlseTogXCJSb2JvdG9cIiwgc2Fucy1zZXJpZjtcbiAgZ3JpZDpcbiAgICBcImhlYWRlciBoZWFkZXIgaGVhZGVyIGhlYWRlclwiIGF1dG9cbiAgICBcIm1haW4gbWFpbiBtYWluIG1haW5cIiAxZnJcbiAgICBcImZvb3RlciBmb290ZXIgZm9vdGVyIGZvb3RlclwiIGF1dG8gL1xuICAgIDFmciAxZnIgMWZyIDFmcjtcbn1cblxuI2hlYWRlcixcbiNmb290ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ibHVlKTtcbn1cblxuI2hlYWRlciB7XG4gIGdyaWQtYXJlYTogaGVhZGVyO1xuICBmb250LWZhbWlseTogXCJZc2FiZWF1IFNDXCIsIHNhbnMtc2VyaWY7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC1zaXplOiA0cmVtO1xuICBmb250LXdlaWdodDogNzAwO1xuICBsZXR0ZXItc3BhY2luZzogMXB4O1xuICBwYWRkaW5nOiAyMHB4O1xufVxuXG4jbWFpbiB7XG4gIGdyaWQtYXJlYTogbWFpbjtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMjBweDtcbiAgYmFja2dyb3VuZDogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fX30pO1xuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5ncmlkLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDEwMHB4O1xufVxuXG4uY29tcHV0ZXItY29udGFpbmVyIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLnBsYXllci1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDIwcHg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4ucGxheWVyLXRpdGxlIHtcbiAgZm9udC1mYW1pbHk6IFwiWXNhYmVhdSBTQ1wiLCBzYW5zLXNlcmlmO1xuICBmb250LXNpemU6IDNyZW07XG4gIGZvbnQtd2VpZ2h0OiA5MDA7XG4gIGNvbG9yOiB2YXIoLS13aGl0ZSk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgaXNvbGF0aW9uOiBpc29sYXRlO1xuICBwYWRkaW5nOiAyMHB4O1xufVxuXG4ucGxheWVyLXRpdGxlOjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGluc2V0OiAwO1xuICB6LWluZGV4OiAtMTtcbiAgb3BhY2l0eTogMC43O1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xufVxuXG4ucGxheWVyLWJvZHkge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDEwMHB4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLnBsYXllci1ncmlkLFxuLmNvbXB1dGVyLWdyaWQsXG4ucGxheWVyLXNoaXBzIHtcbiAgbWluLXdpZHRoOiA0MDBweDtcbiAgbWluLWhlaWdodDogNDAwcHg7XG4gIG91dGxpbmU6IDNweCBzb2xpZCBibGFjaztcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBpc29sYXRpb246IGlzb2xhdGU7XG59XG5cbi5wbGF5ZXItZ3JpZDo6YWZ0ZXIsXG4uY29tcHV0ZXItZ3JpZDo6YWZ0ZXIsXG4ucGxheWVyLXNoaXBzOjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0LWJsdWUpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGluc2V0OiAwO1xuICB6LWluZGV4OiAtMTtcbiAgb3BhY2l0eTogMC44O1xufVxuXG4ucGxheWVyLXNoaXBzIHtcbiAgZ2FwOiAxMHB4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLmRlc3Ryb3llci1jb250YWluZXIsXG4uc3VibWFyaW5lLWNvbnRhaW5lcixcbi5wYXRyb2wtYm9hdC1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDEwcHg7XG59XG5cbi5zaGlwIHtcbiAgYm9yZGVyOiAycHggc29saWQgdmFyKC0tZGFyay1ibHVlKTtcbiAgaGVpZ2h0OiB2YXIoLS1zaGlwLWJsb2NrKTtcbn1cblxuLmNhcnJpZXIge1xuICB3aWR0aDogY2FsYyh2YXIoLS1zaGlwLWJsb2NrKSAqIDUpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS13aGl0ZSk7XG59XG5cbi5iYXR0bGVzaGlwIHtcbiAgd2lkdGg6IGNhbGModmFyKC0tc2hpcC1ibG9jaykgKiA0KTtcbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmVlbjtcbn1cblxuLmRlc3Ryb3llciB7XG4gIHdpZHRoOiBjYWxjKHZhcigtLXNoaXAtYmxvY2spICogMyk7XG4gIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0cGluaztcbn1cblxuLnN1Ym1hcmluZSB7XG4gIHdpZHRoOiBjYWxjKHZhcigtLXNoaXAtYmxvY2spICogMik7XG4gIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0c2xhdGVncmF5O1xufVxuXG4ucGF0cm9sLWJvYXQge1xuICB3aWR0aDogY2FsYyh2YXIoLS1zaGlwLWJsb2NrKSAqIDEpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBwbHVtO1xufVxuXG4uZ3JpZC1yb3cge1xuICBmbGV4OiAxO1xuICBkaXNwbGF5OiBmbGV4O1xufVxuXG4uZ3JpZC1jb2wge1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS13aGl0ZSk7XG4gIGZsZXg6IDE7XG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMTAwbXMgZWFzZS1pbi1vdXQ7XG59XG5cbi5kcmFnLW92ZXIge1xuICBib3JkZXI6IDJweCBkYXNoZWQgcmVkO1xufVxuXG4uY29tcHV0ZXItZ3JpZCAuZ3JpZC1jb2w6aG92ZXIge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJsdWUpO1xufVxuXG4uZ2FtZS13aW5uZXIge1xuICBmb250LXNpemU6IDNyZW07XG4gIGNvbG9yOiB2YXIoLS13aGl0ZSk7XG4gIHBhZGRpbmc6IDIwcHg7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgaXNvbGF0aW9uOiBpc29sYXRlO1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4uZ2FtZS13aW5uZXI6OmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbiAgei1pbmRleDogLTE7XG4gIGluc2V0OiAwO1xuICBvcGFjaXR5OiAwLjY7XG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XG59XG5cbi5oaXQtc2hpcCB7XG4gIGJhY2tncm91bmQ6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzFfX199KTtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xuICBiYWNrZ3JvdW5kLXNpemU6IDEwMCUgMTAwJSwgYXV0bztcbiAgYm9yZGVyOiAxcHggc29saWQgcmVkO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodC15ZWxsb3cpO1xufVxuXG4uaGl0LW1pc3Mge1xuICBiYWNrZ3JvdW5kOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8yX19ffSk7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0LXllbGxvdyk7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWRhcmstYmx1ZSk7XG59XG5cbi5oaWRlIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuI2Zvb3RlciB7XG4gIGdyaWQtYXJlYTogZm9vdGVyO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG59XG5cbiNmb290ZXIgYSB7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgY29sb3I6IHZhcigtLXdoaXRlKTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7O0VBR0Usc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLGVBQWU7RUFDZixxQkFBcUI7RUFDckIsZ0JBQWdCO0VBQ2hCLHVCQUF1QjtFQUN2QixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsYUFBYTtFQUNiLGlDQUFpQztFQUNqQzs7OzttQkFJaUI7QUFDbkI7O0FBRUE7O0VBRUUsNkJBQTZCO0FBQy9COztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLHFDQUFxQztFQUNyQyxrQkFBa0I7RUFDbEIsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixtQkFBbUI7RUFDbkIsYUFBYTtBQUNmOztBQUVBO0VBQ0UsZUFBZTtFQUNmLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsdUJBQXVCO0VBQ3ZCLG1CQUFtQjtFQUNuQixTQUFTO0VBQ1QsbURBQW1DO0VBQ25DLHNCQUFzQjtFQUN0Qiw0QkFBNEI7RUFDNUIsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsVUFBVTtBQUNaOztBQUVBO0VBQ0UsYUFBYTtBQUNmOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixTQUFTO0VBQ1QsbUJBQW1CO0VBQ25CLHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLHFDQUFxQztFQUNyQyxlQUFlO0VBQ2YsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtFQUNuQixrQkFBa0I7RUFDbEIsa0JBQWtCO0VBQ2xCLGFBQWE7QUFDZjs7QUFFQTtFQUNFLFdBQVc7RUFDWCx1QkFBdUI7RUFDdkIsa0JBQWtCO0VBQ2xCLFFBQVE7RUFDUixXQUFXO0VBQ1gsWUFBWTtFQUNaLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixVQUFVO0VBQ1YsbUJBQW1CO0VBQ25CLHVCQUF1QjtBQUN6Qjs7QUFFQTs7O0VBR0UsZ0JBQWdCO0VBQ2hCLGlCQUFpQjtFQUNqQix3QkFBd0I7RUFDeEIsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixrQkFBa0I7RUFDbEIsa0JBQWtCO0FBQ3BCOztBQUVBOzs7RUFHRSxXQUFXO0VBQ1gsbUNBQW1DO0VBQ25DLGtCQUFrQjtFQUNsQixRQUFRO0VBQ1IsV0FBVztFQUNYLFlBQVk7QUFDZDs7QUFFQTtFQUNFLFNBQVM7RUFDVCx1QkFBdUI7RUFDdkIsbUJBQW1CO0FBQ3JCOztBQUVBOzs7RUFHRSxhQUFhO0VBQ2IsU0FBUztBQUNYOztBQUVBO0VBQ0Usa0NBQWtDO0VBQ2xDLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLGtDQUFrQztFQUNsQyw4QkFBOEI7QUFDaEM7O0FBRUE7RUFDRSxrQ0FBa0M7RUFDbEMsNEJBQTRCO0FBQzlCOztBQUVBO0VBQ0Usa0NBQWtDO0VBQ2xDLDJCQUEyQjtBQUM3Qjs7QUFFQTtFQUNFLGtDQUFrQztFQUNsQyxnQ0FBZ0M7QUFDbEM7O0FBRUE7RUFDRSxrQ0FBa0M7RUFDbEMsc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsT0FBTztFQUNQLGFBQWE7QUFDZjs7QUFFQTtFQUNFLDhCQUE4QjtFQUM5QixPQUFPO0VBQ1AsOENBQThDO0FBQ2hEOztBQUVBO0VBQ0Usc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLDZCQUE2QjtBQUMvQjs7QUFFQTtFQUNFLGVBQWU7RUFDZixtQkFBbUI7RUFDbkIsYUFBYTtFQUNiLGtCQUFrQjtFQUNsQixrQkFBa0I7RUFDbEIsYUFBYTtBQUNmOztBQUVBO0VBQ0UsV0FBVztFQUNYLGtCQUFrQjtFQUNsQix1QkFBdUI7RUFDdkIsV0FBVztFQUNYLFFBQVE7RUFDUixZQUFZO0VBQ1osbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsbURBQXdRO0VBQ3hRLDRCQUE0QjtFQUM1QiwyQkFBMkI7RUFDM0IsZ0NBQWdDO0VBQ2hDLHFCQUFxQjtFQUNyQixxQ0FBcUM7QUFDdkM7O0FBRUE7RUFDRSxtREFBbUM7RUFDbkMscUNBQXFDO0VBQ3JDLGtDQUFrQztBQUNwQzs7QUFFQTtFQUNFLGFBQWE7QUFDZjs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLG1CQUFtQjtBQUNyQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqLFxcbio6OmFmdGVyLFxcbio6OmJlZm9yZSB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG46cm9vdCB7XFxuICAtLWRhcmstYmx1ZTogIzQ2ODJhOTtcXG4gIC0tYmx1ZTogIzc0OWJjMjtcXG4gIC0tbGlnaHQtYmx1ZTogIzkxYzhlNDtcXG4gIC0td2hpdGU6ICNmNmY0ZWI7XFxuICAtLWxpZ2h0LXllbGxvdzogI2ZmZjdkNDtcXG4gIC0tc2hpcC1ibG9jazogNDBweDtcXG59XFxuXFxuaHRtbCB7XFxuICBoZWlnaHQ6IDEwMCU7XFxufVxcblxcbmJvZHkge1xcbiAgbWluLWhlaWdodDogMTAwdmg7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJSb2JvdG9cXFwiLCBzYW5zLXNlcmlmO1xcbiAgZ3JpZDpcXG4gICAgXFxcImhlYWRlciBoZWFkZXIgaGVhZGVyIGhlYWRlclxcXCIgYXV0b1xcbiAgICBcXFwibWFpbiBtYWluIG1haW4gbWFpblxcXCIgMWZyXFxuICAgIFxcXCJmb290ZXIgZm9vdGVyIGZvb3RlciBmb290ZXJcXFwiIGF1dG8gL1xcbiAgICAxZnIgMWZyIDFmciAxZnI7XFxufVxcblxcbiNoZWFkZXIsXFxuI2Zvb3RlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ibHVlKTtcXG59XFxuXFxuI2hlYWRlciB7XFxuICBncmlkLWFyZWE6IGhlYWRlcjtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiWXNhYmVhdSBTQ1xcXCIsIHNhbnMtc2VyaWY7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LXNpemU6IDRyZW07XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDFweDtcXG4gIHBhZGRpbmc6IDIwcHg7XFxufVxcblxcbiNtYWluIHtcXG4gIGdyaWQtYXJlYTogbWFpbjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZ2FwOiAyMHB4O1xcbiAgYmFja2dyb3VuZDogdXJsKC4vaW1hZ2VzL3N1bm55LmpwZyk7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuLmdyaWQtY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBnYXA6IDEwMHB4O1xcbn1cXG5cXG4uY29tcHV0ZXItY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5wbGF5ZXItY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgZ2FwOiAyMHB4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4ucGxheWVyLXRpdGxlIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiWXNhYmVhdSBTQ1xcXCIsIHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDNyZW07XFxuICBmb250LXdlaWdodDogOTAwO1xcbiAgY29sb3I6IHZhcigtLXdoaXRlKTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGlzb2xhdGlvbjogaXNvbGF0ZTtcXG4gIHBhZGRpbmc6IDIwcHg7XFxufVxcblxcbi5wbGF5ZXItdGl0bGU6OmFmdGVyIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBpbnNldDogMDtcXG4gIHotaW5kZXg6IC0xO1xcbiAgb3BhY2l0eTogMC43O1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG59XFxuXFxuLnBsYXllci1ib2R5IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBnYXA6IDEwMHB4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4ucGxheWVyLWdyaWQsXFxuLmNvbXB1dGVyLWdyaWQsXFxuLnBsYXllci1zaGlwcyB7XFxuICBtaW4td2lkdGg6IDQwMHB4O1xcbiAgbWluLWhlaWdodDogNDAwcHg7XFxuICBvdXRsaW5lOiAzcHggc29saWQgYmxhY2s7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGlzb2xhdGlvbjogaXNvbGF0ZTtcXG59XFxuXFxuLnBsYXllci1ncmlkOjphZnRlcixcXG4uY29tcHV0ZXItZ3JpZDo6YWZ0ZXIsXFxuLnBsYXllci1zaGlwczo6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodC1ibHVlKTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGluc2V0OiAwO1xcbiAgei1pbmRleDogLTE7XFxuICBvcGFjaXR5OiAwLjg7XFxufVxcblxcbi5wbGF5ZXItc2hpcHMge1xcbiAgZ2FwOiAxMHB4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG5cXG4uZGVzdHJveWVyLWNvbnRhaW5lcixcXG4uc3VibWFyaW5lLWNvbnRhaW5lcixcXG4ucGF0cm9sLWJvYXQtY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBnYXA6IDEwcHg7XFxufVxcblxcbi5zaGlwIHtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWRhcmstYmx1ZSk7XFxuICBoZWlnaHQ6IHZhcigtLXNoaXAtYmxvY2spO1xcbn1cXG5cXG4uY2FycmllciB7XFxuICB3aWR0aDogY2FsYyh2YXIoLS1zaGlwLWJsb2NrKSAqIDUpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0td2hpdGUpO1xcbn1cXG5cXG4uYmF0dGxlc2hpcCB7XFxuICB3aWR0aDogY2FsYyh2YXIoLS1zaGlwLWJsb2NrKSAqIDQpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmVlbjtcXG59XFxuXFxuLmRlc3Ryb3llciB7XFxuICB3aWR0aDogY2FsYyh2YXIoLS1zaGlwLWJsb2NrKSAqIDMpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRwaW5rO1xcbn1cXG5cXG4uc3VibWFyaW5lIHtcXG4gIHdpZHRoOiBjYWxjKHZhcigtLXNoaXAtYmxvY2spICogMik7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodHNsYXRlZ3JheTtcXG59XFxuXFxuLnBhdHJvbC1ib2F0IHtcXG4gIHdpZHRoOiBjYWxjKHZhcigtLXNoaXAtYmxvY2spICogMSk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBwbHVtO1xcbn1cXG5cXG4uZ3JpZC1yb3cge1xcbiAgZmxleDogMTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxufVxcblxcbi5ncmlkLWNvbCB7XFxuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS13aGl0ZSk7XFxuICBmbGV4OiAxO1xcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAxMDBtcyBlYXNlLWluLW91dDtcXG59XFxuXFxuLmRyYWctb3ZlciB7XFxuICBib3JkZXI6IDJweCBkYXNoZWQgcmVkO1xcbn1cXG5cXG4uY29tcHV0ZXItZ3JpZCAuZ3JpZC1jb2w6aG92ZXIge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmx1ZSk7XFxufVxcblxcbi5nYW1lLXdpbm5lciB7XFxuICBmb250LXNpemU6IDNyZW07XFxuICBjb2xvcjogdmFyKC0td2hpdGUpO1xcbiAgcGFkZGluZzogMjBweDtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGlzb2xhdGlvbjogaXNvbGF0ZTtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5nYW1lLXdpbm5lcjo6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG4gIHotaW5kZXg6IC0xO1xcbiAgaW5zZXQ6IDA7XFxuICBvcGFjaXR5OiAwLjY7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbn1cXG5cXG4uaGl0LXNoaXAge1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgdmVyc2lvbj0nMS4xJyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSdub25lJyB2aWV3Qm94PScwIDAgMTAwIDEwMCc+PHBhdGggZD0nTTEwMCAwIEwwIDEwMCAnIHN0cm9rZT0ncmVkJyBzdHJva2Utd2lkdGg9JzUnLz48cGF0aCBkPSdNMCAwIEwxMDAgMTAwICcgc3Ryb2tlPSdyZWQnIHN0cm9rZS13aWR0aD0nNScvPjwvc3ZnPlxcXCIpO1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcXG4gIGJhY2tncm91bmQtc2l6ZTogMTAwJSAxMDAlLCBhdXRvO1xcbiAgYm9yZGVyOiAxcHggc29saWQgcmVkO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQteWVsbG93KTtcXG59XFxuXFxuLmhpdC1taXNzIHtcXG4gIGJhY2tncm91bmQ6IHVybCguL2ltYWdlcy9vY2Vhbi5wbmcpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQteWVsbG93KTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWRhcmstYmx1ZSk7XFxufVxcblxcbi5oaWRlIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbiNmb290ZXIge1xcbiAgZ3JpZC1hcmVhOiBmb290ZXI7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LXdlaWdodDogNzAwO1xcbn1cXG5cXG4jZm9vdGVyIGEge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY29sb3I6IHZhcigtLXdoaXRlKTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTtcblxuICAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfVxuXG4gIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbm9ybWFsaXplLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHtcblx0XHRcdHZhciBpID0gc2NyaXB0cy5sZW5ndGggLSAxO1xuXHRcdFx0d2hpbGUgKGkgPiAtMSAmJiAhc2NyaXB0VXJsKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBcIm5vcm1hbGl6ZS5jc3NcIjtcbmltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XG5pbXBvcnQge1xuICBjb21wbGV0ZURvbUdyaWQsXG4gIGNyZWF0ZUNvb3JkaW5hdGVFdmVudCxcbiAgY3JlYXRlRHJhZ2dhYmxlRXZlbnRzLFxufSBmcm9tIFwiLi9tb2R1bGVzL2RvbVwiO1xuaW1wb3J0IGdhbWVMb29wRmFjdG9yeSBmcm9tIFwiLi9tb2R1bGVzL2dhbWVsb29wXCI7XG5cbmNvbnN0IGdhbWUgPSBnYW1lTG9vcEZhY3RvcnkoKTtcblxuY29tcGxldGVEb21HcmlkKCk7XG5jcmVhdGVDb29yZGluYXRlRXZlbnQoZ2FtZSk7XG5jcmVhdGVEcmFnZ2FibGVFdmVudHMoKTtcbiJdLCJuYW1lcyI6WyJjb21wbGV0ZURvbUdyaWQiLCJwbGF5ZXJHcmlkIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY29tcHV0ZXJHcmlkIiwiY3JlYXRlRG9tR3JpZCIsImdyaWQiLCJzaXplIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiaSIsIm5ld1JvdyIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJqIiwibmV3Q29sIiwiZGF0YXNldCIsIngiLCJ5IiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVDb29yZGluYXRlRXZlbnQiLCJnYW1lIiwiY29vcmRpbmF0ZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImNvb3JkaW5hdGUiLCJhZGRFdmVudExpc3RlbmVyIiwiY29udGFpbnMiLCJwb3NYIiwicGFyc2VJbnQiLCJwb3NZIiwiY2hlY2tXaW5uZXIiLCJnZXRDdXJyZW50UGxheWVyTmFtZSIsImRpc3BsYXlDdXJyZW50UGxheWVyIiwicGxheWVyVHVybiIsImFkZENvb3JkaW5hdGVDbGFzcyIsImdldENvbXB1dGVyQm9hcmQiLCJ1cGRhdGVQbGF5ZXJHcmlkIiwiZGlzcGxheVdpbm5lciIsImdhbWVib2FyZCIsImlzU2hpcEhpdHRlZCIsIm5hbWUiLCJjdXJyZW50UGxheWVyIiwidGV4dENvbnRlbnQiLCJyZXN1bHQiLCJjb21wdXRlclR1cm4iLCJjb21wWCIsImNvbXBZIiwicG9zaXRpb24iLCJpbmRleCIsIm5ld0Nvb3JkaW5hdGUiLCJnZXRQbGF5ZXJCb2FyZCIsImdhbWVXaW5uZXIiLCJkZWNsYXJlV2lubmVyIiwic3R5bGUiLCJkaXNwbGF5IiwiZ3JpZENvbnRhaW5lciIsImNyZWF0ZURyYWdnYWJsZUV2ZW50cyIsInNoaXBzIiwic2hpcCIsImRyYWdTdGFydCIsInBsYXllckNvb3JkaW5hdGVzIiwiZHJhZ0VudGVyIiwiZHJhZ092ZXIiLCJkcmFnTGVhdmUiLCJzaGlwRHJvcCIsImUiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwidGFyZ2V0IiwiaWQiLCJjb25zb2xlIiwibG9nIiwicHJldmVudERlZmF1bHQiLCJyZW1vdmUiLCJnZXREYXRhIiwiZHJhZ2dhYmxlIiwiZ2V0RWxlbWVudEJ5SWQiLCJzaGlwRmFjdG9yeSIsImdhbWVCb2FyZEZhY3RvcnkiLCJjcmVhdGVHYW1lQm9hcmRHcmlkIiwic2hpcGJvYXJkIiwiZ2V0R2FtZUJvYXJkIiwiZ2V0U2hpcEJvYXJkIiwic2hpcENvdW50IiwiTWFwIiwiZ2V0U2hpcHMiLCJwbGFjZVNoaXAiLCJkaXJlY3Rpb24iLCJuZXdTaGlwIiwic2V0IiwiZ2FtZUJvYXJkU2l6ZSIsImVuZFBvaW50IiwiaXNTaGlwT3ZlcmxhcHBlZCIsInNoaXBPdmVybGFwIiwicmVjZWl2ZUF0dGFjayIsImdldCIsImhpdCIsImlzQWxsU2hpcHNTdW5rIiwiYWxsU2hpcHNTdW5rIiwicm93IiwiY29sIiwicHVzaCIsIm1hcCIsInZhbHVlIiwiZXZlcnkiLCJpc1N1bmsiLCJwbGF5ZXJGYWN0b3J5IiwiY29tcHV0ZXJGYWN0b3J5IiwiZ2FtZUxvb3BGYWN0b3J5IiwicGxheWVyR2FtZUJvYXJkIiwiY29tcHV0ZXJHYW1lQm9hcmQiLCJwbGF5ZXIiLCJjb21wdXRlciIsImlzUGxheWVyVHVybiIsImdldE5hbWUiLCJhdHRhY2siLCJnZW5lcmF0ZUNvb3JkaW5hdGUiLCJnZXRWYWxpZENvb3JkaW5hdGVzIiwicmFuZG9tTnVtYmVyIiwibnVtYmVyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiYXZhaWxhYmxlQ29vcmRpbmF0ZXMiLCJnZXRDb29yZGluYXRlcyIsImhpdHMiLCJnZXRTaGlwTmFtZSIsImdldEhpdHMiXSwic291cmNlUm9vdCI6IiJ9