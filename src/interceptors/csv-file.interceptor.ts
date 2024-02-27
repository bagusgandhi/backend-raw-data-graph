import { Injectable, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';
import { Env } from 'src/config/env-loader';

const { UPLOAD_FILE_PATH } = Env();

@Injectable()
export class CsvFileInterceptor extends FileInterceptor('files', {
    fileFilter: (req, files, cb) => {
        if (!files.originalname.match(/\.(csv|zip|gz)$/)) {
            return cb(
                new BadRequestException('Only .csv | .zip | *.gz files are allowed!'),
                false
            );
        }
        cb(null, true);
    },
    storage: diskStorage({
        destination: (req, file, cb) => {
            if (!existsSync(UPLOAD_FILE_PATH)) {
                mkdirSync(UPLOAD_FILE_PATH);
            }
            cb(null, UPLOAD_FILE_PATH);
        },
        filename: (req, file, cb) => {
            cb(null, `${uuid()}${extname(file.originalname)}`);
        }
    })
}){}