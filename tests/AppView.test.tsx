import { shallow } from 'enzyme';
import { Formik, FormikProps } from 'formik';
import * as React from 'react';
import {
  FormikFields,
  FormikFieldsDefinition,
  FormikFieldsState
} from '../src';

interface TestValues {
  name: string;
  email: string;
}

const ERROR_TEST_VAL = 'ERROR_TEST_VAL';

const defaultFieldsDef: FormikFieldsDefinition<TestValues> = {
  name: {
    initialValue: 'not',
    validate: val => !val && ERROR_TEST_VAL
  },
  email: {
    initialValue: 'test'
  }
};

const getTestComponent = (fieldsDefinition = defaultFieldsDef) => {
  const renderMock = jest.fn();
  const submitMock = jest.fn();
  const component = (
    <FormikFields<TestValues>
      fields={fieldsDefinition}
      onSubmit={submitMock}
      render={renderMock}
      validateOnChange={true}
    />
  );

  return { renderMock, submitMock, component };
};

/*
TODO's:
    * add tests for formikToFormikFields.ts
*/

describe('when FormikFields renders', () => {
  it('should pass the submit-handler correctly', () => {
    const { submitMock, component } = getTestComponent();

    const rendered = shallow(component); // .dive cause internally Formik with its render-prop is used

    expect(rendered.find(Formik).prop('onSubmit')).toBe(submitMock);
  });

  it('should call the render-fn', () => {
    const { renderMock, component } = getTestComponent();

    shallow(component).dive(); // .dive cause internally Formik with its render-prop is used

    expect(renderMock).toHaveBeenCalledTimes(1);
  });

  it('should should propagate the initialValue correctly', () => {
    const { renderMock, component } = getTestComponent();

    shallow(component).dive(); // .dive cause internally Formik with its render-prop is used

    const formikFieldState = renderMock.mock.calls[0][0] as FormikFieldsState<
      TestValues
    >;
    // const formikBag = renderMock.mock.calls[0][1] as FormikProps<TestValues>

    expect(formikFieldState.name.value).toBe(
      defaultFieldsDef.name.initialValue
    );
  });

  it('should should propagate the initialValue correctly', () => {
    const { renderMock, component } = getTestComponent();

    shallow(component).dive(); // .dive cause internally Formik with its render-prop is used

    const formikFieldState = renderMock.mock.calls[0][0] as FormikFieldsState<
      TestValues
    >;
    // const formikBag = renderMock.mock.calls[0][1] as FormikProps<TestValues>

    expect(formikFieldState.name.value).toBe(
      defaultFieldsDef.name.initialValue
    );
  });

  it('should set an error if an value is invalid', () => {
    const { renderMock, component } = getTestComponent();

    shallow(component).dive(); // .dive cause internally Formik with its render-prop is used

    const formikFieldState = renderMock.mock.calls[0][0] as FormikFieldsState<
      TestValues
    >;
    const formikBag = renderMock.mock.calls[0][1] as FormikProps<TestValues>;

    formikFieldState.name.setValue('', true);

    return Promise.resolve()
      .then(() => formikBag.validateForm())
      .then(() =>
        expect(
          renderMock.mock.calls[renderMock.mock.calls.length - 1][0].name.error
        ).toBe(ERROR_TEST_VAL)
      );
  });

  it('should mutate only changed fields', () => {
    const { renderMock, component } = getTestComponent();

    shallow(component).dive(); // .dive cause internally Formik with its render-prop is used

    const formikFieldState = renderMock.mock.calls[0][0] as FormikFieldsState<
      TestValues
    >;

    formikFieldState.name.setValue(
      `${formikFieldState.name.value}_CHANGED`,
      true
    );

    expect(
      renderMock.mock.calls[renderMock.mock.calls.length - 1][0].name
    ).not.toBe(formikFieldState.name);
    expect(
      renderMock.mock.calls[renderMock.mock.calls.length - 1][0].email
    ).toBe(formikFieldState.email);
  });
});
