import * as fse from 'fs-extra';

export const checkDirExist = async (directory: string) => {
	try {
		await fse.ensureDirSync(`./${directory}`);
	} catch (error) {
		console.log('Logs folder create.');
	}
};
