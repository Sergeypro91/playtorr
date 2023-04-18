import { ApiError } from '@app/common';
import { HttpStatus } from '@nestjs/common';

export const promiseAllSettledHandle = async (data: Promise<unknown>[]) => {
	const result = await Promise.allSettled(data).then((response) => {
		return response.map(
			(elem) => elem['value'] || new Error('Bad request'),
		);
	});

	result.some((elem) => {
		if (elem instanceof Error) {
			throw new ApiError(
				HttpStatus.BAD_REQUEST,
				'Request to TMDB is failed',
			);
		}
	});

	return result;
};
