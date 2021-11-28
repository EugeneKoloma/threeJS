import Experience from "../Experience";
import Environment from "./Enviroment";
import Floor from "./Floor";
import Fox from "./Fox";
import Overlay from "./Overlay";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resourses = this.experience.resources;

    this.overlay = new Overlay();

    this.resourses.on("ready", () => {
      // Setup
      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Environment();
      this.overlay.updateOnLoaded();
    });
  }

  update() {
    if (this.fox) {
      this.fox.update();
    }
  }
}
