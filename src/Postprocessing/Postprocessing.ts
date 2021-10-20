import { EffectComposer, RenderPass, EffectPass } from 'postprocessing';
import { TouchTexture } from './TouchTexture';
import { WaterEffect } from './WaterEffect ';

interface IOptions {
	renderer: THREE.WebGLRenderer;
	mmas?: number;
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
}

export class Postprocessing {
	effectComposer: any;
	private renderPass: any;
	touchTexture: TouchTexture;
	private waterEffect: WaterEffect;
	private waterPass: any;
	constructor(options: IOptions) {
		const { renderer, mmas, scene, camera } = options;
		this.touchTexture = new TouchTexture({ debug: false });
		this.effectComposer = new EffectComposer(renderer);
		if (mmas) {
			this.effectComposer.multisampling = 4;
		}

		this.renderPass = new RenderPass(scene, camera);

		this.waterEffect = new WaterEffect(this.touchTexture.texture);
		this.waterPass = new EffectPass(camera, this.waterEffect);

		this.renderPass.renderToScreen = false;
		this.waterPass.renderToScreen = true;

		this.effectComposer.addPass(this.renderPass);
		this.effectComposer.addPass(this.waterPass);
	}

	update(getDelta: number) {
		this.touchTexture.update();
		this.effectComposer.render(getDelta);
	}
}
