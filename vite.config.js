import { dependencies } from './package.json';
import { defineConfig } from 'vite';

import pugPlugin from 'vite-plugin-pug';
import glsl from 'vite-plugin-glsl';
const { resolve } = require('path');

// function renderChunks(deps) {
// 	let chunks = {};
// 	Object.keys(deps).forEach((key) => {
// 		if (['postprocessing'].includes(key)) return;
// 		chunks[key] = [key];
// 	});
// 	return chunks;
// }

function inputEntries() {
	let entries = {};
	let noOfExperiments = 2;
	for (let i = 1; i <= noOfExperiments; i++) {
		const path = resolve(__dirname, `src/experiments/Exp${i}/index.html`);
		entries[`exp${i}`] = path;
	}

	return entries;
}

const options = { pretty: true }; // FIXME: pug pretty is deprecated!
const locals = { name: 'My Pug' };

const mainInput = {
	main: resolve(__dirname, 'index.html'),
};

const input = { ...mainInput, ...inputEntries() };

export default defineConfig({
	build: {
		rollupOptions: {
			input,
		},
		minify: true,
	},
	// define: {
	// 	'process.env': {},
	// },
	server: {
		host: true,
	},
	plugins: [glsl(), pugPlugin(options, locals)],
});
