// src/pages/team/MyLicensing/components/MobileLicenseHistory.tsx
import { ScrollableSection } from '../../../admin/components/ScrollableSection';
import { type LicenseHistoryRow, licenseHistoryFields } from '../ui/fields';

type Props = {
  rows: LicenseHistoryRow[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onSearchChange?: (q: string) => void;
};

export default function MobileLicenseHistory({
  rows,
  loading,
  hasMore,
  onLoadMore,
  onSearchChange,
}: Props) {
  return (
    <ScrollableSection<LicenseHistoryRow>
      title='License  history'
      items={rows}
      fields={licenseHistoryFields}
      searchKeys={['license_number', 'status']}
      searchPlaceholder='Search licenses…'
      serverSearch
      loading={!!loading}
      hasMore={!!hasMore}
      onLoadMore={onLoadMore}
      onSearchChange={onSearchChange}
      getItemKey={(r) => r.id}
    />
  );
}
