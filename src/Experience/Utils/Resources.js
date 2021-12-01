import { gsap } from "gsap";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import EventEmitter from "./EventEmiter";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.progressBar = document.querySelector(".loading-bar");

    this.setLoadingManager();
    this.setLoaders();
    this.setLoading();
  }

  setLoadingManager() {
    this.loadingManager = new THREE.LoadingManager(
      () => {
        if (this.progressBar) {
          gsap.delayedCall(0.5, () => {
            this.progressBar.classList.add("loaded");
            this.progressBar.style.transform = "";
          });
        }
        this.trigger("ready");
      },
      (_, loaded, total) => {
        if (this.progressBar) {
          const progressRation = loaded / total;
          this.progressBar.style.transform = `scaleX(${progressRation})`;
        }
      }
    );
  }

  setLoaders() {
    this.loaders = {};
    this.loaders["gltfLoader"] = new GLTFLoader(this.loadingManager);
    this.loaders["textureLoader"] = new THREE.TextureLoader(
      this.loadingManager
    );
    this.loaders["cubeTextureLoader"] = new THREE.CubeTextureLoader(
      this.loadingManager
    );
    this.loaders["dracoLoader"] = new DRACOLoader(this.loadingManager);
    this.loaders["dracoLoader"].setDecoderPath("/draco/");
  }

  setLoading() {
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders["gltfLoader"].load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders["textureLoader"].load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders["cubeTextureLoader"].load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "dracoGLTF") {
        this.loaders["dracoLoader"].load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
  }
}
