import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Controller } from '@nestjs/common';
import { GetPublicPreview } from '@app/common/contracts';
import { PublicPreviewService } from './publicPreview.service';

@Controller()
export class PublicPreviewController {
	constructor(private readonly publicPreviewService: PublicPreviewService) {}

	@RMQValidate()
	@RMQRoute(GetPublicPreview.topic)
	async getPublicPreview(dto): Promise<GetPublicPreview.Response> {
		return this.publicPreviewService.getPreview();
	}
}
