import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial } from 'three';

/* shader */
import vertexShader from '../shader/star/vertex.glsl';
import fragmentShader from '../shader/star/fragment.glsl';

interface Ioption {
	radius: number;
	count: number;
}

export class Star {
	radius: number;
	count: number;
	geometry: BufferGeometry | undefined;
	material: ShaderMaterial | undefined;
	mesh: Points<BufferGeometry, ShaderMaterial> | undefined;
	constructor(options: Ioption) {
		const { radius, count } = options;
		this.radius = radius;
		this.count = count;

		this.addStar();
	}

	addStar() {
		let N = this.count;
		let radius = this.radius * 2.5;
		let position = new Float32Array(N * 3);
		const scales = new Float32Array(N * 1);
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

			scales[i] = Math.random();
		}

		this.geometry.setAttribute('position', new BufferAttribute(position, 3));
		this.geometry.setAttribute('aScale', new BufferAttribute(scales, 1));

		this.material = new ShaderMaterial({
			depthWrite: false,
			blending: AdditiveBlending,
			vertexColors: true,
			uniforms: {
				uTime: { value: 0 },
			},
			transparent: true,
			vertexShader,
			fragmentShader,
		});

		this.mesh = new Points(this.geometry, this.material);
	}

	update(time: number) {
		if (this.material) this.material.uniforms.uTime.value = time;

		if (this.mesh) {
			this.mesh.position.y += Math.sin(time) * 0.2;
			this.mesh.position.y += Math.cos(time) * 0.2;

			this.mesh.position.x += Math.sin(time) * 0.2;
			this.mesh.position.x += Math.cos(time) * 0.2;

			// this.mesh.position.z += Math.cos(time);
			this.mesh.rotation.z += Math.sin(2 * Math.PI) * 0.001;
			this.mesh.rotation.z += Math.cos(2 * Math.PI) * 0.001;
		}
	}
}
