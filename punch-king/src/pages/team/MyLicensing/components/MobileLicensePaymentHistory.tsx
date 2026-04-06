// src/pages/team/MyLicensing/components/MobileLicensePaymentHistory.tsx
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import { IconButton } from '@mui/material';
import { ScrollableSection } from '../../../admin/components/ScrollableSection.tsx';
import { type LicensePaymentRow, licensePaymentFields } from '../ui/fields.ts';

type Props = {
  rows: LicensePaymentRow[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onSearchChange?: (q: string) => void;
  onViewSlip?: (url: string) => void;
};

export default function MobileLicensePaymentHistory({
  rows,
  loading,
  hasMore,
  onLoadMore,
  onSearchChange,
  onViewSlip,
}: Props) {
  return (
    <ScrollableSection<LicensePaymentRow>
      title='License payment history'
      items={rows}
      fields={licensePaymentFields}
      searchKeys={['license_name', 'status']}
      searchPlaceholder='Search payments…'
      serverSearch
      loading={!!loading}
      hasMore={!!hasMore}
      onLoadMore={onLoadMore}
      onSearchChange={onSearchChange}
      getItemKey={(r) => r.id}
      renderRight={(r) =>
        r.payment_slip ? (
          <IconButton
            aria-label='View slip'
            onClick={() => onViewSlip?.(r.payment_slip as string)}
            sx={{ color: '#fff' }}
          >
            <VisibilityRounded />
          </IconButton>
        ) : null
      }
    />
  );
}
