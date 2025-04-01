import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://belohadk97:ccFV9bFU5OjwrDGw@kit-dev.gz937gt.mongodb.net?retryWrites=true&w=majority',
      {
        dbName: 'kitouch',
      }
    ),
  ],
  exports: [MongooseModule],
  controllers: [],
})
export class DbModule {}
