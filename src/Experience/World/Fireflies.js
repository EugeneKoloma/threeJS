import * as THREE from "three";
import Experience from "../Experience";
import firefliesVertexShader from "../Shaders/Fireflies/vertex.glsl";
import firefliesFragmentShader from "../Shaders/Fireflies/fragment.glsl";

export default class Fireflies {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    // Setup
    this.count = 30;
    this.positions = new Float32Array(this.count * 3);

    // Debug
    this.debug = this.experience.debug;
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Fireflies");
    }

    this.setPositions();
    this.setGeometry();
    this.setMaterial();
    this.setPoints();
  }

  setPositions() {
    for (let i = 0; i < this.count; i++) {
      this.positions[i * 3 + 0] = (Math.random() - 0.5) * 4;
      this.positions[i * 3 + 1] = Math.random() * 1.5;
      this.positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
  }

  setGeometry() {
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3)
    );
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
      },
      vertexShader: firefliesVertexShader,
      fragmentShader: firefliesFragmentShader,
    });

    // Debug
    if (this.debug.active) {
    }
  }

  setPoints() {
    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }
}
