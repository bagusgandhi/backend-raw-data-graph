import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RawDataModule } from './services/raw-data/raw-data.module';
import { CsvParseService } from './services/csv-parse/csv-parse.service';
import { CsvParseModule } from './services/csv-parse/csv-parse.module';
import { Env } from './config/env-loader';

const { MONGO_URI } = Env();

@Module({
  imports: [
    RawDataModule,
    CsvParseModule,
    MongooseModule.forRoot(`${MONGO_URI}`),
  ],
  providers: [CsvParseService],
})
export class AppModule { }
