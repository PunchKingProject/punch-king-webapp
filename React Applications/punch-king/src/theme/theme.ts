import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: '#000000', // background
      paper: '#121212', // optionally use 'black background'
    },
    primary: {
      main: '#FFC107', // links and accent (yellow)
    },
    secondary: {
      main: '#B8860B', // Alternate accents
    },
    text: {
      primary: '#FFFFFF', // text milk
      secondary: '#F5F5F5', // text grey
    },
    error: {
      main: '#F44336', // caution (red)
    },
    success: {
      main: '#8BC34A', // success (lime green)
    },
    warning: {
      main: '#FF9800', // optional if needed for caution variations
    },
    grey: {
      500: '#9E9E9E', // freeze
      700: '#757575', // background complements
    },
    textMilk: '#FFFCF4',
  },
  typography: {
    fontFamily: `'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      [`@media (min-width:600px)`]: {
        fontSize: '3rem',
      },
      [`@media (min-width:900px)`]: {
        fontSize: '3.5rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      [`@media (min-width:600px)`]: {
        fontSize: '2.5rem',
      },
      [`@media (min-width:900px)`]: {
        fontSize: '3rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      [`@media (min-width:600px)`]: {
        fontSize: '2rem',
      },
      [`@media (min-width:900px)`]: {
        fontSize: '2.25rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.5,
      [`@media (min-width:600px)`]: {
        fontSize: '1.75rem',
      },
      [`@media (min-width:900px)`]: {
        fontSize: '2rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
      [`@media (min-width:600px)`]: {
        fontSize: '1.5rem',
      },
      [`@media (min-width:900px)`]: {
        fontSize: '1.75rem',
      },
    },
    // Add custom variants
    heroTitle: {
      fontSize: '5.625rem',
      fontWeight: 900,
      lineHeight: 1.2,
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
    },
    // Add more custom variants as needed
    subtitle: {
      fontSize: '2.125rem',
      fontWeight: 900,
      lineHeight: 1.2,
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
    },
    mediumHeaderBold: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.2,
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
    },

    bodyTextMilkDefault: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.2,
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
    },
    headerBold: {
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
    },
    teamSubscriptionHeaderOne: {
      fontSize: '3.75rem',
      fontWeight: 900,
      lineHeight: 1.2,
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
    },
    teamSubscriptionHeaderTwo: {
      fontSize: '2.5rem',
      fontWeight: 900,
      lineHeight: 1.2,
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'accent' },
          style: {
            backgroundColor: '#FFC107',
            color: '#000',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 12,
            '&:hover': {
              backgroundColor: '#e0a800',
            },
          },
        },
        {
          props: { variant: 'caution' },
          style: {
            backgroundColor: '#F44336',
            color: '#fff',
            textTransform: 'none',
            borderRadius: 12,
            '&:hover': {
              backgroundColor: '#d32f2f',
            },
          },
        },
        {
          props: { variant: 'success' },
          style: {
            backgroundColor: '#8BC34A',
            color: '#000',
            textTransform: 'none',
            borderRadius: 12,
            '&:hover': {
              backgroundColor: '#689f38',
            },
          },
        },
      ],
    },
  },
});

export default theme;
