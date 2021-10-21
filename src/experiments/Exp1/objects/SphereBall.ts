import { Mesh, Scene, ShaderMaterial, SphereGeometry } from 'three';
import { Pane } from 'tweakpane';

/* shader */
import vertexShader from '../shader/sphere/vertex.glsl';
import fragmentShader from '../shader/sphere/fragment.glsl';

interface Ioptions {
	radius: number;
	segment: number;
	pane: Pane;
	scene: Scene;
}

export class SphereBall {
	geometry: SphereGeometry;
	material: ShaderMaterial;
	mesh: Mesh;
	private pane: Pane;
	scene: Scene;
	params: { hide: boolean };
	constructor(options: Ioptions) {
		const { radius, segment, pane, scene } = options;

		this.scene = scene;

		this.geometry = new SphereGeometry(radius, segment, segment);
		this.material = new ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uFreq: { value: 0.095 },
				uSize: { value: 2000.0 },
			},
			vertexShader,
			fragmentShader,
		});
		this.mesh = new Mesh(this.geometry, this.material);
		this.scene.add(this.mesh);
		this.mesh.visible = !false;

		this.params = {
			hide: false,
		};

		this.pane = pane;
		this.settingGUI();
	}
	private settingGUI() {
		const sphereGUI = this.pane.addFolder({
			title: 'Sphere',
		});

		sphereGUI.addInput(this.params, 'hide').on('change', (ev) => {
			this.mesh.visible = !ev.value;
		});

		sphereGUI.addInput(this.material.uniforms.uFreq, 'value', {
			label: 'frequency',
			min: 0.01,
			max: 0.9,
			step: 0.0001,
		});
	}

	update(time: number) {
		this.material.uniforms.uTime.value = time;
	}
}
