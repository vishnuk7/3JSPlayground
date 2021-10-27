import {
	BoxGeometry,
	Clock,
	Color,
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

import { colorsPalette } from './colors';

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
	svgCount: number;
	pointCircle: PointCircle;

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

		/* current svg */
		this.svgCount = 1;

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

		this.mouseClick();
	}

	addImageProcess(src: string) {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = src;
		});
	}

	fillup(arr: Vector3[], max: number) {
		for (let i = 0; i < max - arr.length; i++) {}
	}

	mouseClick() {
		const options = {
			coords: [],
			scene: this.scene,
		};

		this.pointCircle = new PointCircle(options);

		window.addEventListener('click', () => {
			this.svgCount++;
			this.svgCount = this.svgCount % 15 == 0 ? 1 : this.svgCount % 15;

			console.log(this.svgCount);

			this.test();
		});
	}

	randomShade() {
		const shades = [
			'50',
			'100',
			'200',
			'300',
			'400',
			'500',
			'600',
			'700',
			'800',
			'800',
			'900',
			'a100',
			'a200',
			'a400',
			'a700',
		];
		return shades[Math.floor(Math.random() * shades.length)];
	}

	randomColor() {
		const colorsName = [
			'red',
			'pink',
			'purple',
			'deeppurple',
			'indigo',
			'blue',
			'lightblue',
			'cyan',
			'teal',
			'green',
			'lightgreen',
			'lime',
			'yellow',
			'grey',
			'bluegrey',
		];

		const randColorName = colorsName[Math.floor(Math.random() * colorsName.length)];

		//@ts-ignore
		let backgroundColor = colorsPalette[randColorName]['100'];

		let foregroundColor = undefined;

		while (foregroundColor === undefined) {
			let randShades = this.randomShade();
			if (randShades === '50' || randShades === '100' || randShades === '100') {
				randShades = '200';
			}
			//@ts-ignore
			foregroundColor = colorsPalette[randColorName][randShades];
		}

		return {
			foregroundColor,
			backgroundColor,
		};
	}

	async test() {
		const color = this.randomColor();
		const customCanvas = document.getElementById('svg_canvas') as HTMLCanvasElement;
		const size = customCanvas.width;
		const ctx = customCanvas.getContext('2d');

		const imgCoords: Vector3[] = [];

		const img = (await this.addImageProcess(`./assets/svg/${this.svgCount}.svg`)) as HTMLImageElement;

		if (ctx) {
			ctx.clearRect(0, 0, size, size);
			ctx.drawImage(img, 0, 0, size, size);
			const imgData = ctx.getImageData(0, 0, size, size);
			const data = imgData.data;
			for (let y = 0; y < size; y++) {
				for (let x = 0; x < size; x++) {
					let alpha = data[(y * size + x) * 4 + 3];
					if (alpha > 0 && x % 2 === 0 && y % 2 !== 0) {
						let x1 = 5 * (x - size / 2) * 0.5;
						let y1 = -5 * (y - size / 2) * 0.5;
						imgCoords.push(new Vector3(x1, y1, (size / 5) * (Math.random() - 0.5)));
					}
				}
			}

			// const options = {
			// 	coords: imgCoords,
			// 	scene: this.scene,
			// };

			this.pointCircle.coords = imgCoords;
			this.pointCircle.color = new Color(color.foregroundColor);
			this.pointCircle.init();
			this.scene.background = new Color(color.backgroundColor);
		}
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

		if (this.pointCircle) this.pointCircle.update(this.time);

		this.controller.update();
		window.requestAnimationFrame(() => this.tick());

		this.renderer.render(this.scene, this.camera);
	}
}
