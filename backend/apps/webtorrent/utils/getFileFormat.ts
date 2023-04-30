export const getFileFormat = (name: string) => {
	const nameArr = name.split('.');

	return nameArr[nameArr.length - 1];
};
