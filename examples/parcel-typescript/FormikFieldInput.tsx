import * as React from 'react';
import { FormikFieldState } from '../../src';

interface FormikFieldInputProps {
  field: FormikFieldState<string>;
}

// Use React.PureComponent component to take advantage of the optimized fields
export class FormikFieldInput extends React.PureComponent<
  FormikFieldInputProps
> {
  render() {
    const { field, ...props } = this.props;

    return (
      <React.Fragment>
        <input
          onChange={field.handleChange}
          onBlur={field.handleBlur}
          value={field.value}
          {...props}
        />
        {field.isTouched && field.error && <div>({field.error})</div>}
      </React.Fragment>
    );
  }
}
