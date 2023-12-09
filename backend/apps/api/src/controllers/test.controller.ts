import {
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ErrorDto } from '@app/common';
import { JwtGuard } from '../guards';
import { Request, Response } from 'express';

@ApiTags('Test')
@Controller('test')
export class TestController {
	// @ApiOperation({ summary: 'Тестовая ручка' })
	// @ApiUnauthorizedResponse({ type: ErrorDto })
	// @UseGuards(JwtGuard)
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
