import { Module } from '@nestjs/common';
import { CsvParseService } from './csv-parse.service';

@Module({
    providers: [CsvParseService],
    exports: [CsvParseService]
})
export class CsvParseModule {}
