import { Sketch } from './Sketch';

/* css */
import './style.css';

const options = {
	canvas: document.getElementById('canvas') as HTMLCanvasElement,
};

new Sketch(options);
