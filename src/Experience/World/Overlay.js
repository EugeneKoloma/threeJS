import * as THREE from "three";
import Experience from "../Experience";
import { gsap } from "gsap";

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
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uAlpha;

        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
      `,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  updateOnLoaded() {
    gsap.to(this.material.uniforms.uAlpha, { duration: 3, value: 0 });
  }
}
