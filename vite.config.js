import { defineConfig } from 'vite';
import pugPlugin from 'vite-plugin-pug';
import glsl from 'vite-plugin-glsl';
import { resolve } from 'path';

const options = { pretty: true }; // FIXME: pug pretty is deprecated!
const locals = { name: 'My Pug' };

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				exp1: resolve(__dirname, 'src/experiments/Exp1/index.html'),
			},
		},
	},
	define: {
		'process.env': {},
	},
	server: {
		host: true,
	},
	plugins: [glsl(), pugPlugin(options, locals)],
});
