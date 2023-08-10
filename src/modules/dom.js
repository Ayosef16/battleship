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
      const posX = coordinate.dataset.x;
      const posY = coordinate.dataset.y;
      // Check if it's the player turn
      if (game.getCurrentPlayerName() !== "computer") {
        displayCurrentPlayer(game.getCurrentPlayerName());
        game.playerTurn(posX, posY);
      }

      // Add the respective class to the hitted coordinate
      addCoordinateClass(posX, posY, game.getComputerBoard(), coordinate);

      // Let the computer play as long as it's it turn.
      while (game.getCurrentPlayerName() === "computer") {
        game.computerTurn();
      }
    })
  );
}

function addCoordinateClass(x, y, gameboard, coordinate) {
  if (gameboard.isShipHitted(x, y)) {
    coordinate.classList.add("hit-ship");
  } else {
    coordinate.classList.add("hit-miss");
  }
}

export function displayCurrentPlayer(name) {
  const currentPlayer = document.querySelector(".current-player");
  currentPlayer.textContent = `${name} turn`;
}
