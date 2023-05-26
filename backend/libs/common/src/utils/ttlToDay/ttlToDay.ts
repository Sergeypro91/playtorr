export const ttlToDay = (ttl: number): number => {
	return Math.round(ttl / 60 / 60 / 24);
};
