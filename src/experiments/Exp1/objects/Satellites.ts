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
	POINTS_PARAMS: { count: number; radius: number; size: number };
	geometry: BufferGeometry | undefined;
	material: ShaderMaterial | undefined;
	points: Points | undefined;
	pane: Pane;
	scene: Scene | undefined;
	mesh: Points<BufferGeometry, ShaderMaterial> | undefined;
	constructor(options: Ioptions) {
		const { radius, scene, pane } = options;
		this.POINTS_PARAMS = {
			count: 6000,
			radius: 2,
			size: 190,
		};

		this.radius = radius;
		this.scene = scene;
		this.pane = pane;

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

		let N = this.POINTS_PARAMS.count;
		let radius = this.radius + this.POINTS_PARAMS.radius;
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
				uSize: { value: this.POINTS_PARAMS.size },
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
		});

		if (this.points)
			satellite.addInput(this.points, 'visible', {
				label: 'un-hide',
			});

		if (this.material)
			satellite
				.addInput(this.material.uniforms.uSize, 'value', {
					min: 50,
					max: 1500,
					step: 50,
				})
				.on('change', (ev) => {
					if (ev.last) this.generatePoints();
				});

		satellite
			.addInput(this.POINTS_PARAMS, 'count', {
				min: 500,
				max: 20000,
				step: 1,
			})
			.on('change', (ev) => {
				if (ev.last) this.generatePoints();
			});

		satellite
			.addInput(this.POINTS_PARAMS, 'radius', {
				min: 5,
				max: 20,
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
