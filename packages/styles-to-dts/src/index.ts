// Copyright (c) 2017 Panjie Setiawan Wicaksono
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as CssDtsCreator from 'typed-css-modules';

export interface ICssDtsCreator {
	create(filePath: string, content?: string | null): Promise<IDtsContent>;
}

export interface IDtsCreatorOpts {
	rootDir?: string;
	searchDir?: string;
	outDir?: string;
	camelCase?: boolean;
}

export interface IDtsContent {
	readonly tokens: string[];
	readonly contents: string[];
	readonly formatted: string;
	readonly messageList: string[];
	readonly outputFilePath: string;
	writeFile(): Promise<IDtsContent>;
}

export interface IDtsPreprocessed {
	filePath: string;
	content: string;
}

abstract class DtsCreator {
	private creator: ICssDtsCreator;
	constructor(options?: IDtsCreatorOpts) {
		this.creator = new CssDtsCreator(options);
	}

	public process: (filePath: string) => Promise<IDtsContent> = (filePath) =>
		this.preprocess(filePath)
			.then((pre) => this.creator.create(pre.filePath, pre.content));

	protected abstract preprocess(filePath: string): Promise<IDtsPreprocessed>;

}

export default DtsCreator;
