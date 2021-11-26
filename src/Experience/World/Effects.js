import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import Experience from '../Experience'
import TintShader from './TintShader'
import DisplacementShader from './DisplacementShader'

export default class Effects {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.renderer = this.experience.renderer
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera
        this.time = this.experience.time
        this.resources = this.experience.resources

        this.pass = {}

        // Debug
        this.debug = this.experience.debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Effects')
        }

        this.setRenderTarget()
        this.setInstance()
        this.setPass()
    }

    setRenderTarget() {
        this.renderTarget = new THREE.WebGLMultisampleRenderTarget(
            800,
            600,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                encoding: THREE.sRGBEncoding
            }
        )
    }

    setInstance() {
        this.instance = new EffectComposer(this.renderer.instance, this.renderTarget)
        this.instance.setPixelRatio(this.sizes.pixelRation)
        this.instance.setSize(this.sizes.width, this.sizes.height)
    }

    setPass() {
        this.pass.renderPass = new RenderPass(this.scene, this.camera.instance)
        this.instance.addPass(this.pass.renderPass)

        this.pass.dotScreenPass = new DotScreenPass()
        this.pass.dotScreenPass.enabled = false
        this.instance.addPass(this.pass.dotScreenPass)

        this.pass.glitchPass = new GlitchPass()
        this.pass.glitchPass.enabled = false
        this.instance.addPass(this.pass.glitchPass)

        this.pass.rgbPass = new ShaderPass(RGBShiftShader)
        this.pass.rgbPass.enabled = false
        this.instance.addPass(this.pass.rgbPass)

        this.pass.unrealBloomPass = new UnrealBloomPass()
        this.pass.unrealBloomPass.strength = 0.3
        this.pass.unrealBloomPass.radius = 1
        this.pass.unrealBloomPass.threshold = 0.6
        this.instance.addPass(this.pass.unrealBloomPass)

        this.pass.tintPass = new ShaderPass(TintShader)
        this.pass.tintPass.material.uniforms.uTint.value = new THREE.Vector3(0, 0, 0)
        this.instance.addPass(this.pass.tintPass)

        this.pass.displacementPass = new ShaderPass(DisplacementShader)
        this.pass.displacementPass.material.uniforms.uNormalMap.value = this.resources.items['interfaceNormalMap']
        this.instance.addPass(this.pass.displacementPass)

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.pass.unrealBloomPass, 'enabled')
                .name('Unreal Bloom')

            this.debugFolder
                .add(this.pass.unrealBloomPass, 'strength')
                .min(0)
                .max(2)
                .step(0.001)
                .name('UB strength')

            this.debugFolder
                .add(this.pass.unrealBloomPass, 'radius')
                .min(0)
                .max(2)
                .step(0.001)
                .name('UB radius')

            this.debugFolder
                .add(this.pass.unrealBloomPass, 'threshold')
                .min(0)
                .max(2)
                .step(0.001)
                .name('UB threshold')
                .onChange()

            this.debugFolder
                .add(this.pass.tintPass.uniforms.uTint.value, 'x')
                .min(-1)
                .max(1)
                .step(0.001)
                .name('Red')

            this.debugFolder
                .add(this.pass.tintPass.uniforms.uTint.value, 'y')
                .min(-1)
                .max(1)
                .step(0.001)
                .name('Green')

            this.debugFolder
                .add(this.pass.tintPass.uniforms.uTint.value, 'z')
                .min(-1)
                .max(1)
                .step(0.001)
                .name('Blue')
        }
    }

    resize() {
        this.instance.setPixelRatio(this.sizes.pixelRation)
        this.instance.setSize(this.sizes.width, this.sizes.height)
    }

    update() {
        this.instance.render()
    }
}