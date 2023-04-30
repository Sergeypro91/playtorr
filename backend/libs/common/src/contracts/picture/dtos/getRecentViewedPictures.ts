import { IsEmail } from 'class-validator';

export class GetRecentViewedPictures {
	@IsEmail()
	email: string;
}
