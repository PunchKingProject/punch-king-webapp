// src/mui.d.ts
import '@mui/material/Button';
import '@mui/material/styles';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    accent: true;
    caution: true;
    success: true;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    heroTitle: React.CSSProperties;
    subtitle: React.CSSProperties;
    mediumHeaderBold: React.CSSProperties;
    bodyTextMilkDefault: React.CSSProperties;
    headerBold: React.CSSProperties;
    teamSubscriptionHeaderOne: React.CSSProperties;
    teamSubscriptionHeaderTwo: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    heroTitle?: React.CSSProperties;
    subtitle?: React.CSSProperties;
    mediumHeaderBold: React.CSSProperties;
    bodyTextMilkDefault: React.CSSProperties;
    headerBold: React.CSSProperties;
    teamSubscriptionHeaderOne: React.CSSProperties;
    teamSubscriptionHeaderTwo: React.CSSProperties;
  }

  // ✅ Extend custom palette with textMilk
  interface Palette {
    textMilk: string;
  }

  interface PaletteOptions {
    textMilk?: string;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    heroTitle: true;
    subtitle: true;
    mediumHeaderBold: true;
    bodyTextMilkDefault: true;
    headerBold: true;
    teamSubscriptionHeaderOne: true;
    teamSubscriptionHeaderTwo: true;
  }
}
