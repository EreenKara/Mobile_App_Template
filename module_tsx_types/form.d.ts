import {FormikHelpers} from 'formik';

export interface FormValues {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormHandlers {
  handleSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => void | Promise<any>;
  handleValidation?: (values: FormValues) => FormErrors | Promise<FormErrors>;
  initialValues: FormValues;
}

export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}
