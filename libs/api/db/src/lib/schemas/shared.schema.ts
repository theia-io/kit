import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Subdocument for UploadedMedia
@Schema({ _id: false })
export class UploadedMedia {
  @Prop({ required: true })
  height: string;

  @Prop({ required: true })
  width: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  optimizedUrls: Array<string>;
}
export const UploadedMediaSchema = SchemaFactory.createForClass(UploadedMedia);
