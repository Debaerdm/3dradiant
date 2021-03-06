import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: '3dradiant',
		file: 'public/build/bundle.js',
	},
	plugins: [
		svelte({
			dev: !production,
			preprocess: sveltePreprocess(),
			css: css => {
				css.write('public/build/bundle.css');
			},
		}),
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),
		typescript({ sourceMap: !production }),
		!production && serve(),
		!production && livereload('public'),
		production && terser(),
	],
	watch: {
		clearScreen: false,
	},
};

function serve() {
	let server;
	
	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			
			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}
