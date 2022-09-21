import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('MOVIE_PROCESSING')
    private readonly movieProcessioningClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  handleCountNumberEvent(data: number[]) {
    console.log('Reroute request to - MOVIE_PROCESSING', data);
    this.movieProcessioningClient.emit('count_number', data);
  }

  handleCountNumberMessage(data: number[]) {
    console.log('ACS Reroute request to - MOVIE_PROCESSING', data);
    return this.movieProcessioningClient.send('handling_number_count', data);
  }
}
