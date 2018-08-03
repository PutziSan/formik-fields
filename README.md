# FormikFields

An extension to the great [formik-library](https://github.com/jaredpalmer/formik).

## Motivation

The main goal is to keep the simplicity of formik's [`<Field>`-component](https://github.com/jaredpalmer/formik#field-) and to remove the magic introduced by the implicit context and the name-string. In addition, when updating one field, you do not want to have to render all the others again.

## Installation

FormikFields is available as an npm-package and has [formik](https://github.com/jaredpalmer/formik) as peer-dependency:

```shell
yarn add formik formik-fields
# or npm
npm install formik formik-fields
```

## Example

```typescript
import * as React from 'react';
import { FormikFields } from 'formik-fields';
import { FormikFieldInput } from './your-custom-component';

interface MyFormValues {
  email: string;
  name: string;
}

export const MyForm = () => (
  <FormikFields<MyFormValues>
    fields={{
      name: {
        initialValue: '',
        validate: val => !val && 'Name should not be empty'
      },
      email: { initialValue: '' }
    }}
    onSubmit={(values: MyFormValues) => console.log(values)}
    render={(fields, formikBag) => (
      <form onSubmit={formikBag.handleSubmit}>
        <FormikFieldInput field={fields.email} />
        <FormikFieldInput field={fields.name} />
        <button type="submit">submit</button>
      </form>
    )}
  />
);
```

* [TypeScript-example on CodeSandbox](https://codesandbox.io/s/p2pzokv1mq)
* [React-JSX example on CodeSandbox](https://codesandbox.io/s/2pjyoqoolr)

## Table of Contents

- [`<FormikFields>`-API](#formikfields-api)
  - [`fields`](#fields)
  - [`FieldDefinition`](#fielddefinition)
  - [`render`-prop](#render-prop)
    - [`fieldsState`](#fieldsstate)
    - [`formikProps`](#formikprops)
- [TypeScript](#typescript)
  - [usage without TypeScript](#usage-without-typescript)
- [advanced](#advanced)
  - [custom input example](#custom-input-example)
  - [formik under the hood](#formik-under-the-hood)
  - [Field-Validators and form-submission](#field-validators-and-form-submission)
  - [Validation and performance](#validation-and-performance)

## `<FormikFields>`-API

The `<FormikFields>`-Component accepts following props:

### `fields`

> Type: `{ [fieldName]: FieldDefinition }`

```typescript
const formikFieldDefinition = {
  name: {
    initialValue: '',
    validate: val => !val && 'Name should not be empty'
  },
  email: { initialValue: '' }
};
```

### `FieldDefinition`

| Name                    | Type                  | Description                                                                                                                                                                                                                                                                                       |
| ----------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| initialValue (required) | `Value`               | Initial value when the form is first mounted.                                                                                                                                                                                                                                                     |
| validate                | `(val: Value) => any` | If not [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), the fields `error`-prop is set with the computed value from this function. See formik's [How Form Submission Works](https://github.com/jaredpalmer/formik#how-form-submission-works) to understand how validation works. |

### `render`-prop

> type: `(fieldsState, formikProps) => ReactNode`

You can also use the `children`-prop, for more usage about the render-prop-pattern [head over the the react-documentation](https://reactjs.org/docs/render-props.html).

#### `fieldsState`

> type : `{ [fieldName]: FieldState }`

`FieldState` is an `Object` with following members:

| Name           | Type                                                    | Description                                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`         | `string`                                                | equal to the corresponding key in the `fieldsState`-Object                                                                                                                                                                                       |
| `value`        | `FormValue[name]`                                       | current value, on mount equal to `initialValue` in the [FieldDefinition](#FieldDefinition)                                                                                                                                                       |
| `isTouched`    | `boolean` (default: `false`)                            | result from `setIsTouched` or `handleBlur`                                                                                                                                                                                                       |
| `error`        | `any`                                                   | result from the `validate`-function in the [FieldDefinition](#FieldDefinition)                                                                                                                                                                   |
| `setValue`     | `(val: FormValue[name], shouldValidate = true) => void` | set `value` and re-evaluate your [validators](#validators-and-performance), calls internally [formik's `setFieldValue`](https://github.com/jaredpalmer/formik#setfieldvalue-field-string-value-any-shouldvalidate-boolean--void)                 |
| `setIsTouched` | `(isTouched: boolean, shouldValidate = true) => void`   | set `isTouched` and re-evaluate your [validators](#validators-and-performance), calls internally [formik's `setFieldTouched`](https://github.com/jaredpalmer/formik#setfieldtouched-field-string-istouched-boolean-shouldvalidate-boolean--void) |
| `handleChange` | `(e: React.ChangeEvent) => void`                        | calls `setValue` with the extracted value from an input-`onChange`-callback                                                                                                                                                                      |
| `handleBlur`   | `() => void`                                            | calls `setIsTouched(true)`                                                                                                                                                                                                                       |

#### `formikProps`

The second callback-parameter contains all props from [Formik's render-prop-callback](https://github.com/jaredpalmer/formik#formik-props), visit their documentation for more information.

## TypeScript

This project is written in TypeScript and so typings should always be up-to-date. You should always enhance the `<FormikFields>`-Component with your form-values-Interface (since [TypeScript 2.9](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-9.html#generic-type-arguments-in-jsx-elements) you can do this inline):

```typescript
interface MyFormValues {
  email: string;
  name: string;
}

export const MyForm = () => <FormikFields<MyFormValues> {/*...*/} />
```

Now your fields and render-prop-parameters are enhanced with your specific field-names and -types.

### usage without TypeScript

You can use FormikFields as well as formik without TypeScript (via ES6-`import` or `require`). However, you lose the advantages of the types in your forms (with TS the fields are checked against the initial definitions of the form-values-structure and so you can only access defined fields).

## advanced

### custom input example

A minimum implementation of a `FormikFieldInput` in TypeScript could look like this:

```typescript
import { PureComponent } from 'react';
import { FormikFieldState } from 'formik-fields';

interface FormikFieldInputProps {
  field: FormikFieldState<string>;
}

// Use React.PureComponent component to take advantage of the optimized fields
export class FormikFieldInput extends PureComponent<FormikFieldInputProps> {
  render() {
    const { field, ...props } = this.props;

    return (
      <div>
        <input
          onChange={field.handleChange}
          onBlur={field.handleBlur}
          value={field.value}
          {...props}
        />
        {field.isTouched && field.error && <div>({field.error})</div>}
      </div>
    );
  }
}
```

### formik under the hood

Since this is only an extension, `<FormikFields>` accepts [all props of the actual `<Formik>` component](https://github.com/jaredpalmer/formik#formik-) (except `Component` and `initialValues`, which is overwritten by your field-definitions).

When you define Formik's [`validate`-prop](https://github.com/jaredpalmer/formik#validate-values-values--formikerrorsvalues--promiseany), the results of the specifically defined `validate` function are merged with the results of the field-validations (where the specific `validate` function overwrites the values of the field-validations if they have the same keys).

### Field-Validators and form-submission

If you define a field-level-`validate`-function via the [FieldDefinition](#FieldDefinition), the result of your function can prevent your form to submit:

If this function returns a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value, this field will not prevent your form to submit. Otherwise, the form validation corresponds to that of Formik, see [How Form Submission Works](https://github.com/jaredpalmer/formik#how-form-submission-works) in their documentation.

> for advanced validations you can use [formik's `validate`-prop](https://github.com/jaredpalmer/formik#user-content-validate-values-values--formikerrorsvalues--promiseany)

### Validation and performance

your field-validator-function HAVE TO be always a [pure function](http://www.nicoespeon.com/en/2015/01/pure-functions-javascript/) with only one parameter (the field-value itself). Under this assumption, the results of the validations are memoized. The fields are only renewed if there are actual changes. So you can use [Reacts PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) to improve the performance of your forms.
