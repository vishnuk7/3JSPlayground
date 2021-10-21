import { defineConfig } from 'vite';
import pugPlugin from 'vite-plugin-pug';
import glsl from 'vite-plugin-glsl';

const options = { pretty: true }; // FIXME: pug pretty is deprecated!
const locals = { name: 'My Pug' };

export default defineConfig({
	server: {
		host: true,
	},
	plugins: [glsl(), pugPlugin(options, locals)],
});
