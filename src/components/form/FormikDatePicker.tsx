// src/components/form/FormikDatePicker.tsx
import type { SxProps, Theme } from '@mui/material/styles';
import {
    DatePicker,

    LocalizationProvider
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useField } from 'formik';
import * as React from 'react';

type DatePickerNativeProps = React.ComponentProps<typeof DatePicker>;


export type FormikDatePickerProps = Omit<
  DatePickerNativeProps,
  'value' | 'onChange'
> & {
  name: string;
  label?: string;
  dark?: boolean;
  sx?: SxProps<Theme>;
};

const darkSx: SxProps<Theme> = {
  /* Pickers "outlined" shell */
  '& .MuiPickersOutlinedInput-root': {
    '& .MuiPickersOutlinedInput-notchedOutline': {
      borderColor: '#fff !important',
    },
    '&:hover .MuiPickersOutlinedInput-notchedOutline': {
      borderColor: '#fff !important',
    },
    '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
      borderColor: '#fff !important',
    },
  },

  /* Text & sections inside the field */
  '& .MuiPickersInputBase-input, \
     & .MuiPickersSectionList-sectionContent': {
    color: '#fff',
  },

  /* Icon button / adornment */
  '& .MuiInputAdornment-root, & .MuiSvgIcon-root': {
    color: '#fff',
  },

  /* Helper text */
  '& .MuiFormHelperText-root': {
    color: 'rgba(255,255,255,0.7)',
  },
};

export default function FormikDatePicker({
  name,
  label,
  dark = true,
  sx,
  ...rest
}: FormikDatePickerProps) {
  const [field, meta, helpers] = useField<string>(name);
  const error = Boolean(meta.touched && meta.error);

  const value = field.value ? dayjs(field.value, 'YYYY-MM-DD') : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={(newVal) => {
          // store as "YYYY-MM-DD" in form state
          const next = newVal ? newVal.format('YYYY-MM-DD') : '';
          helpers.setValue(next);
        }}
        onClose={() => helpers.setTouched(true)}
        
        slotProps={{
          textField: {
            fullWidth: true,
            variant: 'outlined',
            error,
            helperText: error ? meta.error : ' ',
            InputLabelProps: { shrink: true },
            sx: dark ? darkSx : undefined,
          },
        }}
        sx={sx}
        {...rest}
      />
    </LocalizationProvider>
  );
}
