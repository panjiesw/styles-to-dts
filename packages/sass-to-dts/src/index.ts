// Copyright (c) 2017 Panjie Setiawan Wicaksono
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as sass from 'node-sass';
import DtsCreator, { IDtsCreatorOpts, IDtsPreprocessed } from 'styles-to-dts';

export interface ISassDtsCreatorOpts extends IDtsCreatorOpts {
	includePaths?: string[];
	indentedSyntax?: boolean;
	indentType?: string;
	indentWidth?: number;
	linefeed?: string;
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
		} = this.options;
		return new Promise<IDtsPreprocessed>((resolve, reject) => {
			sass.render({
				file,
				includePaths,
				indentedSyntax,
				indentType,
				indentWidth,
				linefeed,
			}, (err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve({ filePath: file, content: result.css.toString() });
				}
			});
		});
	}
}

export default SassDtsCreator;
