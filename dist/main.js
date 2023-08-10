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
/* harmony export */   createEventListener: () => (/* binding */ createEventListener),
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
function createEventListener(game) {
  // Get computer grid and the coordinates from it
  const computerGrid = document.querySelector(".computer-grid");
  const coordinates = computerGrid.querySelectorAll(".grid-col");

  // Add an event listener to each coordinate
  coordinates.forEach(coordinate => coordinate.addEventListener("click", () => {
    if (coordinate.classList.contains("hit-ship") || coordinate.classList.contains("hit-miss")) return;
    const posX = parseInt(coordinate.dataset.x, 10);
    const posY = parseInt(coordinate.dataset.y, 10);
    // Check if it's the player turn
    if (game.getCurrentPlayerName() !== "computer") {
      displayCurrentPlayer(game.getCurrentPlayerName());
      game.playerTurn(posX, posY);
    }

    // Add the respective class to the hitted coordinate
    addCoordinateClass(posX, posY, game.getComputerBoard(), coordinate);

    // Let the computer play as long as it's it turn.
    while (game.getCurrentPlayerName() === "computer") {
      updatePlayerGrid(game);
    }
  }));
}
function addCoordinateClass(x, y, gameboard, coordinate) {
  if (gameboard.isShipHitted(x, y)) {
    coordinate.classList.add("hit-ship");
  } else {
    coordinate.classList.add("hit-miss");
  }
}
function displayCurrentPlayer(name) {
  const currentPlayer = document.querySelector(".current-player");
  currentPlayer.textContent = `${name} turn`;
}
function updatePlayerGrid(game) {
  // Get the player grid and it's coordinates
  const playerGrid = document.querySelector(".player-grid");
  const coordinates = playerGrid.querySelectorAll(".grid-col");

  // Get the x and y position randomly generated for the computer
  const result = game.computerTurn();

  // Split the result and transform it to string
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
  gap: 100px;
  background: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
  background-size: cover;
  background-repeat: no-repeat;
}

.grid-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 100px;
}

.player-grid,
.computer-grid {
  min-width: 400px;
  min-height: 400px;
  outline: 3px solid black;
  display: flex;
  flex-direction: column;
  position: relative;
  isolation: isolate;
}

