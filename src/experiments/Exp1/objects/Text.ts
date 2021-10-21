import {
	Color,
	FontLoader,
	LoadingManager,
	Mesh,
	RawShaderMaterial,
	Scene,
	ShaderMaterial,
	TextGeometry,
	Texture,
} from 'three';

import { Pane } from 'tweakpane';

/* shader */
import vertexShader from '../shader/text/vertex.glsl';
import fragmentShader from '../shader/text/fragment.glsl';

interface Ioptions {
	loadingManger: LoadingManager;
	pane: Pane;
	scene: Scene;
}

export class TextMesh {
	geometry: TextGeometry | undefined;
	material: RawShaderMaterial;
	params: { name: string; size: number; height: number; color: string };
	scene: Scene;
	mesh: Mesh<TextGeometry, ShaderMaterial> | undefined;
	pane: Pane;
	texture: Texture | undefined;
	fontLoader: FontLoader;

	constructor(options: Ioptions) {
		const { loadingManger, pane, scene } = options;

		this.fontLoader = new FontLoader(loadingManger);
		this.scene = scene;

		this.params = { name: 'Vishnu', size: 60, height: 5, color: '#ffffff' };
		this.pane = pane;

		this.init();
	}

	init() {
		this.fontLoader.load('/static/Exp1/font/Lato.json', (font) => {
			this.geometry = new TextGeometry(this.params.name, {
				font: font,
				size: this.params.size,
				height: this.params.height,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 10,
				bevelSize: 8,
				bevelOffset: 0,
				bevelSegments: 5,
			});

			this.createText();
		});
	}

	createText() {
		if (this.mesh !== undefined || this.mesh !== null) {
			this.geometry?.dispose();
			this.material?.dispose();
			if (this.mesh) this.scene.remove(this.mesh);
		}

		this.material = new ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: {
				uTime: { value: 0 },
				uColor: { value: new Color(this.params.color) },
			},
		});

		this.mesh = new Mesh(this.geometry, this.material);
		this.scene.add(this.mesh);
	}

	update(time: number) {
		if (this.material) this.material.uniforms.uTime.value = time;
	}
}
