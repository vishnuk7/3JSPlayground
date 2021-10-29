import { Color, Scene, Vector3 } from 'three';
import { PointCircle } from './object/PointCircle';

import { colorsPalette } from './colors';

interface IOptions {
	scene: Scene;
	width: number;
	height: number;
}

export class SvgCoords {
	svgCount: number;
	pointCircle: PointCircle | undefined;
	scene: Scene;
	height: number;
	width: number;
	constructor(options: IOptions) {
		const { scene, width, height } = options;

		this.scene = scene;
		this.width = width;
		this.height = height;

		/* current svg */
		this.svgCount = 1;

		this.mouseClick();
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

	addImageProcess(src: string) {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = src;
		});
	}

	// fillup(arr: Vector3[], max: number) {
	// 	for (let i = 0; i < max - arr.length; i++) {}
	// }

	async load() {
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

			if (this.pointCircle) {
				this.pointCircle.coords = imgCoords;
				this.pointCircle.foregroundColor = new Color(color.foregroundColor);
				this.pointCircle.backgroundColor = new Color(color.backgroundColor);
				this.pointCircle.init();
				this.scene.background = new Color(color.backgroundColor);
			}
		}
	}

	mouseClick() {
		//TODO: Remove width and height
		const options = {
			coords: [],
			scene: this.scene,
			width: this.width,
			height: this.height,
		};

		this.pointCircle = new PointCircle(options);

		window.addEventListener('click', () => {
			this.svgCount++;
			this.svgCount = this.svgCount % 15 == 0 ? 1 : this.svgCount % 15;

			console.log(this.svgCount);

			this.load();
		});
	}

	update(time: number) {
		if (this.pointCircle) this.pointCircle.update(time);
	}
}
