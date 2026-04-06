import { useField } from 'formik';
import {
  MuiTelInput,
  type MuiTelInputProps,
} from 'mui-tel-input';

type Props = {
  name: string;
  /** ISO2 default country e.g. 'NG', 'GH', 'US' */
  defaultCountry?: MuiTelInputProps['defaultCountry'];
} & Omit<MuiTelInputProps, 'value' | 'onChange' | 'defaultCountry'>;

export default function GoldPhoneField({
  name,
  defaultCountry = 'NG',
  ...props
}: Props) {
  const [field, meta, helpers] = useField<string>(name);
  const touched = Boolean(meta.touched);
  const hasError = Boolean(meta.touched && meta.error);
  const hasValue = String(field.value ?? '').trim().length > 0;

  // mirror GoldTextField's status → border & text colors
  const isValid = touched && !hasError && hasValue;
  const borderColor = isValid ? '#90C403' : '#EFAF00'; // green when valid, gold otherwise
  const inputColor = isValid ? '#90C403' : '#FFFFFF';

  return (
    <MuiTelInput
      {...props}
      defaultCountry={defaultCountry}
      forceCallingCode
      focusOnSelectCountry
      preferredCountries={['NG', 'GH', 'US', 'GB']}
      value={field.value || ''}
      onChange={(val, info) => {
        // store E.164 if available, else the visible value
        helpers.setValue(info?.numberValue ?? val);
      }}
      onBlur={() => helpers.setTouched(true)}
      error={hasError}
      helperText={hasError ? meta.error : ' '}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          background: 'transparent',
          height: 50,
          color: inputColor,
          '& fieldset': { borderColor },
          '&:hover fieldset': { borderColor },
          '&.Mui-focused fieldset': { borderColor, borderWidth: 1.5 },
        },
        '& .MuiOutlinedInput-input': {
          color: inputColor,
          padding: '12px 14px',
        },
        // placeholder (gold)
        '& input::placeholder': {
          color: '#EFAF00',
          opacity: 1,
        },
        // dropdown/caret icons in gold
        '& .MuiSvgIcon-root, & .MuiInputAdornment-root': {
          color: '#EFAF00',
        },
        // helper text spacing/color like GoldTextField
        '& .MuiFormHelperText-root': {
          marginLeft: 0,
          color: '#C9C9C9',
        },
      }}
    />
  );
}

