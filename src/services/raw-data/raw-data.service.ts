import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RawData } from './schema/raw-data.schema';
import { Model } from 'mongoose';
import { CsvParseService } from '../csv-parse/csv-parse.service';
import { CreateRawDto } from './dto/create-raw-data.dto';
import * as extract from 'extract-zip';
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'fs';
import * as path from 'path';
import { GetRawDto } from './dto/get-raw-data.dto';

@Injectable()
export class RawDataService {
    private csvPaths: Array<string> = [];
    private parsedCsv: Array<any>;

    constructor(
        @InjectModel(RawData.name) private rawDataModel: Model<RawData>,
        private readonly csvParseService: CsvParseService
    ) { }

    async dirProcessed(dirPath: string) {
        try {
            const files = readdirSync(dirPath);

            for (const file of files) {
                const filePath = path.join(dirPath, file);

                if (statSync(filePath).isDirectory()) {
                    await this.dirProcessed(filePath);

                } else if (path.extname(file) === '.gz' || path.extname(file) === '.csv') {
                    this.csvPaths.push(filePath);

                } else if (path.extname(file) === '.zip') {
                    await this.extractAndFindCsv(filePath);

                }
            }

        } catch (error) {
            unlinkSync(dirPath);
            throw new Error(error.message);
        }
    }

    async extractAndFindCsv(filePath: string) {
        try {
            const temp = filePath.split('.')[0]
            console.log(temp)

            if (!existsSync(temp)) mkdirSync(temp);

            if (path.extname(filePath) === '.zip') await extract(filePath, { dir: path.resolve(temp) })

            const files = readdirSync(temp);

            for (const file of files) {
                const currentFilePath = path.join(temp, file);

                if (statSync(currentFilePath).isDirectory()) {
                    await this.dirProcessed(currentFilePath);

                } else if (path.extname(file) === '.gz' || path.extname(file) === '.csv') {
                    this.csvPaths.push(currentFilePath);

                } else if (path.extname(file) === '.zip') {
                    await this.extractAndFindCsv(currentFilePath);

                }
            }

            console.log(this.csvPaths)
            const promises = this.csvPaths.length && this.csvPaths.map((file: string) => this.processRawData(file))
            await Promise.all(promises);

            return { message: 'file has been uploaded and successfully process' }

        } catch (error) {

            unlinkSync(filePath);

            if (error.name === 'MongoBulkWriteError' && error.code === 11000) {
                const failedInsertsCount = error.result.result.nInserted;
                throw new BadRequestException(`Some data failed to insert. ${failedInsertsCount} documents were not inserted due to duplicated data.`);

            } else {
                throw new Error(error.message);
            }

        }
    }


    async processRawData(filePath: string) {
        try {

            if (path.extname(filePath) === '.gz') {
                this.parsedCsv = await this.csvParseService.parseUncompressedCsv(filePath);
            }

            if (path.extname(filePath) === '.csv') {
                this.parsedCsv = await this.csvParseService.parseCsv(filePath);
            }

            const dataRow = this.parsedCsv && this.parsedCsv.map((item: any) => {
                const resultTime: Date = item['Result Time'] ? new Date(item['Result Time']) : null;
                const availDur: number = item['L.Cell.Avail.Dur'] ? parseInt(item['L.Cell.Avail.Dur']) : null;

                const matchENodeB = item['Object Name'].match(/eNodeB ID=(\d+)/);
                const enodebId: string = matchENodeB ? matchENodeB[1] : null;

                const matchLocalCell = item['Object Name'].match(/Local Cell ID=(\d+)/);
                const cellId: string = matchLocalCell ? matchLocalCell[1] : null;

                const uid: string = `${enodebId}${cellId}${(new Date(item['Result Time']).getTime() / 1000)}`

                const data: CreateRawDto = {
                    uid,
                    availDur,
                    cellId,
                    enodebId,
                    resultTime
                }

                if (data.resultTime) return data;
            });

            await this.rawDataModel.insertMany(dataRow, { ordered: false });

            return { message: 'file has been uploaded and successfully process' }

        } catch (error) {

            unlinkSync(filePath);

            if (error.name === 'MongoBulkWriteError' && error.code === 11000) {
                const failedInsertsCount = error.result.result.nInserted;
                throw new BadRequestException(`Some data failed to insert. ${failedInsertsCount} documents were not inserted due to duplicated data.`);
            } else {
                throw new Error(error.message);
            }
        }
    }

    async getRawData(getRawDto: GetRawDto) {
        try {
            const { enodebId, cellId, startDate, endDate } = getRawDto;
            let query: any = {};

            if (enodebId) {
                query.enodebId = enodebId;
            }

            if (cellId) {
                query.cellId = cellId;
            }

            if (startDate && endDate) {
                query.resultTime = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }

            const data = await this.rawDataModel.find(query);

            const result = data?.map((item: RawData) => ({
                resultTime: item.resultTime,
                availability: ((item.availDur / 900) * 100)
            })) || [];

            return { data: result };

        } catch (error) {
            throw new Error(error.message);
        }
    }
}
