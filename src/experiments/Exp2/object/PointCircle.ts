import { BufferGeometry, Color, Points, Scene, ShaderMaterial, TextureLoader, Vector3 } from 'three';

/* shader */
import vertexShader from '../shader/point/vertex.glsl';
import fragmentShader from '../shader/point/fragment.glsl';

import txt from '../assets/svg/1.png';

interface IOptions {
	coords: Vector3[];
	scene: Scene;
}

export class PointCircle {
	geometry: BufferGeometry;
	material: ShaderMaterial;

	scene: Scene;
	texture: any;
	coords: Vector3[];
	points: Points<BufferGeometry, ShaderMaterial> | undefined;
	color: Color | undefined;

	constructor(options: IOptions) {
		const { coords, scene } = options;

		this.texture = new TextureLoader().load(txt);

		this.geometry = new BufferGeometry();
		this.material = new ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uColor: { value: new Color('#ffffff') },
			},
			vertexShader,
			fragmentShader,
		});

		this.coords = coords;
		this.scene = scene;

		this.init();
	}

	init() {
		if (this.geometry) {
			this.geometry.dispose();
			this.material.dispose();
			if (this.points) this.scene.remove(this.points);
		}

		this.geometry.setFromPoints(this.coords);

		if (this.color) this.material.uniforms.uColor.value = this.color;

		this.points = new Points(this.geometry, this.material);

		this.scene.add(this.points);
	}

	update(time: number) {
		this.material.uniforms.uTime.value = time;
	}
}
