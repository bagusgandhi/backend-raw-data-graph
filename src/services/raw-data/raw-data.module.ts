import { Module } from '@nestjs/common';
import { RawDataService } from './raw-data.service';
import { RawDataController } from './raw-data.controller';
import { CsvParseModule } from '../csv-parse/csv-parse.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RawData, RawDataSchema } from './schema/raw-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RawData.name, schema: RawDataSchema }]),
    CsvParseModule
  ],
  providers: [RawDataService],
  controllers: [RawDataController]
})
export class RawDataModule {}
