import { MenuItem, TextField } from "@mui/material";
import { useField } from "formik";

 function FormikSelect({
  name,
  label,
  placeholder,
  options,
  disabled,
  onChangeOverride,
}: {
  name: string;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  onChangeOverride?: (value: string) => void;
}) {
  const [field, meta, helpers] = useField<string | null>(name);
  const error = Boolean(meta.touched && meta.error);

  return (
    <TextField
      select
      fullWidth
      label={label}
      placeholder={placeholder}
      value={field.value ?? ''}
      onChange={(e) => {
        const v = (e.target.value ?? '') as string;
        if (onChangeOverride) onChangeOverride(v);
        else helpers.setValue(v);
      }}
      onBlur={() => helpers.setTouched(true)}
      error={error}
      helperText={error ? meta.error : ' '}
      disabled={disabled}
      InputLabelProps={{ shrink: true }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'white',
          },
          '&:hover fieldset': {
            borderColor: 'white',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'white',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'white',
        },
        '& .MuiSelect-icon': {
          color: 'white',
        },
      }}
    >
      <MenuItem value=''>{placeholder ?? 'Select...'}</MenuItem>
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}


export default FormikSelect