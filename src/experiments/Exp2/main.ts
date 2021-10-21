import { Sketch } from './Sketch';

/* css */
import './style.css';

const options = {
	canvas: document.getElementById('canvas') as HTMLCanvasElement,
};

const sketch = new Sketch(options);
