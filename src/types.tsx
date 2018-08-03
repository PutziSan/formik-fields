import { FormikConfig, FormikProps } from 'formik';
import * as React from 'react';

// formik-types: https://github.com/jaredpalmer/formik/blob/master/src/types.tsx
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type fieldKeys<Values> = (keyof Values & string)[];

export interface FormikFieldState<Value> {
  name: string;
  value: Value;
  isTouched: boolean;
  error: any;
  setValue(val: Value, shouldValidate?: boolean): void;
  setIsTouched(isTouched: boolean, shouldValidate?: boolean): void;
  handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
  handleBlur(): void;
}

export type FormikFieldsState<Values> = {
  [K in keyof Values & string]: FormikFieldState<Values[K]>
};

export interface FormikFieldDefinition<T> {
  initialValue: T;
  validate?(value: T): any; // string but also support I18N-libraries
}

export type FormikFieldsDefinition<Values> = {
  [K in keyof Values & string]: FormikFieldDefinition<Values[K]>
};

export type FormikRenderType<Values> = (
  props: FormikFieldsState<Values>,
  formikBag: FormikProps<Values>
) => React.ReactNode;

export interface FormikFieldsConfig<Values>
  extends Omit<
      FormikConfig<Values>,
      'render' | 'initialValues' | 'children' | 'component'
    > {
  fields: FormikFieldsDefinition<Values>;
  render?: FormikRenderType<Values>;
  children?: FormikRenderType<Values>;
  initialValues?: Values;
}
