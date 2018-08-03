import memoizeOne from 'memoize-one';
import { fieldKeys, FormikFieldsConfig, FormikFieldState } from './types';

export type FieldValidator<Values> = (value: Values[keyof Values]) => any;

export type ValidatorMap<Values> = {
  [K in keyof Values & string]?: (val: Values[K]) => any
};

export type FormikBagToFormikFieldState<Values> = (
  value: Values[keyof Values & string],
  error: any,
  isTouched: boolean,
  setFieldValue: (
    field: keyof Values & string,
    value: any,
    shouldValidate?: boolean
  ) => void,
  setFieldTouched: (
    field: keyof Values & string,
    isTouched?: boolean,
    shouldValidate?: boolean
  ) => void
) => FormikFieldState<Values[keyof Values & string]>;

export type FormikBagToFormikFieldStateMap<Values> = {
  [K in keyof Values & string]: FormikBagToFormikFieldState<Values>
};

export function getFieldKeys<Values>(props: FormikFieldsConfig<Values>) {
  return Object.keys(props.fields) as fieldKeys<Values>;
}

export function calcInitialValues<Values>(props: FormikFieldsConfig<Values>) {
  const res = {} as Values;

  getFieldKeys(props).forEach(
    key => (res[key] = props.fields[key].initialValue)
  );

  return res;
}

function toMemoizedValidator<Values>(
  props: FormikFieldsConfig<Values>,
  key: keyof Values & string
) {
  return memoizeOne(props.fields[key].validate as FieldValidator<Values>);
}

export function calcMemoizedValidatorsFromProps<Values>(
  props: FormikFieldsConfig<Values>
) {
  const memoizedValidators: ValidatorMap<Values> = {};

  getFieldKeys(props)
    .filter(key => props.fields[key].validate)
    .forEach(
      key => (memoizedValidators[key] = toMemoizedValidator<Values>(props, key))
    );

  return memoizedValidators;
}

function toFormikFieldStateMemoizedByKey<Values>(key: keyof Values & string) {
  return memoizeOne<FormikBagToFormikFieldState<Values>>(
    (value, error, isTouched, setFieldValue, setFieldTouched) => ({
      name: key,
      error,
      isTouched: isTouched,
      value: value,
      handleChange: e => setFieldValue(key, e.target.value),
      handleBlur: () => setFieldTouched(key, true),
      setValue: (newValue, shouldValidate) =>
        setFieldValue(key, newValue, shouldValidate),
      setIsTouched: (newTouched, shouldValidate) =>
        setFieldTouched(key, newTouched, shouldValidate)
    })
  );
}

export function calcMemoizedFormikBagToFormikFieldStateMap<Values>(
  props: FormikFieldsConfig<Values>
) {
  const res = {} as FormikBagToFormikFieldStateMap<Values>;

  getFieldKeys(props).forEach(
    key => (res[key] = toFormikFieldStateMemoizedByKey<Values>(key))
  );

  return res;
}
