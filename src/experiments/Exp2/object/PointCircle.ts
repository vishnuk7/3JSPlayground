import { BufferGeometry, Points, Scene, ShaderMaterial, TextureLoader, Vector3 } from 'three';

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
	constructor(options: IOptions) {
		const { coords, scene } = options;

		this.texture = new TextureLoader().load(txt);

		this.geometry = new BufferGeometry();
		this.material = new ShaderMaterial({
			vertexShader,
			fragmentShader,
		});
		this.coords = coords;
		this.scene = scene;

		this.init();
	}

	init() {
		this.geometry.setFromPoints(this.coords);

		const points = new Points(this.geometry, this.material);

		this.scene.add(points);
	}
}
