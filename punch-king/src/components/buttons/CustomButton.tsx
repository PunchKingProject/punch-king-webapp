import React from 'react';
import {
  Button,

  useTheme,
  type ButtonProps,
  type TypographyVariant,

} from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  textSize?: TypographyVariant;
  bgColor?: string;
  textColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  textSize = 'body1',
  bgColor,
  textColor,
  sx,
  ...rest
}) => {
  const theme = useTheme();

  const getFontSize = () => {
    return (
      theme.typography[textSize]?.fontSize ?? theme.typography.body1.fontSize
    );
  };

  return (
    <Button
      variant={variant}
      color={color}
      sx={{
        borderRadius: '5px',
        textTransform: 'none',
        fontWeight: 600,
        fontSize: getFontSize(),
        backgroundColor: bgColor,
        color: textColor,
        '&:hover': {
        filter: 'brightness(50%)',
          backgroundColor: bgColor ? `${bgColor}CC` : undefined, // slight hover transparency if custom
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
