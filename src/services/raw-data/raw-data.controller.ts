import { BadRequestException, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CsvFileInterceptor } from 'src/interceptors/csv-file.interceptor';
import { RawDataService } from './raw-data.service';
import { GetRawDto } from './dto/get-raw-data.dto';

@Controller('raw-data')
export class RawDataController {
    constructor(
        private readonly rawDataService: RawDataService
    ) { }

    @Get('graph')
    async graph(@Query() queryParams: GetRawDto) {
        const result = await this.rawDataService.getRawData(queryParams);
        return result;
    }

    @Post('upload')
    @UseInterceptors(CsvFileInterceptor)
    async upload(@UploadedFile() file: Express.Multer.File) {
        if(file.mimetype === 'application/zip') return await this.rawDataService.extractAndFindCsv(file.path);

        if(file.mimetype === 'text/csv' || file.mimetype === 'application/gzip') return await this.rawDataService.processRawData(file.path);
    }
}
