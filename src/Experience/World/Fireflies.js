import * as THREE from "three";
import Experience from "../Experience";
import firefliesVertexShader from "../Shaders/Fireflies/vertex.glsl";
import firefliesFragmentShader from "../Shaders/Fireflies/fragment.glsl";

export default class Fireflies {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;

    // Setup
    this.count = 30;
    this.positions = new Float32Array(this.count * 3);
    this.scale = new Float32Array(this.count);

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

      this.scale[i] = Math.random() + 0.3;
    }
  }

  setGeometry() {
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3)
    );
    this.geometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(this.scale, 1)
    );
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
      },
      vertexShader: firefliesVertexShader,
      fragmentShader: firefliesFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.material.uniforms.uSize, "value")
        .min(1)
        .max(500)
        .step(1)
        .name("Fireflies size");
    }
  }

  setPoints() {
    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsed * 0.001;
  }
}
