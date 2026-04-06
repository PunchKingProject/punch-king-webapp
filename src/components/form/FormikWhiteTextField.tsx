// src/components/form/FormikTextField.tsx
import { TextField} from '@mui/material';
import { useField } from 'formik';
import type { SxProps, TextFieldProps, Theme } from '@mui/material';
import { useMemo } from 'react';


/**
 * Formik-aware TextField with white borders for dark backgrounds.
 * - Strongly typed (no `any`)
 * - Works with type="date" (auto-shrinks label)
 * - Pass any TextFieldProps; we merge your sx with the dark style
 */
export type FormikTextFieldProps = Omit<
  TextFieldProps,
  'name' | 'value' | 'onChange' | 'onBlur'
> & {
  name: string;
  /** Apply white border/label/icon colors for dark UIs */
  dark?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

const darkSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'white' },
    '&:hover fieldset': { borderColor: 'white' },
    '&.Mui-focused fieldset': { borderColor: 'white' },
  },
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .MuiOutlinedInput-input': {
    color: 'white',
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'rgba(255,255,255,0.7)',
    opacity: 1,
  },
  '& .MuiFormHelperText-root': {
    color: 'rgba(255,255,255,0.7)',
  },
  '& .MuiSvgIcon-root': {
    color: 'white',
  },
} as const;

export default function FormikTextField({
  name,
  dark = true,
  sx,
  InputLabelProps,
  type,
  ...rest
}: FormikTextFieldProps) {
  // Use string for most form cases; if you truly need number, you can widen as needed.
  const [field, meta, helpers] = useField<string>(name);
  const error = Boolean(meta.touched && meta.error);

  // Auto-shrink label for date inputs (and allow user override)
  const mergedInputLabelProps = {
    ...(type === 'date' ? { shrink: true } : {}),
    ...InputLabelProps,
  };

  // ✅ Normalize sx into an array of SxProps<Theme>, filtering out undefined
  const mergedSx: SxProps<Theme> = useMemo(() => {
    const base = dark ? [darkSx] : [];
    const extra = sx ? (Array.isArray(sx) ? sx : [sx]) : [];
    return [...base, ...extra];
  }, [dark, sx]);

  return (
    <TextField
      {...rest}
      {...field}
      type={type}
      fullWidth={rest.fullWidth ?? true}
      value={field.value ?? ''}
      onChange={(e) => {
        helpers.setValue(e.target.value);
        if (rest.onChange) rest.onChange(e);
      }}
      onBlur={(e) => {
        helpers.setTouched(true);
        if (rest.onBlur) rest.onBlur(e);
      }}
      error={error}
      helperText={error ? meta.error : rest.helperText ?? ' '}
      InputLabelProps={mergedInputLabelProps}
      sx={mergedSx}
    />
  );
}
