import * as THREE from 'three'
import { Raycaster } from 'three';
import Experience from './Experience';

export default class Points {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.sizes = this.experience.sizes
        this.raycaster = new Raycaster()
        this.points = [
            {
                position: new THREE.Vector3(-0.1, 1.2, 1.2),
                element: document.querySelector('.point-0')
            }
        ];
    }

    update() {
        for (const point of this.points) {
            const screenPosition = point.position.clone()
            screenPosition.project(this.camera)

            this.raycaster.setFromCamera(screenPosition, this.camera)
            const intersects = this.raycaster.intersectObjects(this.scene.children, true)

            if (intersects.length === 0) {
                point.element.classList.add('visible')
            } else {
                const intersectionDistance = intersects[0].distance
                const pointDistance = point.position.distanceTo(this.camera.position)
                if (intersectionDistance < pointDistance) {
                    point.element.classList.remove('visible')
                } else {
                    point.element.classList.add('visible')
                }
            }

            const translateX = screenPosition.x * this.sizes.width * 0.5
            const translateY = - screenPosition.y * this.sizes.height * 0.5
            point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
        }
    }
}