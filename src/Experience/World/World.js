import Experience from "../Experience";
import Environment from './Enviroment';
import Floor from './Floor';
import Fox from './Fox';

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resourses = this.experience.resources

        this.resourses.on('ready', () => {
            // Setup
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
        })
    }

    update() {
        if (this.fox) {
            this.fox.update()
        }
    }
}