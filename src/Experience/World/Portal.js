import * as THREE from 'three'
import Experience from "../Experience";

export default class Portal {
    constructor() {
        this.expirience = new Experience()
        this.scene = this.expirience.scene
        this.resources = this.expirience.resources

        // Setup
        this.resource = this.resources.items['portal']
        this.texture = this.resources.items['portalTexture']
        this.texture.flipY = false
        this.texture.encoding = THREE.sRGBEncoding

        this.setMaterial()
        this.setModel()
    }

    setMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture
        })

        this.poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })
        this.portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    }

    setModel() {
        this.model = this.resource.scene

        // this.model.traverse((child) => {
        //     child.material = this.material
        // })

        const baked = this.model.children.find((child) => child.name === 'baked')
        baked.material = this.material

        const poleLightAMesh = this.model.children.find((child) => child.name === 'poleLightA')
        const poleLightBMesh = this.model.children.find((child) => child.name === 'poleLightB')
        const portalLightMesh = this.model.children.find((child) => child.name === 'portalLight')

        poleLightAMesh.material = this.poleLightMaterial
        poleLightBMesh.material = this.poleLightMaterial
        portalLightMesh.material = this.portalLightMaterial

        this.scene.add(this.model)
    }
}