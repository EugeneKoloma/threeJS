import Experience from "../Experience";
import Environment from "./Enviroment";
import Fireflies from "./Fireflies";
import Overlay from "./Overlay";
import Portal from "./Portal";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resourses = this.experience.resources;

    this.overlay = new Overlay();

    this.resourses.on("ready", () => {
      this.portal = new Portal();
      this.fireflies = new Fireflies();
      this.overlay.updateOnLoaded();
    });
  }

  update() {
    if (this.portal) {
      this.portal.update();
    }
    if (this.fireflies) {
      this.fireflies.update();
    }
  }
}
