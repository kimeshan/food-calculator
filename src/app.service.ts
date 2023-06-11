import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Food Calculator API! To contribute, visit: https://github.com/kimeshan/food-calculator';
  }
}
