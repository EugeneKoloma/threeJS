import Experience from "../Experience";
import Points from "../Points";
import Environment from "./Enviroment";
import Floor from "./Floor";
import Fox from "./Fox";
import Overlay from "./Overlay";
import Portal from "./Portal";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resourses = this.experience.resources;

    this.overlay = new Overlay();

    this.resourses.on("ready", () => {
      // Setup
      // this.floor = new Floor();
      // this.fox = new Fox();
      // this.environment = new Environment();
      this.portal = new Portal();
      this.overlay.updateOnLoaded();
      // this.points = new Points()
    });
  }

  update() {
    if (this.fox) {
      this.fox.update();
    }
    if (this.points) {
      this.points.update()
    }
  }
}
