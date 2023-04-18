export const daysPassed = ({
	from = new Date(),
	to = new Date(),
}: {
	from?: string | number | Date;
	to?: string | number | Date;
}): number => {
	return Math.round(
		(new Date(from).getTime() - new Date(to).getTime()) /
			1000 /
			60 /
			60 /
			24,
	);
};
