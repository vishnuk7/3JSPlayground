const { resolve } = require('path');

function inputEntries() {
	let entries = {};
	let noOfExperiments = 2;
	for (let i = 1; i <= noOfExperiments; i++) {
		const path = resolve(__dirname, `src/experiments/Exp${i}/index.html`);
		entries[`exp${i}`] = path;
	}

	return entries;
}

const input = {
	main: resolve(__dirname, 'index.html'),
	...inputEntries(),
};

console.log(input);
