import * as React from 'react';
import { FormikFields } from '../../src';
import { FormikFieldInput } from './FormikFieldInput';

interface MyFormValues {
  email: string;
  name: string;
}

const handleSubmit = (values: MyFormValues) => console.log(values);

export const AppView = () => (
  <FormikFields<MyFormValues>
    fields={{
      name: {
        initialValue: '',
        validate: val => !val && 'Name should not be empty'
      },
      email: { initialValue: 'not' }
    }}
    onSubmit={handleSubmit}
    render={(fields, formikBag) => (
      <form onSubmit={formikBag.handleSubmit}>
        <FormikFieldInput field={fields.email} />
        <br />
        <FormikFieldInput field={fields.name} />
        <br />
        <button type="submit">submit</button>
      </form>
    )}
  />
);
