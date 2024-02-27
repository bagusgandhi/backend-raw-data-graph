import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RawDataDocument = HydratedDocument<RawData>;

@Schema({ collection: "raw_data" })
export class RawData {
    @Prop({ required: true, index: true, type: String, unique: true })
    uid: string;

    @Prop({ type: String })
    enodebId: string;

    @Prop({ type: String })
    cellId: string;

    @Prop({ type: Number })
    availDur: number;

    @Prop({ index: true, type: Date })
    resultTime: Date;
}

export const RawDataSchema = SchemaFactory.createForClass(RawData);
// RawDataSchema.index({ uid: 1 }, { unique: true });