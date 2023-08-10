import "normalize.css";
import "./style.css";
import {
  completeDomGrid,
  createEventListener,
  displayCurrentPlayer,
} from "./modules/dom";
import gameLoopFactory from "./modules/gameloop";

const game = gameLoopFactory();

completeDomGrid();
createEventListener(game);
displayCurrentPlayer(game.getCurrentPlayerName());
