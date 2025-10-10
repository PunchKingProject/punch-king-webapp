// src/components/formik/FormikTextarea.tsx
import { TextField, type TextFieldProps } from '@mui/material';
import { useField } from 'formik';
import { colors } from '../../theme/colors';

type FormikTextareaProps = Omit<
  TextFieldProps,
  'name' | 'type' | 'multiline' | 'rows' | 'value' | 'onChange'
> & {
  name: string;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  showSuccessStyle?: boolean;
  successMessage?: string;
};

export default function FormikTextarea({
  name,
  rows = 4,
  minRows,
  maxRows,
  showSuccessStyle = false,
  successMessage,
  sx,
  ...rest
}: FormikTextareaProps) {
  const [field, meta] = useField<string>(name);
  const hasError = Boolean(meta.touched && meta.error);
  const isValid = Boolean(meta.touched && !meta.error);

  return (
    <TextField
      {...rest}
      {...field}
      value={field.value ?? ''} // avoid uncontrolled -> controlled warnings
      fullWidth
      multiline
      rows={rows}
      minRows={minRows}
      maxRows={maxRows}
      variant='outlined'
      error={hasError}
      helperText={
        hasError
          ? meta.error
          : showSuccessStyle && isValid && successMessage
          ? successMessage
          : ' '
      }
      // Carefully target textarea styles; DO NOT set a fixed height
      sx={{
        ...sx,
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px',
          backgroundColor: 'transparent',
          alignItems: 'flex-start', // keep label/outline happy in multiline
        },
        // Default/focus/hover outline colors
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: hasError
            ? 'error.main'
            : showSuccessStyle && isValid
            ? colors.Success
            : '#FFC107',
        },
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: hasError
            ? 'error.main'
            : showSuccessStyle && isValid
            ? colors.Success
            : '#FFC107',
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
          {
            borderColor: hasError
              ? 'error.main'
              : showSuccessStyle && isValid
              ? colors.Success
              : '#FFFFFF',
          },

        // Text color
        '& .MuiOutlinedInput-inputMultiline': {
          color: showSuccessStyle && isValid ? colors.Success : '#FFFFFF',
          padding: '12px 14px',
          lineHeight: 1.5,
          resize: 'vertical', // allow vertical resize if you like
        },

        // Placeholder (works for both input & textarea)
        '& .MuiInputBase-input::placeholder': {
          color: '#FFC107',
          opacity: 1,
        },
      }}
    />
  );
}
