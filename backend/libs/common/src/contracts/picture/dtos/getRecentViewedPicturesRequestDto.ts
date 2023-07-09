import { IsEmail } from 'class-validator';

export class GetRecentViewedPicturesRequestDto {
	@IsEmail()
	email: string;
}
