// StatusChipDropdown.tsx
import { Chip, Menu, MenuItem, type SxProps } from '@mui/material';
import { useState } from 'react';

export const PAYMENT_OPTIONS = ['pending', 'confirmed', 'failed'] as const;
export type PaymentStatus = (typeof PAYMENT_OPTIONS)[number];

export const LICENSE_OPTIONS = [
  'pending',
  'processing',
  'failed',
  'processed',
] as const;
export type LicenseStatus = (typeof LICENSE_OPTIONS)[number];

export const SUBSCRIPTION_OPTIONS = [
  'pending',
  'processing',
  'failed',
  'processed',
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_OPTIONS)[number];

type Domain = 'payment' | 'license' | 'subscription';

type BaseProps<T extends string> = {
  sx?: SxProps;
  onChange: (next: T) => void;
};

type PaymentProps = BaseProps<PaymentStatus> & {
  domain: 'payment';
  value: PaymentStatus;
};
type LicenseProps = BaseProps<LicenseStatus> & {
  domain: 'license';
  value: LicenseStatus;
};
type SubscriptionProps = BaseProps<SubscriptionStatus> & {
  domain: 'subscription';
  value: SubscriptionStatus;
};

export type StatusChipDropdownProps =
  | PaymentProps
  | LicenseProps
  | SubscriptionProps;

const STATUS_COLORS: Record<
  PaymentStatus | LicenseStatus | SubscriptionStatus,
  { border: string; color: string }
> = {
  pending: { border: '#FFC107', color: '#FFC107' },
  processing: { border: '#FFC107', color: '#FFC107' },
  confirmed: { border: '#4CAF50', color: '#4CAF50' },
  processed: { border: '#4CAF50', color: '#4CAF50' },
  failed: { border: '#F44336', color: '#F44336' },
};

const OPTIONS_BY_DOMAIN: Record<Domain, readonly string[]> = {
  payment: PAYMENT_OPTIONS,
  license: LICENSE_OPTIONS,
  subscription: SUBSCRIPTION_OPTIONS,
};

function toTitle(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

export default function StatusChipDropdown(props: StatusChipDropdownProps) {
  const { domain, value, onChange, sx } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // ⛑️ Safe color fallback (prevents destructure crash)
  const fallbackStyle = { border: '#9E9E9E', color: '#9E9E9E' };
  const style =
    (value ? STATUS_COLORS[value as keyof typeof STATUS_COLORS] : undefined) ??
    fallbackStyle;

  const all = OPTIONS_BY_DOMAIN[domain];
  const options = all.filter((opt) => opt !== value);

  return (
    <>
      <Chip
        onClick={(e) => setAnchorEl(e.currentTarget)}
        label={toTitle(value ?? 'unknown')}
        sx={{
          border: `2px solid ${style.border}`,
          color: style.color,
          backgroundColor: 'transparent',
          fontWeight: 700,
          borderRadius: '999px',
          height: 32,
          px: 1.25,
          cursor: 'pointer',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `6px solid ${style.color}`,
          },
          pr: 3.5,
          ...sx,
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {options.map((opt) => {
          const optStyle =
            STATUS_COLORS[opt as keyof typeof STATUS_COLORS] ?? fallbackStyle;
          return (
            <MenuItem
              key={opt}
              onClick={() => {
                if (domain === 'payment') onChange(opt as PaymentStatus);
                else if (domain === 'license') onChange(opt as LicenseStatus);
                else onChange(opt as SubscriptionStatus); // ✅ handle subscription explicitly
                setAnchorEl(null);
              }}
              sx={{
                color: optStyle.color,
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {toTitle(opt)}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
