import { ScrollableSection } from '../../../admin/components/ScrollableSection';
import {
    teamLicenseFields,
    type TeamLicenseRow,
} from '../../Dashboard/ui/fields';

type Props = {
  rows: TeamLicenseRow[];
  loading?: boolean;
};

export default function MobileMyLicenses({ rows, loading }: Props) {
  // Licenses API doesn’t support search; keep it client-side only
  return (
    <ScrollableSection<TeamLicenseRow>
      title='My licenses history'
      items={rows}
      loading={!!loading}
      fields={teamLicenseFields}
      getItemKey={(r) => r.idx}
      searchKeys={['license_name']} // local filter
      serverSearch={false}
    />
  );
}
