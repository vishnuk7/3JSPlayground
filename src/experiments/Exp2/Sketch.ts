import {
	BoxGeometry,
	Clock,
	LoadingManager,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
	TextureLoader,
	Vector3,
	WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Pane } from 'tweakpane';
import { PointCircle } from './object/PointCircle';

// import moduleName from '';

interface IOption {
	canvas: HTMLCanvasElement;
}

export class Sketch {
	scene: Scene;
	sizes: { width: number; height: number };
	camera: PerspectiveCamera;
	canvas: HTMLCanvasElement;
	renderer: WebGLRenderer;
	isController: boolean;
	controller: OrbitControls;
	pane: Pane;
	paneParams: { [key: string]: string | number | boolean };
	clock: Clock;
	time: number;
	loadingManger: LoadingManager;
	textureLoader: TextureLoader;

	constructor(options: IOption) {
		this.scene = new Scene();
		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};
		/* camera */
		this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);
		this.camera.position.set(0, 0, 150);
		this.setFovCamera();
		this.camera.updateProjectionMatrix();

		/* canvas dom */
		this.canvas = options.canvas;

		/* renderer */
		this.renderer = new WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
		});

		this.renderer.setSize(this.sizes.width, this.sizes.height);
		this.isController = true;
		this.controller = new OrbitControls(this.camera, this.canvas);
		this.controller.enableDamping = true;
		this.controller.enabled = false;

		/* loading manager */
		this.loadingManger = new LoadingManager();

		/* texture loader */
		this.textureLoader = new TextureLoader(this.loadingManger);

		/* clock */
		this.clock = new Clock();
		this.time = 0;

		/* change the size of canvas when window resized  */
		this.resize();

		/* tick function */
		this.tick();

		/* setting up gui */
		this.pane = new Pane();
		this.paneParams = {
			isController: this.isController,
		};

		this.settingGUI();

		/* add objects */
		this.addObjects();

		this.test();
	}

	addImageProcess(src: string) {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = src;
		});
	}

	async test() {
		const svg = ['apple'];

		const customCanvas = document.getElementById('svg_canvas') as HTMLCanvasElement;
		const size = customCanvas.width;
		const ctx = customCanvas.getContext('2d');

		const imgCoords: Vector3[] = [];

		const img = (await this.addImageProcess('./assets/svg/15.svg')) as HTMLImageElement;

		if (ctx) {
			ctx.drawImage(img, 0, 0, size, size);
			const imgData = ctx.getImageData(0, 0, size, size);
			const data = imgData.data;
			for (let y = 0; y < size; y++) {
				for (let x = 0; x < size; x++) {
					let alpha = data[(y * size + x) * 4 + 3];
					if (alpha > 0 && x % 2 === 0 && y % 2 !== 0) {
						let x1 = 2 * (x - size / 2) * 0.5;
						let y1 = -2 * (y - size / 2) * 0.5;
						imgCoords.push(new Vector3(x1, y1, 2 * (Math.random() - 0.5)));
					}
				}
			}

			const options = {
				coords: imgCoords,
				scene: this.scene,
			};

			new PointCircle(options);
		}

		console.log(this.scene);
	}

	setFovCamera() {
		this.camera.fov = 2 * Math.atan(this.sizes.height / 2 / this.camera.position.z) * (180 / Math.PI);
	}

	resize() {
		window.addEventListener('resize', () => {
			this.sizes.width = window.innerWidth;
			this.sizes.height = window.innerHeight;
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.setFovCamera();
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(this.sizes.width, this.sizes.height);
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		});
	}

	settingGUI() {
		this.pane.addInput(this.controller, 'enabled', {
			label: 'orbital control',
		});
	}

	addObjects() {
		// const geometry = new BoxGeometry(200, 200, 200);
		// const material = new MeshBasicMaterial({
		// 	color: 'red',
		// });
		// const mesh = new Mesh(geometry, material);
		// this.scene.add(mesh);
	}

	tick() {
		this.time = this.clock.getElapsedTime();

		this.controller.update();
		window.requestAnimationFrame(() => this.tick());

		this.renderer.render(this.scene, this.camera);
	}
}
