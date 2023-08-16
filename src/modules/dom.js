export default function dom(game) {
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

function createDomGrid(grid, size = 10) {
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
  coordinates.forEach((coordinate) =>
    coordinate.addEventListener("click", () => {
      if (
        coordinate.classList.contains("hit-ship") ||
        coordinate.classList.contains("hit-miss")
      )
        return;
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
      while (
        game.getCurrentPlayerName() === "computer" &&
        !game.checkWinner()
      ) {
        updatePlayerGrid(game);
        console.log(game.getPlayerBoard().getGameBoard());
      }

      // Check if someone have won
      if (game.checkWinner()) {
        displayWinner(game);
      }
    })
  );
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
  const { compX, compY } = result;

  // Get the index on the node list that represent the current coordinate
  let position;
  coordinates.forEach((coordinate, index) => {
    if (
      parseInt(coordinate.dataset.x, 10) === compX &&
      parseInt(coordinate.dataset.y, 10) === compY
    ) {
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
  ships.forEach((ship) => {
    ship.addEventListener("dragstart", dragStart);
  });

  // Get all the player grid col
  const playerCoordinates = document.querySelectorAll(".player-grid .grid-col");
  playerCoordinates.forEach((coordinate) => {
    coordinate.addEventListener("dragenter", dragEnter);
    coordinate.addEventListener("dragover", dragOver);
    coordinate.addEventListener("dragleave", dragLeave);
    coordinate.addEventListener("drop", (e) => {
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
  let { x } = e.target.dataset;
  let { y } = e.target.dataset;
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
function displayShip(x, y, ship, coordinate, direction = true) {
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
      newCoordinate = document.querySelector(
        `[data-x="${(i + 1).toString()}"][data-y="${y.toString()}"]`
      );
    }
  }

  ship.remove();
}

// Check if the ship overlaps with one another
function checkOverlap(x, y, length, coordinate, direction = true) {
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
      currentCoordinate = document.querySelector(
        `[data-x="${(i + 1).toString()}"][data-y="${y.toString()}"]`
      );
    }
  }
  return false;
}

function swapAxis() {
  const changeDirection = document.querySelector(".change-direction");
  changeDirection.addEventListener("click", () => {
    const ships = document.querySelectorAll(".ship");
    ships.forEach((ship) => {
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
