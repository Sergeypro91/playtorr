export const hoursPassed = (
	dayOne: string | number | Date,
	dayTwo: string | number | Date,
): number => {
	return Math.round(
		(new Date(dayOne).getTime() - new Date(dayTwo).getTime()) /
			1000 /
			60 /
			60,
	);
};
