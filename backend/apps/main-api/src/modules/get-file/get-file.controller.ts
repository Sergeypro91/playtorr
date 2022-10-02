import { Controller, Get, Param } from '@nestjs/common';
import { GetFileService } from './get-file.service';
import { IdValidationPipe } from '../../utils/pipes/id-validation.pipe';

@Controller('get-file')
export class GetFileController {
	constructor(private readonly getFileService: GetFileService) {}

	@Get(':name')
	getFile(@Param('name') name: string) {
		return this.getFileService.downloadFile(name);
	}
}
