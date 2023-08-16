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
/* harmony export */   "default": () => (/* binding */ dom)
/* harmony export */ });
function dom(game) {
  completeDomGrid();
  createCoordinateEvent(game);
  createDraggableEvents(game);
  swapAxis();
  addStartGameListener();
  playAgainListener();
}

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
      game.playerTurn(posX, posY);
    }

    // Add the respective class to the hitted coordinate
    addCoordinateClass(posX, posY, game.getComputerBoard(), coordinate);

    // Let the computer play as long as it's it turn.
    while (game.getCurrentPlayerName() === "computer" && !game.checkWinner()) {
      updatePlayerGrid(game);
      console.log(game.getPlayerBoard().getGameBoard());
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
  const playAgain = document.querySelector(".play-again");
  gameWinner.textContent = game.declareWinner();
  gameWinner.style.display = "block";
  playAgain.style.display = "block";

  // Hide the grids
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.style.display = "none";
}

// Create draggable events

function createDraggableEvents(game) {
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
    coordinate.addEventListener("drop", e => {
      shipDrop(e, game);
    });
  });
}
function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
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
function shipDrop(e, game) {
  e.target.classList.remove("drag-over");

  // Get the draggable element
  const id = e.dataTransfer.getData("text/plain");
  const draggable = document.getElementById(id);
  const isHorizontal = !draggable.classList.contains("vertical");

  // Get the coordinates and length
  const gridSize = 10;
  const length = parseInt(draggable.dataset.length, 10);
  let {
    x
  } = e.target.dataset;
  let {
    y
  } = e.target.dataset;
  x = parseInt(x, 10);
  y = parseInt(y, 10);
  const endPoint = isHorizontal ? length + y : length + x;
  const isOverlapped = checkOverlap(x, y, length, e.target, isHorizontal);

  // Check that the ship doesn't go beyond the boundaries of the grid
  if (endPoint <= gridSize && !isOverlapped) {
    // Add it to the drop target
    displayShip(x, y, draggable, e.target, isHorizontal);
    const direction = isHorizontal ? "row" : "col";
    game.getPlayerBoard().placeShip(x, y, length, direction);
  }
}

// Display the ship on the grid
function displayShip(x, y, ship, coordinate) {
  let direction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  let newCoordinate = coordinate;
  const shipLength = parseInt(ship.dataset.length, 10);
  const shipColor = getComputedStyle(ship).getPropertyValue("background-color");
  const endPoint = direction ? shipLength + y : shipLength + x;

  // Get the coordinates depending on the direction
  if (direction) {
    for (let i = y; i < endPoint; i++) {
      newCoordinate.style.backgroundColor = shipColor;
      newCoordinate.classList.add("occupied");
      newCoordinate = newCoordinate.nextSibling;
    }
  } else {
    for (let i = x; i < endPoint; i++) {
      newCoordinate.style.backgroundColor = shipColor;
      newCoordinate.classList.add("occupied");
      newCoordinate = document.querySelector(`[data-x="${(i + 1).toString()}"][data-y="${y.toString()}"]`);
    }
  }
  ship.remove();
}

