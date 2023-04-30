import fs from 'fs-extra';

export const getFileSize = (path: string) => {
	return fs.existsSync(path) ? fs.statSync(path).size : 0;
};
