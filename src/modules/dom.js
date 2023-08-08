// Complete the grid on the website
export default function completeDomGrid() {
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
      newRow.appendChild(newCol);
    }
    grid.appendChild(newRow);
  }
}
