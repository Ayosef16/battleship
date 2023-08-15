// Complete the grid on the website
export function completeDomGrid() {
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

export function createCoordinateEvent(game) {
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
        displayCurrentPlayer(game.getCurrentPlayerName());
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

// Display the name of the current player
export function displayCurrentPlayer(name) {
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
  gameWinner.textContent = game.declareWinner();
  gameWinner.style.display = "block";

  // Hide the grids
  const gridContainer = document.querySelector(".grid-container");
  gridContainer.style.display = "none";
}

// Create draggable events

export function createDraggableEvents() {
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
