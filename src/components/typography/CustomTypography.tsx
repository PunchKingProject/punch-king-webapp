// src/components/typography/CustomTypography.tsx
import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';
import type { SxProps } from '@mui/system';
import React from 'react';

interface CustomTypographyProps extends TypographyProps {
  capitalize?: boolean;
  underline?: boolean;
  fontWeight?: number;
  fontSize?: string | number;
  sx?: SxProps;
}

const CustomTypography: React.FC<CustomTypographyProps> = ({
  children,
  capitalize = false,
  underline = false,
  fontWeight,
  fontSize,
  sx = {},
  ...rest
}) => {
  return (
    <Typography
      {...rest}
      sx={{
        ...sx,
        textTransform: capitalize ? 'capitalize' : undefined,
        textDecoration: underline ? 'underline' : undefined,
        fontWeight: fontWeight,
        fontSize: fontSize,
      }}
    >
      {children}
    </Typography>
  );
};

export default CustomTypography;
