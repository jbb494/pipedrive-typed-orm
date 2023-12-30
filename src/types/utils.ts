import { Properties } from "./properties";
import { ItemType, PropertyKeys, Schema } from "./schema";

export type IsEmptyObject<T> = keyof T extends never ? true : false;

export type IsRequired<T extends ItemType> = T extends { required: true }
  ? true
  : false;

export type IsAnyFieldRequired<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : true;
}[keyof T] extends never
  ? false
  : true;

export type Not<T> = [T] extends [false] ? true : false;
export type And<T, U> = T extends true
  ? U extends true
    ? true
    : false
  : false;
export type Or<T, U> = [T] extends [never]
  ? [U] extends [never]
    ? never
    : U
  : T;
