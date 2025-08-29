// components/buttons/CustomButton.tsx
import { Button, CircularProgress, type ButtonProps } from '@mui/material';
import type { ReactNode } from 'react';


type Props = ButtonProps & {
  /** Show a spinner and auto-disable the button */
  loading?: boolean;
  /** Optional text to show while loading (defaults to children) */
  loadingLabel?: ReactNode;
  /** Spinner size */
  loaderSize?: number;
};
export default function CustomAuthButton({
  children,
  fullWidth = true,

  loading = false,
  loadingLabel,
  loaderSize = 18,

  ...props
}: Props) {
  const isContained = props.variant === 'contained';
  const spinnerSx = isContained ? { color: '#000' } : undefined;
  return (
    <Button
      {...props}
      fullWidth={fullWidth}
      sx={{
        fontWeight: 700,
        textTransform: 'none',
        py: 0.8,
        ...(props.variant === 'contained' && {
          backgroundColor: '#F6C10A',
          color: '#C28E02',
          '&:disabled': {
            backgroundColor: '#A2A2A2',
            color: '#3B3B3B',
          },
          '&:hover': {
            backgroundColor: '#e0ae07',
          },
        }),
        ...(props.variant === 'outlined' && {
          backgroundColor: '#FFFCF4',
          color: '#EFAF00',
          '&:hover': { backgroundColor: '#FFF8E1' },
        }),
        ...props.sx, // allow override if needed
      }}
    >
      {loading ? (
        <>
          <CircularProgress size={loaderSize} sx={spinnerSx} />
          {/* small spacer so text doesn't hug the spinner */}
          {/* <span style={{ width: 8 }} />
          {loadingLabel ?? children} */}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
