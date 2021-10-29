import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, Scene, ShaderMaterial } from 'three';

/* shader */
import vertexShader from '../shader/star/vertex.glsl';
import fragmentShader from '../shader/star/fragment.glsl';
import { Pane } from 'tweakpane';

interface Ioption {
	radius: number;
	count: number;
	pane: Pane;
	scene: Scene;
}

export class Star {
	radius: number;
	count: number;
	geometry: BufferGeometry | undefined;
	material: ShaderMaterial | undefined;
	mesh: Points<BufferGeometry, ShaderMaterial> | undefined;
	pane: Pane;
	scene: Scene;

	params: { count: number; hide: boolean };
	constructor(options: Ioption) {
		const { radius, count, pane, scene } = options;
		this.radius = radius;
		this.count = count;
		this.pane = pane;
		this.scene = scene;

		this.params = { count: 1000, hide: false };

		this.addStar();
		this.settingGUI();
	}

	addStar() {
		if (this.mesh !== undefined || this.mesh !== null) {
			this.geometry?.dispose();
			this.material?.dispose();
			if (this.mesh) this.scene.remove(this.mesh);
		}

		let N = this.params.count;
		let radius = this.radius * 2.5;
		let position = new Float32Array(N * 3);
		const scales = new Float32Array(N * 1);
		let color = new Color();
		const colors = new Float32Array(N * 3);
		this.geometry = new BufferGeometry();

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

			color.setHSL(i / N, 1.0, 0.5);

			colors[3 * i] = color.r;
			colors[3 * i + 1] = color.g;
			colors[3 * i + 2] = color.b;

			scales[i] = Math.random();
		}

		this.geometry.setAttribute('position', new BufferAttribute(position, 3));
		this.geometry.setAttribute('aScale', new BufferAttribute(scales, 1));
		this.geometry.setAttribute('aColors', new BufferAttribute(colors, 3));

		this.material = new ShaderMaterial({
			depthWrite: false,
			blending: AdditiveBlending,
			vertexColors: true,
			transparent: true,
			uniforms: {
				uTime: { value: 0 },
				uAlpha: { value: 0 },
			},
			vertexShader,
			fragmentShader,
		});

		this.mesh = new Points(this.geometry, this.material);
		console.log(this.scene);
		this.scene.add(this.mesh);
	}

	settingGUI() {
		const stars = this.pane.addFolder({
			title: 'Stars',
			expanded: false,
		});

		stars.addInput(this.params, 'hide').on('change', (e) => {
			if (this.mesh) this.mesh.visible = !e.value;
		});

		stars
			.addInput(this.params, 'count', {
				min: 100,
				max: 2000,
				step: 1,
			})
			.on('change', (e) => {
				if (e.last) {
					this.addStar();
				}
			});
	}

	update(time: number) {
		if (this.material) {
			this.material.uniforms.uTime.value = time;
			this.material.uniforms.uAlpha.value += 0.01;
		}
		if (this.mesh) {
			// this.mesh.position.y += Math.sin(time) * 0.2;
			// this.mesh.position.y += Math.cos(time) * 0.2;
			// this.mesh.position.x += Math.sin(time) * 0.2;
			// this.mesh.position.x += Math.cos(time) * 0.2;
			// this.mesh.position.z += Math.cos(time);
			// this.mesh.rotation.z += Math.sin(2 * Math.PI) * 0.001;
			// this.mesh.rotation.z += Math.cos(2 * Math.PI) * 0.001;
		}
	}
}
