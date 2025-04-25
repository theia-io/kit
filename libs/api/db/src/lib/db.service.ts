import { ConfigService } from '@kitouch/be-config';
import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class DBService {
  #mongoose;

  constructor(private configService: ConfigService) {
    this.#mongoose = this.init();
  }

  async init() {
    const connectionString = this.configService.getConfig('atlasUri');

    try {
      return await mongoose.connect(connectionString, { dbName: 'kitouch ' });
    } catch (e) {
      console.error('Cannot establish connection with DB', e);
      return undefined;
    }
  }

  protected db$() {
    // return from(this.#mongoose).pipe(filter(Boolean));
    return this.#mongoose;
  }
}
