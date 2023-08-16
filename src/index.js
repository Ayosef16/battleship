import "normalize.css";
import "./style.css";
import dom from "./modules/dom";
import gameLoopFactory from "./modules/gameloop";

const game = gameLoopFactory();

dom(game);
