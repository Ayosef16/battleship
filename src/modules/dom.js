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
      if (coordinate.classList.contains("hit")) return;
      coordinate.classList.add("hit");
      const posX = coordinate.dataset.x;
      const posY = coordinate.dataset.y;
      sendPlayerAttack(posX, posY, game);
      sendComputerAttack(game);
      //   updateGameBoard();
    })
  );
}

function sendPlayerAttack(x, y, game) {
  game.gameTurn(x, y);
}

function sendComputerAttack(game) {
  game.gameTurn();
}

// function updateGameBoard(x,y,gameboard) {
//     if (gameboard[x][y] === 'x')
// }
