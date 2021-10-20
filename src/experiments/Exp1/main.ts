import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Pane } from 'tweakpane';

/* css */
import './style.css';
import { Background } from './objects/Background';
import { SphereBall } from './objects/SphereBall';
import { Satellites } from './objects/Satellites';
import { Star } from './objects/Star';
import { Postprocessing } from './Postprocessing/Postprocessing';

interface IOption {
	canvas: HTMLCanvasElement;
}

class Sketch {
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
	effectComposer: Postprocessing | undefined;
	background: Background | undefined;
	sphereBall: SphereBall | undefined;
	satellite: Satellites | undefined;
	star: Star | undefined;

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

		/* add effects */
		this.addEffect();

		/* mouse movement */
		this.mouseMovement();
	}

	addEffect() {
		const options = {
			renderer: this.renderer,
			mmas: 4,
			scene: this.scene,
			camera: this.camera,
		};
		/* post processing */
		this.effectComposer = new Postprocessing(options);
	}

	mouseMovement() {
		window.addEventListener('mousemove', (e) => {
			const point = {
				x: e.clientX / this.sizes.width,
				y: e.clientY / this.sizes.height,
			};
			if (this.effectComposer) this.effectComposer.touchTexture.addPoint(point);
		});
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
		this.pane.addInput(this.controller, 'enabled');
	}

	addObjects() {
		this.addBackground();
		this.addSphere();
		this.addSatellites();
		this.addStar();
	}

	addBackground() {
		const options = {
			width: this.sizes.width,
			height: this.sizes.height,
			segment: 20,
			pane: this.pane,
			textureLoader: this.textureLoader,
		};

		this.background = new Background(options);
		this.scene.add(this.background.mesh);
	}

	addSphere() {
		/* sphere */
		const options = {
			radius: 120,
			segment: 120,
			pane: this.pane,
		};

		this.sphereBall = new SphereBall(options);
		this.scene.add(this.sphereBall.mesh);
	}

	addSatellites() {
		const options = {
			radius: this.sphereBall?.geometry.parameters.radius || 200,
			scene: this.scene,
			pane: this.pane,
		};

		this.satellite = new Satellites(options);
	}

	addStar() {
		const options = {
			radius: this.sphereBall?.geometry.parameters.radius as number,
			count: 200,
		};

		this.star = new Star(options);
		if (this.star.mesh) this.scene.add(this.star.mesh);
	}

	tick() {
		this.time = this.clock.getElapsedTime();

		if (this.background) this.background.update(this.time);

		if (this.sphereBall) this.sphereBall.update(this.time);

		if (this.satellite) this.satellite.update(this.time);

		if (this.star) this.star.update(this.time);

		this.controller.update();
		window.requestAnimationFrame(() => this.tick());

		this.renderer.render(this.scene, this.camera);

		if (this.effectComposer) this.effectComposer.update(this.clock.getDelta());
	}
}

const options = {
	canvas: document.getElementById('canvas') as HTMLCanvasElement,
};

new Sketch(options);
