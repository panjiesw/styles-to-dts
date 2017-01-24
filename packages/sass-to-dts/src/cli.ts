#!/usr/bin/env node

// Heavily based on typed-css-modules by Yosuke Kurami licensed under MIT
// https://github.com/Quramy/typed-css-modules/blob/master/src/cli.js

import * as chalk from 'chalk';
import * as glob from 'glob';
import * as path from 'path';
import * as yargs from 'yargs';
import SassDtsCreator from './index';

const yarg = yargs.usage('Generate .scss.d.ts from scss files')
	.example('sass-dts src/sass', '')
	.example('sass-dts src -o dist', '')
	.example('sass-dts -p sass/**/*.sass -w', '')
	.detectLocale(false)
	.demand(['_'])
	.alias('i', 'includePaths').describe('i', 'Add sass include paths').array('i')
	.alias('c', 'camelCase').describe('c', 'Convert SASS class tokens to camelcase').boolean('c')
	.alias('o', 'outDir').describe('o', 'Output directory')
	.alias('l', 'loader').describe('l', 'Specify the files are to be consumed by css-loader').boolean('l')
	.alias('h', 'help').help('h')
	.version(() => require('../package.json').version);

const argv = yarg.argv;
let creator: SassDtsCreator;

const writeFile = (f: string) => {
	creator.process(f)
		.then((content) => content.writeFile())
		.then((content) => {
			console.log('Wrote ' + chalk.green(content.outputFilePath));
			content.messageList.forEach((message) => {
				console.warn(chalk.yellow('[Warn] ' + message));
			});
		})
		.catch((reason) => console.error(chalk.red('[Error] ' + reason)));
};

const main = () => {
	let rootDir: string;
	let searchDir: string;
	if (argv.h) {
		yarg.showHelp();
		return;
	}

	if (argv._ && argv._[0]) {
		searchDir = argv._[0];
	} else if (argv.p) {
		searchDir = './';
	} else {
		yarg.showHelp();
		return;
	}
	let filesPattern = path.join(searchDir, '**/*.scss');
	rootDir = process.cwd();
	creator = new SassDtsCreator({
		camelCase: argv.c, rootDir, searchDir, includePaths: argv.i, loader: argv.l, outDir: argv.o,
	});

	glob(filesPattern, (err, files) => {
		if (err) {
			console.error(err);
			return;
		}
		if (!files || !files.length) {
			return;
		}
		files.forEach(writeFile);
	});
};

main();
