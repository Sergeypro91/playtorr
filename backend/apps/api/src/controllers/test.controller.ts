import {
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ErrorDto } from '@app/contracts';
import { JwtAuthGuard } from '../guards';

@ApiTags('Test')
@Controller('test')
export class TestController {
	@ApiOperation({ summary: 'Тестовая ручка' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@UseGuards(JwtAuthGuard)
	@Get()
	async checkIn() {
		return 'IT WORK';
	}
}
