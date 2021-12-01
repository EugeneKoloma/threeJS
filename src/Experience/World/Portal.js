import * as THREE from "three";
import Experience from "../Experience";
import vertexPortalShader from "../Shaders/Portal/vertex.glsl";
import fragmentPortalShader from "../Shaders/Portal/fragment.glsl";

export default class Portal {
  constructor() {
    this.expirience = new Experience();
    this.scene = this.expirience.scene;
    this.resources = this.expirience.resources;
    this.time = this.expirience.time;
    this.debug = this.expirience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Portal");
    }

    // Setup
    this.portalColors = {
      start: "#65bcd9",
      end: "#375570",
    };
    this.resource = this.resources.items["portal"];
    this.texture = this.resources.items["portalTexture"];
    this.texture.flipY = false;
    this.texture.encoding = THREE.sRGBEncoding;

    this.setMaterial();
    this.setModel();
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
    });

    this.poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });
    this.portalLightMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorStart: { value: new THREE.Color(this.portalColors.start) },
        uColorEnd: { value: new THREE.Color(this.portalColors.end) },
      },
      vertexShader: vertexPortalShader,
      fragmentShader: fragmentPortalShader,
    });

    // Debug
    if (this.debug.active) {
      this.debugFolder.addColor(this.portalColors, 'start').name('Portal Color Start').onChange(() => {
        this.portalLightMaterial.uniforms.uColorStart.value.set(this.portalColors.start); 
      });
      this.debugFolder.addColor(this.portalColors, 'end').name('Portal Color End').onChange(() => {
        this.portalLightMaterial.uniforms.uColorEnd.value.set(this.portalColors.end);
      });
    }
  }

  setModel() {
    this.model = this.resource.scene;

    // this.model.traverse((child) => {
    //     child.material = this.material
    // })

    const baked = this.model.children.find((child) => child.name === "baked");
    baked.material = this.material;

    const poleLightAMesh = this.model.children.find(
      (child) => child.name === "poleLightA"
    );
    const poleLightBMesh = this.model.children.find(
      (child) => child.name === "poleLightB"
    );
    const portalLightMesh = this.model.children.find(
      (child) => child.name === "portalLight"
    );

    poleLightAMesh.material = this.poleLightMaterial;
    poleLightBMesh.material = this.poleLightMaterial;
    portalLightMesh.material = this.portalLightMaterial;

    this.scene.add(this.model);
  }

  update() {
    this.portalLightMaterial.uniforms.uTime.value = this.time.elapsed * 0.0009;
  }
}
