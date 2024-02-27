import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import * as csv from 'csv-parser';
import * as zlib from 'zlib';

@Injectable()
export class CsvParseService {
    private dataParse: Array<string> = [];

    async parseCsv(filePath: string): Promise<Array<string>> {
        return new Promise((resolve, reject) => {
            createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => this.dataParse.push(data))
                .on('end', () => {
                    resolve(this.dataParse);
                })
                .on('error', (error) => {
                    reject(error);
                })
        })
    }

    async parseUncompressedCsv(filePath: string): Promise<Array<string>> {
        const readStream = createReadStream(filePath);
        const gunzip = zlib.createGunzip();
        
        return new Promise((resolve, reject) => {
            readStream
                .pipe(gunzip)
                .pipe(csv())
                .on('data', (data) => this.dataParse.push(data))
                .on('end', () => {
                    resolve(this.dataParse);
                })
                .on('error', (error) => {
                    reject(error);
                })
        })
    }
}
