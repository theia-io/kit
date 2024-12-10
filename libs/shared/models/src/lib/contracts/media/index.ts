import { ISizeCalculationResult } from 'image-size/dist/types/interface';

export type SupportedImageTypes = 'avif' | 'webp' | 'jpg' | 'jpeg' | 'png';

export interface ContractUploadedMedia {
  height: ISizeCalculationResult['height'];
  width: ISizeCalculationResult['width'];
  url: string;
  optimizedUrls: Array<string>;
}