.player-grid::after,
.computer-grid::after {
  content: "";
  background-color: var(--light-blue);
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: 0.8;
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

.computer-grid .grid-col:hover {
  cursor: pointer;
  background-color: var(--blue);
}

.hit-ship {
  background: url(${___CSS_LOADER_URL_REPLACEMENT_1___});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%, auto;
  border: 1px solid red;
}

.hit-miss {
  background: url(${___CSS_LOADER_URL_REPLACEMENT_2___});
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
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;;;EAGE,sBAAsB;AACxB;;AAEA;EACE,oBAAoB;EACpB,eAAe;EACf,qBAAqB;EACrB,gBAAgB;AAClB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,iBAAiB;EACjB,aAAa;EACb,iCAAiC;EACjC;;;;mBAIiB;AACnB;;AAEA;;EAEE,6BAA6B;AAC/B;;AAEA;EACE,iBAAiB;EACjB,qCAAqC;EACrC,kBAAkB;EAClB,eAAe;EACf,gBAAgB;EAChB,mBAAmB;EACnB,aAAa;AACf;;AAEA;EACE,eAAe;EACf,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,mBAAmB;EACnB,UAAU;EACV,mDAAmC;EACnC,sBAAsB;EACtB,4BAA4B;AAC9B;;AAEA;EACE,aAAa;EACb,uBAAuB;EACvB,mBAAmB;EACnB,UAAU;AACZ;;AAEA;;EAEE,gBAAgB;EAChB,iBAAiB;EACjB,wBAAwB;EACxB,aAAa;EACb,sBAAsB;EACtB,kBAAkB;EAClB,kBAAkB;AACpB;;AAEA;;EAEE,WAAW;EACX,mCAAmC;EACnC,kBAAkB;EAClB,QAAQ;EACR,WAAW;EACX,YAAY;AACd;;AAEA;EACE,OAAO;EACP,aAAa;AACf;;AAEA;EACE,8BAA8B;EAC9B,OAAO;EACP,8CAA8C;AAChD;;AAEA;EACE,eAAe;EACf,6BAA6B;AAC/B;;AAEA;EACE,mDAAwQ;EACxQ,4BAA4B;EAC5B,2BAA2B;EAC3B,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,mDAAmC;AACrC;;AAEA;EACE,iBAAiB;EACjB,kBAAkB;EAClB,gBAAgB;AAClB;;AAEA;EACE,qBAAqB;EACrB,mBAAmB;AACrB","sourcesContent":["*,\n*::after,\n*::before {\n  box-sizing: border-box;\n}\n\n:root {\n  --dark-blue: #4682a9;\n  --blue: #749bc2;\n  --light-blue: #91c8e4;\n  --white: #f6f4eb;\n}\n\nhtml {\n  height: 100%;\n}\n\nbody {\n  min-height: 100vh;\n  display: grid;\n  font-family: \"Roboto\", sans-serif;\n  grid:\n    \"header header header header\" auto\n    \"main main main main\" 1fr\n    \"footer footer footer footer\" auto /\n    1fr 1fr 1fr 1fr;\n}\n\n#header,\n#footer {\n  background-color: var(--blue);\n}\n\n#header {\n  grid-area: header;\n  font-family: \"Ysabeau SC\", sans-serif;\n  text-align: center;\n  font-size: 4rem;\n  font-weight: 700;\n  letter-spacing: 1px;\n  padding: 20px;\n}\n\n#main {\n  grid-area: main;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 100px;\n  background: url(./images/sunny.jpg);\n  background-size: cover;\n  background-repeat: no-repeat;\n}\n\n.grid-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 100px;\n}\n\n.player-grid,\n.computer-grid {\n  min-width: 400px;\n  min-height: 400px;\n  outline: 3px solid black;\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  isolation: isolate;\n}\n\n.player-grid::after,\n.computer-grid::after {\n  content: \"\";\n  background-color: var(--light-blue);\n  position: absolute;\n  inset: 0;\n  z-index: -1;\n  opacity: 0.8;\n}\n\n.grid-row {\n  flex: 1;\n  display: flex;\n}\n\n.grid-col {\n  border: 1px solid var(--white);\n  flex: 1;\n  transition: background-color 100ms ease-in-out;\n}\n\n.computer-grid .grid-col:hover {\n  cursor: pointer;\n  background-color: var(--blue);\n}\n\n.hit-ship {\n  background: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' preserveAspectRatio='none' viewBox='0 0 100 100'><path d='M100 0 L0 100 ' stroke='red' stroke-width='5'/><path d='M0 0 L100 100 ' stroke='red' stroke-width='5'/></svg>\");\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 100% 100%, auto;\n  border: 1px solid red;\n}\n\n.hit-miss {\n  background: url(./images/ocean.png);\n}\n\n#footer {\n  grid-area: footer;\n  text-align: center;\n  font-weight: 700;\n}\n\n#footer a {\n  text-decoration: none;\n  color: var(--white);\n}\n"],"sourceRoot":""}]);
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
(0,_modules_dom__WEBPACK_IMPORTED_MODULE_2__.createEventListener)(game);
(0,_modules_dom__WEBPACK_IMPORTED_MODULE_2__.displayCurrentPlayer)(game.getCurrentPlayerName());
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ2xCQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7Ozs7O1dDckJBOzs7Ozs7Ozs7Ozs7Ozs7QUNBdUI7QUFDRjtBQUtFO0FBQzBCO0FBRWpELE1BQU1nQixJQUFJLEdBQUc4RCw2REFBZSxDQUFDLENBQUM7QUFFOUJyRiw2REFBZSxDQUFDLENBQUM7QUFDakJzQixpRUFBbUIsQ0FBQ0MsSUFBSSxDQUFDO0FBQ3pCVyxrRUFBb0IsQ0FBQ1gsSUFBSSxDQUFDVSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9kb20uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9ub3JtYWxpemUuY3NzL25vcm1hbGl6ZS5jc3M/MzQyZiIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvbXBsZXRlIHRoZSBncmlkIG9uIHRoZSB3ZWJzaXRlXG5leHBvcnQgZnVuY3Rpb24gY29tcGxldGVEb21HcmlkKCkge1xuICAvLyBHZXQgdGhlIHBsYXllciBhbmQgY29tcHV0ZXIgZ3JpZFxuICBjb25zdCBwbGF5ZXJHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXItZ3JpZFwiKTtcbiAgY29uc3QgY29tcHV0ZXJHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb21wdXRlci1ncmlkXCIpO1xuXG4gIC8vIENyZWF0ZSB0aGUgZ3JpZCBmb3IgdGhlIHBsYXllciBhbmQgY29tcHV0ZXJcbiAgY3JlYXRlRG9tR3JpZChwbGF5ZXJHcmlkKTtcbiAgY3JlYXRlRG9tR3JpZChjb21wdXRlckdyaWQpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVEb21HcmlkKGdyaWQsIHNpemUgPSAxMCkge1xuICAvLyBDcmVhdGUgYSBzaXplIHggc2l6ZSBncmlkXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgY29uc3QgbmV3Um93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBuZXdSb3cuY2xhc3NMaXN0LmFkZChcImdyaWQtcm93XCIpO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2l6ZTsgaisrKSB7XG4gICAgICBjb25zdCBuZXdDb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgbmV3Q29sLmNsYXNzTGlzdC5hZGQoXCJncmlkLWNvbFwiKTtcbiAgICAgIG5ld0NvbC5kYXRhc2V0LnggPSBpO1xuICAgICAgbmV3Q29sLmRhdGFzZXQueSA9IGo7XG4gICAgICBuZXdSb3cuYXBwZW5kQ2hpbGQobmV3Q29sKTtcbiAgICB9XG4gICAgZ3JpZC5hcHBlbmRDaGlsZChuZXdSb3cpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFdmVudExpc3RlbmVyKGdhbWUpIHtcbiAgLy8gR2V0IGNvbXB1dGVyIGdyaWQgYW5kIHRoZSBjb29yZGluYXRlcyBmcm9tIGl0XG4gIGNvbnN0IGNvbXB1dGVyR3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItZ3JpZFwiKTtcbiAgY29uc3QgY29vcmRpbmF0ZXMgPSBjb21wdXRlckdyaWQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkLWNvbFwiKTtcblxuICAvLyBBZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gZWFjaCBjb29yZGluYXRlXG4gIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkaW5hdGUpID0+XG4gICAgY29vcmRpbmF0ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBjb29yZGluYXRlLmNsYXNzTGlzdC5jb250YWlucyhcImhpdC1zaGlwXCIpIHx8XG4gICAgICAgIGNvb3JkaW5hdGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0LW1pc3NcIilcbiAgICAgIClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY29uc3QgcG9zWCA9IHBhcnNlSW50KGNvb3JkaW5hdGUuZGF0YXNldC54LCAxMCk7XG4gICAgICBjb25zdCBwb3NZID0gcGFyc2VJbnQoY29vcmRpbmF0ZS5kYXRhc2V0LnksIDEwKTtcbiAgICAgIC8vIENoZWNrIGlmIGl0J3MgdGhlIHBsYXllciB0dXJuXG4gICAgICBpZiAoZ2FtZS5nZXRDdXJyZW50UGxheWVyTmFtZSgpICE9PSBcImNvbXB1dGVyXCIpIHtcbiAgICAgICAgZGlzcGxheUN1cnJlbnRQbGF5ZXIoZ2FtZS5nZXRDdXJyZW50UGxheWVyTmFtZSgpKTtcbiAgICAgICAgZ2FtZS5wbGF5ZXJUdXJuKHBvc1gsIHBvc1kpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdGhlIHJlc3BlY3RpdmUgY2xhc3MgdG8gdGhlIGhpdHRlZCBjb29yZGluYXRlXG4gICAgICBhZGRDb29yZGluYXRlQ2xhc3MocG9zWCwgcG9zWSwgZ2FtZS5nZXRDb21wdXRlckJvYXJkKCksIGNvb3JkaW5hdGUpO1xuXG4gICAgICAvLyBMZXQgdGhlIGNvbXB1dGVyIHBsYXkgYXMgbG9uZyBhcyBpdCdzIGl0IHR1cm4uXG4gICAgICB3aGlsZSAoZ2FtZS5nZXRDdXJyZW50UGxheWVyTmFtZSgpID09PSBcImNvbXB1dGVyXCIpIHtcbiAgICAgICAgdXBkYXRlUGxheWVyR3JpZChnYW1lKTtcbiAgICAgIH1cbiAgICB9KVxuICApO1xufVxuXG5mdW5jdGlvbiBhZGRDb29yZGluYXRlQ2xhc3MoeCwgeSwgZ2FtZWJvYXJkLCBjb29yZGluYXRlKSB7XG4gIGlmIChnYW1lYm9hcmQuaXNTaGlwSGl0dGVkKHgsIHkpKSB7XG4gICAgY29vcmRpbmF0ZS5jbGFzc0xpc3QuYWRkKFwiaGl0LXNoaXBcIik7XG4gIH0gZWxzZSB7XG4gICAgY29vcmRpbmF0ZS5jbGFzc0xpc3QuYWRkKFwiaGl0LW1pc3NcIik7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BsYXlDdXJyZW50UGxheWVyKG5hbWUpIHtcbiAgY29uc3QgY3VycmVudFBsYXllciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY3VycmVudC1wbGF5ZXJcIik7XG4gIGN1cnJlbnRQbGF5ZXIudGV4dENvbnRlbnQgPSBgJHtuYW1lfSB0dXJuYDtcbn1cblxuZnVuY3Rpb24gdXBkYXRlUGxheWVyR3JpZChnYW1lKSB7XG4gIC8vIEdldCB0aGUgcGxheWVyIGdyaWQgYW5kIGl0J3MgY29vcmRpbmF0ZXNcbiAgY29uc3QgcGxheWVyR3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLWdyaWRcIik7XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gcGxheWVyR3JpZC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtY29sXCIpO1xuXG4gIC8vIEdldCB0aGUgeCBhbmQgeSBwb3NpdGlvbiByYW5kb21seSBnZW5lcmF0ZWQgZm9yIHRoZSBjb21wdXRlclxuICBjb25zdCByZXN1bHQgPSBnYW1lLmNvbXB1dGVyVHVybigpO1xuXG4gIC8vIFNwbGl0IHRoZSByZXN1bHQgYW5kIHRyYW5zZm9ybSBpdCB0byBzdHJpbmdcbiAgY29uc3QgeyBjb21wWCwgY29tcFkgfSA9IHJlc3VsdDtcblxuICAvLyBHZXQgdGhlIGluZGV4IG9uIHRoZSBub2RlIGxpc3QgdGhhdCByZXByZXNlbnQgdGhlIGN1cnJlbnQgY29vcmRpbmF0ZVxuICBsZXQgcG9zaXRpb247XG4gIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkaW5hdGUsIGluZGV4KSA9PiB7XG4gICAgaWYgKFxuICAgICAgcGFyc2VJbnQoY29vcmRpbmF0ZS5kYXRhc2V0LngsIDEwKSA9PT0gY29tcFggJiZcbiAgICAgIHBhcnNlSW50KGNvb3JkaW5hdGUuZGF0YXNldC55LCAxMCkgPT09IGNvbXBZXG4gICAgKSB7XG4gICAgICBwb3NpdGlvbiA9IGluZGV4O1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gR2V0IHRoZSBjb29yZGluYXRlXG4gIGNvbnN0IG5ld0Nvb3JkaW5hdGUgPSBjb29yZGluYXRlc1twb3NpdGlvbl07XG5cbiAgLy8gQWRkIHRoZSBjbGFzcyB0byBpdFxuICBhZGRDb29yZGluYXRlQ2xhc3MoY29tcFgsIGNvbXBZLCBnYW1lLmdldFBsYXllckJvYXJkKCksIG5ld0Nvb3JkaW5hdGUpO1xufVxuIiwiaW1wb3J0IHNoaXBGYWN0b3J5IGZyb20gXCIuL3NoaXBcIjtcblxuLy8gTWFrZSBhIGdhbWUgYm9hcmQgZmFjdG9yeSB0aGF0IHdvcmtzIGFzIGEgZ2FtZWJvYXJkIGZvciB0aGUgYmF0dGxlc2hpcCBnYW1lLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2FtZUJvYXJkRmFjdG9yeSgpIHtcbiAgLy8gQ3JlYXRlIGdhbWVib2FyZCBhbmQgc2hpcCBib2FyZCB0byBrZWVwIHRyYWNrIG9mIHRoZSBzaGlwc1xuICBjb25zdCBnYW1lYm9hcmQgPSBjcmVhdGVHYW1lQm9hcmRHcmlkKCk7XG4gIGNvbnN0IHNoaXBib2FyZCA9IGNyZWF0ZUdhbWVCb2FyZEdyaWQoKTtcbiAgY29uc3QgZ2V0R2FtZUJvYXJkID0gKCkgPT4gZ2FtZWJvYXJkO1xuICBjb25zdCBnZXRTaGlwQm9hcmQgPSAoKSA9PiBzaGlwYm9hcmQ7XG5cbiAgLy8gVmFyaWFibGVzIHRvIGtlZXAgdHJhY2sgb2YgaG93IG1hbnkgc2hpcHMgaGF2ZSBiZWVuIHBsYWNlZCBhbmQgdG8gc3RvcmUgdGhlbVxuICBsZXQgc2hpcENvdW50ID0gMDtcbiAgY29uc3Qgc2hpcHMgPSBuZXcgTWFwKCk7XG4gIGNvbnN0IGdldFNoaXBzID0gKCkgPT4gc2hpcHM7XG5cbiAgLy8gRnVuY3Rpb24gdGhhdCBsZXQgeW91IHBsYWNlIHNoaXBzIG9uIHRoZSBnYW1lYm9hcmRcbiAgY29uc3QgcGxhY2VTaGlwID0gKHgsIHksIHNpemUsIGRpcmVjdGlvbiA9IFwicm93XCIpID0+IHtcbiAgICAvLyBJbmNyZWFzZSBzaGlwIGNvdW50IGFuZCBtYXAgdGhlIG5ldyBzaGlwXG4gICAgc2hpcENvdW50Kys7XG4gICAgY29uc3QgbmV3U2hpcCA9IHNoaXBGYWN0b3J5KHNpemUpO1xuICAgIHNoaXBzLnNldChgJHtzaGlwQ291bnR9YCwgbmV3U2hpcCk7XG5cbiAgICAvLyBDaGVjayB0aGF0IHRoZSBzaGlwIGJlZWluZyBwbGFjZWQgYXQgdGhlIGNvb3JkaW5hdGVzICh4LCB5KSBkb2Vzbid0IGdvIGJleW9uZCBnYW1lYm9hcmQgc2l6ZVxuICAgIGNvbnN0IGdhbWVCb2FyZFNpemUgPSBnYW1lYm9hcmQubGVuZ3RoO1xuICAgIGNvbnN0IGVuZFBvaW50ID0gZGlyZWN0aW9uID09PSBcImNvbFwiID8gc2l6ZSArIHggOiBzaXplICsgeTtcbiAgICBpZiAoZW5kUG9pbnQgPiBnYW1lQm9hcmRTaXplKSByZXR1cm4gXCJTaGlwIGNhbm5vdCBiZSBwbGFjZWRcIjtcblxuICAgIC8vIENoZWNrIHRoYXQgdGhlIHNoaXBzIGRvZXNuJ3Qgb3ZlcmxhcFxuICAgIGNvbnN0IGlzU2hpcE92ZXJsYXBwZWQgPSBzaGlwT3ZlcmxhcChnYW1lYm9hcmQsIHgsIHksIHNpemUsIGRpcmVjdGlvbik7XG4gICAgaWYgKGlzU2hpcE92ZXJsYXBwZWQpIHJldHVybiBcIlNoaXBzIGFyZSBvdmVybGFwcGluZywgY2Fubm90IGJlIHBsYWNlZFwiO1xuXG4gICAgLy8gUGxhY2UgdGhlIHNoaXAgb24gdGhlIGdhbWVib2FyZCBjaGVja2luZyBmb3IgaXQncyBkaXJlY3Rpb25cbiAgICBpZiAoZGlyZWN0aW9uID09PSBcImNvbFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0geDsgaSA8IGVuZFBvaW50OyBpKyspIHtcbiAgICAgICAgZ2FtZWJvYXJkW2ldW3ldID0gYCR7c2hpcENvdW50fWA7XG4gICAgICAgIHNoaXBib2FyZFtpXVt5XSA9IGAke3NoaXBDb3VudH1gO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0geTsgaSA8IGVuZFBvaW50OyBpKyspIHtcbiAgICAgICAgZ2FtZWJvYXJkW3hdW2ldID0gYCR7c2hpcENvdW50fWA7XG4gICAgICAgIHNoaXBib2FyZFt4XVtpXSA9IGAke3NoaXBDb3VudH1gO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKHgsIHkpID0+IHtcbiAgICAvLyBNYWtlIHN1cmUgaXQgZG9lc24ndCByZWNlaXZlIGFuIGF0dGFjayBvdXRzaWRlIHRoZSBnYW1lYm9hcmRcbiAgICBpZiAoeCA+PSBnYW1lYm9hcmQubGVuZ3RoIHx8IHkgPj0gZ2FtZWJvYXJkLmxlbmd0aClcbiAgICAgIHJldHVybiBcIkludmFsaWQgY29vcmRpbmF0ZXNcIjtcblxuICAgIC8vIFVwZGF0ZSB0aGUgbnVtYmVyIG9mIGhpdHMgb24gdGhlIHNoaXAgaWYgaXQncyBub3QgZW1wdHkgb3IgYSBoaXQgYWxyZWFkeVxuICAgIGlmIChnYW1lYm9hcmRbeF1beV0gIT09IFwiXCIgJiYgZ2FtZWJvYXJkW3hdW3ldICE9PSBcInhcIikge1xuICAgICAgc2hpcHMuZ2V0KGdhbWVib2FyZFt4XVt5XSkuaGl0KCk7XG4gICAgfVxuICAgIC8vIENoYW5nZSB0aGUgZ2FtZWJvYXJkIG9ubHkgaWYgdGhlIGNvb3JkaW5hdGVzIGFyZSBub3QgYSBtaXNzZWQgYXR0YWNrXG4gICAgaWYgKGdhbWVib2FyZFt4XVt5XSAhPT0gXCJ4XCIpIHtcbiAgICAgIGdhbWVib2FyZFt4XVt5XSA9IFwieFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJDYW5ub3QgYXR0YWNrIHRoZSBzYW1lIHNwb3QgdHdpY2VcIjtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaXNTaGlwSGl0dGVkID0gKHgsIHkpID0+IHtcbiAgICBpZiAoc2hpcGJvYXJkW3hdW3ldICE9PSBcIlwiKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgaXNBbGxTaGlwc1N1bmsgPSAoKSA9PiBhbGxTaGlwc1N1bmsoc2hpcHMpO1xuXG4gIHJldHVybiB7XG4gICAgZ2V0R2FtZUJvYXJkLFxuICAgIGdldFNoaXBCb2FyZCxcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBnZXRTaGlwcyxcbiAgICBpc1NoaXBIaXR0ZWQsXG4gICAgaXNBbGxTaGlwc1N1bmssXG4gIH07XG59XG5cbi8vIE1ha2UgYSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYSBnYW1lIGJvYXJkIGdyaWQsIGRlZmF1bHQgc2l6ZSBpcyAxMHgxMFxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUdhbWVCb2FyZEdyaWQoc2l6ZSA9IDEwKSB7XG4gIGNvbnN0IGdhbWVib2FyZCA9IFtdO1xuICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBzaXplOyByb3crKykge1xuICAgIGNvbnN0IG5ld1JvdyA9IFtdO1xuICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHNpemU7IGNvbCsrKSB7XG4gICAgICBuZXdSb3cucHVzaChcIlwiKTtcbiAgICB9XG4gICAgZ2FtZWJvYXJkLnB1c2gobmV3Um93KTtcbiAgfVxuICByZXR1cm4gZ2FtZWJvYXJkO1xufVxuXG4vLyBNYWtlIGEgZnVuY3Rpb24gdGhhdCBjaGVjayBpZiBhIHNoaXAgaXMgb3ZlcmxhcHBpbmcgd2l0aCBhbm90aGVyXG5mdW5jdGlvbiBzaGlwT3ZlcmxhcChnYW1lYm9hcmQsIHgsIHksIHNpemUsIGRpcmVjdGlvbikge1xuICBjb25zdCBlbmRQb2ludCA9IGRpcmVjdGlvbiA9PT0gXCJjb2xcIiA/IHNpemUgKyB4IDogc2l6ZSArIHk7XG4gIGlmIChkaXJlY3Rpb24gPT09IFwiY29sXCIpIHtcbiAgICBmb3IgKGxldCBpID0geDsgaSA8IGVuZFBvaW50OyBpKyspIHtcbiAgICAgIGlmIChnYW1lYm9hcmRbaV1beV0gIT09IFwiXCIpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBpID0geTsgaSA8IGVuZFBvaW50OyBpKyspIHtcbiAgICAgIGlmIChnYW1lYm9hcmRbeF1baV0gIT09IFwiXCIpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIE1ha2UgYSBmdW5jdGlvbiB0aGF0IGNoZWNrIGlmIGFsbCB0aGUgc2hpcHMgaGF2ZSBiZWVuIHN1bmtcbmZ1bmN0aW9uIGFsbFNoaXBzU3VuayhtYXApIHtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcbiAgbWFwLmZvckVhY2goKHZhbHVlKSA9PiBzaGlwcy5wdXNoKHZhbHVlKSk7XG4gIHJldHVybiBzaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSk7XG59XG4iLCJpbXBvcnQgZ2FtZUJvYXJkRmFjdG9yeSBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCBwbGF5ZXJGYWN0b3J5LCB7IGNvbXB1dGVyRmFjdG9yeSB9IGZyb20gXCIuL3BsYXllclwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnYW1lTG9vcEZhY3RvcnkoKSB7XG4gIC8vIENyZWF0ZSBnYW1lYm9hcmRzLCBwbGF5ZXIgYW5kIGNvbXB1dGVyXG4gIGNvbnN0IHBsYXllckdhbWVCb2FyZCA9IGdhbWVCb2FyZEZhY3RvcnkoKTtcbiAgY29uc3QgY29tcHV0ZXJHYW1lQm9hcmQgPSBnYW1lQm9hcmRGYWN0b3J5KCk7XG4gIGNvbnN0IHBsYXllciA9IHBsYXllckZhY3RvcnkoXCJwbGF5ZXJcIik7XG4gIGNvbnN0IGNvbXB1dGVyID0gY29tcHV0ZXJGYWN0b3J5KCk7XG5cbiAgLy8gR2V0IHBsYXllciBhbmQgY29tcHV0ZXIgYm9hcmRcbiAgY29uc3QgZ2V0UGxheWVyQm9hcmQgPSAoKSA9PiBwbGF5ZXJHYW1lQm9hcmQ7XG4gIGNvbnN0IGdldENvbXB1dGVyQm9hcmQgPSAoKSA9PiBjb21wdXRlckdhbWVCb2FyZDtcblxuICAvLyBQbGFjZSBwbGF5ZXIgc2hpcHNcbiAgcGxheWVyR2FtZUJvYXJkLnBsYWNlU2hpcCgwLCAwLCA1KTtcbiAgcGxheWVyR2FtZUJvYXJkLnBsYWNlU2hpcCgzLCA1LCA0LCBcImNvbFwiKTtcbiAgcGxheWVyR2FtZUJvYXJkLnBsYWNlU2hpcCg3LCAwLCAzLCBcImNvbFwiKTtcbiAgcGxheWVyR2FtZUJvYXJkLnBsYWNlU2hpcCg5LCA0LCAzKTtcbiAgcGxheWVyR2FtZUJvYXJkLnBsYWNlU2hpcCg2LCA3LCAyKTtcbiAgcGxheWVyR2FtZUJvYXJkLnBsYWNlU2hpcCg2LCAxLCAyKTtcbiAgcGxheWVyR2FtZUJvYXJkLnBsYWNlU2hpcCgyLCAyLCAyLCBcImNvbFwiKTtcbiAgcGxheWVyR2FtZUJvYXJkLnBsYWNlU2hpcCg5LCA5LCAxKTtcbiAgcGxheWVyR2FtZUJvYXJkLnBsYWNlU2hpcCg0LCA3LCAxKTtcbiAgcGxheWVyR2FtZUJvYXJkLnBsYWNlU2hpcCg4LCAzLCAxKTtcbiAgcGxheWVyR2FtZUJvYXJkLnBsYWNlU2hpcCgxLCA4LCAxKTtcblxuICAvLyBQbGFjZSBjb21wdXRlciBzaGlwc1xuICBjb21wdXRlckdhbWVCb2FyZC5wbGFjZVNoaXAoMSwgMSwgNSk7XG4gIGNvbXB1dGVyR2FtZUJvYXJkLnBsYWNlU2hpcCg0LCAyLCA0LCBcImNvbFwiKTtcbiAgY29tcHV0ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDAsIDAsIDMsIFwiY29sXCIpO1xuICBjb21wdXRlckdhbWVCb2FyZC5wbGFjZVNoaXAoOSwgMSwgMyk7XG4gIGNvbXB1dGVyR2FtZUJvYXJkLnBsYWNlU2hpcCg4LCA3LCAyKTtcbiAgY29tcHV0ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDUsIDMsIDIpO1xuICBjb21wdXRlckdhbWVCb2FyZC5wbGFjZVNoaXAoMywgNywgMiwgXCJjb2xcIik7XG4gIGNvbXB1dGVyR2FtZUJvYXJkLnBsYWNlU2hpcCg5LCA4LCAxKTtcbiAgY29tcHV0ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDAsIDksIDEpO1xuICBjb21wdXRlckdhbWVCb2FyZC5wbGFjZVNoaXAoMywgMywgMSk7XG4gIGNvbXB1dGVyR2FtZUJvYXJkLnBsYWNlU2hpcCgyLCA4LCAxKTtcblxuICAvLyBEZWZpbmUgYSB0dXJuIHZhcmlhYmxlLCBzdGFydGluZyB3aXRoIHRoZSBwbGF5ZXJcbiAgbGV0IGlzUGxheWVyVHVybiA9IHRydWU7XG5cbiAgLy8gR2V0IHRoZSBuYW1lIG9mIHdob2V2ZXIgaXMgcGxheWluZyBpbiB0aGUgY3VycmVudCB0dXJuXG4gIGNvbnN0IGdldEN1cnJlbnRQbGF5ZXJOYW1lID0gKCkgPT4ge1xuICAgIGlmIChpc1BsYXllclR1cm4pIHJldHVybiBwbGF5ZXIuZ2V0TmFtZSgpO1xuICAgIHJldHVybiBjb21wdXRlci5nZXROYW1lKCk7XG4gIH07XG5cbiAgLy8gRGVmaW5lIHRoZSBwbGF5ZXIgdHVyblxuICBjb25zdCBwbGF5ZXJUdXJuID0gKHgsIHkpID0+IHtcbiAgICBpZiAoY2hlY2tXaW5uZXIoKSkge1xuICAgICAgY29uc29sZS5sb2coZGVjbGFyZVdpbm5lcigpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGlzUGxheWVyVHVybikge1xuICAgICAgcGxheWVyLmF0dGFjayh4LCB5LCBjb21wdXRlckdhbWVCb2FyZCk7XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwbGF5ZXIgcGxheXMgYWdhaW4gb3Igbm90XG4gICAgICBpc1BsYXllclR1cm4gPSBjb21wdXRlckdhbWVCb2FyZC5pc1NoaXBIaXR0ZWQoeCwgeSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIERlZmluZSB0aGUgY29tcHV0ZXIgdHVyblxuICBjb25zdCBjb21wdXRlclR1cm4gPSAoKSA9PiB7XG4gICAgaWYgKGNoZWNrV2lubmVyKCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKGRlY2xhcmVXaW5uZXIoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghaXNQbGF5ZXJUdXJuKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBjb21wdXRlci5hdHRhY2socGxheWVyR2FtZUJvYXJkKTtcbiAgICAgIGNvbnN0IGNvbXBYID0gcmVzdWx0Lng7XG4gICAgICBjb25zdCBjb21wWSA9IHJlc3VsdC55O1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgY29tcHV0ZXIgcGxheXMgYWdhaW4gb3Igbm90XG4gICAgICBpc1BsYXllclR1cm4gPSAhcGxheWVyR2FtZUJvYXJkLmlzU2hpcEhpdHRlZChjb21wWCwgY29tcFkpO1xuXG4gICAgICByZXR1cm4geyBjb21wWCwgY29tcFkgfTtcbiAgICB9XG4gIH07XG5cbiAgLy8gQ2hlY2sgZm9yIGEgd2lubmVyXG4gIGNvbnN0IGNoZWNrV2lubmVyID0gKCkgPT4ge1xuICAgIGlmIChcbiAgICAgIHBsYXllckdhbWVCb2FyZC5pc0FsbFNoaXBzU3VuaygpIHx8XG4gICAgICBjb21wdXRlckdhbWVCb2FyZC5pc0FsbFNoaXBzU3VuaygpXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIERlY2xhcmUgdGhlIHdpbm5lclxuICBjb25zdCBkZWNsYXJlV2lubmVyID0gKCkgPT4ge1xuICAgIGlmIChwbGF5ZXJHYW1lQm9hcmQuaXNBbGxTaGlwc1N1bmsoKSkgcmV0dXJuIGAke2NvbXB1dGVyLmdldE5hbWUoKX0gd2lucyFgO1xuICAgIHJldHVybiBgJHtwbGF5ZXIuZ2V0TmFtZSgpfSB3aW5zIWA7XG4gIH07XG4gIHJldHVybiB7XG4gICAgZ2V0UGxheWVyQm9hcmQsXG4gICAgZ2V0Q29tcHV0ZXJCb2FyZCxcbiAgICBwbGF5ZXJUdXJuLFxuICAgIGNvbXB1dGVyVHVybixcbiAgICBnZXRDdXJyZW50UGxheWVyTmFtZSxcbiAgICBkZWNsYXJlV2lubmVyLFxuICAgIGNoZWNrV2lubmVyLFxuICB9O1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlR2FtZUJvYXJkR3JpZCB9IGZyb20gXCIuL2dhbWVib2FyZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwbGF5ZXJGYWN0b3J5KG5hbWUgPSBcInBsYXllclwiKSB7XG4gIGNvbnN0IGdldE5hbWUgPSAoKSA9PiBuYW1lO1xuICBjb25zdCBhdHRhY2sgPSAoeCwgeSwgZ2FtZWJvYXJkKSA9PiBnYW1lYm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KTtcbiAgcmV0dXJuIHsgZ2V0TmFtZSwgYXR0YWNrIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlckZhY3RvcnkoKSB7XG4gIGNvbnN0IGdldE5hbWUgPSAoKSA9PiBcImNvbXB1dGVyXCI7XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2VuZXJhdGVDb29yZGluYXRlKCk7XG4gIGNvbnN0IGF0dGFjayA9IChnYW1lYm9hcmQpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBjb29yZGluYXRlcy5nZXRWYWxpZENvb3JkaW5hdGVzKCk7XG4gICAgaWYgKHJlc3VsdCA9PT0gXCJObyBtb3JlIGNvb3JkaW5hdGVzIHRvIGF0dGFja1wiKSB7XG4gICAgICByZXR1cm4gXCJBbGwgY29vcmRpbmF0ZXMgaGF2ZSBiZWVuIGF0dGFja2VkXCI7XG4gICAgfVxuICAgIGNvbnN0IHsgeCwgeSB9ID0gcmVzdWx0O1xuICAgIGdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuICAgIHJldHVybiB7IHgsIHkgfTtcbiAgfTtcbiAgcmV0dXJuIHsgZ2V0TmFtZSwgYXR0YWNrIH07XG59XG5cbmZ1bmN0aW9uIHJhbmRvbU51bWJlcihzaXplID0gMTApIHtcbiAgY29uc3QgbnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2l6ZSk7XG4gIHJldHVybiBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUNvb3JkaW5hdGUoc2l6ZSA9IDEwKSB7XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gY3JlYXRlR2FtZUJvYXJkR3JpZChzaXplKTtcbiAgbGV0IGF2YWlsYWJsZUNvb3JkaW5hdGVzID0gc2l6ZSAqIHNpemU7XG4gIGNvbnN0IGdldFZhbGlkQ29vcmRpbmF0ZXMgPSAoKSA9PiB7XG4gICAgY29uc3QgeCA9IHJhbmRvbU51bWJlcihzaXplKTtcbiAgICBjb25zdCB5ID0gcmFuZG9tTnVtYmVyKHNpemUpO1xuICAgIGlmIChhdmFpbGFibGVDb29yZGluYXRlcyA9PT0gMCkgcmV0dXJuIFwiTm8gbW9yZSBjb29yZGluYXRlcyB0byBhdHRhY2tcIjtcbiAgICBpZiAoY29vcmRpbmF0ZXNbeF1beV0gPT09IFwiXCIpIHtcbiAgICAgIGNvb3JkaW5hdGVzW3hdW3ldID0gXCJhdHRhY2tlZFwiO1xuICAgICAgYXZhaWxhYmxlQ29vcmRpbmF0ZXMtLTtcbiAgICAgIHJldHVybiB7IHgsIHkgfTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBnZXRWYWxpZENvb3JkaW5hdGVzKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcmV0dXJuIHsgZ2V0VmFsaWRDb29yZGluYXRlcywgZ2V0Q29vcmRpbmF0ZXM6ICgpID0+IGNvb3JkaW5hdGVzIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaGlwRmFjdG9yeShzaXplKSB7XG4gIGNvbnN0IGxlbmd0aCA9IHNpemU7XG4gIGxldCBoaXRzID0gMDtcbiAgY29uc3QgbmFtZSA9IGdldFNoaXBOYW1lKHNpemUpO1xuICBjb25zdCBoaXQgPSAoKSA9PiB7XG4gICAgaWYgKGhpdHMgPCBsZW5ndGgpIGhpdHMrKztcbiAgfTtcbiAgY29uc3QgaXNTdW5rID0gKCkgPT4gIShsZW5ndGggPiBoaXRzKTtcbiAgY29uc3QgZ2V0SGl0cyA9ICgpID0+IGhpdHM7XG4gIGNvbnN0IGdldE5hbWUgPSAoKSA9PiBuYW1lO1xuICByZXR1cm4geyBoaXQsIGlzU3VuaywgZ2V0SGl0cywgZ2V0TmFtZSB9O1xufVxuXG5mdW5jdGlvbiBnZXRTaGlwTmFtZShzaXplKSB7XG4gIHN3aXRjaCAoc2l6ZSkge1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBcIkNhcnJpZXJcIjtcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gXCJCYXR0bGVzaGlwXCI7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIFwiRGVzdHJveWVyXCI7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIFwiU3VibWFyaW5lXCI7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIFwiUGF0cm9sIEJvYXRcIjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIFwiSW52YWxpZCBTaGlwIFNpemVcIjtcbiAgfVxufVxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXG5cbi8qIERvY3VtZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxuICovXG5cbmh0bWwge1xuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cbn1cblxuLyogU2VjdGlvbnNcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbmJvZHkge1xuICBtYXJnaW46IDA7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBcXGBtYWluXFxgIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxuICovXG5cbm1haW4ge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBcXGBoMVxcYCBlbGVtZW50cyB3aXRoaW4gXFxgc2VjdGlvblxcYCBhbmRcbiAqIFxcYGFydGljbGVcXGAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxuICovXG5cbmgxIHtcbiAgZm9udC1zaXplOiAyZW07XG4gIG1hcmdpbjogMC42N2VtIDA7XG59XG5cbi8qIEdyb3VwaW5nIGNvbnRlbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cbiAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxuICovXG5cbmhyIHtcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cbiAgaGVpZ2h0OiAwOyAvKiAxICovXG4gIG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBcXGBlbVxcYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxucHJlIHtcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXG59XG5cbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cbiAqL1xuXG5hIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG5cbi8qKlxuICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXG4gKi9cblxuYWJiclt0aXRsZV0ge1xuICBib3JkZXItYm90dG9tOiBub25lOyAvKiAxICovXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyAvKiAyICovXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXG4gKi9cblxuYixcbnN0cm9uZyB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBcXGBlbVxcYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuY29kZSxcbmtiZCxcbnNhbXAge1xuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zbWFsbCB7XG4gIGZvbnQtc2l6ZTogODAlO1xufVxuXG4vKipcbiAqIFByZXZlbnQgXFxgc3ViXFxgIGFuZCBcXGBzdXBcXGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXG4gKiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3ViLFxuc3VwIHtcbiAgZm9udC1zaXplOiA3NSU7XG4gIGxpbmUtaGVpZ2h0OiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuc3ViIHtcbiAgYm90dG9tOiAtMC4yNWVtO1xufVxuXG5zdXAge1xuICB0b3A6IC0wLjVlbTtcbn1cblxuLyogRW1iZWRkZWQgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmltZyB7XG4gIGJvcmRlci1zdHlsZTogbm9uZTtcbn1cblxuLyogRm9ybXNcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQsXG5vcHRncm91cCxcbnNlbGVjdCxcbnRleHRhcmVhIHtcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cbiAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG4gIG1hcmdpbjogMDsgLyogMiAqL1xufVxuXG4vKipcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxuICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCB7IC8qIDEgKi9cbiAgb3ZlcmZsb3c6IHZpc2libGU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXG4gKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uLFxuc2VsZWN0IHsgLyogMSAqL1xuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICovXG5cbmJ1dHRvbixcblt0eXBlPVwiYnV0dG9uXCJdLFxuW3R5cGU9XCJyZXNldFwiXSxcblt0eXBlPVwic3VibWl0XCJdIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cImJ1dHRvblwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwicmVzZXRcIl06Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cInN1Ym1pdFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XG4gIGJvcmRlci1zdHlsZTogbm9uZTtcbiAgcGFkZGluZzogMDtcbn1cblxuLyoqXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXG4gKi9cblxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJidXR0b25cIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInJlc2V0XCJdOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJzdWJtaXRcIl06LW1vei1mb2N1c3Jpbmcge1xuICBvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxuICovXG5cbmZpZWxkc2V0IHtcbiAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIFxcYGZpZWxkc2V0XFxgIGVsZW1lbnRzIGluIElFLlxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxuICogICAgXFxgZmllbGRzZXRcXGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbmxlZ2VuZCB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cbiAgY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cbiAgZGlzcGxheTogdGFibGU7IC8qIDEgKi9cbiAgbWF4LXdpZHRoOiAxMDAlOyAvKiAxICovXG4gIHBhZGRpbmc6IDA7IC8qIDMgKi9cbiAgd2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXG4gKi9cblxucHJvZ3Jlc3Mge1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXG4gKi9cblxudGV4dGFyZWEge1xuICBvdmVyZmxvdzogYXV0bztcbn1cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cbiAqL1xuXG5bdHlwZT1cImNoZWNrYm94XCJdLFxuW3R5cGU9XCJyYWRpb1wiXSB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cbiAgcGFkZGluZzogMDsgLyogMiAqL1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cbiAqL1xuXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcbiAgaGVpZ2h0OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxuICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXG4gKi9cblxuW3R5cGU9XCJzZWFyY2hcIl0ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqL1xuICBvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBcXGBpbmhlcml0XFxgIGluIFNhZmFyaS5cbiAqL1xuXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cbiAgZm9udDogaW5oZXJpdDsgLyogMiAqL1xufVxuXG4vKiBJbnRlcmFjdGl2ZVxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXG4gKi9cblxuZGV0YWlscyB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnN1bW1hcnkge1xuICBkaXNwbGF5OiBsaXN0LWl0ZW07XG59XG5cbi8qIE1pc2NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxuICovXG5cbnRlbXBsYXRlIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cbiAqL1xuXG5baGlkZGVuXSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL25vZGVfbW9kdWxlcy9ub3JtYWxpemUuY3NzL25vcm1hbGl6ZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsMkVBQTJFOztBQUUzRTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7QUFFRjtFQUNFLGlCQUFpQixFQUFFLE1BQU07RUFDekIsOEJBQThCLEVBQUUsTUFBTTtBQUN4Qzs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0VBQ0UsU0FBUztBQUNYOztBQUVBOztFQUVFOztBQUVGO0VBQ0UsY0FBYztBQUNoQjs7QUFFQTs7O0VBR0U7O0FBRUY7RUFDRSxjQUFjO0VBQ2QsZ0JBQWdCO0FBQ2xCOztBQUVBOytFQUMrRTs7QUFFL0U7OztFQUdFOztBQUVGO0VBQ0UsdUJBQXVCLEVBQUUsTUFBTTtFQUMvQixTQUFTLEVBQUUsTUFBTTtFQUNqQixpQkFBaUIsRUFBRSxNQUFNO0FBQzNCOztBQUVBOzs7RUFHRTs7QUFFRjtFQUNFLGlDQUFpQyxFQUFFLE1BQU07RUFDekMsY0FBYyxFQUFFLE1BQU07QUFDeEI7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtFQUNFLDZCQUE2QjtBQUMvQjs7QUFFQTs7O0VBR0U7O0FBRUY7RUFDRSxtQkFBbUIsRUFBRSxNQUFNO0VBQzNCLDBCQUEwQixFQUFFLE1BQU07RUFDbEMsaUNBQWlDLEVBQUUsTUFBTTtBQUMzQzs7QUFFQTs7RUFFRTs7QUFFRjs7RUFFRSxtQkFBbUI7QUFDckI7O0FBRUE7OztFQUdFOztBQUVGOzs7RUFHRSxpQ0FBaUMsRUFBRSxNQUFNO0VBQ3pDLGNBQWMsRUFBRSxNQUFNO0FBQ3hCOztBQUVBOztFQUVFOztBQUVGO0VBQ0UsY0FBYztBQUNoQjs7QUFFQTs7O0VBR0U7O0FBRUY7O0VBRUUsY0FBYztFQUNkLGNBQWM7RUFDZCxrQkFBa0I7RUFDbEIsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0UsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLFdBQVc7QUFDYjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0VBQ0Usa0JBQWtCO0FBQ3BCOztBQUVBOytFQUMrRTs7QUFFL0U7OztFQUdFOztBQUVGOzs7OztFQUtFLG9CQUFvQixFQUFFLE1BQU07RUFDNUIsZUFBZSxFQUFFLE1BQU07RUFDdkIsaUJBQWlCLEVBQUUsTUFBTTtFQUN6QixTQUFTLEVBQUUsTUFBTTtBQUNuQjs7QUFFQTs7O0VBR0U7O0FBRUY7UUFDUSxNQUFNO0VBQ1osaUJBQWlCO0FBQ25COztBQUVBOzs7RUFHRTs7QUFFRjtTQUNTLE1BQU07RUFDYixvQkFBb0I7QUFDdEI7O0FBRUE7O0VBRUU7O0FBRUY7Ozs7RUFJRSwwQkFBMEI7QUFDNUI7O0FBRUE7O0VBRUU7O0FBRUY7Ozs7RUFJRSxrQkFBa0I7RUFDbEIsVUFBVTtBQUNaOztBQUVBOztFQUVFOztBQUVGOzs7O0VBSUUsOEJBQThCO0FBQ2hDOztBQUVBOztFQUVFOztBQUVGO0VBQ0UsOEJBQThCO0FBQ2hDOztBQUVBOzs7OztFQUtFOztBQUVGO0VBQ0Usc0JBQXNCLEVBQUUsTUFBTTtFQUM5QixjQUFjLEVBQUUsTUFBTTtFQUN0QixjQUFjLEVBQUUsTUFBTTtFQUN0QixlQUFlLEVBQUUsTUFBTTtFQUN2QixVQUFVLEVBQUUsTUFBTTtFQUNsQixtQkFBbUIsRUFBRSxNQUFNO0FBQzdCOztBQUVBOztFQUVFOztBQUVGO0VBQ0Usd0JBQXdCO0FBQzFCOztBQUVBOztFQUVFOztBQUVGO0VBQ0UsY0FBYztBQUNoQjs7QUFFQTs7O0VBR0U7O0FBRUY7O0VBRUUsc0JBQXNCLEVBQUUsTUFBTTtFQUM5QixVQUFVLEVBQUUsTUFBTTtBQUNwQjs7QUFFQTs7RUFFRTs7QUFFRjs7RUFFRSxZQUFZO0FBQ2Q7O0FBRUE7OztFQUdFOztBQUVGO0VBQ0UsNkJBQTZCLEVBQUUsTUFBTTtFQUNyQyxvQkFBb0IsRUFBRSxNQUFNO0FBQzlCOztBQUVBOztFQUVFOztBQUVGO0VBQ0Usd0JBQXdCO0FBQzFCOztBQUVBOzs7RUFHRTs7QUFFRjtFQUNFLDBCQUEwQixFQUFFLE1BQU07RUFDbEMsYUFBYSxFQUFFLE1BQU07QUFDdkI7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7K0VBQytFOztBQUUvRTs7RUFFRTs7QUFFRjtFQUNFLGFBQWE7QUFDZjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLGFBQWE7QUFDZlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXFxuXFxuLyogRG9jdW1lbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cXG4gKi9cXG5cXG5odG1sIHtcXG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cXG59XFxuXFxuLyogU2VjdGlvbnNcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5ib2R5IHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuLyoqXFxuICogUmVuZGVyIHRoZSBgbWFpbmAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXFxuICovXFxuXFxubWFpbiB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxcbiAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuaDEge1xcbiAgZm9udC1zaXplOiAyZW07XFxuICBtYXJnaW46IDAuNjdlbSAwO1xcbn1cXG5cXG4vKiBHcm91cGluZyBjb250ZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxcbiAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxcbiAqL1xcblxcbmhyIHtcXG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXFxuICBoZWlnaHQ6IDA7IC8qIDEgKi9cXG4gIG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnByZSB7XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxufVxcblxcbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXFxuICovXFxuXFxuYSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG59XFxuXFxuLyoqXFxuICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmFiYnJbdGl0bGVdIHtcXG4gIGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyAvKiAyICovXFxuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5iLFxcbnN0cm9uZyB7XFxuICBmb250LXdlaWdodDogYm9sZGVyO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5jb2RlLFxcbmtiZCxcXG5zYW1wIHtcXG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc21hbGwge1xcbiAgZm9udC1zaXplOiA4MCU7XFxufVxcblxcbi8qKlxcbiAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxcbiAqIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdWIsXFxuc3VwIHtcXG4gIGZvbnQtc2l6ZTogNzUlO1xcbiAgbGluZS1oZWlnaHQ6IDA7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbnN1YiB7XFxuICBib3R0b206IC0wLjI1ZW07XFxufVxcblxcbnN1cCB7XFxuICB0b3A6IC0wLjVlbTtcXG59XFxuXFxuLyogRW1iZWRkZWQgY29udGVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5pbWcge1xcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xcbn1cXG5cXG4vKiBGb3Jtc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5pbnB1dCxcXG5vcHRncm91cCxcXG5zZWxlY3QsXFxudGV4dGFyZWEge1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xcbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gIG1hcmdpbjogMDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cXG4gKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5pbnB1dCB7IC8qIDEgKi9cXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cXG4gKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXFxuICovXFxuXFxuYnV0dG9uLFxcbnNlbGVjdCB7IC8qIDEgKi9cXG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl0sXFxuW3R5cGU9XFxcInJlc2V0XFxcIl0sXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOjotbW96LWZvY3VzLWlubmVyIHtcXG4gIGJvcmRlci1zdHlsZTogbm9uZTtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi8qKlxcbiAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cXG4gKi9cXG5cXG5idXR0b246LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTotbW96LWZvY3VzcmluZyB7XFxuICBvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5maWVsZHNldCB7XFxuICBwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXFxuICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBgZmllbGRzZXRgIGVsZW1lbnRzIGluIElFLlxcbiAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcXG4gKiAgICBgZmllbGRzZXRgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5sZWdlbmQge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG4gIGRpc3BsYXk6IHRhYmxlOyAvKiAxICovXFxuICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cXG4gIHBhZGRpbmc6IDA7IC8qIDMgKi9cXG4gIHdoaXRlLXNwYWNlOiBub3JtYWw7IC8qIDEgKi9cXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cXG4gKi9cXG5cXG5wcm9ncmVzcyB7XFxuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgMTArLlxcbiAqL1xcblxcbnRleHRhcmVhIHtcXG4gIG92ZXJmbG93OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cXG4gKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXFxuICovXFxuXFxuW3R5cGU9XFxcImNoZWNrYm94XFxcIl0sXFxuW3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgcGFkZGluZzogMDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXFxuICovXFxuXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcblt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuICBoZWlnaHQ6IGF1dG87XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxcbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxcbiAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqL1xcbiAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxcbiAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBgaW5oZXJpdGAgaW4gU2FmYXJpLlxcbiAqL1xcblxcbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cXG4gIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cXG59XFxuXFxuLyogSW50ZXJhY3RpdmVcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cXG4gKi9cXG5cXG5kZXRhaWxzIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdW1tYXJ5IHtcXG4gIGRpc3BsYXk6IGxpc3QtaXRlbTtcXG59XFxuXFxuLyogTWlzY1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxcbiAqL1xcblxcbnRlbXBsYXRlIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxcbiAqL1xcblxcbltoaWRkZW5dIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiLi9pbWFnZXMvc3VubnkuanBnXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18gPSBuZXcgVVJMKFwiZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz0lMjdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyUyNyB2ZXJzaW9uPSUyNzEuMSUyNyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSUyN25vbmUlMjcgdmlld0JveD0lMjcwIDAgMTAwIDEwMCUyNz48cGF0aCBkPSUyN00xMDAgMCBMMCAxMDAgJTI3IHN0cm9rZT0lMjdyZWQlMjcgc3Ryb2tlLXdpZHRoPSUyNzUlMjcvPjxwYXRoIGQ9JTI3TTAgMCBMMTAwIDEwMCAlMjcgc3Ryb2tlPSUyN3JlZCUyNyBzdHJva2Utd2lkdGg9JTI3NSUyNy8+PC9zdmc+XCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzJfX18gPSBuZXcgVVJMKFwiLi9pbWFnZXMvb2NlYW4ucG5nXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzFfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8xX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8yX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMl9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCosXG4qOjphZnRlcixcbio6OmJlZm9yZSB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbjpyb290IHtcbiAgLS1kYXJrLWJsdWU6ICM0NjgyYTk7XG4gIC0tYmx1ZTogIzc0OWJjMjtcbiAgLS1saWdodC1ibHVlOiAjOTFjOGU0O1xuICAtLXdoaXRlOiAjZjZmNGViO1xufVxuXG5odG1sIHtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG5ib2R5IHtcbiAgbWluLWhlaWdodDogMTAwdmg7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGZvbnQtZmFtaWx5OiBcIlJvYm90b1wiLCBzYW5zLXNlcmlmO1xuICBncmlkOlxuICAgIFwiaGVhZGVyIGhlYWRlciBoZWFkZXIgaGVhZGVyXCIgYXV0b1xuICAgIFwibWFpbiBtYWluIG1haW4gbWFpblwiIDFmclxuICAgIFwiZm9vdGVyIGZvb3RlciBmb290ZXIgZm9vdGVyXCIgYXV0byAvXG4gICAgMWZyIDFmciAxZnIgMWZyO1xufVxuXG4jaGVhZGVyLFxuI2Zvb3RlciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJsdWUpO1xufVxuXG4jaGVhZGVyIHtcbiAgZ3JpZC1hcmVhOiBoZWFkZXI7XG4gIGZvbnQtZmFtaWx5OiBcIllzYWJlYXUgU0NcIiwgc2Fucy1zZXJpZjtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LXNpemU6IDRyZW07XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGxldHRlci1zcGFjaW5nOiAxcHg7XG4gIHBhZGRpbmc6IDIwcHg7XG59XG5cbiNtYWluIHtcbiAgZ3JpZC1hcmVhOiBtYWluO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxMDBweDtcbiAgYmFja2dyb3VuZDogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fX30pO1xuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xufVxuXG4uZ3JpZC1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxMDBweDtcbn1cblxuLnBsYXllci1ncmlkLFxuLmNvbXB1dGVyLWdyaWQge1xuICBtaW4td2lkdGg6IDQwMHB4O1xuICBtaW4taGVpZ2h0OiA0MDBweDtcbiAgb3V0bGluZTogM3B4IHNvbGlkIGJsYWNrO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGlzb2xhdGlvbjogaXNvbGF0ZTtcbn1cblxuLnBsYXllci1ncmlkOjphZnRlcixcbi5jb21wdXRlci1ncmlkOjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0LWJsdWUpO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGluc2V0OiAwO1xuICB6LWluZGV4OiAtMTtcbiAgb3BhY2l0eTogMC44O1xufVxuXG4uZ3JpZC1yb3cge1xuICBmbGV4OiAxO1xuICBkaXNwbGF5OiBmbGV4O1xufVxuXG4uZ3JpZC1jb2wge1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS13aGl0ZSk7XG4gIGZsZXg6IDE7XG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMTAwbXMgZWFzZS1pbi1vdXQ7XG59XG5cbi5jb21wdXRlci1ncmlkIC5ncmlkLWNvbDpob3ZlciB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmx1ZSk7XG59XG5cbi5oaXQtc2hpcCB7XG4gIGJhY2tncm91bmQ6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzFfX199KTtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xuICBiYWNrZ3JvdW5kLXNpemU6IDEwMCUgMTAwJSwgYXV0bztcbiAgYm9yZGVyOiAxcHggc29saWQgcmVkO1xufVxuXG4uaGl0LW1pc3Mge1xuICBiYWNrZ3JvdW5kOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8yX19ffSk7XG59XG5cbiNmb290ZXIge1xuICBncmlkLWFyZWE6IGZvb3RlcjtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LXdlaWdodDogNzAwO1xufVxuXG4jZm9vdGVyIGEge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGNvbG9yOiB2YXIoLS13aGl0ZSk7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7OztFQUdFLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLG9CQUFvQjtFQUNwQixlQUFlO0VBQ2YscUJBQXFCO0VBQ3JCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQixhQUFhO0VBQ2IsaUNBQWlDO0VBQ2pDOzs7O21CQUlpQjtBQUNuQjs7QUFFQTs7RUFFRSw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIscUNBQXFDO0VBQ3JDLGtCQUFrQjtFQUNsQixlQUFlO0VBQ2YsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtFQUNuQixhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLFVBQVU7RUFDVixtREFBbUM7RUFDbkMsc0JBQXNCO0VBQ3RCLDRCQUE0QjtBQUM5Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsbUJBQW1CO0VBQ25CLFVBQVU7QUFDWjs7QUFFQTs7RUFFRSxnQkFBZ0I7RUFDaEIsaUJBQWlCO0VBQ2pCLHdCQUF3QjtFQUN4QixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLGtCQUFrQjtFQUNsQixrQkFBa0I7QUFDcEI7O0FBRUE7O0VBRUUsV0FBVztFQUNYLG1DQUFtQztFQUNuQyxrQkFBa0I7RUFDbEIsUUFBUTtFQUNSLFdBQVc7RUFDWCxZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxPQUFPO0VBQ1AsYUFBYTtBQUNmOztBQUVBO0VBQ0UsOEJBQThCO0VBQzlCLE9BQU87RUFDUCw4Q0FBOEM7QUFDaEQ7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsNkJBQTZCO0FBQy9COztBQUVBO0VBQ0UsbURBQXdRO0VBQ3hRLDRCQUE0QjtFQUM1QiwyQkFBMkI7RUFDM0IsZ0NBQWdDO0VBQ2hDLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLG1EQUFtQztBQUNyQzs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLG1CQUFtQjtBQUNyQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqLFxcbio6OmFmdGVyLFxcbio6OmJlZm9yZSB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG46cm9vdCB7XFxuICAtLWRhcmstYmx1ZTogIzQ2ODJhOTtcXG4gIC0tYmx1ZTogIzc0OWJjMjtcXG4gIC0tbGlnaHQtYmx1ZTogIzkxYzhlNDtcXG4gIC0td2hpdGU6ICNmNmY0ZWI7XFxufVxcblxcbmh0bWwge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbn1cXG5cXG5ib2R5IHtcXG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiUm9ib3RvXFxcIiwgc2Fucy1zZXJpZjtcXG4gIGdyaWQ6XFxuICAgIFxcXCJoZWFkZXIgaGVhZGVyIGhlYWRlciBoZWFkZXJcXFwiIGF1dG9cXG4gICAgXFxcIm1haW4gbWFpbiBtYWluIG1haW5cXFwiIDFmclxcbiAgICBcXFwiZm9vdGVyIGZvb3RlciBmb290ZXIgZm9vdGVyXFxcIiBhdXRvIC9cXG4gICAgMWZyIDFmciAxZnIgMWZyO1xcbn1cXG5cXG4jaGVhZGVyLFxcbiNmb290ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmx1ZSk7XFxufVxcblxcbiNoZWFkZXIge1xcbiAgZ3JpZC1hcmVhOiBoZWFkZXI7XFxuICBmb250LWZhbWlseTogXFxcIllzYWJlYXUgU0NcXFwiLCBzYW5zLXNlcmlmO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC1zaXplOiA0cmVtO1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGxldHRlci1zcGFjaW5nOiAxcHg7XFxuICBwYWRkaW5nOiAyMHB4O1xcbn1cXG5cXG4jbWFpbiB7XFxuICBncmlkLWFyZWE6IG1haW47XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGdhcDogMTAwcHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoLi9pbWFnZXMvc3VubnkuanBnKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XFxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbn1cXG5cXG4uZ3JpZC1jb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGdhcDogMTAwcHg7XFxufVxcblxcbi5wbGF5ZXItZ3JpZCxcXG4uY29tcHV0ZXItZ3JpZCB7XFxuICBtaW4td2lkdGg6IDQwMHB4O1xcbiAgbWluLWhlaWdodDogNDAwcHg7XFxuICBvdXRsaW5lOiAzcHggc29saWQgYmxhY2s7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGlzb2xhdGlvbjogaXNvbGF0ZTtcXG59XFxuXFxuLnBsYXllci1ncmlkOjphZnRlcixcXG4uY29tcHV0ZXItZ3JpZDo6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodC1ibHVlKTtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGluc2V0OiAwO1xcbiAgei1pbmRleDogLTE7XFxuICBvcGFjaXR5OiAwLjg7XFxufVxcblxcbi5ncmlkLXJvdyB7XFxuICBmbGV4OiAxO1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuXFxuLmdyaWQtY29sIHtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXdoaXRlKTtcXG4gIGZsZXg6IDE7XFxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDEwMG1zIGVhc2UtaW4tb3V0O1xcbn1cXG5cXG4uY29tcHV0ZXItZ3JpZCAuZ3JpZC1jb2w6aG92ZXIge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmx1ZSk7XFxufVxcblxcbi5oaXQtc2hpcCB7XFxuICBiYWNrZ3JvdW5kOiB1cmwoXFxcImRhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB2ZXJzaW9uPScxLjEnIHByZXNlcnZlQXNwZWN0UmF0aW89J25vbmUnIHZpZXdCb3g9JzAgMCAxMDAgMTAwJz48cGF0aCBkPSdNMTAwIDAgTDAgMTAwICcgc3Ryb2tlPSdyZWQnIHN0cm9rZS13aWR0aD0nNScvPjxwYXRoIGQ9J00wIDAgTDEwMCAxMDAgJyBzdHJva2U9J3JlZCcgc3Ryb2tlLXdpZHRoPSc1Jy8+PC9zdmc+XFxcIik7XFxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xcbiAgYmFja2dyb3VuZC1zaXplOiAxMDAlIDEwMCUsIGF1dG87XFxuICBib3JkZXI6IDFweCBzb2xpZCByZWQ7XFxufVxcblxcbi5oaXQtbWlzcyB7XFxuICBiYWNrZ3JvdW5kOiB1cmwoLi9pbWFnZXMvb2NlYW4ucG5nKTtcXG59XFxuXFxuI2Zvb3RlciB7XFxuICBncmlkLWFyZWE6IGZvb3RlcjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxufVxcblxcbiNmb290ZXIgYSB7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBjb2xvcjogdmFyKC0td2hpdGUpO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgdXJsID0gU3RyaW5nKHVybC5fX2VzTW9kdWxlID8gdXJsLmRlZmF1bHQgOiB1cmwpO1xuXG4gIC8vIElmIHVybCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gcXVvdGVzLCByZW1vdmUgdGhlbVxuICBpZiAoL15bJ1wiXS4qWydcIl0kLy50ZXN0KHVybCkpIHtcbiAgICB1cmwgPSB1cmwuc2xpY2UoMSwgLTEpO1xuICB9XG4gIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICB1cmwgKz0gb3B0aW9ucy5oYXNoO1xuICB9XG5cbiAgLy8gU2hvdWxkIHVybCBiZSB3cmFwcGVkP1xuICAvLyBTZWUgaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuICBpZiAoL1tcIicoKSBcXHRcXG5dfCglMjApLy50ZXN0KHVybCkgfHwgb3B0aW9ucy5uZWVkUXVvdGVzKSB7XG4gICAgcmV0dXJuIFwiXFxcIlwiLmNvbmNhdCh1cmwucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpLCBcIlxcXCJcIik7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL25vcm1hbGl6ZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICFzY3JpcHRVcmwpIHNjcmlwdFVybCA9IHNjcmlwdHNbaS0tXS5zcmM7XG5cdFx0fVxuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG4vLyBubyBqc29ucCBmdW5jdGlvbiIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IFwibm9ybWFsaXplLmNzc1wiO1xuaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcbmltcG9ydCB7XG4gIGNvbXBsZXRlRG9tR3JpZCxcbiAgY3JlYXRlRXZlbnRMaXN0ZW5lcixcbiAgZGlzcGxheUN1cnJlbnRQbGF5ZXIsXG59IGZyb20gXCIuL21vZHVsZXMvZG9tXCI7XG5pbXBvcnQgZ2FtZUxvb3BGYWN0b3J5IGZyb20gXCIuL21vZHVsZXMvZ2FtZWxvb3BcIjtcblxuY29uc3QgZ2FtZSA9IGdhbWVMb29wRmFjdG9yeSgpO1xuXG5jb21wbGV0ZURvbUdyaWQoKTtcbmNyZWF0ZUV2ZW50TGlzdGVuZXIoZ2FtZSk7XG5kaXNwbGF5Q3VycmVudFBsYXllcihnYW1lLmdldEN1cnJlbnRQbGF5ZXJOYW1lKCkpO1xuIl0sIm5hbWVzIjpbImNvbXBsZXRlRG9tR3JpZCIsInBsYXllckdyaWQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjb21wdXRlckdyaWQiLCJjcmVhdGVEb21HcmlkIiwiZ3JpZCIsInNpemUiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJpIiwibmV3Um93IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImoiLCJuZXdDb2wiLCJkYXRhc2V0IiwieCIsInkiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZUV2ZW50TGlzdGVuZXIiLCJnYW1lIiwiY29vcmRpbmF0ZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImNvb3JkaW5hdGUiLCJhZGRFdmVudExpc3RlbmVyIiwiY29udGFpbnMiLCJwb3NYIiwicGFyc2VJbnQiLCJwb3NZIiwiZ2V0Q3VycmVudFBsYXllck5hbWUiLCJkaXNwbGF5Q3VycmVudFBsYXllciIsInBsYXllclR1cm4iLCJhZGRDb29yZGluYXRlQ2xhc3MiLCJnZXRDb21wdXRlckJvYXJkIiwidXBkYXRlUGxheWVyR3JpZCIsImdhbWVib2FyZCIsImlzU2hpcEhpdHRlZCIsIm5hbWUiLCJjdXJyZW50UGxheWVyIiwidGV4dENvbnRlbnQiLCJyZXN1bHQiLCJjb21wdXRlclR1cm4iLCJjb21wWCIsImNvbXBZIiwicG9zaXRpb24iLCJpbmRleCIsIm5ld0Nvb3JkaW5hdGUiLCJnZXRQbGF5ZXJCb2FyZCIsInNoaXBGYWN0b3J5IiwiZ2FtZUJvYXJkRmFjdG9yeSIsImNyZWF0ZUdhbWVCb2FyZEdyaWQiLCJzaGlwYm9hcmQiLCJnZXRHYW1lQm9hcmQiLCJnZXRTaGlwQm9hcmQiLCJzaGlwQ291bnQiLCJzaGlwcyIsIk1hcCIsImdldFNoaXBzIiwicGxhY2VTaGlwIiwiZGlyZWN0aW9uIiwibmV3U2hpcCIsInNldCIsImdhbWVCb2FyZFNpemUiLCJlbmRQb2ludCIsImlzU2hpcE92ZXJsYXBwZWQiLCJzaGlwT3ZlcmxhcCIsInJlY2VpdmVBdHRhY2siLCJnZXQiLCJoaXQiLCJpc0FsbFNoaXBzU3VuayIsImFsbFNoaXBzU3VuayIsInJvdyIsImNvbCIsInB1c2giLCJtYXAiLCJ2YWx1ZSIsImV2ZXJ5Iiwic2hpcCIsImlzU3VuayIsInBsYXllckZhY3RvcnkiLCJjb21wdXRlckZhY3RvcnkiLCJnYW1lTG9vcEZhY3RvcnkiLCJwbGF5ZXJHYW1lQm9hcmQiLCJjb21wdXRlckdhbWVCb2FyZCIsInBsYXllciIsImNvbXB1dGVyIiwiaXNQbGF5ZXJUdXJuIiwiZ2V0TmFtZSIsImNoZWNrV2lubmVyIiwiY29uc29sZSIsImxvZyIsImRlY2xhcmVXaW5uZXIiLCJhdHRhY2siLCJnZW5lcmF0ZUNvb3JkaW5hdGUiLCJnZXRWYWxpZENvb3JkaW5hdGVzIiwicmFuZG9tTnVtYmVyIiwibnVtYmVyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiYXZhaWxhYmxlQ29vcmRpbmF0ZXMiLCJnZXRDb29yZGluYXRlcyIsImhpdHMiLCJnZXRTaGlwTmFtZSIsImdldEhpdHMiXSwic291cmNlUm9vdCI6IiJ9