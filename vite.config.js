import { defineConfig } from 'vite';
import pugPlugin from 'vite-plugin-pug';
import glsl from 'vite-plugin-glsl';
import fs from 'fs';

const options = { pretty: true }; // FIXME: pug pretty is deprecated!
const locals = { name: 'My Pug' };

export default defineConfig({
	// fallback: {
	// 	buffer: require.resolve('buffer/'),
	// 	fs: require.resolve('fs/'),
	// },
	optimizeDeps: {
		allowNodeBuiltins: ['fs', 'os'],
	},
	define: {
		'process.env': {},
	},
	server: {
		host: true,
	},
	plugins: [
		glsl(),
		pugPlugin(options, locals),
		// new ProvidePlugin({
		// 	process: 'process/browser',
		// 	Buffer: ['buffer', 'Buffer'],
		// }),
	],
});
