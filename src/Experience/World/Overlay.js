import * as THREE from "three";
import Experience from "../Experience";
import { gsap } from "gsap";
import vertexShader from "../Shaders/Overlay/vertex.glsl";
import fragmentShader from "../Shaders/Overlay/fragment.glsl";

export default class Overlay {
  constructor() {
    this.expirience = new Experience();
    this.scene = this.expirience.scene;

    this.setInstance();
  }

  setInstance() {
    this.geometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uAlpha: { value: 1 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  updateOnLoaded() {
    gsap.to(this.material.uniforms.uAlpha, { duration: 2, value: 0 });
  }
}