// Check if the ship overlaps with one another
function checkOverlap(x, y, length, coordinate) {
  let direction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  let currentCoordinate = coordinate;
  const endPoint = direction ? length + y : length + x;
  if (direction) {
    for (let i = y; i < endPoint; i++) {
      if (currentCoordinate.classList.contains("occupied")) return true;
      currentCoordinate = currentCoordinate.nextSibling;
    }
  } else {
    for (let i = x; i < endPoint; i++) {
      if (currentCoordinate.classList.contains("occupied")) return true;
      currentCoordinate = document.querySelector(`[data-x="${(i + 1).toString()}"][data-y="${y.toString()}"]`);
    }
  }
  return false;
}
function swapAxis() {
  const changeDirection = document.querySelector(".change-direction");
  changeDirection.addEventListener("click", () => {
    const ships = document.querySelectorAll(".ship");
    ships.forEach(ship => {
      const width = getComputedStyle(ship).getPropertyValue("width");
      const height = getComputedStyle(ship).getPropertyValue("height");
      ship.style.width = height; // eslint-disable-line no-param-reassign
      ship.style.height = width; // eslint-disable-line no-param-reassign
      ship.classList.toggle("vertical");
    });
  });
}
function addStartGameListener() {
  document.querySelector(".start-game").addEventListener("click", startGame);
}
function startGame() {
  // Define Variables
  const playerShips = document.querySelector(".player-ships");
  const computerContainer = document.querySelector(".computer-container");
  const startGame = document.querySelector(".start-game"); // eslint-disable-line no-shadow
  const playerTitle = document.querySelector(".player-title");

  // Hide and show variables
  playerShips.style.display = "none";
  startGame.style.display = "none";
  playerTitle.style.display = "none";
  computerContainer.style.display = "block";
}
function playAgainListener() {
  const playAgain = document.querySelector(".play-again");
  playAgain.addEventListener("click", () => {
    location.reload(); // eslint-disable-line no-restricted-globals
  });
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
  --brown: #862b0d;
  --light-green: #98eecc;
  --light-pink: #ffcacc;
  --grey: #9babb8;
  --purple: #beadfa;
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

.big-ship-container,
.destroyer-container,
.submarine-container,
.patrol-boat-container {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.big-ship-container {
  margin-top: 10px;
}

.ship {
  border: 2px solid var(--dark-blue);
  height: var(--ship-block);
}

.carrier {
  width: calc(var(--ship-block) * 5);
  background-color: var(--brown);
}

.battleship {
  width: calc(var(--ship-block) * 4);
  background-color: var(--light-green);
}

.destroyer {
  width: calc(var(--ship-block) * 3);
  background-color: var(--light-pink);
}

.submarine {
  width: calc(var(--ship-block) * 2);
  background-color: var(--grey);
}

.patrol-boat {
  width: calc(var(--ship-block) * 1);
  background-color: var(--purple);
}

.change-direction,
.start-game,
.play-again {
  font-weight: 700;
  font-family: "Ysabeau SC", sans-serif;
  background-color: black;
  color: var(--white);
  border: none;
  cursor: pointer;
  border-radius: 1rem;
}

.change-direction {
  font-size: 0.7rem;
  padding: 5px;
  margin-top: 20px;
}

.start-game,
.play-again {
  font-size: 1.5rem;
  padding: 10px;
}

.play-again {
  display: none;
  margin-top: 200px;
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
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["*,\n*::after,\n*::before {\n  box-sizing: border-box;\n}\n\n:root {\n  --dark-blue: #4682a9;\n  --blue: #749bc2;\n  --light-blue: #91c8e4;\n  --white: #f6f4eb;\n  --light-yellow: #fff7d4;\n  --brown: #862b0d;\n  --light-green: #98eecc;\n  --light-pink: #ffcacc;\n  --grey: #9babb8;\n  --purple: #beadfa;\n  --ship-block: 40px;\n}\n\nhtml {\n  height: 100%;\n}\n\nbody {\n  min-height: 100vh;\n  display: grid;\n  font-family: \"Roboto\", sans-serif;\n  grid:\n    \"header header header header\" auto\n    \"main main main main\" 1fr\n    \"footer footer footer footer\" auto /\n    1fr 1fr 1fr 1fr;\n}\n\n#header,\n#footer {\n  background-color: var(--blue);\n}\n\n#header {\n  grid-area: header;\n  font-family: \"Ysabeau SC\", sans-serif;\n  text-align: center;\n  font-size: 4rem;\n  font-weight: 700;\n  letter-spacing: 1px;\n  padding: 20px;\n}\n\n#main {\n  grid-area: main;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 20px;\n  background: url(./images/sunny.jpg);\n  background-size: cover;\n  background-repeat: no-repeat;\n  position: relative;\n}\n\n.grid-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 100px;\n}\n\n.computer-container {\n  display: none;\n}\n\n.player-container {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n  align-items: center;\n  justify-content: center;\n}\n\n.player-title {\n  font-family: \"Ysabeau SC\", sans-serif;\n  font-size: 3rem;\n  font-weight: 900;\n  color: var(--white);\n  position: relative;\n  isolation: isolate;\n  padding: 20px;\n}\n\n.player-title::after {\n  content: \"\";\n  background-color: black;\n  position: absolute;\n  inset: 0;\n  z-index: -1;\n  opacity: 0.7;\n  border-radius: 1rem;\n}\n\n.player-body {\n  display: flex;\n  gap: 100px;\n  align-items: center;\n  justify-content: center;\n}\n\n.player-grid,\n.computer-grid,\n.player-ships {\n  min-width: 400px;\n  min-height: 400px;\n  outline: 3px solid black;\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  isolation: isolate;\n}\n\n.player-grid::after,\n.computer-grid::after,\n.player-ships::after {\n  content: \"\";\n  background-color: var(--light-blue);\n  position: absolute;\n  inset: 0;\n  z-index: -1;\n  opacity: 0.8;\n}\n\n.player-ships {\n  gap: 10px;\n  justify-content: center;\n  align-items: center;\n}\n\n.big-ship-container,\n.destroyer-container,\n.submarine-container,\n.patrol-boat-container {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n  justify-content: center;\n}\n\n.big-ship-container {\n  margin-top: 10px;\n}\n\n.ship {\n  border: 2px solid var(--dark-blue);\n  height: var(--ship-block);\n}\n\n.carrier {\n  width: calc(var(--ship-block) * 5);\n  background-color: var(--brown);\n}\n\n.battleship {\n  width: calc(var(--ship-block) * 4);\n  background-color: var(--light-green);\n}\n\n.destroyer {\n  width: calc(var(--ship-block) * 3);\n  background-color: var(--light-pink);\n}\n\n.submarine {\n  width: calc(var(--ship-block) * 2);\n  background-color: var(--grey);\n}\n\n.patrol-boat {\n  width: calc(var(--ship-block) * 1);\n  background-color: var(--purple);\n}\n\n.change-direction,\n.start-game,\n.play-again {\n  font-weight: 700;\n  font-family: \"Ysabeau SC\", sans-serif;\n  background-color: black;\n  color: var(--white);\n  border: none;\n  cursor: pointer;\n  border-radius: 1rem;\n}\n\n.change-direction {\n  font-size: 0.7rem;\n  padding: 5px;\n  margin-top: 20px;\n}\n\n.start-game,\n.play-again {\n  font-size: 1.5rem;\n  padding: 10px;\n}\n\n.play-again {\n  display: none;\n  margin-top: 200px;\n}\n\n.grid-row {\n  flex: 1;\n  display: flex;\n}\n\n.grid-col {\n  border: 1px solid var(--white);\n  flex: 1;\n  transition: background-color 100ms ease-in-out;\n}\n\n.drag-over {\n  border: 2px dashed red;\n}\n\n.computer-grid .grid-col:hover {\n  cursor: pointer;\n  background-color: var(--blue);\n}\n\n.game-winner {\n  font-size: 3rem;\n  color: var(--white);\n  padding: 20px;\n  position: absolute;\n  isolation: isolate;\n  display: none;\n}\n\n.game-winner::after {\n  content: \"\";\n  position: absolute;\n  background-color: black;\n  z-index: -1;\n  inset: 0;\n  opacity: 0.6;\n  border-radius: 1rem;\n}\n\n.hit-ship {\n  background: url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' preserveAspectRatio='none' viewBox='0 0 100 100'><path d='M100 0 L0 100 ' stroke='red' stroke-width='5'/><path d='M0 0 L100 100 ' stroke='red' stroke-width='5'/></svg>\");\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 100% 100%, auto;\n  border: 1px solid red;\n  background-color: var(--light-yellow);\n}\n\n.hit-miss {\n  background: url(./images/ocean.png);\n  background-color: var(--light-yellow);\n  border: 1px solid var(--dark-blue);\n}\n\n.hide {\n  display: none;\n}\n\n#footer {\n  grid-area: footer;\n  text-align: center;\n  font-weight: 700;\n}\n\n#footer a {\n  text-decoration: none;\n  color: var(--white);\n}\n"],"sourceRoot":""}]);
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
(0,_modules_dom__WEBPACK_IMPORTED_MODULE_2__["default"])(game);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixtQ0FBbUM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNB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L2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9kb20uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9ub3JtYWxpemUuY3NzL25vcm1hbGl6ZS5jc3M/MzQyZiIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcz83MTYzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRvbShnYW1lKSB7XG4gIGNvbXBsZXRlRG9tR3JpZCgpO1xuICBjcmVhdGVDb29yZGluYXRlRXZlbnQoZ2FtZSk7XG4gIGNyZWF0ZURyYWdnYWJsZUV2ZW50cyhnYW1lKTtcbiAgc3dhcEF4aXMoKTtcbiAgYWRkU3RhcnRHYW1lTGlzdGVuZXIoKTtcbiAgcGxheUFnYWluTGlzdGVuZXIoKTtcbn1cblxuLy8gQ29tcGxldGUgdGhlIGdyaWQgb24gdGhlIHdlYnNpdGVcbmZ1bmN0aW9uIGNvbXBsZXRlRG9tR3JpZCgpIHtcbiAgLy8gR2V0IHRoZSBwbGF5ZXIgYW5kIGNvbXB1dGVyIGdyaWRcbiAgY29uc3QgcGxheWVyR3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLWdyaWRcIik7XG4gIGNvbnN0IGNvbXB1dGVyR3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItZ3JpZFwiKTtcblxuICAvLyBDcmVhdGUgdGhlIGdyaWQgZm9yIHRoZSBwbGF5ZXIgYW5kIGNvbXB1dGVyXG4gIGNyZWF0ZURvbUdyaWQocGxheWVyR3JpZCk7XG4gIGNyZWF0ZURvbUdyaWQoY29tcHV0ZXJHcmlkKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRG9tR3JpZChncmlkLCBzaXplID0gMTApIHtcbiAgLy8gQ3JlYXRlIGEgc2l6ZSB4IHNpemUgZ3JpZFxuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgIGNvbnN0IG5ld1JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbmV3Um93LmNsYXNzTGlzdC5hZGQoXCJncmlkLXJvd1wiKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNpemU7IGorKykge1xuICAgICAgY29uc3QgbmV3Q29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIG5ld0NvbC5jbGFzc0xpc3QuYWRkKFwiZ3JpZC1jb2xcIik7XG4gICAgICBuZXdDb2wuZGF0YXNldC54ID0gaTtcbiAgICAgIG5ld0NvbC5kYXRhc2V0LnkgPSBqO1xuICAgICAgbmV3Um93LmFwcGVuZENoaWxkKG5ld0NvbCk7XG4gICAgfVxuICAgIGdyaWQuYXBwZW5kQ2hpbGQobmV3Um93KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDb29yZGluYXRlRXZlbnQoZ2FtZSkge1xuICAvLyBHZXQgY29tcHV0ZXIgZ3JpZCBhbmQgdGhlIGNvb3JkaW5hdGVzIGZyb20gaXRcbiAgY29uc3QgY29tcHV0ZXJHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb21wdXRlci1ncmlkXCIpO1xuICBjb25zdCBjb29yZGluYXRlcyA9IGNvbXB1dGVyR3JpZC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdyaWQtY29sXCIpO1xuXG4gIC8vIEFkZCBhbiBldmVudCBsaXN0ZW5lciB0byBlYWNoIGNvb3JkaW5hdGVcbiAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmRpbmF0ZSkgPT5cbiAgICBjb29yZGluYXRlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIGNvb3JkaW5hdGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0LXNoaXBcIikgfHxcbiAgICAgICAgY29vcmRpbmF0ZS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXQtbWlzc1wiKVxuICAgICAgKVxuICAgICAgICByZXR1cm47XG4gICAgICBjb25zdCBwb3NYID0gcGFyc2VJbnQoY29vcmRpbmF0ZS5kYXRhc2V0LngsIDEwKTtcbiAgICAgIGNvbnN0IHBvc1kgPSBwYXJzZUludChjb29yZGluYXRlLmRhdGFzZXQueSwgMTApO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIHdpbm5lciBwcmV2ZW50IGZ1cnRoZXIgcGxheXNcbiAgICAgIGlmIChnYW1lLmNoZWNrV2lubmVyKCkpIHJldHVybjtcblxuICAgICAgLy8gQ2hlY2sgaWYgaXQncyB0aGUgcGxheWVyIHR1cm5cbiAgICAgIGlmIChnYW1lLmdldEN1cnJlbnRQbGF5ZXJOYW1lKCkgIT09IFwiY29tcHV0ZXJcIikge1xuICAgICAgICBnYW1lLnBsYXllclR1cm4ocG9zWCwgcG9zWSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGUgcmVzcGVjdGl2ZSBjbGFzcyB0byB0aGUgaGl0dGVkIGNvb3JkaW5hdGVcbiAgICAgIGFkZENvb3JkaW5hdGVDbGFzcyhwb3NYLCBwb3NZLCBnYW1lLmdldENvbXB1dGVyQm9hcmQoKSwgY29vcmRpbmF0ZSk7XG5cbiAgICAgIC8vIExldCB0aGUgY29tcHV0ZXIgcGxheSBhcyBsb25nIGFzIGl0J3MgaXQgdHVybi5cbiAgICAgIHdoaWxlIChcbiAgICAgICAgZ2FtZS5nZXRDdXJyZW50UGxheWVyTmFtZSgpID09PSBcImNvbXB1dGVyXCIgJiZcbiAgICAgICAgIWdhbWUuY2hlY2tXaW5uZXIoKVxuICAgICAgKSB7XG4gICAgICAgIHVwZGF0ZVBsYXllckdyaWQoZ2FtZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKGdhbWUuZ2V0UGxheWVyQm9hcmQoKS5nZXRHYW1lQm9hcmQoKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGlmIHNvbWVvbmUgaGF2ZSB3b25cbiAgICAgIGlmIChnYW1lLmNoZWNrV2lubmVyKCkpIHtcbiAgICAgICAgZGlzcGxheVdpbm5lcihnYW1lKTtcbiAgICAgIH1cbiAgICB9KVxuICApO1xufVxuXG4vLyBBZGQgYSBoaXQgY2xhc3MgdG8gdGhlIGNvb3JkaW5hdGVcbmZ1bmN0aW9uIGFkZENvb3JkaW5hdGVDbGFzcyh4LCB5LCBnYW1lYm9hcmQsIGNvb3JkaW5hdGUpIHtcbiAgaWYgKGdhbWVib2FyZC5pc1NoaXBIaXR0ZWQoeCwgeSkpIHtcbiAgICBjb29yZGluYXRlLmNsYXNzTGlzdC5hZGQoXCJoaXQtc2hpcFwiKTtcbiAgfSBlbHNlIHtcbiAgICBjb29yZGluYXRlLmNsYXNzTGlzdC5hZGQoXCJoaXQtbWlzc1wiKTtcbiAgfVxufVxuXG4vLyBNYWtlIGEgZnVuY3Rpb24gdGhhdCB1cGRhdGVzIHRoZSBwbGF5ZXIgZ3JpZCB3aGVuIHRoZSBjb21wdXRlciBhdHRhY2tzXG5mdW5jdGlvbiB1cGRhdGVQbGF5ZXJHcmlkKGdhbWUpIHtcbiAgLy8gR2V0IHRoZSBwbGF5ZXIgZ3JpZCBhbmQgaXQncyBjb29yZGluYXRlc1xuICBjb25zdCBwbGF5ZXJHcmlkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXItZ3JpZFwiKTtcbiAgY29uc3QgY29vcmRpbmF0ZXMgPSBwbGF5ZXJHcmlkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZC1jb2xcIik7XG5cbiAgLy8gR2V0IHRoZSB4IGFuZCB5IHBvc2l0aW9uIHJhbmRvbWx5IGdlbmVyYXRlZCBmb3IgdGhlIGNvbXB1dGVyXG4gIGNvbnN0IHJlc3VsdCA9IGdhbWUuY29tcHV0ZXJUdXJuKCk7XG5cbiAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgbm8gbW9yZSBjb29yZGluYXRlcyB0byBhdHRhY2sgYW5kIGlmIHRoZXJlIGlzIG5vIHdpbm5lclxuICBpZiAocmVzdWx0ID09PSBcIkFsbCBjb29yZGluYXRlcyBoYXZlIGJlZW4gYXR0YWNrZWQhXCIgfHwgIXJlc3VsdCkgcmV0dXJuO1xuICBpZiAoZ2FtZS5jaGVja1dpbm5lcigpKSByZXR1cm47XG5cbiAgLy8gU3BsaXQgdGhlIHJlc3VsdFxuICBjb25zdCB7IGNvbXBYLCBjb21wWSB9ID0gcmVzdWx0O1xuXG4gIC8vIEdldCB0aGUgaW5kZXggb24gdGhlIG5vZGUgbGlzdCB0aGF0IHJlcHJlc2VudCB0aGUgY3VycmVudCBjb29yZGluYXRlXG4gIGxldCBwb3NpdGlvbjtcbiAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmRpbmF0ZSwgaW5kZXgpID0+IHtcbiAgICBpZiAoXG4gICAgICBwYXJzZUludChjb29yZGluYXRlLmRhdGFzZXQueCwgMTApID09PSBjb21wWCAmJlxuICAgICAgcGFyc2VJbnQoY29vcmRpbmF0ZS5kYXRhc2V0LnksIDEwKSA9PT0gY29tcFlcbiAgICApIHtcbiAgICAgIHBvc2l0aW9uID0gaW5kZXg7XG4gICAgfVxuICB9KTtcblxuICAvLyBHZXQgdGhlIGNvb3JkaW5hdGVcbiAgY29uc3QgbmV3Q29vcmRpbmF0ZSA9IGNvb3JkaW5hdGVzW3Bvc2l0aW9uXTtcblxuICAvLyBBZGQgdGhlIGNsYXNzIHRvIGl0XG4gIGFkZENvb3JkaW5hdGVDbGFzcyhjb21wWCwgY29tcFksIGdhbWUuZ2V0UGxheWVyQm9hcmQoKSwgbmV3Q29vcmRpbmF0ZSk7XG59XG5cbi8vIEFkZCBhIGZ1bmN0aW9uIHRoYXQgZGlzcGxheXMgdGhlIHdpbm5lclxuZnVuY3Rpb24gZGlzcGxheVdpbm5lcihnYW1lKSB7XG4gIC8vIERpc3BsYXkgdGhlIHdpbm5lclxuICBjb25zdCBnYW1lV2lubmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lLXdpbm5lclwiKTtcbiAgY29uc3QgcGxheUFnYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5LWFnYWluXCIpO1xuICBnYW1lV2lubmVyLnRleHRDb250ZW50ID0gZ2FtZS5kZWNsYXJlV2lubmVyKCk7XG4gIGdhbWVXaW5uZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgcGxheUFnYWluLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG5cbiAgLy8gSGlkZSB0aGUgZ3JpZHNcbiAgY29uc3QgZ3JpZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ3JpZC1jb250YWluZXJcIik7XG4gIGdyaWRDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuXG4vLyBDcmVhdGUgZHJhZ2dhYmxlIGV2ZW50c1xuXG5mdW5jdGlvbiBjcmVhdGVEcmFnZ2FibGVFdmVudHMoZ2FtZSkge1xuICAvLyBHZXQgYWxsIHRoZSBzaGlwc1xuICBjb25zdCBzaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxheWVyLXNoaXBzIC5zaGlwXCIpO1xuICBzaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgc2hpcC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIGRyYWdTdGFydCk7XG4gIH0pO1xuXG4gIC8vIEdldCBhbGwgdGhlIHBsYXllciBncmlkIGNvbFxuICBjb25zdCBwbGF5ZXJDb29yZGluYXRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxheWVyLWdyaWQgLmdyaWQtY29sXCIpO1xuICBwbGF5ZXJDb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlKSA9PiB7XG4gICAgY29vcmRpbmF0ZS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VudGVyXCIsIGRyYWdFbnRlcik7XG4gICAgY29vcmRpbmF0ZS5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZHJhZ092ZXIpO1xuICAgIGNvb3JkaW5hdGUuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCBkcmFnTGVhdmUpO1xuICAgIGNvb3JkaW5hdGUuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgKGUpID0+IHtcbiAgICAgIHNoaXBEcm9wKGUsIGdhbWUpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZHJhZ1N0YXJ0KGUpIHtcbiAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgZS50YXJnZXQuaWQpO1xufVxuXG5mdW5jdGlvbiBkcmFnRW50ZXIoZSkge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJkcmFnLW92ZXJcIik7XG59XG5cbmZ1bmN0aW9uIGRyYWdPdmVyKGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwiZHJhZy1vdmVyXCIpO1xufVxuXG5mdW5jdGlvbiBkcmFnTGVhdmUoZSkge1xuICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKFwiZHJhZy1vdmVyXCIpO1xufVxuXG5mdW5jdGlvbiBzaGlwRHJvcChlLCBnYW1lKSB7XG4gIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJkcmFnLW92ZXJcIik7XG5cbiAgLy8gR2V0IHRoZSBkcmFnZ2FibGUgZWxlbWVudFxuICBjb25zdCBpZCA9IGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ0ZXh0L3BsYWluXCIpO1xuICBjb25zdCBkcmFnZ2FibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gIGNvbnN0IGlzSG9yaXpvbnRhbCA9ICFkcmFnZ2FibGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwidmVydGljYWxcIik7XG5cbiAgLy8gR2V0IHRoZSBjb29yZGluYXRlcyBhbmQgbGVuZ3RoXG4gIGNvbnN0IGdyaWRTaXplID0gMTA7XG4gIGNvbnN0IGxlbmd0aCA9IHBhcnNlSW50KGRyYWdnYWJsZS5kYXRhc2V0Lmxlbmd0aCwgMTApO1xuICBsZXQgeyB4IH0gPSBlLnRhcmdldC5kYXRhc2V0O1xuICBsZXQgeyB5IH0gPSBlLnRhcmdldC5kYXRhc2V0O1xuICB4ID0gcGFyc2VJbnQoeCwgMTApO1xuICB5ID0gcGFyc2VJbnQoeSwgMTApO1xuICBjb25zdCBlbmRQb2ludCA9IGlzSG9yaXpvbnRhbCA/IGxlbmd0aCArIHkgOiBsZW5ndGggKyB4O1xuICBjb25zdCBpc092ZXJsYXBwZWQgPSBjaGVja092ZXJsYXAoeCwgeSwgbGVuZ3RoLCBlLnRhcmdldCwgaXNIb3Jpem9udGFsKTtcblxuICAvLyBDaGVjayB0aGF0IHRoZSBzaGlwIGRvZXNuJ3QgZ28gYmV5b25kIHRoZSBib3VuZGFyaWVzIG9mIHRoZSBncmlkXG4gIGlmIChlbmRQb2ludCA8PSBncmlkU2l6ZSAmJiAhaXNPdmVybGFwcGVkKSB7XG4gICAgLy8gQWRkIGl0IHRvIHRoZSBkcm9wIHRhcmdldFxuICAgIGRpc3BsYXlTaGlwKHgsIHksIGRyYWdnYWJsZSwgZS50YXJnZXQsIGlzSG9yaXpvbnRhbCk7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gaXNIb3Jpem9udGFsID8gXCJyb3dcIiA6IFwiY29sXCI7XG4gICAgZ2FtZS5nZXRQbGF5ZXJCb2FyZCgpLnBsYWNlU2hpcCh4LCB5LCBsZW5ndGgsIGRpcmVjdGlvbik7XG4gIH1cbn1cblxuLy8gRGlzcGxheSB0aGUgc2hpcCBvbiB0aGUgZ3JpZFxuZnVuY3Rpb24gZGlzcGxheVNoaXAoeCwgeSwgc2hpcCwgY29vcmRpbmF0ZSwgZGlyZWN0aW9uID0gdHJ1ZSkge1xuICBsZXQgbmV3Q29vcmRpbmF0ZSA9IGNvb3JkaW5hdGU7XG4gIGNvbnN0IHNoaXBMZW5ndGggPSBwYXJzZUludChzaGlwLmRhdGFzZXQubGVuZ3RoLCAxMCk7XG4gIGNvbnN0IHNoaXBDb2xvciA9IGdldENvbXB1dGVkU3R5bGUoc2hpcCkuZ2V0UHJvcGVydHlWYWx1ZShcImJhY2tncm91bmQtY29sb3JcIik7XG4gIGNvbnN0IGVuZFBvaW50ID0gZGlyZWN0aW9uID8gc2hpcExlbmd0aCArIHkgOiBzaGlwTGVuZ3RoICsgeDtcblxuICAvLyBHZXQgdGhlIGNvb3JkaW5hdGVzIGRlcGVuZGluZyBvbiB0aGUgZGlyZWN0aW9uXG4gIGlmIChkaXJlY3Rpb24pIHtcbiAgICBmb3IgKGxldCBpID0geTsgaSA8IGVuZFBvaW50OyBpKyspIHtcbiAgICAgIG5ld0Nvb3JkaW5hdGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gc2hpcENvbG9yO1xuICAgICAgbmV3Q29vcmRpbmF0ZS5jbGFzc0xpc3QuYWRkKFwib2NjdXBpZWRcIik7XG4gICAgICBuZXdDb29yZGluYXRlID0gbmV3Q29vcmRpbmF0ZS5uZXh0U2libGluZztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgaSA9IHg7IGkgPCBlbmRQb2ludDsgaSsrKSB7XG4gICAgICBuZXdDb29yZGluYXRlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHNoaXBDb2xvcjtcbiAgICAgIG5ld0Nvb3JkaW5hdGUuY2xhc3NMaXN0LmFkZChcIm9jY3VwaWVkXCIpO1xuICAgICAgbmV3Q29vcmRpbmF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS14PVwiJHsoaSArIDEpLnRvU3RyaW5nKCl9XCJdW2RhdGEteT1cIiR7eS50b1N0cmluZygpfVwiXWBcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgc2hpcC5yZW1vdmUoKTtcbn1cblxuLy8gQ2hlY2sgaWYgdGhlIHNoaXAgb3ZlcmxhcHMgd2l0aCBvbmUgYW5vdGhlclxuZnVuY3Rpb24gY2hlY2tPdmVybGFwKHgsIHksIGxlbmd0aCwgY29vcmRpbmF0ZSwgZGlyZWN0aW9uID0gdHJ1ZSkge1xuICBsZXQgY3VycmVudENvb3JkaW5hdGUgPSBjb29yZGluYXRlO1xuICBjb25zdCBlbmRQb2ludCA9IGRpcmVjdGlvbiA/IGxlbmd0aCArIHkgOiBsZW5ndGggKyB4O1xuICBpZiAoZGlyZWN0aW9uKSB7XG4gICAgZm9yIChsZXQgaSA9IHk7IGkgPCBlbmRQb2ludDsgaSsrKSB7XG4gICAgICBpZiAoY3VycmVudENvb3JkaW5hdGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwib2NjdXBpZWRcIikpIHJldHVybiB0cnVlO1xuICAgICAgY3VycmVudENvb3JkaW5hdGUgPSBjdXJyZW50Q29vcmRpbmF0ZS5uZXh0U2libGluZztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgaSA9IHg7IGkgPCBlbmRQb2ludDsgaSsrKSB7XG4gICAgICBpZiAoY3VycmVudENvb3JkaW5hdGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwib2NjdXBpZWRcIikpIHJldHVybiB0cnVlO1xuICAgICAgY3VycmVudENvb3JkaW5hdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEteD1cIiR7KGkgKyAxKS50b1N0cmluZygpfVwiXVtkYXRhLXk9XCIke3kudG9TdHJpbmcoKX1cIl1gXG4gICAgICApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHN3YXBBeGlzKCkge1xuICBjb25zdCBjaGFuZ2VEaXJlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNoYW5nZS1kaXJlY3Rpb25cIik7XG4gIGNoYW5nZURpcmVjdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGNvbnN0IHNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zaGlwXCIpO1xuICAgIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIGNvbnN0IHdpZHRoID0gZ2V0Q29tcHV0ZWRTdHlsZShzaGlwKS5nZXRQcm9wZXJ0eVZhbHVlKFwid2lkdGhcIik7XG4gICAgICBjb25zdCBoZWlnaHQgPSBnZXRDb21wdXRlZFN0eWxlKHNoaXApLmdldFByb3BlcnR5VmFsdWUoXCJoZWlnaHRcIik7XG4gICAgICBzaGlwLnN0eWxlLndpZHRoID0gaGVpZ2h0OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICBzaGlwLnN0eWxlLmhlaWdodCA9IHdpZHRoOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICBzaGlwLmNsYXNzTGlzdC50b2dnbGUoXCJ2ZXJ0aWNhbFwiKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0YXJ0R2FtZUxpc3RlbmVyKCkge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0LWdhbWVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZSk7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcbiAgLy8gRGVmaW5lIFZhcmlhYmxlc1xuICBjb25zdCBwbGF5ZXJTaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyLXNoaXBzXCIpO1xuICBjb25zdCBjb21wdXRlckNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXItY29udGFpbmVyXCIpO1xuICBjb25zdCBzdGFydEdhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0LWdhbWVcIik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2hhZG93XG4gIGNvbnN0IHBsYXllclRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXItdGl0bGVcIik7XG5cbiAgLy8gSGlkZSBhbmQgc2hvdyB2YXJpYWJsZXNcbiAgcGxheWVyU2hpcHMuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBzdGFydEdhbWUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICBwbGF5ZXJUaXRsZS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gIGNvbXB1dGVyQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG59XG5cbmZ1bmN0aW9uIHBsYXlBZ2Fpbkxpc3RlbmVyKCkge1xuICBjb25zdCBwbGF5QWdhaW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXktYWdhaW5cIik7XG4gIHBsYXlBZ2Fpbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGxvY2F0aW9uLnJlbG9hZCgpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXJlc3RyaWN0ZWQtZ2xvYmFsc1xuICB9KTtcbn1cbiIsImltcG9ydCBzaGlwRmFjdG9yeSBmcm9tIFwiLi9zaGlwXCI7XG5cbi8vIE1ha2UgYSBnYW1lIGJvYXJkIGZhY3RvcnkgdGhhdCB3b3JrcyBhcyBhIGdhbWVib2FyZCBmb3IgdGhlIGJhdHRsZXNoaXAgZ2FtZS5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdhbWVCb2FyZEZhY3RvcnkoKSB7XG4gIC8vIENyZWF0ZSBnYW1lYm9hcmQgYW5kIHNoaXAgYm9hcmQgdG8ga2VlcCB0cmFjayBvZiB0aGUgc2hpcHNcbiAgY29uc3QgZ2FtZWJvYXJkID0gY3JlYXRlR2FtZUJvYXJkR3JpZCgpO1xuICBjb25zdCBzaGlwYm9hcmQgPSBjcmVhdGVHYW1lQm9hcmRHcmlkKCk7XG4gIGNvbnN0IGdldEdhbWVCb2FyZCA9ICgpID0+IGdhbWVib2FyZDtcbiAgY29uc3QgZ2V0U2hpcEJvYXJkID0gKCkgPT4gc2hpcGJvYXJkO1xuXG4gIC8vIFZhcmlhYmxlcyB0byBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IHNoaXBzIGhhdmUgYmVlbiBwbGFjZWQgYW5kIHRvIHN0b3JlIHRoZW1cbiAgbGV0IHNoaXBDb3VudCA9IDA7XG4gIGNvbnN0IHNoaXBzID0gbmV3IE1hcCgpO1xuICBjb25zdCBnZXRTaGlwcyA9ICgpID0+IHNoaXBzO1xuXG4gIC8vIEZ1bmN0aW9uIHRoYXQgbGV0IHlvdSBwbGFjZSBzaGlwcyBvbiB0aGUgZ2FtZWJvYXJkXG4gIGNvbnN0IHBsYWNlU2hpcCA9ICh4LCB5LCBzaXplLCBkaXJlY3Rpb24gPSBcInJvd1wiKSA9PiB7XG4gICAgLy8gSW5jcmVhc2Ugc2hpcCBjb3VudCBhbmQgbWFwIHRoZSBuZXcgc2hpcFxuICAgIHNoaXBDb3VudCsrO1xuICAgIGNvbnN0IG5ld1NoaXAgPSBzaGlwRmFjdG9yeShzaXplKTtcbiAgICBzaGlwcy5zZXQoYCR7c2hpcENvdW50fWAsIG5ld1NoaXApO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCB0aGUgc2hpcCBiZWVpbmcgcGxhY2VkIGF0IHRoZSBjb29yZGluYXRlcyAoeCwgeSkgZG9lc24ndCBnbyBiZXlvbmQgZ2FtZWJvYXJkIHNpemVcbiAgICBjb25zdCBnYW1lQm9hcmRTaXplID0gZ2FtZWJvYXJkLmxlbmd0aDtcbiAgICBjb25zdCBlbmRQb2ludCA9IGRpcmVjdGlvbiA9PT0gXCJjb2xcIiA/IHNpemUgKyB4IDogc2l6ZSArIHk7XG4gICAgaWYgKGVuZFBvaW50ID4gZ2FtZUJvYXJkU2l6ZSkgcmV0dXJuIFwiU2hpcCBjYW5ub3QgYmUgcGxhY2VkXCI7XG5cbiAgICAvLyBDaGVjayB0aGF0IHRoZSBzaGlwcyBkb2Vzbid0IG92ZXJsYXBcbiAgICBjb25zdCBpc1NoaXBPdmVybGFwcGVkID0gc2hpcE92ZXJsYXAoZ2FtZWJvYXJkLCB4LCB5LCBzaXplLCBkaXJlY3Rpb24pO1xuICAgIGlmIChpc1NoaXBPdmVybGFwcGVkKSByZXR1cm4gXCJTaGlwcyBhcmUgb3ZlcmxhcHBpbmcsIGNhbm5vdCBiZSBwbGFjZWRcIjtcblxuICAgIC8vIFBsYWNlIHRoZSBzaGlwIG9uIHRoZSBnYW1lYm9hcmQgY2hlY2tpbmcgZm9yIGl0J3MgZGlyZWN0aW9uXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJjb2xcIikge1xuICAgICAgZm9yIChsZXQgaSA9IHg7IGkgPCBlbmRQb2ludDsgaSsrKSB7XG4gICAgICAgIGdhbWVib2FyZFtpXVt5XSA9IGAke3NoaXBDb3VudH1gO1xuICAgICAgICBzaGlwYm9hcmRbaV1beV0gPSBgJHtzaGlwQ291bnR9YDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IHk7IGkgPCBlbmRQb2ludDsgaSsrKSB7XG4gICAgICAgIGdhbWVib2FyZFt4XVtpXSA9IGAke3NoaXBDb3VudH1gO1xuICAgICAgICBzaGlwYm9hcmRbeF1baV0gPSBgJHtzaGlwQ291bnR9YDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9ICh4LCB5KSA9PiB7XG4gICAgLy8gTWFrZSBzdXJlIGl0IGRvZXNuJ3QgcmVjZWl2ZSBhbiBhdHRhY2sgb3V0c2lkZSB0aGUgZ2FtZWJvYXJkXG4gICAgaWYgKHggPj0gZ2FtZWJvYXJkLmxlbmd0aCB8fCB5ID49IGdhbWVib2FyZC5sZW5ndGgpXG4gICAgICByZXR1cm4gXCJJbnZhbGlkIGNvb3JkaW5hdGVzXCI7XG5cbiAgICAvLyBVcGRhdGUgdGhlIG51bWJlciBvZiBoaXRzIG9uIHRoZSBzaGlwIGlmIGl0J3Mgbm90IGVtcHR5IG9yIGEgaGl0IGFscmVhZHlcbiAgICBpZiAoZ2FtZWJvYXJkW3hdW3ldICE9PSBcIlwiICYmIGdhbWVib2FyZFt4XVt5XSAhPT0gXCJ4XCIpIHtcbiAgICAgIHNoaXBzLmdldChnYW1lYm9hcmRbeF1beV0pLmhpdCgpO1xuICAgIH1cbiAgICAvLyBDaGFuZ2UgdGhlIGdhbWVib2FyZCBvbmx5IGlmIHRoZSBjb29yZGluYXRlcyBhcmUgbm90IGEgbWlzc2VkIGF0dGFja1xuICAgIGlmIChnYW1lYm9hcmRbeF1beV0gIT09IFwieFwiKSB7XG4gICAgICBnYW1lYm9hcmRbeF1beV0gPSBcInhcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiQ2Fubm90IGF0dGFjayB0aGUgc2FtZSBzcG90IHR3aWNlXCI7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGlzU2hpcEhpdHRlZCA9ICh4LCB5KSA9PiB7XG4gICAgaWYgKHNoaXBib2FyZFt4XVt5XSAhPT0gXCJcIikgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IGlzQWxsU2hpcHNTdW5rID0gKCkgPT4gYWxsU2hpcHNTdW5rKHNoaXBzKTtcblxuICByZXR1cm4ge1xuICAgIGdldEdhbWVCb2FyZCxcbiAgICBnZXRTaGlwQm9hcmQsXG4gICAgcGxhY2VTaGlwLFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgZ2V0U2hpcHMsXG4gICAgaXNTaGlwSGl0dGVkLFxuICAgIGlzQWxsU2hpcHNTdW5rLFxuICB9O1xufVxuXG4vLyBNYWtlIGEgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGEgZ2FtZSBib2FyZCBncmlkLCBkZWZhdWx0IHNpemUgaXMgMTB4MTBcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVHYW1lQm9hcmRHcmlkKHNpemUgPSAxMCkge1xuICBjb25zdCBnYW1lYm9hcmQgPSBbXTtcbiAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgc2l6ZTsgcm93KyspIHtcbiAgICBjb25zdCBuZXdSb3cgPSBbXTtcbiAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBzaXplOyBjb2wrKykge1xuICAgICAgbmV3Um93LnB1c2goXCJcIik7XG4gICAgfVxuICAgIGdhbWVib2FyZC5wdXNoKG5ld1Jvdyk7XG4gIH1cbiAgcmV0dXJuIGdhbWVib2FyZDtcbn1cblxuLy8gTWFrZSBhIGZ1bmN0aW9uIHRoYXQgY2hlY2sgaWYgYSBzaGlwIGlzIG92ZXJsYXBwaW5nIHdpdGggYW5vdGhlclxuZnVuY3Rpb24gc2hpcE92ZXJsYXAoZ2FtZWJvYXJkLCB4LCB5LCBzaXplLCBkaXJlY3Rpb24pIHtcbiAgY29uc3QgZW5kUG9pbnQgPSBkaXJlY3Rpb24gPT09IFwiY29sXCIgPyBzaXplICsgeCA6IHNpemUgKyB5O1xuICBpZiAoZGlyZWN0aW9uID09PSBcImNvbFwiKSB7XG4gICAgZm9yIChsZXQgaSA9IHg7IGkgPCBlbmRQb2ludDsgaSsrKSB7XG4gICAgICBpZiAoZ2FtZWJvYXJkW2ldW3ldICE9PSBcIlwiKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgaSA9IHk7IGkgPCBlbmRQb2ludDsgaSsrKSB7XG4gICAgICBpZiAoZ2FtZWJvYXJkW3hdW2ldICE9PSBcIlwiKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBNYWtlIGEgZnVuY3Rpb24gdGhhdCBjaGVjayBpZiBhbGwgdGhlIHNoaXBzIGhhdmUgYmVlbiBzdW5rXG5mdW5jdGlvbiBhbGxTaGlwc1N1bmsobWFwKSB7XG4gIGNvbnN0IHNoaXBzID0gW107XG4gIG1hcC5mb3JFYWNoKCh2YWx1ZSkgPT4gc2hpcHMucHVzaCh2YWx1ZSkpO1xuICByZXR1cm4gc2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkpO1xufVxuIiwiaW1wb3J0IGdhbWVCb2FyZEZhY3RvcnkgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgcGxheWVyRmFjdG9yeSwgeyBjb21wdXRlckZhY3RvcnkgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2FtZUxvb3BGYWN0b3J5KCkge1xuICAvLyBDcmVhdGUgZ2FtZWJvYXJkcywgcGxheWVyIGFuZCBjb21wdXRlclxuICBjb25zdCBwbGF5ZXJHYW1lQm9hcmQgPSBnYW1lQm9hcmRGYWN0b3J5KCk7XG4gIGNvbnN0IGNvbXB1dGVyR2FtZUJvYXJkID0gZ2FtZUJvYXJkRmFjdG9yeSgpO1xuICBjb25zdCBwbGF5ZXIgPSBwbGF5ZXJGYWN0b3J5KFwicGxheWVyXCIpO1xuICBjb25zdCBjb21wdXRlciA9IGNvbXB1dGVyRmFjdG9yeSgpO1xuXG4gIC8vIEdldCBwbGF5ZXIgYW5kIGNvbXB1dGVyIGJvYXJkXG4gIGNvbnN0IGdldFBsYXllckJvYXJkID0gKCkgPT4gcGxheWVyR2FtZUJvYXJkO1xuICBjb25zdCBnZXRDb21wdXRlckJvYXJkID0gKCkgPT4gY29tcHV0ZXJHYW1lQm9hcmQ7XG5cbiAgLy8gUGxhY2UgY29tcHV0ZXIgc2hpcHNcbiAgY29tcHV0ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDEsIDEsIDUpO1xuICBjb21wdXRlckdhbWVCb2FyZC5wbGFjZVNoaXAoNCwgMiwgNCwgXCJjb2xcIik7XG4gIGNvbXB1dGVyR2FtZUJvYXJkLnBsYWNlU2hpcCgwLCAwLCAzLCBcImNvbFwiKTtcbiAgY29tcHV0ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDksIDEsIDMpO1xuICBjb21wdXRlckdhbWVCb2FyZC5wbGFjZVNoaXAoOCwgNywgMik7XG4gIGNvbXB1dGVyR2FtZUJvYXJkLnBsYWNlU2hpcCg1LCAzLCAyKTtcbiAgY29tcHV0ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDMsIDcsIDIsIFwiY29sXCIpO1xuICBjb21wdXRlckdhbWVCb2FyZC5wbGFjZVNoaXAoOSwgOCwgMSk7XG4gIGNvbXB1dGVyR2FtZUJvYXJkLnBsYWNlU2hpcCgwLCA5LCAxKTtcbiAgY29tcHV0ZXJHYW1lQm9hcmQucGxhY2VTaGlwKDMsIDMsIDEpO1xuICBjb21wdXRlckdhbWVCb2FyZC5wbGFjZVNoaXAoMiwgOCwgMSk7XG5cbiAgLy8gRGVmaW5lIGEgdHVybiB2YXJpYWJsZSwgc3RhcnRpbmcgd2l0aCB0aGUgcGxheWVyXG4gIGxldCBpc1BsYXllclR1cm4gPSB0cnVlO1xuXG4gIC8vIEdldCB0aGUgbmFtZSBvZiB3aG9ldmVyIGlzIHBsYXlpbmcgaW4gdGhlIGN1cnJlbnQgdHVyblxuICBjb25zdCBnZXRDdXJyZW50UGxheWVyTmFtZSA9ICgpID0+IHtcbiAgICBpZiAoaXNQbGF5ZXJUdXJuKSByZXR1cm4gcGxheWVyLmdldE5hbWUoKTtcbiAgICByZXR1cm4gY29tcHV0ZXIuZ2V0TmFtZSgpO1xuICB9O1xuXG4gIC8vIERlZmluZSB0aGUgcGxheWVyIHR1cm5cbiAgY29uc3QgcGxheWVyVHVybiA9ICh4LCB5KSA9PiB7XG4gICAgaWYgKGNoZWNrV2lubmVyKCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKGRlY2xhcmVXaW5uZXIoKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc1BsYXllclR1cm4pIHtcbiAgICAgIHBsYXllci5hdHRhY2soeCwgeSwgY29tcHV0ZXJHYW1lQm9hcmQpO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgcGxheWVyIHBsYXlzIGFnYWluIG9yIG5vdFxuICAgICAgaXNQbGF5ZXJUdXJuID0gY29tcHV0ZXJHYW1lQm9hcmQuaXNTaGlwSGl0dGVkKHgsIHkpO1xuICAgIH1cbiAgfTtcblxuICAvLyBEZWZpbmUgdGhlIGNvbXB1dGVyIHR1cm5cbiAgY29uc3QgY29tcHV0ZXJUdXJuID0gKCkgPT4ge1xuICAgIGlmIChjaGVja1dpbm5lcigpKSB7XG4gICAgICBjb25zb2xlLmxvZyhkZWNsYXJlV2lubmVyKCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWlzUGxheWVyVHVybikge1xuICAgICAgY29uc3QgcmVzdWx0ID0gY29tcHV0ZXIuYXR0YWNrKHBsYXllckdhbWVCb2FyZCk7XG4gICAgICBpZiAocmVzdWx0ID09PSBcIkFsbCBjb29yZGluYXRlcyBoYXZlIGJlZW4gYXR0YWNrZWRcIilcbiAgICAgICAgcmV0dXJuIFwiQWxsIGNvb3JkaW5hdGVzIGhhdmUgYmVlbiBhdHRhY2tlZCFcIjtcbiAgICAgIGNvbnN0IGNvbXBYID0gcmVzdWx0Lng7XG4gICAgICBjb25zdCBjb21wWSA9IHJlc3VsdC55O1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgY29tcHV0ZXIgcGxheXMgYWdhaW4gb3Igbm90XG4gICAgICBpc1BsYXllclR1cm4gPSAhcGxheWVyR2FtZUJvYXJkLmlzU2hpcEhpdHRlZChjb21wWCwgY29tcFkpO1xuXG4gICAgICByZXR1cm4geyBjb21wWCwgY29tcFkgfTtcbiAgICB9XG4gIH07XG5cbiAgLy8gQ2hlY2sgZm9yIGEgd2lubmVyXG4gIGNvbnN0IGNoZWNrV2lubmVyID0gKCkgPT4ge1xuICAgIGlmIChcbiAgICAgIHBsYXllckdhbWVCb2FyZC5pc0FsbFNoaXBzU3VuaygpIHx8XG4gICAgICBjb21wdXRlckdhbWVCb2FyZC5pc0FsbFNoaXBzU3VuaygpXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIERlY2xhcmUgdGhlIHdpbm5lclxuICBjb25zdCBkZWNsYXJlV2lubmVyID0gKCkgPT4ge1xuICAgIGlmIChwbGF5ZXJHYW1lQm9hcmQuaXNBbGxTaGlwc1N1bmsoKSkgcmV0dXJuIGAke2NvbXB1dGVyLmdldE5hbWUoKX0gd2lucyFgO1xuICAgIHJldHVybiBgJHtwbGF5ZXIuZ2V0TmFtZSgpfSB3aW5zIWA7XG4gIH07XG4gIHJldHVybiB7XG4gICAgZ2V0UGxheWVyQm9hcmQsXG4gICAgZ2V0Q29tcHV0ZXJCb2FyZCxcbiAgICBwbGF5ZXJUdXJuLFxuICAgIGNvbXB1dGVyVHVybixcbiAgICBnZXRDdXJyZW50UGxheWVyTmFtZSxcbiAgICBkZWNsYXJlV2lubmVyLFxuICAgIGNoZWNrV2lubmVyLFxuICB9O1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlR2FtZUJvYXJkR3JpZCB9IGZyb20gXCIuL2dhbWVib2FyZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwbGF5ZXJGYWN0b3J5KG5hbWUgPSBcInBsYXllclwiKSB7XG4gIGNvbnN0IGdldE5hbWUgPSAoKSA9PiBuYW1lO1xuICBjb25zdCBhdHRhY2sgPSAoeCwgeSwgZ2FtZWJvYXJkKSA9PiBnYW1lYm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KTtcbiAgcmV0dXJuIHsgZ2V0TmFtZSwgYXR0YWNrIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlckZhY3RvcnkoKSB7XG4gIGNvbnN0IGdldE5hbWUgPSAoKSA9PiBcImNvbXB1dGVyXCI7XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2VuZXJhdGVDb29yZGluYXRlKCk7XG4gIGNvbnN0IGF0dGFjayA9IChnYW1lYm9hcmQpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSBjb29yZGluYXRlcy5nZXRWYWxpZENvb3JkaW5hdGVzKCk7XG4gICAgaWYgKHJlc3VsdCA9PT0gXCJObyBtb3JlIGNvb3JkaW5hdGVzIHRvIGF0dGFja1wiKSB7XG4gICAgICByZXR1cm4gXCJBbGwgY29vcmRpbmF0ZXMgaGF2ZSBiZWVuIGF0dGFja2VkXCI7XG4gICAgfVxuICAgIGNvbnN0IHsgeCwgeSB9ID0gcmVzdWx0O1xuICAgIGdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuICAgIHJldHVybiB7IHgsIHkgfTtcbiAgfTtcbiAgcmV0dXJuIHsgZ2V0TmFtZSwgYXR0YWNrIH07XG59XG5cbmZ1bmN0aW9uIHJhbmRvbU51bWJlcihzaXplID0gMTApIHtcbiAgY29uc3QgbnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2l6ZSk7XG4gIHJldHVybiBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUNvb3JkaW5hdGUoc2l6ZSA9IDEwKSB7XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gY3JlYXRlR2FtZUJvYXJkR3JpZChzaXplKTtcbiAgbGV0IGF2YWlsYWJsZUNvb3JkaW5hdGVzID0gc2l6ZSAqIHNpemU7XG4gIGNvbnN0IGdldFZhbGlkQ29vcmRpbmF0ZXMgPSAoKSA9PiB7XG4gICAgY29uc3QgeCA9IHJhbmRvbU51bWJlcihzaXplKTtcbiAgICBjb25zdCB5ID0gcmFuZG9tTnVtYmVyKHNpemUpO1xuICAgIGlmIChhdmFpbGFibGVDb29yZGluYXRlcyA9PT0gMCkgcmV0dXJuIFwiTm8gbW9yZSBjb29yZGluYXRlcyB0byBhdHRhY2tcIjtcbiAgICBpZiAoY29vcmRpbmF0ZXNbeF1beV0gPT09IFwiXCIpIHtcbiAgICAgIGNvb3JkaW5hdGVzW3hdW3ldID0gXCJhdHRhY2tlZFwiO1xuICAgICAgYXZhaWxhYmxlQ29vcmRpbmF0ZXMtLTtcbiAgICAgIHJldHVybiB7IHgsIHkgfTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBnZXRWYWxpZENvb3JkaW5hdGVzKCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcmV0dXJuIHsgZ2V0VmFsaWRDb29yZGluYXRlcywgZ2V0Q29vcmRpbmF0ZXM6ICgpID0+IGNvb3JkaW5hdGVzIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaGlwRmFjdG9yeShzaXplKSB7XG4gIGNvbnN0IGxlbmd0aCA9IHNpemU7XG4gIGxldCBoaXRzID0gMDtcbiAgY29uc3QgbmFtZSA9IGdldFNoaXBOYW1lKHNpemUpO1xuICBjb25zdCBoaXQgPSAoKSA9PiB7XG4gICAgaWYgKGhpdHMgPCBsZW5ndGgpIGhpdHMrKztcbiAgfTtcbiAgY29uc3QgaXNTdW5rID0gKCkgPT4gIShsZW5ndGggPiBoaXRzKTtcbiAgY29uc3QgZ2V0SGl0cyA9ICgpID0+IGhpdHM7XG4gIGNvbnN0IGdldE5hbWUgPSAoKSA9PiBuYW1lO1xuICByZXR1cm4geyBoaXQsIGlzU3VuaywgZ2V0SGl0cywgZ2V0TmFtZSB9O1xufVxuXG5mdW5jdGlvbiBnZXRTaGlwTmFtZShzaXplKSB7XG4gIHN3aXRjaCAoc2l6ZSkge1xuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBcIkNhcnJpZXJcIjtcbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gXCJCYXR0bGVzaGlwXCI7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIFwiRGVzdHJveWVyXCI7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIFwiU3VibWFyaW5lXCI7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIFwiUGF0cm9sIEJvYXRcIjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIFwiSW52YWxpZCBTaGlwIFNpemVcIjtcbiAgfVxufVxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXG5cbi8qIERvY3VtZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxuICovXG5cbmh0bWwge1xuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xuICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cbn1cblxuLyogU2VjdGlvbnNcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbmJvZHkge1xuICBtYXJnaW46IDA7XG59XG5cbi8qKlxuICogUmVuZGVyIHRoZSBcXGBtYWluXFxgIGVsZW1lbnQgY29uc2lzdGVudGx5IGluIElFLlxuICovXG5cbm1haW4ge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBcXGBoMVxcYCBlbGVtZW50cyB3aXRoaW4gXFxgc2VjdGlvblxcYCBhbmRcbiAqIFxcYGFydGljbGVcXGAgY29udGV4dHMgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgU2FmYXJpLlxuICovXG5cbmgxIHtcbiAgZm9udC1zaXplOiAyZW07XG4gIG1hcmdpbjogMC42N2VtIDA7XG59XG5cbi8qIEdyb3VwaW5nIGNvbnRlbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQWRkIHRoZSBjb3JyZWN0IGJveCBzaXppbmcgaW4gRmlyZWZveC5cbiAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxuICovXG5cbmhyIHtcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cbiAgaGVpZ2h0OiAwOyAvKiAxICovXG4gIG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBcXGBlbVxcYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxucHJlIHtcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXG59XG5cbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cbiAqL1xuXG5hIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG5cbi8qKlxuICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXG4gKi9cblxuYWJiclt0aXRsZV0ge1xuICBib3JkZXItYm90dG9tOiBub25lOyAvKiAxICovXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyAvKiAyICovXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHdlaWdodCBpbiBDaHJvbWUsIEVkZ2UsIGFuZCBTYWZhcmkuXG4gKi9cblxuYixcbnN0cm9uZyB7XG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBcXGBlbVxcYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuY29kZSxcbmtiZCxcbnNhbXAge1xuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zbWFsbCB7XG4gIGZvbnQtc2l6ZTogODAlO1xufVxuXG4vKipcbiAqIFByZXZlbnQgXFxgc3ViXFxgIGFuZCBcXGBzdXBcXGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXG4gKiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3ViLFxuc3VwIHtcbiAgZm9udC1zaXplOiA3NSU7XG4gIGxpbmUtaGVpZ2h0OiAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuc3ViIHtcbiAgYm90dG9tOiAtMC4yNWVtO1xufVxuXG5zdXAge1xuICB0b3A6IC0wLjVlbTtcbn1cblxuLyogRW1iZWRkZWQgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmltZyB7XG4gIGJvcmRlci1zdHlsZTogbm9uZTtcbn1cblxuLyogRm9ybXNcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXG4gKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXG4gKi9cblxuYnV0dG9uLFxuaW5wdXQsXG5vcHRncm91cCxcbnNlbGVjdCxcbnRleHRhcmVhIHtcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cbiAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG4gIG1hcmdpbjogMDsgLyogMiAqL1xufVxuXG4vKipcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxuICogMS4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCB7IC8qIDEgKi9cbiAgb3ZlcmZsb3c6IHZpc2libGU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbmhlcml0YW5jZSBvZiB0ZXh0IHRyYW5zZm9ybSBpbiBFZGdlLCBGaXJlZm94LCBhbmQgSUUuXG4gKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXG4gKi9cblxuYnV0dG9uLFxuc2VsZWN0IHsgLyogMSAqL1xuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICovXG5cbmJ1dHRvbixcblt0eXBlPVwiYnV0dG9uXCJdLFxuW3R5cGU9XCJyZXNldFwiXSxcblt0eXBlPVwic3VibWl0XCJdIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBib3JkZXIgYW5kIHBhZGRpbmcgaW4gRmlyZWZveC5cbiAqL1xuXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cImJ1dHRvblwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwicmVzZXRcIl06Oi1tb3otZm9jdXMtaW5uZXIsXG5bdHlwZT1cInN1Ym1pdFwiXTo6LW1vei1mb2N1cy1pbm5lciB7XG4gIGJvcmRlci1zdHlsZTogbm9uZTtcbiAgcGFkZGluZzogMDtcbn1cblxuLyoqXG4gKiBSZXN0b3JlIHRoZSBmb2N1cyBzdHlsZXMgdW5zZXQgYnkgdGhlIHByZXZpb3VzIHJ1bGUuXG4gKi9cblxuYnV0dG9uOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJidXR0b25cIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInJlc2V0XCJdOi1tb3otZm9jdXNyaW5nLFxuW3R5cGU9XCJzdWJtaXRcIl06LW1vei1mb2N1c3Jpbmcge1xuICBvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxuICovXG5cbmZpZWxkc2V0IHtcbiAgcGFkZGluZzogMC4zNWVtIDAuNzVlbSAwLjYyNWVtO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIFxcYGZpZWxkc2V0XFxgIGVsZW1lbnRzIGluIElFLlxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxuICogICAgXFxgZmllbGRzZXRcXGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbmxlZ2VuZCB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cbiAgY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cbiAgZGlzcGxheTogdGFibGU7IC8qIDEgKi9cbiAgbWF4LXdpZHRoOiAxMDAlOyAvKiAxICovXG4gIHBhZGRpbmc6IDA7IC8qIDMgKi9cbiAgd2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCB2ZXJ0aWNhbCBhbGlnbm1lbnQgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXG4gKi9cblxucHJvZ3Jlc3Mge1xuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXG4gKi9cblxudGV4dGFyZWEge1xuICBvdmVyZmxvdzogYXV0bztcbn1cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cbiAqL1xuXG5bdHlwZT1cImNoZWNrYm94XCJdLFxuW3R5cGU9XCJyYWRpb1wiXSB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cbiAgcGFkZGluZzogMDsgLyogMiAqL1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cbiAqL1xuXG5bdHlwZT1cIm51bWJlclwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcbiAgaGVpZ2h0OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxuICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXG4gKi9cblxuW3R5cGU9XCJzZWFyY2hcIl0ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqL1xuICBvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgaW5uZXIgcGFkZGluZyBpbiBDaHJvbWUgYW5kIFNhZmFyaSBvbiBtYWNPUy5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBcXGBpbmhlcml0XFxgIGluIFNhZmFyaS5cbiAqL1xuXG46Oi13ZWJraXQtZmlsZS11cGxvYWQtYnV0dG9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cbiAgZm9udDogaW5oZXJpdDsgLyogMiAqL1xufVxuXG4vKiBJbnRlcmFjdGl2ZVxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLypcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIEVkZ2UsIElFIDEwKywgYW5kIEZpcmVmb3guXG4gKi9cblxuZGV0YWlscyB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnN1bW1hcnkge1xuICBkaXNwbGF5OiBsaXN0LWl0ZW07XG59XG5cbi8qIE1pc2NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxuICovXG5cbnRlbXBsYXRlIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMC5cbiAqL1xuXG5baGlkZGVuXSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL25vZGVfbW9kdWxlcy9ub3JtYWxpemUuY3NzL25vcm1hbGl6ZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsMkVBQTJFOztBQUUzRTsrRUFDK0U7O0FBRS9FOzs7RUFHRTs7QUFFRjtFQUNFLGlCQUFpQixFQUFFLE1BQU07RUFDekIsOEJB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RTs7QUFFRjtFQUNFLGFBQWE7QUFDZlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiEgbm9ybWFsaXplLmNzcyB2OC4wLjEgfCBNSVQgTGljZW5zZSB8IGdpdGh1Yi5jb20vbmVjb2xhcy9ub3JtYWxpemUuY3NzICovXFxuXFxuLyogRG9jdW1lbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGxpbmUgaGVpZ2h0IGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBQcmV2ZW50IGFkanVzdG1lbnRzIG9mIGZvbnQgc2l6ZSBhZnRlciBvcmllbnRhdGlvbiBjaGFuZ2VzIGluIGlPUy5cXG4gKi9cXG5cXG5odG1sIHtcXG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXFxuICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cXG59XFxuXFxuLyogU2VjdGlvbnNcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgbWFyZ2luIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5ib2R5IHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuLyoqXFxuICogUmVuZGVyIHRoZSBgbWFpbmAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXFxuICovXFxuXFxubWFpbiB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgZm9udCBzaXplIGFuZCBtYXJnaW4gb24gYGgxYCBlbGVtZW50cyB3aXRoaW4gYHNlY3Rpb25gIGFuZFxcbiAqIGBhcnRpY2xlYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuaDEge1xcbiAgZm9udC1zaXplOiAyZW07XFxuICBtYXJnaW46IDAuNjdlbSAwO1xcbn1cXG5cXG4vKiBHcm91cGluZyBjb250ZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxcbiAqIDIuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UgYW5kIElFLlxcbiAqL1xcblxcbmhyIHtcXG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94OyAvKiAxICovXFxuICBoZWlnaHQ6IDA7IC8qIDEgKi9cXG4gIG92ZXJmbG93OiB2aXNpYmxlOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnByZSB7XFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cXG4gIGZvbnQtc2l6ZTogMWVtOyAvKiAyICovXFxufVxcblxcbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBvbiBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXFxuICovXFxuXFxuYSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG59XFxuXFxuLyoqXFxuICogMS4gUmVtb3ZlIHRoZSBib3R0b20gYm9yZGVyIGluIENocm9tZSA1Ny1cXG4gKiAyLiBBZGQgdGhlIGNvcnJlY3QgdGV4dCBkZWNvcmF0aW9uIGluIENocm9tZSwgRWRnZSwgSUUsIE9wZXJhLCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmFiYnJbdGl0bGVdIHtcXG4gIGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOyAvKiAyICovXFxuICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZSBkb3R0ZWQ7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5iLFxcbnN0cm9uZyB7XFxuICBmb250LXdlaWdodDogYm9sZGVyO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIENvcnJlY3QgdGhlIG9kZCBgZW1gIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5jb2RlLFxcbmtiZCxcXG5zYW1wIHtcXG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxuc21hbGwge1xcbiAgZm9udC1zaXplOiA4MCU7XFxufVxcblxcbi8qKlxcbiAqIFByZXZlbnQgYHN1YmAgYW5kIGBzdXBgIGVsZW1lbnRzIGZyb20gYWZmZWN0aW5nIHRoZSBsaW5lIGhlaWdodCBpblxcbiAqIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdWIsXFxuc3VwIHtcXG4gIGZvbnQtc2l6ZTogNzUlO1xcbiAgbGluZS1oZWlnaHQ6IDA7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbnN1YiB7XFxuICBib3R0b206IC0wLjI1ZW07XFxufVxcblxcbnN1cCB7XFxuICB0b3A6IC0wLjVlbTtcXG59XFxuXFxuLyogRW1iZWRkZWQgY29udGVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBib3JkZXIgb24gaW1hZ2VzIGluc2lkZSBsaW5rcyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5pbWcge1xcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xcbn1cXG5cXG4vKiBGb3Jtc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ2hhbmdlIHRoZSBmb250IHN0eWxlcyBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gUmVtb3ZlIHRoZSBtYXJnaW4gaW4gRmlyZWZveCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5pbnB1dCxcXG5vcHRncm91cCxcXG5zZWxlY3QsXFxudGV4dGFyZWEge1xcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7IC8qIDEgKi9cXG4gIGZvbnQtc2l6ZTogMTAwJTsgLyogMSAqL1xcbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gIG1hcmdpbjogMDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBTaG93IHRoZSBvdmVyZmxvdyBpbiBJRS5cXG4gKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5pbnB1dCB7IC8qIDEgKi9cXG4gIG92ZXJmbG93OiB2aXNpYmxlO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cXG4gKiAxLiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEZpcmVmb3guXFxuICovXFxuXFxuYnV0dG9uLFxcbnNlbGVjdCB7IC8qIDEgKi9cXG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIHR5cGVzIGluIGlPUyBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmJ1dHRvbixcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl0sXFxuW3R5cGU9XFxcInJlc2V0XFxcIl0sXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uO1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOjotbW96LWZvY3VzLWlubmVyIHtcXG4gIGJvcmRlci1zdHlsZTogbm9uZTtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi8qKlxcbiAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cXG4gKi9cXG5cXG5idXR0b246LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcImJ1dHRvblxcXCJdOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJyZXNldFxcXCJdOi1tb3otZm9jdXNyaW5nLFxcblt0eXBlPVxcXCJzdWJtaXRcXFwiXTotbW96LWZvY3VzcmluZyB7XFxuICBvdXRsaW5lOiAxcHggZG90dGVkIEJ1dHRvblRleHQ7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIHBhZGRpbmcgaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5maWVsZHNldCB7XFxuICBwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIHRleHQgd3JhcHBpbmcgaW4gRWRnZSBhbmQgSUUuXFxuICogMi4gQ29ycmVjdCB0aGUgY29sb3IgaW5oZXJpdGFuY2UgZnJvbSBgZmllbGRzZXRgIGVsZW1lbnRzIGluIElFLlxcbiAqIDMuIFJlbW92ZSB0aGUgcGFkZGluZyBzbyBkZXZlbG9wZXJzIGFyZSBub3QgY2F1Z2h0IG91dCB3aGVuIHRoZXkgemVybyBvdXRcXG4gKiAgICBgZmllbGRzZXRgIGVsZW1lbnRzIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5sZWdlbmQge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgY29sb3I6IGluaGVyaXQ7IC8qIDIgKi9cXG4gIGRpc3BsYXk6IHRhYmxlOyAvKiAxICovXFxuICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cXG4gIHBhZGRpbmc6IDA7IC8qIDMgKi9cXG4gIHdoaXRlLXNwYWNlOiBub3JtYWw7IC8qIDEgKi9cXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cXG4gKi9cXG5cXG5wcm9ncmVzcyB7XFxuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgMTArLlxcbiAqL1xcblxcbnRleHRhcmVhIHtcXG4gIG92ZXJmbG93OiBhdXRvO1xcbn1cXG5cXG4vKipcXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBJRSAxMC5cXG4gKiAyLiBSZW1vdmUgdGhlIHBhZGRpbmcgaW4gSUUgMTAuXFxuICovXFxuXFxuW3R5cGU9XFxcImNoZWNrYm94XFxcIl0sXFxuW3R5cGU9XFxcInJhZGlvXFxcIl0ge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xcbiAgcGFkZGluZzogMDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBjdXJzb3Igc3R5bGUgb2YgaW5jcmVtZW50IGFuZCBkZWNyZW1lbnQgYnV0dG9ucyBpbiBDaHJvbWUuXFxuICovXFxuXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcblt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxuICBoZWlnaHQ6IGF1dG87XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIG9kZCBhcHBlYXJhbmNlIGluIENocm9tZSBhbmQgU2FmYXJpLlxcbiAqIDIuIENvcnJlY3QgdGhlIG91dGxpbmUgc3R5bGUgaW4gU2FmYXJpLlxcbiAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqL1xcbiAgb3V0bGluZS1vZmZzZXQ6IC0ycHg7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxcbiAqL1xcblxcblt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICogMi4gQ2hhbmdlIGZvbnQgcHJvcGVydGllcyB0byBgaW5oZXJpdGAgaW4gU2FmYXJpLlxcbiAqL1xcblxcbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247IC8qIDEgKi9cXG4gIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cXG59XFxuXFxuLyogSW50ZXJhY3RpdmVcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cXG4gKi9cXG5cXG5kZXRhaWxzIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zdW1tYXJ5IHtcXG4gIGRpc3BsYXk6IGxpc3QtaXRlbTtcXG59XFxuXFxuLyogTWlzY1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTArLlxcbiAqL1xcblxcbnRlbXBsYXRlIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxcbiAqL1xcblxcbltoaWRkZW5dIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiLi9pbWFnZXMvc3VubnkuanBnXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18gPSBuZXcgVVJMKFwiZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsPHN2ZyB4bWxucz0lMjdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyUyNyB2ZXJzaW9uPSUyNzEuMSUyNyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSUyN25vbmUlMjcgdmlld0JveD0lMjcwIDAgMTAwIDEwMCUyNz48cGF0aCBkPSUyN00xMDAgMCBMMCAxMDAgJTI3IHN0cm9rZT0lMjdyZWQlMjcgc3Ryb2tlLXdpZHRoPSUyNzUlMjcvPjxwYXRoIGQ9JTI3TTAgMCBMMTAwIDEwMCAlMjcgc3Ryb2tlPSUyN3JlZCUyNyBzdHJva2Utd2lkdGg9JTI3NSUyNy8+PC9zdmc+XCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzJfX18gPSBuZXcgVVJMKFwiLi9pbWFnZXMvb2NlYW4ucG5nXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzFfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8xX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8yX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMl9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCosXG4qOjphZnRlcixcbio6OmJlZm9yZSB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbjpyb290IHtcbiAgLS1kYXJrLWJsdWU6ICM0NjgyYTk7XG4gIC0tYmx1ZTogIzc0OWJjMjtcbiAgLS1saWdodC1ibHVlOiAjOTFjOGU0O1xuICAtLXdoaXRlOiAjZjZmNGViO1xuICAtLWxpZ2h0LXllbGxvdzogI2ZmZjdkNDtcbiAgLS1icm93bjogIzg2MmIwZDtcbiAgLS1saWdodC1ncmVlbjogIzk4ZWVjYztcbiAgLS1saWdodC1waW5rOiAjZmZjYWNjO1xuICAtLWdyZXk6ICM5YmFiYjg7XG4gIC0tcHVycGxlOiAjYmVhZGZhO1xuICAtLXNoaXAtYmxvY2s6IDQwcHg7XG59XG5cbmh0bWwge1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbmJvZHkge1xuICBtaW4taGVpZ2h0OiAxMDB2aDtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZm9udC1mYW1pbHk6IFwiUm9ib3RvXCIsIHNhbnMtc2VyaWY7XG4gIGdyaWQ6XG4gICAgXCJoZWFkZXIgaGVhZGVyIGhlYWRlciBoZWFkZXJcIiBhdXRvXG4gICAgXCJtYWluIG1haW4gbWFpbiBtYWluXCIgMWZyXG4gICAgXCJmb290ZXIgZm9vdGVyIGZvb3RlciBmb290ZXJcIiBhdXRvIC9cbiAgICAxZnIgMWZyIDFmciAxZnI7XG59XG5cbiNoZWFkZXIsXG4jZm9vdGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmx1ZSk7XG59XG5cbiNoZWFkZXIge1xuICBncmlkLWFyZWE6IGhlYWRlcjtcbiAgZm9udC1mYW1pbHk6IFwiWXNhYmVhdSBTQ1wiLCBzYW5zLXNlcmlmO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogNHJlbTtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGV0dGVyLXNwYWNpbmc6IDFweDtcbiAgcGFkZGluZzogMjBweDtcbn1cblxuI21haW4ge1xuICBncmlkLWFyZWE6IG1haW47XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDIwcHg7XG4gIGJhY2tncm91bmQ6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX199KTtcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4uZ3JpZC1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxMDBweDtcbn1cblxuLmNvbXB1dGVyLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbi5wbGF5ZXItY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiAyMHB4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLnBsYXllci10aXRsZSB7XG4gIGZvbnQtZmFtaWx5OiBcIllzYWJlYXUgU0NcIiwgc2Fucy1zZXJpZjtcbiAgZm9udC1zaXplOiAzcmVtO1xuICBmb250LXdlaWdodDogOTAwO1xuICBjb2xvcjogdmFyKC0td2hpdGUpO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGlzb2xhdGlvbjogaXNvbGF0ZTtcbiAgcGFkZGluZzogMjBweDtcbn1cblxuLnBsYXllci10aXRsZTo6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBpbnNldDogMDtcbiAgei1pbmRleDogLTE7XG4gIG9wYWNpdHk6IDAuNztcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcbn1cblxuLnBsYXllci1ib2R5IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiAxMDBweDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5wbGF5ZXItZ3JpZCxcbi5jb21wdXRlci1ncmlkLFxuLnBsYXllci1zaGlwcyB7XG4gIG1pbi13aWR0aDogNDAwcHg7XG4gIG1pbi1oZWlnaHQ6IDQwMHB4O1xuICBvdXRsaW5lOiAzcHggc29saWQgYmxhY2s7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgaXNvbGF0aW9uOiBpc29sYXRlO1xufVxuXG4ucGxheWVyLWdyaWQ6OmFmdGVyLFxuLmNvbXB1dGVyLWdyaWQ6OmFmdGVyLFxuLnBsYXllci1zaGlwczo6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodC1ibHVlKTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBpbnNldDogMDtcbiAgei1pbmRleDogLTE7XG4gIG9wYWNpdHk6IDAuODtcbn1cblxuLnBsYXllci1zaGlwcyB7XG4gIGdhcDogMTBweDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5iaWctc2hpcC1jb250YWluZXIsXG4uZGVzdHJveWVyLWNvbnRhaW5lcixcbi5zdWJtYXJpbmUtY29udGFpbmVyLFxuLnBhdHJvbC1ib2F0LWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogMTBweDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5iaWctc2hpcC1jb250YWluZXIge1xuICBtYXJnaW4tdG9wOiAxMHB4O1xufVxuXG4uc2hpcCB7XG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWRhcmstYmx1ZSk7XG4gIGhlaWdodDogdmFyKC0tc2hpcC1ibG9jayk7XG59XG5cbi5jYXJyaWVyIHtcbiAgd2lkdGg6IGNhbGModmFyKC0tc2hpcC1ibG9jaykgKiA1KTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYnJvd24pO1xufVxuXG4uYmF0dGxlc2hpcCB7XG4gIHdpZHRoOiBjYWxjKHZhcigtLXNoaXAtYmxvY2spICogNCk7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0LWdyZWVuKTtcbn1cblxuLmRlc3Ryb3llciB7XG4gIHdpZHRoOiBjYWxjKHZhcigtLXNoaXAtYmxvY2spICogMyk7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0LXBpbmspO1xufVxuXG4uc3VibWFyaW5lIHtcbiAgd2lkdGg6IGNhbGModmFyKC0tc2hpcC1ibG9jaykgKiAyKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JleSk7XG59XG5cbi5wYXRyb2wtYm9hdCB7XG4gIHdpZHRoOiBjYWxjKHZhcigtLXNoaXAtYmxvY2spICogMSk7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXB1cnBsZSk7XG59XG5cbi5jaGFuZ2UtZGlyZWN0aW9uLFxuLnN0YXJ0LWdhbWUsXG4ucGxheS1hZ2FpbiB7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGZvbnQtZmFtaWx5OiBcIllzYWJlYXUgU0NcIiwgc2Fucy1zZXJpZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XG4gIGNvbG9yOiB2YXIoLS13aGl0ZSk7XG4gIGJvcmRlcjogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xufVxuXG4uY2hhbmdlLWRpcmVjdGlvbiB7XG4gIGZvbnQtc2l6ZTogMC43cmVtO1xuICBwYWRkaW5nOiA1cHg7XG4gIG1hcmdpbi10b3A6IDIwcHg7XG59XG5cbi5zdGFydC1nYW1lLFxuLnBsYXktYWdhaW4ge1xuICBmb250LXNpemU6IDEuNXJlbTtcbiAgcGFkZGluZzogMTBweDtcbn1cblxuLnBsYXktYWdhaW4ge1xuICBkaXNwbGF5OiBub25lO1xuICBtYXJnaW4tdG9wOiAyMDBweDtcbn1cblxuLmdyaWQtcm93IHtcbiAgZmxleDogMTtcbiAgZGlzcGxheTogZmxleDtcbn1cblxuLmdyaWQtY29sIHtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0td2hpdGUpO1xuICBmbGV4OiAxO1xuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDEwMG1zIGVhc2UtaW4tb3V0O1xufVxuXG4uZHJhZy1vdmVyIHtcbiAgYm9yZGVyOiAycHggZGFzaGVkIHJlZDtcbn1cblxuLmNvbXB1dGVyLWdyaWQgLmdyaWQtY29sOmhvdmVyIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ibHVlKTtcbn1cblxuLmdhbWUtd2lubmVyIHtcbiAgZm9udC1zaXplOiAzcmVtO1xuICBjb2xvcjogdmFyKC0td2hpdGUpO1xuICBwYWRkaW5nOiAyMHB4O1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGlzb2xhdGlvbjogaXNvbGF0ZTtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLmdhbWUtd2lubmVyOjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7XG4gIHotaW5kZXg6IC0xO1xuICBpbnNldDogMDtcbiAgb3BhY2l0eTogMC42O1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xufVxuXG4uaGl0LXNoaXAge1xuICBiYWNrZ3JvdW5kOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19ffSk7XG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1zaXplOiAxMDAlIDEwMCUsIGF1dG87XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJlZDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQteWVsbG93KTtcbn1cblxuLmhpdC1taXNzIHtcbiAgYmFja2dyb3VuZDogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMl9fX30pO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodC15ZWxsb3cpO1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1kYXJrLWJsdWUpO1xufVxuXG4uaGlkZSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbiNmb290ZXIge1xuICBncmlkLWFyZWE6IGZvb3RlcjtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBmb250LXdlaWdodDogNzAwO1xufVxuXG4jZm9vdGVyIGEge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGNvbG9yOiB2YXIoLS13aGl0ZSk7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7OztFQUdFLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLG9CQUFvQjtFQUNwQixlQUFlO0VBQ2YscUJBQXFCO0VBQ3JCLGdCQUFnQjtFQUNoQix1QkFBdUI7RUFDdkIsZ0JBQWdCO0VBQ2hCLHNCQUFzQjtFQUN0QixxQkFBcUI7RUFDckIsZUFBZTtFQUNmLGlCQUFpQjtFQUNqQixrQkFBa0I7QUFDcEI7O0FBRUE7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QkFBNEI7RUFDNUIsMkJBQTJCO0VBQzNCLGdDQUFnQztFQUNoQyxxQkFBcUI7RUFDckIscUNBQXFDO0FBQ3ZDOztBQUVBO0VBQ0UsbURBQW1DO0VBQ25DLHFDQUFxQztFQUNyQyxrQ0FBa0M7QUFDcEM7O0FBRUE7RUFDRSxhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLHFCQUFxQjtFQUNyQixtQkFBbUI7QUFDckJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKixcXG4qOjphZnRlcixcXG4qOjpiZWZvcmUge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuOnJvb3Qge1xcbiAgLS1kYXJrLWJsdWU6ICM0NjgyYTk7XFxuICAtLWJsdWU6ICM3NDliYzI7XFxuICAtLWxpZ2h0LWJsdWU6ICM5MWM4ZTQ7XFxuICAtLXdoaXRlOiAjZjZmNGViO1xcbiAgLS1saWdodC15ZWxsb3c6ICNmZmY3ZDQ7XFxuICAtLWJyb3duOiAjODYyYjBkO1xcbiAgLS1saWdodC1ncmVlbjogIzk4ZWVjYztcXG4gIC0tbGlnaHQtcGluazogI2ZmY2FjYztcXG4gIC0tZ3JleTogIzliYWJiODtcXG4gIC0tcHVycGxlOiAjYmVhZGZhO1xcbiAgLS1zaGlwLWJsb2NrOiA0MHB4O1xcbn1cXG5cXG5odG1sIHtcXG4gIGhlaWdodDogMTAwJTtcXG59XFxuXFxuYm9keSB7XFxuICBtaW4taGVpZ2h0OiAxMDB2aDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBmb250LWZhbWlseTogXFxcIlJvYm90b1xcXCIsIHNhbnMtc2VyaWY7XFxuICBncmlkOlxcbiAgICBcXFwiaGVhZGVyIGhlYWRlciBoZWFkZXIgaGVhZGVyXFxcIiBhdXRvXFxuICAgIFxcXCJtYWluIG1haW4gbWFpbiBtYWluXFxcIiAxZnJcXG4gICAgXFxcImZvb3RlciBmb290ZXIgZm9vdGVyIGZvb3RlclxcXCIgYXV0byAvXFxuICAgIDFmciAxZnIgMWZyIDFmcjtcXG59XFxuXFxuI2hlYWRlcixcXG4jZm9vdGVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJsdWUpO1xcbn1cXG5cXG4jaGVhZGVyIHtcXG4gIGdyaWQtYXJlYTogaGVhZGVyO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJZc2FiZWF1IFNDXFxcIiwgc2Fucy1zZXJpZjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGZvbnQtc2l6ZTogNHJlbTtcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBsZXR0ZXItc3BhY2luZzogMXB4O1xcbiAgcGFkZGluZzogMjBweDtcXG59XFxuXFxuI21haW4ge1xcbiAgZ3JpZC1hcmVhOiBtYWluO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBnYXA6IDIwcHg7XFxuICBiYWNrZ3JvdW5kOiB1cmwoLi9pbWFnZXMvc3VubnkuanBnKTtcXG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XFxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4uZ3JpZC1jb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGdhcDogMTAwcHg7XFxufVxcblxcbi5jb21wdXRlci1jb250YWluZXIge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLnBsYXllci1jb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBnYXA6IDIwcHg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5wbGF5ZXItdGl0bGUge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJZc2FiZWF1IFNDXFxcIiwgc2Fucy1zZXJpZjtcXG4gIGZvbnQtc2l6ZTogM3JlbTtcXG4gIGZvbnQtd2VpZ2h0OiA5MDA7XFxuICBjb2xvcjogdmFyKC0td2hpdGUpO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgaXNvbGF0aW9uOiBpc29sYXRlO1xcbiAgcGFkZGluZzogMjBweDtcXG59XFxuXFxuLnBsYXllci10aXRsZTo6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGluc2V0OiAwO1xcbiAgei1pbmRleDogLTE7XFxuICBvcGFjaXR5OiAwLjc7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbn1cXG5cXG4ucGxheWVyLWJvZHkge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGdhcDogMTAwcHg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5wbGF5ZXItZ3JpZCxcXG4uY29tcHV0ZXItZ3JpZCxcXG4ucGxheWVyLXNoaXBzIHtcXG4gIG1pbi13aWR0aDogNDAwcHg7XFxuICBtaW4taGVpZ2h0OiA0MDBweDtcXG4gIG91dGxpbmU6IDNweCBzb2xpZCBibGFjaztcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgaXNvbGF0aW9uOiBpc29sYXRlO1xcbn1cXG5cXG4ucGxheWVyLWdyaWQ6OmFmdGVyLFxcbi5jb21wdXRlci1ncmlkOjphZnRlcixcXG4ucGxheWVyLXNoaXBzOjphZnRlciB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0LWJsdWUpO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgaW5zZXQ6IDA7XFxuICB6LWluZGV4OiAtMTtcXG4gIG9wYWNpdHk6IDAuODtcXG59XFxuXFxuLnBsYXllci1zaGlwcyB7XFxuICBnYXA6IDEwcHg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5iaWctc2hpcC1jb250YWluZXIsXFxuLmRlc3Ryb3llci1jb250YWluZXIsXFxuLnN1Ym1hcmluZS1jb250YWluZXIsXFxuLnBhdHJvbC1ib2F0LWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZ2FwOiAxMHB4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG5cXG4uYmlnLXNoaXAtY29udGFpbmVyIHtcXG4gIG1hcmdpbi10b3A6IDEwcHg7XFxufVxcblxcbi5zaGlwIHtcXG4gIGJvcmRlcjogMnB4IHNvbGlkIHZhcigtLWRhcmstYmx1ZSk7XFxuICBoZWlnaHQ6IHZhcigtLXNoaXAtYmxvY2spO1xcbn1cXG5cXG4uY2FycmllciB7XFxuICB3aWR0aDogY2FsYyh2YXIoLS1zaGlwLWJsb2NrKSAqIDUpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYnJvd24pO1xcbn1cXG5cXG4uYmF0dGxlc2hpcCB7XFxuICB3aWR0aDogY2FsYyh2YXIoLS1zaGlwLWJsb2NrKSAqIDQpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQtZ3JlZW4pO1xcbn1cXG5cXG4uZGVzdHJveWVyIHtcXG4gIHdpZHRoOiBjYWxjKHZhcigtLXNoaXAtYmxvY2spICogMyk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodC1waW5rKTtcXG59XFxuXFxuLnN1Ym1hcmluZSB7XFxuICB3aWR0aDogY2FsYyh2YXIoLS1zaGlwLWJsb2NrKSAqIDIpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZ3JleSk7XFxufVxcblxcbi5wYXRyb2wtYm9hdCB7XFxuICB3aWR0aDogY2FsYyh2YXIoLS1zaGlwLWJsb2NrKSAqIDEpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcHVycGxlKTtcXG59XFxuXFxuLmNoYW5nZS1kaXJlY3Rpb24sXFxuLnN0YXJ0LWdhbWUsXFxuLnBsYXktYWdhaW4ge1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiWXNhYmVhdSBTQ1xcXCIsIHNhbnMtc2VyaWY7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG4gIGNvbG9yOiB2YXIoLS13aGl0ZSk7XFxuICBib3JkZXI6IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbn1cXG5cXG4uY2hhbmdlLWRpcmVjdGlvbiB7XFxuICBmb250LXNpemU6IDAuN3JlbTtcXG4gIHBhZGRpbmc6IDVweDtcXG4gIG1hcmdpbi10b3A6IDIwcHg7XFxufVxcblxcbi5zdGFydC1nYW1lLFxcbi5wbGF5LWFnYWluIHtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgcGFkZGluZzogMTBweDtcXG59XFxuXFxuLnBsYXktYWdhaW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIG1hcmdpbi10b3A6IDIwMHB4O1xcbn1cXG5cXG4uZ3JpZC1yb3cge1xcbiAgZmxleDogMTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxufVxcblxcbi5ncmlkLWNvbCB7XFxuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS13aGl0ZSk7XFxuICBmbGV4OiAxO1xcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAxMDBtcyBlYXNlLWluLW91dDtcXG59XFxuXFxuLmRyYWctb3ZlciB7XFxuICBib3JkZXI6IDJweCBkYXNoZWQgcmVkO1xcbn1cXG5cXG4uY29tcHV0ZXItZ3JpZCAuZ3JpZC1jb2w6aG92ZXIge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmx1ZSk7XFxufVxcblxcbi5nYW1lLXdpbm5lciB7XFxuICBmb250LXNpemU6IDNyZW07XFxuICBjb2xvcjogdmFyKC0td2hpdGUpO1xcbiAgcGFkZGluZzogMjBweDtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGlzb2xhdGlvbjogaXNvbGF0ZTtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5nYW1lLXdpbm5lcjo6YWZ0ZXIge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjaztcXG4gIHotaW5kZXg6IC0xO1xcbiAgaW5zZXQ6IDA7XFxuICBvcGFjaXR5OiAwLjY7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbn1cXG5cXG4uaGl0LXNoaXAge1xcbiAgYmFja2dyb3VuZDogdXJsKFxcXCJkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgdmVyc2lvbj0nMS4xJyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSdub25lJyB2aWV3Qm94PScwIDAgMTAwIDEwMCc+PHBhdGggZD0nTTEwMCAwIEwwIDEwMCAnIHN0cm9rZT0ncmVkJyBzdHJva2Utd2lkdGg9JzUnLz48cGF0aCBkPSdNMCAwIEwxMDAgMTAwICcgc3Ryb2tlPSdyZWQnIHN0cm9rZS13aWR0aD0nNScvPjwvc3ZnPlxcXCIpO1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcXG4gIGJhY2tncm91bmQtc2l6ZTogMTAwJSAxMDAlLCBhdXRvO1xcbiAgYm9yZGVyOiAxcHggc29saWQgcmVkO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQteWVsbG93KTtcXG59XFxuXFxuLmhpdC1taXNzIHtcXG4gIGJhY2tncm91bmQ6IHVybCguL2ltYWdlcy9vY2Vhbi5wbmcpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQteWVsbG93KTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWRhcmstYmx1ZSk7XFxufVxcblxcbi5oaWRlIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbiNmb290ZXIge1xcbiAgZ3JpZC1hcmVhOiBmb290ZXI7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBmb250LXdlaWdodDogNzAwO1xcbn1cXG5cXG4jZm9vdGVyIGEge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgY29sb3I6IHZhcigtLXdoaXRlKTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTtcblxuICAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfVxuXG4gIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbm9ybWFsaXplLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9ub3JtYWxpemUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHtcblx0XHRcdHZhciBpID0gc2NyaXB0cy5sZW5ndGggLSAxO1xuXHRcdFx0d2hpbGUgKGkgPiAtMSAmJiAhc2NyaXB0VXJsKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBcIm5vcm1hbGl6ZS5jc3NcIjtcbmltcG9ydCBcIi4vc3R5bGUuY3NzXCI7XG5pbXBvcnQgZG9tIGZyb20gXCIuL21vZHVsZXMvZG9tXCI7XG5pbXBvcnQgZ2FtZUxvb3BGYWN0b3J5IGZyb20gXCIuL21vZHVsZXMvZ2FtZWxvb3BcIjtcblxuY29uc3QgZ2FtZSA9IGdhbWVMb29wRmFjdG9yeSgpO1xuXG5kb20oZ2FtZSk7XG4iXSwibmFtZXMiOlsiZG9tIiwiZ2FtZSIsImNvbXBsZXRlRG9tR3JpZCIsImNyZWF0ZUNvb3JkaW5hdGVFdmVudCIsImNyZWF0ZURyYWdnYWJsZUV2ZW50cyIsInN3YXBBeGlzIiwiYWRkU3RhcnRHYW1lTGlzdGVuZXIiLCJwbGF5QWdhaW5MaXN0ZW5lciIsInBsYXllckdyaWQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjb21wdXRlckdyaWQiLCJjcmVhdGVEb21HcmlkIiwiZ3JpZCIsInNpemUiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJpIiwibmV3Um93IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsImoiLCJuZXdDb2wiLCJkYXRhc2V0IiwieCIsInkiLCJhcHBlbmRDaGlsZCIsImNvb3JkaW5hdGVzIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJjb29yZGluYXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNvbnRhaW5zIiwicG9zWCIsInBhcnNlSW50IiwicG9zWSIsImNoZWNrV2lubmVyIiwiZ2V0Q3VycmVudFBsYXllck5hbWUiLCJwbGF5ZXJUdXJuIiwiYWRkQ29vcmRpbmF0ZUNsYXNzIiwiZ2V0Q29tcHV0ZXJCb2FyZCIsInVwZGF0ZVBsYXllckdyaWQiLCJjb25zb2xlIiwibG9nIiwiZ2V0UGxheWVyQm9hcmQiLCJnZXRHYW1lQm9hcmQiLCJkaXNwbGF5V2lubmVyIiwiZ2FtZWJvYXJkIiwiaXNTaGlwSGl0dGVkIiwicmVzdWx0IiwiY29tcHV0ZXJUdXJuIiwiY29tcFgiLCJjb21wWSIsInBvc2l0aW9uIiwiaW5kZXgiLCJuZXdDb29yZGluYXRlIiwiZ2FtZVdpbm5lciIsInBsYXlBZ2FpbiIsInRleHRDb250ZW50IiwiZGVjbGFyZVdpbm5lciIsInN0eWxlIiwiZGlzcGxheSIsImdyaWRDb250YWluZXIiLCJzaGlwcyIsInNoaXAiLCJkcmFnU3RhcnQiLCJwbGF5ZXJDb29yZGluYXRlcyIsImRyYWdFbnRlciIsImRyYWdPdmVyIiwiZHJhZ0xlYXZlIiwiZSIsInNoaXBEcm9wIiwiZGF0YVRyYW5zZmVyIiwic2V0RGF0YSIsInRhcmdldCIsImlkIiwicHJldmVudERlZmF1bHQiLCJyZW1vdmUiLCJnZXREYXRhIiwiZHJhZ2dhYmxlIiwiZ2V0RWxlbWVudEJ5SWQiLCJpc0hvcml6b250YWwiLCJncmlkU2l6ZSIsImVuZFBvaW50IiwiaXNPdmVybGFwcGVkIiwiY2hlY2tPdmVybGFwIiwiZGlzcGxheVNoaXAiLCJkaXJlY3Rpb24iLCJwbGFjZVNoaXAiLCJzaGlwTGVuZ3RoIiwic2hpcENvbG9yIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImdldFByb3BlcnR5VmFsdWUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJuZXh0U2libGluZyIsInRvU3RyaW5nIiwiY3VycmVudENvb3JkaW5hdGUiLCJjaGFuZ2VEaXJlY3Rpb24iLCJ3aWR0aCIsImhlaWdodCIsInRvZ2dsZSIsInN0YXJ0R2FtZSIsInBsYXllclNoaXBzIiwiY29tcHV0ZXJDb250YWluZXIiLCJwbGF5ZXJUaXRsZSIsImxvY2F0aW9uIiwicmVsb2FkIiwic2hpcEZhY3RvcnkiLCJnYW1lQm9hcmRGYWN0b3J5IiwiY3JlYXRlR2FtZUJvYXJkR3JpZCIsInNoaXBib2FyZCIsImdldFNoaXBCb2FyZCIsInNoaXBDb3VudCIsIk1hcCIsImdldFNoaXBzIiwibmV3U2hpcCIsInNldCIsImdhbWVCb2FyZFNpemUiLCJpc1NoaXBPdmVybGFwcGVkIiwic2hpcE92ZXJsYXAiLCJyZWNlaXZlQXR0YWNrIiwiZ2V0IiwiaGl0IiwiaXNBbGxTaGlwc1N1bmsiLCJhbGxTaGlwc1N1bmsiLCJyb3ciLCJjb2wiLCJwdXNoIiwibWFwIiwidmFsdWUiLCJldmVyeSIsImlzU3VuayIsInBsYXllckZhY3RvcnkiLCJjb21wdXRlckZhY3RvcnkiLCJnYW1lTG9vcEZhY3RvcnkiLCJwbGF5ZXJHYW1lQm9hcmQiLCJjb21wdXRlckdhbWVCb2FyZCIsInBsYXllciIsImNvbXB1dGVyIiwiaXNQbGF5ZXJUdXJuIiwiZ2V0TmFtZSIsImF0dGFjayIsIm5hbWUiLCJnZW5lcmF0ZUNvb3JkaW5hdGUiLCJnZXRWYWxpZENvb3JkaW5hdGVzIiwicmFuZG9tTnVtYmVyIiwibnVtYmVyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiYXZhaWxhYmxlQ29vcmRpbmF0ZXMiLCJnZXRDb29yZGluYXRlcyIsImhpdHMiLCJnZXRTaGlwTmFtZSIsImdldEhpdHMiXSwic291cmNlUm9vdCI6IiJ9