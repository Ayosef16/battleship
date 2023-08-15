import "normalize.css";
import "./style.css";
import {
  completeDomGrid,
  createCoordinateEvent,
  createDraggableEvents,
} from "./modules/dom";
import gameLoopFactory from "./modules/gameloop";

const game = gameLoopFactory();

completeDomGrid();
createCoordinateEvent(game);
createDraggableEvents();
