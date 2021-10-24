import { Mesh, PlaneGeometry, ShaderMaterial, Texture, TextureLoader, Vector2 } from 'three';
import { Pane } from 'tweakpane';

/* shader */

import vertexShader from '../shader/background/vertex.glsl';
import fragmentShader from '../shader/background/fragment.glsl';

interface Ioptions {
	width: number;
	height: number;
	segment: number;
	pane: Pane;
	textureLoader: TextureLoader;
}

export class Background {
	geometry: PlaneGeometry;
	material: ShaderMaterial;
	mesh: Mesh;
	private texture: Texture;
	private pane: Pane;
	params: { hide: boolean };

	constructor(options: Ioptions) {
		const { width, height, segment, pane, textureLoader } = options;
		this.geometry = new PlaneGeometry(width, height, segment, segment);
		this.texture = textureLoader.load('/static/Exp1/img/noise.jpg');
		this.material = new ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uResolution: { value: new Vector2(width, height) },
				uTxt: { value: this.texture },
			},
			vertexShader,
			fragmentShader,
		});
		this.mesh = new Mesh(this.geometry, this.material);
		this.pane = pane;
		this.params = { hide: false };
		this.settingGUI();
	}

	private settingGUI() {
		const background = this.pane.addFolder({
			title: 'Background',
			expanded: false,
		});
		background.addInput(this.material, 'wireframe');
		background.addInput(this.params, 'hide').on('change', (ev) => {
			this.mesh.visible = !ev.value;
		});
	}

	update(time: number) {
		this.material.uniforms.uTime.value = time;
	}
}
