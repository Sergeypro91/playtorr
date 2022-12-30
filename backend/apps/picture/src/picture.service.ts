import { Injectable } from '@nestjs/common';

@Injectable()
export class PictureService {
  getHello(): string {
    return 'Hello World!';
  }
}
