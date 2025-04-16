import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Farewell, FarewellDocument } from './schemas';

@Injectable()
export class BeFarewellService {
  constructor(
    @InjectModel(Farewell.name) private bookmarkModel: Model<FarewellDocument>
  ) {}

  getFarewells(profileId: string): any {
    return [];
  }

  getFarewell(farewellId: string): any {
    return null;
  }

  createFarewell(): any {
    return {};
  }

  putFarewell(): any {
    return {};
  }
}
