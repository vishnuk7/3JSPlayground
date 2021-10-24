import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, Scene, ShaderMaterial } from 'three';

/* shader */
import vertexShader from '../shader/satellites/vertex.glsl';
import fragmentShader from '../shader/satellites/fragment.glsl';
import { Pane } from 'tweakpane';

interface Ioptions {
	radius: number;
	scene: Scene;
	pane: Pane;
}

export class Satellites {
	radius: number;
	params: { count: number; radius: number; size: number; hide: boolean };
	geometry: BufferGeometry | undefined;
	material: ShaderMaterial | undefined;
	pane: Pane;
	scene: Scene | undefined;
	mesh: Points<BufferGeometry, ShaderMaterial> | undefined;
	constructor(options: Ioptions) {
		const { radius, scene, pane } = options;

		this.radius = radius;
		this.scene = scene;
		this.pane = pane;

		this.params = {
			count: 6000,
			radius: 2,
			size: 190,
			hide: false,
		};

		this.addSatellites();
		this.settingGUI();
	}

	addSatellites() {
		this.generatePoints();
	}

	private generatePoints() {
		if (this.mesh !== undefined || this.mesh !== null) {
			this.geometry?.dispose();
			this.material?.dispose();
			if (this.mesh && this.scene) this.scene.remove(this.mesh);
		}

		let N = this.params.count;
		let radius = this.radius + this.params.radius;
		let position = new Float32Array(N * 3);
		this.geometry = new BufferGeometry();

		// golden angle in radians
		let inc = Math.PI * (3 - Math.sqrt(5));
		let offset = 2 / N;
		let y = 0;
		let x = 0;
		let z = 0;
		let r = 0;
		let phi = 0;

		for (let i = 0; i < N; i++) {
			y = i * offset - 1 + offset / 2;
			r = Math.sqrt(1 - y * y);

			phi = i * inc;

			x = Math.cos(phi) * r;
			z = Math.sin(phi) * r;

			position[3 * i] = radius * x;
			position[3 * i + 1] = radius * y;
			position[3 * i + 2] = radius * z;
		}

		this.geometry.setAttribute('position', new BufferAttribute(position, 3));

		this.material = new ShaderMaterial({
			depthWrite: false,
			blending: AdditiveBlending,
			vertexColors: true,
			uniforms: {
				uSize: { value: this.params.size },
				uTime: { value: 0 },
			},
			transparent: true,
			vertexShader,
			fragmentShader,
		});

		this.mesh = new Points(this.geometry, this.material);

		if (this.scene) this.scene.add(this.mesh);
	}

	private settingGUI() {
		const satellite = this.pane.addFolder({
			title: 'Satellite',
			expanded: false,
		});

		satellite.addInput(this.params, 'hide').on('change', (ev) => {
			if (this.mesh) this.mesh.visible = !ev.value;
		});

		if (this.material)
			satellite
				.addInput(this.params, 'size', {
					min: 50,
					max: 1500,
					step: 50,
				})
				.on('change', (ev) => {
					if (ev.last) this.generatePoints();
				});

		satellite
			.addInput(this.params, 'count', {
				min: 500,
				max: 20000,
				step: 1,
			})
			.on('change', (ev) => {
				if (ev.last) this.generatePoints();
			});

		satellite
			.addInput(this.params, 'radius', {
				min: 5,
				max: 40,
				step: 1,
			})
			.on('change', (ev) => {
				if (ev.last) this.generatePoints();
			});
	}

	update(time: number) {
		if (this.material) this.material.uniforms.uTime.value = time;
		if (this.mesh) {
			this.mesh.rotation.z += 0.0001;
			this.mesh.rotation.x += 0.0001;
		}
	}
}
