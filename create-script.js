// This script generates a "docker-compose.yml" file and a "main.kevs" file
// in the current directory.
// If no command-line argument is given, then the system will contain 5 nodes
// You can change that by specifying another value while calling the script:
//   eg. node create-script.js 15
//
// Once created, you just have to call:
//   eg. docker-compose up

const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');
const kConst = require('kevoree-const');

const DOCKER_COMPOSE_FILE = path.join('docker-compose.yml');
const KEVSCRIPT_FILE = path.join('main.kevs');

function kevsTpl(nodes) {
	return `add ${nodes.join(', ')}: JavascriptNode/LATEST/LATEST
add sync: WSGroup/LATEST/LATEST

attach * sync

set sync.master = 'node0'

network node0.ip.eth0 kevoree-node0
`;
}

let nbNodes = 5;
if (process.argv[2] && process.argv[2].match(/^[\d]+$/)) {
	nbNodes = parseInt(process.argv[2], 10);
}
console.log(`Creating files using ${nbNodes} nodes...`);
console.log();

const COUNT = process.argv[2] || 5;

const dCompose = {
	version: '2',
	services: {}
};
const nodes = [];

for (let count = 0; count < COUNT; count++) {
	const nodeName = `node${count}`;
	const containerName = `kevoree-${nodeName}`;
	nodes.push(nodeName);
	dCompose.services[containerName] = {
		image: 'kevoree/js:base-mosquitto',
		command: `start -m /root/main.kevs -n ${nodeName}`,
		volumes: [
			`${path.resolve(kConst.CONFIG_PATH, '..', 'node_modules')}:/root/.kevoree/node_modules`,
			`${path.resolve('main.kevs')}:/root/main.kevs`
		]
	};

	if (count > 0) {
		dCompose.services[containerName].links = [
			'kevoree-node0'
		];
	}
}

// write main.kevs
fs.writeFileSync(
	KEVSCRIPT_FILE,
	kevsTpl(nodes),
	{ encoding: 'utf8' }
);

console.log(`File "${KEVSCRIPT_FILE}" written.`);

// write docker-compose.yml
fs.writeFileSync(
	DOCKER_COMPOSE_FILE,
	jsYaml.dump(dCompose),
	{ encoding: 'utf8' }
);

console.log(`File "${DOCKER_COMPOSE_FILE}" written.`);
console.log();
console.log('Done.');
