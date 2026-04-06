import { ScrollableSection } from '../../../admin/components/ScrollableSection.tsx';
import {
    teamSponsorshipFields,
    type TeamSponsorshipRow,
} from '../ui/fields.ts';

type Props = {
  rows: TeamSponsorshipRow[];
  loading?: boolean;
  // server search + pagination
  onSearchChange?: (q: string) => void;
  serverSearch?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
};

export default function MobileMySponsorships({
  rows,
  loading,
  onSearchChange,
  serverSearch = true,
  hasMore,
  onLoadMore,
}: Props) {
  return (
    <ScrollableSection<TeamSponsorshipRow>
      title='My sponsorships'
      items={rows}
      loading={!!loading}
      fields={teamSponsorshipFields}
      getItemKey={(r) => r.idx}
      searchKeys={['sponsor_name', 'date', 'amount_paid']} // used when serverSearch=false
      serverSearch={serverSearch}
      onSearchChange={onSearchChange}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
    />
  );
}
