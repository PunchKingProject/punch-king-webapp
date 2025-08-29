import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import { useField } from 'formik';
import FailureIcon from '../../assets/failureIcon.svg?react';
import HelpIcon from '../../assets/helpIcon.svg?react';
import SuccessIcon from '../../assets/modalSuccess.svg?react';



const GOLD = '#EFAF00';
const GREEN = '#90C403';
// const RED = '#ff6b6b';

// status: 'untouched' | 'valid' | 'invalid'
function getStatus(touched: boolean, error: boolean, hasValue: boolean) {
  if (!touched && !hasValue) return 'untouched';
  if (touched && !error && hasValue) return 'valid';
  if (touched && (error || !hasValue)) return 'invalid';
  return 'untouched';
}

function adornmentFor(status: 'untouched' | 'valid' | 'invalid') {
  switch (status) {
    case 'valid':
      return (
        <Box
          sx={{
            '& svg': { width: 20, height: 20 },
          }}
        >
          <SuccessIcon />
        </Box>
      );

    // <CheckCircleRoundedIcon fontSize='small' />;
    case 'invalid':
      return (
        <Box
          sx={{
            '& svg': { width: 20, height: 20 },
          }}
        >
          <FailureIcon />
        </Box>
      );
    default:
      return <Box
          sx={{
            '& svg': { width: 20, height: 20 },
          }}
        >
          <HelpIcon />
        </Box>
      
  }
}

function outlineStylesFor(status: 'untouched' | 'valid' | 'invalid') {
  const border =
    status === 'valid' ? GREEN : status === 'invalid' ? GOLD : GOLD; // border stays gold in design when invalid/untouched
  const inputColor = status === 'valid' ? GREEN : '#fff';

  return {
    '& .MuiOutlinedInput-root': {
      color: inputColor,
      '& fieldset': { borderColor: border },
      '&:hover fieldset': { borderColor: border },
      '&.Mui-focused fieldset': { borderColor: border, borderWidth: 1.5 },
      borderRadius: '8px',
      background: 'transparent',
    },
    '& .MuiInputBase-input': { padding: '12px 14px' },
    '& .MuiInputBase-input::placeholder': {
      color: '#EFAF00', // 👈 your custom placeholder color
      opacity: 1, // important: prevent MUI from reducing opacity
    },
    '& .MuiInputLabel-root': {
      color: GOLD, // default color
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: GOLD,
    },
    '& .MuiFormHelperText-root': { marginLeft: 0, color: '#C9C9C9' },
  };
}

function ValidityAdornment({
  status,
  color,
}: {
  status: 'untouched' | 'valid' | 'invalid';
  color?: string;
}) {
  const icon =
    status === 'valid'
      ? 'valid'
      : status === 'invalid'
      ? 'invalid'
      : 'untouched';

  const iconColor = icon === 'valid' ? GREEN : icon === 'invalid' ? GOLD : GOLD;

  return (
    <InputAdornment position='end' sx={{ mr: 0.5 }}>
      <IconButton
        edge='end'
        size='small'
        disableRipple
        sx={{ color: color ?? iconColor }}
      >
        {adornmentFor(status)}
      </IconButton>
    </InputAdornment>
  );
}

export function GoldTextField({
  name,
  placeholder,
  multiline,
  rows,
  label,
  type = 'text',
  sx,
}: {
  name: string;
  placeholder: string;
  multiline?: boolean;
  label?: string;
  rows?: number;
  type?: string;
  sx?: object;
}) {
  const [field, meta] = useField(name);
  const touched = meta.touched ?? false;
  const hasValue = String(field.value ?? '').trim().length > 0;
  const error = Boolean(meta.error);
  const status = getStatus(touched, error, hasValue);

  return (
    <Box sx={{ mb: 2, ...sx }}>
      <TextField
        {...field}
        type={type}
        placeholder={placeholder}
        label={label}
        fullWidth
        size='small'
        variant='outlined'
        multiline={multiline}
        rows={rows}
        sx={outlineStylesFor(status)}
        InputProps={{ endAdornment: <ValidityAdornment status={status} /> }}
      />
    </Box>
  );
}

export function GoldSelect({
  name,
  placeholder,
  options,
  sx,
}: {
  name: string;
  placeholder: string;
  options: Array<{ label: string; value: string }>;
  sx?: object;
}) {
  const [field, meta, helpers] = useField(name);
  const touched = meta.touched ?? false;
  const hasValue = Boolean(field.value);
  const error = Boolean(meta.error);
  const status = getStatus(touched, error, hasValue);

  return (
    <Box sx={{ mb: 2, ...sx }}>
      <TextField
        select
        fullWidth
        size='small'
        variant='outlined'
        value={field.value || ''}
        onChange={(e) => helpers.setValue(e.target.value)}
        onBlur={() => helpers.setTouched(true)}
        label={placeholder}
        placeholder={placeholder}
        sx={outlineStylesFor(status)}
        InputProps={{
          endAdornment: (
            <>
              <ValidityAdornment status={status} />
              <InputAdornment position='end' sx={{ ml: 0.5 }}>
                <ArrowDropDownRoundedIcon sx={{ color: GOLD }} />
              </InputAdornment>
            </>
          ),
        }}
      >
        <MenuItem
          value=''
          disabled
          sx={{
            color: '#777',
          }}
        >
          {placeholder}
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
