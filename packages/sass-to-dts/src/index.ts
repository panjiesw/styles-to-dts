// Copyright (c) 2017 Panjie Setiawan Wicaksono
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as fs from 'fs';
import * as sass from 'node-sass';
import DtsCreator, { IDtsCreatorOpts, IDtsPreprocessed } from 'styles-to-dts';

export interface ISassDtsCreatorOpts extends IDtsCreatorOpts {
	includePaths?: string[];
	indentedSyntax?: boolean;
	indentType?: string;
	indentWidth?: number;
	linefeed?: string;
	loader?: boolean;
}

class SassDtsCreator extends DtsCreator {
	private options: ISassDtsCreatorOpts;
	constructor(options?: ISassDtsCreatorOpts) {
		super(options);
		this.options = options ? options : {};
	}

	protected preprocess(file: string): Promise<IDtsPreprocessed> {
		const {
			includePaths,
			indentedSyntax,
			indentType,
			indentWidth,
			linefeed,
			loader,
		} = this.options;
		return new Promise<IDtsPreprocessed>((resolve, reject) => {
			const render = (data?: string) => {
				const sassOpts: sass.Options = {
					includePaths,
					indentedSyntax,
					indentType,
					indentWidth,
					linefeed,
				};
				if (data) {
					sassOpts.data = data;
				} else {
					sassOpts.file = file;
				}
				sass.render(sassOpts, (err, result) => {
					if (err) {
						reject(err);
					} else {
						resolve({ filePath: file, content: result.css.toString() });
					}
				});
			};

			if (loader) {
				fs.readFile(file, 'utf8', (err, data) => {
					if (err) {
						reject(err);
					} else {
						render(data.replace(/("|')~\b/, '$1'));
					}
				});
			} else {
				render();
			}
		});
	}
}

export default SassDtsCreator;
