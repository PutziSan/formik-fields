import * as React from 'react';
import { CFormikProps, FormikFieldsState, FormikRenderType } from './types';

interface RenderPureFormikFieldsProps<Values> extends CFormikProps<Values> {
  render?: FormikRenderType<Values>;
  children?: FormikRenderType<Values>;
  formikFields: FormikFieldsState<Values>;
}

const shallowEq = (a: {}, b: {}) => {
  for (const key in a) {
    // @ts-ignore
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
};

export class RenderPureFormikFields<Values> extends React.Component<
  RenderPureFormikFieldsProps<Values>
> {
  shouldComponentUpdate(nextProps: RenderPureFormikFieldsProps<Values>) {
    const { formikFields, ...rest } = nextProps;

    if (
      shallowEq(rest, this.props) &&
      shallowEq(formikFields, this.props.formikFields)
    ) {
      return false;
    }

    return true;
  }

  render() {
    const { render, children, formikFields, ...formikBag } = this.props;

    if (render) {
      return render(formikFields, formikBag);
    }

    if (children) {
      return children(formikFields, formikBag);
    }

    throw new Error(
      'you have to provide either the children- or the render-prop'
    );
  }
}
