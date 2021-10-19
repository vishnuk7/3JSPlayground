import THREE, { Texture } from 'three';

interface Ipoint {
	x: number;
	y: number;
}

interface Ipoints extends Ipoint {
	age: number;
	force: number;
	vx: number;
	vy: number;
}

interface Ilast {
	x: number;
	y: number;
}

interface Ioptions {
	debug: boolean;
}

const easeOutSine = (t: number, b: number, c: number, d: number) => {
	return c * Math.sin((t / d) * (Math.PI / 2)) + b;
};

const easeOutQuad = (t: number, b: number, c: number, d: number) => {
	t /= d;
	return -c * t * (t - 2) + b;
};

export class WaterTexture {
	size: number;
	radius: number;
	height: number;
	width: number;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	maxAge: number;
	points: Ipoints[];
	last: Ilast | null;
	texture: THREE.Texture;

	constructor(options: Ioptions) {
		this.size = 15;
		this.points = [];
		this.radius = this.size * 0.1;
		this.width = this.height = this.size;
		this.maxAge = 30;
		this.last = null;

		if (options.debug) {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
			this.radius = this.width * 0.1;
		}

		this.initTexture();
		this.texture = new Texture(this.canvas);
		console.log(options.debug);
		if (options.debug) document.body.append(this.canvas);
	}
	// Initialize our canvas
	initTexture() {
		this.canvas = document.createElement('canvas');
		this.canvas.id = 'WaterTexture';
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		this.clear();
	}
	clear() {
		this.ctx.fillStyle = 'black';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
	addPoint(point: Ipoint) {
		let force = 0;
		let vx = 0;
		let vy = 0;
		const last = this.last;
		if (last) {
			const relativeX = point.x - last.x;
			const relativeY = point.y - last.y;
			// Distance formula
			const distanceSquared = relativeX * relativeX + relativeY * relativeY;
			const distance = Math.sqrt(distanceSquared);
			// Calculate Unit Vector
			vx = relativeX / distance;
			vy = relativeY / distance;

			force = Math.min(distanceSquared * 10000, 1);
		}

		this.last = {
			x: point.x,
			y: point.y,
		};
		this.points.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
	}
	update() {
		this.clear();
		let agePart = 1 / this.maxAge;
		this.points.forEach((point, i) => {
			let slowAsOlder = 1 - point.age / this.maxAge;
			let force = point.force * agePart * slowAsOlder;
			point.x += point.vx * force;
			point.y += point.vy * force;
			point.age += 1;
			if (point.age > this.maxAge) {
				this.points.splice(i, 1);
			}
		});
		this.points.forEach((point) => {
			this.drawPoint(point);
		});

		this.texture.needsUpdate = true;
	}
	drawPoint(point: Ipoints) {
		// Convert normalized position into canvas coordinates
		let pos = {
			x: point.x * this.width,
			y: point.y * this.height,
		};
		const radius = this.radius;
		const ctx = this.ctx;

		let intensity = 1;
		if (point.age < this.maxAge * 0.3) {
			intensity = easeOutSine(point.age / (this.maxAge * 0.3), 0, 1, 1);
		} else {
			intensity = easeOutQuad(1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7), 0, 1, 1);
		}
		intensity *= point.force;

		let red = ((point.vx + 1) / 2) * 255;
		let green = ((point.vy + 1) / 2) * 255;
		// B = Unit vector
		let blue = intensity * 255;
		let color = `${red}, ${green}, ${blue}`;

		let offset = this.width * 5;
		// 1. Give the shadow a high offset.
		ctx.shadowOffsetX = offset;
		ctx.shadowOffsetY = offset;
		ctx.shadowBlur = radius * 1;
		ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

		this.ctx.beginPath();
		this.ctx.fillStyle = 'rgba(255,0,0,1)';
		// 2. Move the circle to the other direction of the offset
		this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
		this.ctx.fill();
	}
}
