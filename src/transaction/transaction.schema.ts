import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as SoftDelete from 'mongoose-delete';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  _id?: Types.ObjectId;
  @Prop({ required: true })
  address: string;
  @Prop({ required: true })
  contactName: string;
  @Prop({ required: true })
  contactPhone: string;
  @Prop({ required: true })
  reference: string;
  @Prop({ required: true })
  userId: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.plugin(SoftDelete, { deletedAt: true });
