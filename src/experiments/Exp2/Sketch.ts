import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Pane } from 'tweakpane';

interface IOption {
	canvas: HTMLCanvasElement;
}

export class Sketch {
	scene: THREE.Scene;
	sizes: { width: number; height: number };
	camera: THREE.PerspectiveCamera;
	canvas: HTMLCanvasElement;
	renderer: THREE.WebGLRenderer;
	isController: boolean;
	controller: OrbitControls;
	pane: Pane;
	paneParams: { [key: string]: string | number | boolean };
	clock: THREE.Clock;
	time: number;
	loadingManger: THREE.LoadingManager;
	textureLoader: THREE.TextureLoader;

	constructor(options: IOption) {
		this.scene = new THREE.Scene();
		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};
		/* camera */
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);
		this.camera.position.set(0, 0, 150);
		this.setFovCamera();
		this.camera.updateProjectionMatrix();

		/* canvas dom */
		this.canvas = options.canvas;

		/* renderer */
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
		});

		this.renderer.setSize(this.sizes.width, this.sizes.height);
		this.isController = true;
		this.controller = new OrbitControls(this.camera, this.canvas);
		this.controller.enableDamping = true;
		this.controller.enabled = false;

		/* loading manager */
		this.loadingManger = new THREE.LoadingManager();

		/* texture loader */
		this.textureLoader = new THREE.TextureLoader(this.loadingManger);

		/* clock */
		this.clock = new THREE.Clock();
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
		console.log('add objects');
	}

	tick() {
		this.time = this.clock.getElapsedTime();

		this.controller.update();
		window.requestAnimationFrame(() => this.tick());

		this.renderer.render(this.scene, this.camera);
	}
}
