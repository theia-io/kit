import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(process.env?.['ATLAS_URI'] ?? '', {
      dbName: 'kitouch',
    }),
  ],
  exports: [MongooseModule],
  controllers: [],
})
export class DbModule {}
