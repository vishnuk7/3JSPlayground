import * as THREE from 'three';
import { Effect } from 'postprocessing';

import fragment from '../shader/mouse/fragment.glsl';

export class WaterEffect extends Effect {
	constructor(texture: THREE.Texture) {
		super('WaterEffect', fragment, {
			uniforms: new Map([['uTexture', new THREE.Uniform(texture)]]),
		});
	}
}
