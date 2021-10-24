import {
	Color,
	DoubleSide,
	LoadingManager,
	Mesh,
	RawShaderMaterial,
	Scene,
	TextGeometry,
	Texture,
	TextureLoader,
} from 'three';

import { Pane } from 'tweakpane';

/* shader */
import vertexShader from '../shader/text/vertex.glsl';
import fragmentShader from '../shader/text/fragment.glsl';
import createTextGeometry from '../../../BnfText';

interface Ioptions {
	loadingManager: LoadingManager;
	pane: Pane;
	scene: Scene;
}

export class TextMesh {
	material: RawShaderMaterial | undefined;
	params: { name: string; size: number; height: number; color: string; hide: boolean };
	scene: Scene;
	mesh: Mesh | undefined;
	pane: Pane;
	texture: Texture | undefined;
	textureLoader: TextureLoader;
	font: string | undefined;
	geometry: TextGeometry | undefined;

	constructor(options: Ioptions) {
		const { loadingManager, pane, scene } = options;

		this.textureLoader = new TextureLoader(loadingManager);
		this.scene = scene;

		this.params = { name: 'Vishnu', size: 60, height: 5, color: '#ffffff', hide: false };
		this.pane = pane;

		this.init();
		this.settingGUI();
	}

	init() {
		this.textureLoader.load('/static/Exp1/font/Lato.png', async (t) => {
			this.texture = t;

			const res = await fetch('/static/Exp1/font/Lato.json');
			const data = await res.text();
			this.font = JSON.parse(data);

			this.createText();
		});
	}

	createText() {
		if (this.geometry !== undefined || this.geometry !== null) {
			this.geometry?.dispose();
			this.material?.dispose();
			if (this.mesh) this.scene.remove(this.mesh);
		}

		//@ts-ignore
		this.geometry = createTextGeometry({
			text: this.params.name,
			font: this.font,
			align: 'left',
			flipY: this.texture?.flipY,
		});

		this.material = new RawShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: {
				map: { value: this.texture },
				color: { value: new Color(0xffffff) },
				opacity: { value: 1 },
				time: { value: 0 },
			},
			transparent: true,
			side: DoubleSide,
		});

		//@ts-ignore
		const layout = this.geometry?.layout;
		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.rotation.z = Math.PI;
		this.mesh.rotation.y = Math.PI;

		this.mesh.scale.set(0.6, 0.6, 0.6);
		this.mesh.position.set(-0.6 * layout.width * 0.5, -0.6 * layout.height * 0.5, 110);
		this.scene.add(this.mesh);
	}

	private settingGUI() {
		const text = this.pane.addFolder({
			title: 'Text',
			expanded: false,
		});

		text.addInput(this.params, 'hide').on('change', (ev) => {
			if (this.mesh) this.mesh.visible = !ev.value;
		});

		text.addInput(this.params, 'name').on('change', (ev) => {
			if (ev.last) {
				this.createText();
			}
		});
	}

	update(time: number) {
		if (this.material) this.material.uniforms.time.value = time;
	}
}
