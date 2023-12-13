import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@ApiTags('Test')
@Controller('test')
export class TestController {
	// @ApiOperation({ summary: 'Тестовая ручка' })
	// @ApiUnauthorizedResponse({ type: ErrorDto })
	// @UseGuards(AccessTokenGuard)
	@Post()
	checkIn(
		@Req() req: Request,
		@Res({ passthrough: true }) response: Response,
	): string {
		response.cookie('test', 'test value', {
			expires: new Date(Date.now() + 3600000),
		});
		console.log('COOKIES', req.cookies);
		return 'IT WORK';
	}
}
