import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class GetRawDto {
    @IsOptional()
    @IsString()
    startDate?: string;

    @IsOptional()
    @IsString()
    endDate?: string;

    @IsOptional()
    @IsString()
    enodebId?: string;

    @IsOptional()
    @IsString()
    cellId?: string;
}