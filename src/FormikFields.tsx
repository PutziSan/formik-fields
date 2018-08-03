import { Formik, FormikErrors, FormikProps } from 'formik';
import * as React from 'react';
import {
  calcInitialValues,
  calcMemoizedFormikBagToFormikFieldStateMap,
  calcMemoizedValidatorsFromProps,
  FieldValidator,
  FormikBagToFormikFieldStateMap,
  getFieldKeys,
  ValidatorMap
} from './formikToFormikFields';
import { FormikFieldsConfig, FormikFieldsState } from './types';
import { withoutFalsies } from './utilities';

export class FormikFields<Values> extends React.PureComponent<
  FormikFieldsConfig<Values>
> {
  initialValues: Values;
  memoizedValidatorMap: ValidatorMap<Values>;
  memoizedFormikBagToFormikFieldStateMap: FormikBagToFormikFieldStateMap<
    Values
  >;

  constructor(props: FormikFieldsConfig<Values>) {
    super(props);

    this.initialValues = calcInitialValues<Values>(props);

    this.memoizedValidatorMap = calcMemoizedValidatorsFromProps(props);
    this.memoizedFormikBagToFormikFieldStateMap = calcMemoizedFormikBagToFormikFieldStateMap(
      props
    );
  }

  fieldKeys = () => getFieldKeys<Values>(this.props);

  validateKey = (key: keyof Values & string, values: Values) => {
    if (!this.memoizedValidatorMap[key]) {
      return false;
    }

    const validator = this.memoizedValidatorMap[key] as FieldValidator<Values>;

    return validator(values[key]);
  };

  validate = (values: Values) => {
    const res: FormikErrors<Values> = {};

    this.fieldKeys()
      .filter(key => this.memoizedValidatorMap[key])
      .forEach(key => (res[key] = this.validateKey(key, values)));

    if (this.props.validate) {
      return withoutFalsies(Object.assign(res, this.props.validate(values)));
    }

    return withoutFalsies(res);
  };

  formikFieldStateByKey = (
    key: keyof Values & string,
    formikBag: FormikProps<Values>
  ) =>
    this.memoizedFormikBagToFormikFieldStateMap[key](
      formikBag.values[key],
      formikBag.errors[key],
      !!formikBag.touched[key],
      formikBag.setFieldValue,
      formikBag.setFieldTouched
    );

  getState = (formikBag: FormikProps<Values>) => {
    const res = {} as FormikFieldsState<Values>;

    this.fieldKeys().forEach(
      key => (res[key] = this.formikFieldStateByKey(key, formikBag))
    );

    return res;
  };

  renderCustomFieldsForm = (formikBag: FormikProps<Values>) => {
    if (this.props.render) {
      return this.props.render(this.getState(formikBag), formikBag);
    }

    if (this.props.children) {
      return this.props.children(this.getState(formikBag), formikBag);
    }

    throw new Error(
      'you have to provide either the children- or the render-prop'
    );
  };

  render() {
    const { fields, render, children, ...props } = this.props;

    return (
      <Formik
        {...props}
        initialValues={this.initialValues}
        validate={this.validate}
        render={this.renderCustomFieldsForm}
      />
    );
  }
}
