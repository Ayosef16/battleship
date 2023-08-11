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

export function createEventListener(game) {
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
      while (game.getCurrentPlayerName() === "computer") {
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

  // Split the result and transform it to string
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
  const gameWinner = document.querySelector(".game-winner");
  gameWinner.textContent = game.declareWinner();
}
