export default function shipFactory(size) {
  const length = size;
  let hits = 0;
  const name = getShipName(size);
  const hit = () => {
    if (hits < length) hits++;
  };
  const isSunk = () => !(length > hits);
  const getHits = () => hits;
  const getName = () => name;
  return { hit, isSunk, getHits, getName };
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
