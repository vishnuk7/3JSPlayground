import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Pane } from 'tweakpane';

/* shaders */
import raysVertexShader from './shader/rays/vertex.glsl';
import raysFragmentShader from './shader/rays/fragment.glsl';

import sphereVertexShader from './shader/sphere/vertex.glsl';
import sphereFragmentShader from './shader/sphere/fragment.glsl';

import pointsVertexShader from './shader/points/vertex.glsl';
import pointsFragmentShader from './shader/points/fragment.glsl';

/* css */
import './style.css';

interface IOption {
	canvas: HTMLCanvasElement;
}

interface IGeometries {
	planeGeometry?: THREE.PlaneGeometry;
	sphereGeometry?: THREE.SphereGeometry;
	particleGeometry?: THREE.BufferGeometry;
}

interface IMaterials {
	planeMaterial?: THREE.ShaderMaterial;
	sphereMaterial?: THREE.ShaderMaterial;
	particleMaterial?: THREE.ShaderMaterial;
}

interface IMesh {
	plane?: THREE.Mesh;
	sphere?: THREE.Mesh;
	points?: THREE.Points;
}

interface IPOINTS_PARAMS {
	count: number;
	radius: number;
}

class Sketch {
	scene: THREE.Scene;
	sizes: { width: number; height: number };
	camera: THREE.PerspectiveCamera;
	canvas: HTMLCanvasElement;
	renderer: THREE.WebGLRenderer;
	isController: boolean;
	controller: OrbitControls;
	guiConfig: { min: number; max: number; step: number };
	pane: Pane;
	paneParams: { [key: string]: string | number | boolean };
	clock: THREE.Clock;
	time: number;
	materials: { [key: string]: THREE.ShaderMaterial };
	loadingManger: THREE.LoadingManager;
	textureLoader: THREE.TextureLoader;
	textures: THREE.Texture[];
	geometries: IGeometries;
	mesh: IMesh;
	POINTS_PARAMS: IPOINTS_PARAMS;

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

		this.textures = [];

		/* geometries */
		this.geometries = {};

		/* materials */
		this.materials = {};

		/* mesh */
		this.mesh = {};

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
		this.guiConfig = { min: 0, max: 1, step: 0.001 };
		this.settingGUI();

		/* loading textures */
		this.loadTextures();

		/* add objects */
		this.addObjects();
	}

	loadTextures() {
		this.textures.push(this.textureLoader.load('/static/img/noise.jpg'));
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
		/* cube */
		const planeGeometry = new THREE.PlaneGeometry(this.sizes.width, this.sizes.height, 2, 2);
		const planeMaterial = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uTxt1: { value: this.textures[0] },
				uResolution: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) },
			},
			vertexShader: raysVertexShader,
			fragmentShader: raysFragmentShader,
		});
		this.geometries.planeGeometry = planeGeometry;
		this.materials.planeMaterial = planeMaterial;

		const plane = new THREE.Mesh(this.geometries.planeGeometry, this.materials.planeMaterial);
		this.mesh.plane = plane;

		this.scene.add(this.mesh.plane);

		/* gui */
		const background = this.pane.addFolder({
			title: 'Background',
		});
		background.addInput(planeMaterial, 'wireframe');
		background.addInput(plane, 'visible', {
			label: 'un-hide',
		});

		/* sphere */
		const sphereGeometry = new THREE.SphereGeometry(120, 240, 240);
		const sphereMaterial = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uFreq: { value: 0.095 },
				uSize: { value: 2000.0 },
				uTxt1: { value: this.textures[0] },
				uResolution: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) },
			},
			vertexShader: sphereVertexShader,
			fragmentShader: sphereFragmentShader,
		});
		this.materials.sphereMaterial = sphereMaterial;
		this.geometries.sphereGeometry = sphereGeometry;

		const sphere = new THREE.Mesh(this.geometries.sphereGeometry, this.materials.sphereMaterial);
		this.mesh.sphere = sphere;
		this.scene.add(this.mesh.sphere);

		/* gui */
		const sphereGUI = this.pane.addFolder({
			title: 'Sphere',
		});

		sphereGUI.addInput(this.mesh.sphere, 'visible', {
			label: 'un-hide',
		});

		sphereGUI.addInput(this.materials.sphereMaterial.uniforms.uFreq, 'value', {
			label: 'frequency',
			min: 0.01,
			max: 0.9,
			step: 0.0001,
		});

		this.addPoints();
	}

	addPoints() {
		this.POINTS_PARAMS = {
			count: 6000,
			radius: 2,
		};

		this.generatePoints();

		/* gui */
		const satellite = this.pane.addFolder({
			title: 'Satellite',
		});

		if (this.mesh.points)
			satellite.addInput(this.mesh.points, 'visible', {
				label: 'un-hide',
			});

		if (this.materials.sphereMaterial)
			satellite
				.addInput(this.materials.sphereMaterial.uniforms.uSize, 'value', {
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
				max: 2000,
				step: 1,
			})
			.on('change', (ev) => {
				if (ev.last) this.generatePoints();
			});

		if (this.geometries.sphereGeometry)
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

	generatePoints() {
		if (this.mesh['points'] !== undefined || this.mesh['points'] !== null) {
			this.geometries.particleGeometry?.dispose();
			this.materials.particleGeometry?.dispose();
			if (this.mesh.points) this.scene.remove(this.mesh.points);
		}

		if (this.geometries.sphereGeometry) {
			let N = this.POINTS_PARAMS.count;
			let radius = this.geometries.sphereGeometry.parameters.radius + this.POINTS_PARAMS.radius;
			let position = new Float32Array(N * 3);
			const particleGeometry = new THREE.BufferGeometry();

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

			particleGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

			this.geometries.particleGeometry = particleGeometry;

			const particleMaterial = new THREE.ShaderMaterial({
				depthWrite: false,
				blending: THREE.AdditiveBlending,
				vertexColors: true,
				uniforms: {
					uTime: { value: 0 },
				},
				transparent: true,
				vertexShader: pointsVertexShader,
				fragmentShader: pointsFragmentShader,
			});

			this.materials.particleMaterial = particleMaterial;

			const points = new THREE.Points(particleGeometry, particleMaterial);
			this.mesh.points = points;
			this.scene.add(this.mesh.points);
		}
	}

	tick() {
		this.time = this.clock.getElapsedTime();

		/* uniform time for rays */
		if (this.materials.planeMaterial) this.materials.planeMaterial.uniforms.uTime.value = this.time;

		if (this.materials.sphereMaterial) this.materials.sphereMaterial.uniforms.uTime.value = this.time;

		if (this.materials.particleMaterial) this.materials.particleMaterial.uniforms.uTime.value = this.time;

		this.controller.update();
		window.requestAnimationFrame(() => this.tick());
		this.renderer.render(this.scene, this.camera);
	}
}

const options = {
	canvas: document.getElementById('canvas') as HTMLCanvasElement,
};

new Sketch(options);
