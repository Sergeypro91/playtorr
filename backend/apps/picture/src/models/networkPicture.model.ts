import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { INetworkPicture } from '@app/common/interfaces';
import {
	GetNetworkPicturesRequestDto,
	GetNetworkPicturesResponseDto,
} from '@app/common/contracts';

@Schema({ timestamps: true })
export class NetworkPicture extends Document implements INetworkPicture {
	@Prop({ required: true, unique: true, type: GetNetworkPicturesRequestDto })
	networkPictureRequest: GetNetworkPicturesRequestDto;

	@Prop({ required: true, type: GetNetworkPicturesResponseDto })
	networkPictureResponse: GetNetworkPicturesResponseDto;
}

export const NetworkPictureSchema =
	SchemaFactory.createForClass(NetworkPicture);
