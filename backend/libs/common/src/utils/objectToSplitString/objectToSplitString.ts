export const objectToSplitString = (obj: unknown, splitter = '|') => {
	return Object.entries(obj).reduce(
		(acc, [key, val]) => acc.concat(`${key}=${val} ${splitter} `),
		'',
	);
};
