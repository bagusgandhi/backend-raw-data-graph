import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRawDto {
    @IsNotEmpty()
    @IsString()
    uid: string;

    @IsNotEmpty()
    @IsString()
    enodebId: string;

    @IsNotEmpty()
    @IsString()
    cellId: string;

    @IsNotEmpty()
    @IsNumber()
    availDur: number;

    @IsNotEmpty()
    @IsDate()
    resultTime: Date;
}