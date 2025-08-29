import { TextField, type TextFieldProps } from '@mui/material';
import { useField } from 'formik';
import { colors } from '../../theme/colors';

type FormikTextFieldProps = {
  name: string;
  showSuccessStyle?: boolean;
  successMessage?: string;
} & TextFieldProps;

const FormikTextField = ({
  name,
  successMessage,
  showSuccessStyle = false,
  ...props
}: FormikTextFieldProps) => {
  const [field, meta] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);
  const isValid = Boolean(meta.touched && !meta.error);
  return (
    <TextField
      {...field}
      {...props}
      fullWidth
      variant='outlined'
      error={hasError}
      helperText={
        hasError
          ? meta.error
          : showSuccessStyle && isValid && successMessage
          ? successMessage
          : ' '
      }
      slotProps={{
        formHelperText: {
          sx: {
            '&.Mui-error': {
              //   color: 'pink', // override error color
              //   border:'2px solid re',
            //   marginBottom: '-0px',
            },
          },
        },
      }}
      sx={{
        ...props.sx,
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px',
          backgroundColor: 'transparent',
          height: 50,
          '& fieldset': {
            borderColor: hasError
              ? 'error.main'
              : showSuccessStyle && isValid
              ? colors.Success
              : '#FFC107',
          },
          '&:hover fieldset': {
            borderColor: hasError
              ? 'error.main'
              : showSuccessStyle && isValid
              ? colors.Success
              : '#FFC107',
          },
          '&.Mui-focused fieldset': {
            borderColor: hasError
              ? 'error.main'
              : showSuccessStyle && isValid
              ? colors.Success
              : '#FFFFFF',
          },
        },
        '& .MuiOutlinedInput-input': {
          color: showSuccessStyle && isValid ? colors.Success : '#FFFFFF',
        },
        '& input::placeholder': {
          color: '#FFC107', // placeholder in gold
          opacity: 1,
        },
      }}
    />
  );
};

export default FormikTextField;
