import {
	BufferGeometry,
	Color,
	NormalBlending,
	Points,
	Scene,
	ShaderMaterial,
	TextureLoader,
	Vector2,
	Vector3,
} from 'three';

/* shader */
import vertexShader from '../shader/point/vertex.glsl';
import fragmentShader from '../shader/point/fragment.glsl';

import txt from '../assets/svg/1.png';
import circle from '../assets/img/c2.png';

interface IOptions {
	coords: Vector3[];
	scene: Scene;
	width: number;
	height: number;
}

export class PointCircle {
	geometry: BufferGeometry;
	material: ShaderMaterial;

	scene: Scene;
	texture: any;
	coords: Vector3[];
	points: Points<BufferGeometry, ShaderMaterial> | undefined;
	foregroundColor: Color | undefined;
	backgroundColor: Color | undefined;

	constructor(options: IOptions) {
		const { coords, scene, width, height } = options;

		this.texture = new TextureLoader().load(txt);

		this.geometry = new BufferGeometry();
		this.material = new ShaderMaterial({
			// alphaTest: 0.5,
			// depthTest: false,
			depthWrite: false,
			blending: NormalBlending,
			vertexColors: true,
			transparent: true,
			uniforms: {
				uMap: { value: new TextureLoader().load(circle) },
				uTime: { value: 0 },
				uBackgroundColor: { value: new Color() },
				uForegroundColor: { value: new Color() },
				uResolution: { value: new Vector2(width, height) },
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

		if (this.backgroundColor) this.material.uniforms.uBackgroundColor.value = this.backgroundColor;

		if (this.foregroundColor) this.material.uniforms.uForegroundColor.value = this.foregroundColor;

		this.points = new Points(this.geometry, this.material);

		this.scene.add(this.points);
	}

	update(time: number) {
		this.material.uniforms.uTime.value = time;
	}
}
