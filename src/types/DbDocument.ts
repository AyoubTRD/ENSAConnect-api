import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { Document } from 'mongoose';

export type DbDocument<T> = T & Document<string, BeAnObject, T>;
