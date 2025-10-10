// components/form/FormikTextField.tsx
import {
  TextField,
  type TextFieldProps,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useField } from 'formik';
import { useMemo, useState } from 'react';
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

  // Toggle only when this is a password field
  const isPassword = props.type === 'password';
  const [showPw, setShowPw] = useState(false);
  const computedType = isPassword ? (showPw ? 'text' : 'password') : props.type;

  const mergedInputProps = useMemo(() => {
    // preserve any endAdornment passed in
    const endAdornment = isPassword ? (
      <InputAdornment position='end'>
        <IconButton
          aria-label={showPw ? 'Hide password' : 'Show password'}
          onClick={() => setShowPw((s) => !s)}
          edge='end'
          tabIndex={-1}
        >
          {showPw ? (
            <VisibilityOff sx={{ color: '#FFC107' }} />
          ) : (
            <Visibility sx={{ color: '#FFC107' }} />
          )}
        </IconButton>
      </InputAdornment>
    ) : (
      props.InputProps?.endAdornment
    );

    return {
      ...props.InputProps,
      endAdornment,
    };
  }, [isPassword, showPw, props.InputProps]);

  return (
    <TextField
      {...field}
      {...props}
      fullWidth
      variant='outlined'
      error={hasError}
      type={computedType}
      InputProps={mergedInputProps}
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
            '&.Mui-error': {},
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
          color: '#FFC107',
          opacity: 1,
        },
      }}
    />
  );
};

export default FormikTextField;
