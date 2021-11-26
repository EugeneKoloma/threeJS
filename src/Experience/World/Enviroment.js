import * as THREE from 'three'
import Experience from "../Experience"

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resourses = this.experience.resources
        this.debug = this.experience.debug

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Environment')
        }

        this.setSunlight()
        this.setEnvironmentMap()
    }

    setSunlight() {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, - 1.25)
        this.scene.add(this.sunLight)

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('lightIntensity')
                .min(0)
                .max(4)
                .step(0.001)

            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('Light X')
                .min(-5)
                .max(5)
                .step(0.01)

            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('Light Y')
                .min(-5)
                .max(5)
                .step(0.01)

            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('Light Z')
                .min(-5)
                .max(5)
                .step(0.01)
        }
    }

    setEnvironmentMap() {
        this.environmentMap = {}
        this.environmentMap['intensity'] = 0.4
        this.environmentMap['texture'] = this.resourses.items['environmentMapTexture']
        this.environmentMap['texture']['encoding'] = THREE.sRGBEncoding

        this.scene.environment = this.environmentMap['texture']

        this.environmentMap['updateMaterials'] = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap['texture']
                    child.material.envMapIntensity = this.environmentMap['intensity']
                    child.material.needsUpdate = true
                }
            })
        }

        this.environmentMap['updateMaterials']()

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}