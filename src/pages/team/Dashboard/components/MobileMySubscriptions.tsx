import { ScrollableSection } from '../../../admin/components/ScrollableSection.tsx';
import {
    teamSubscriptionFields,
    type TeamSubscriptionRow,
} from '../ui/fields.ts';

type Props = {
  rows: TeamSubscriptionRow[];
  loading?: boolean;
  onSearchChange?: (q: string) => void;
  serverSearch?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
};

export default function MobileMySubscriptions({
  rows,
  loading,
  onSearchChange,
  serverSearch = true,
  hasMore,
  onLoadMore,
}: Props) {
  return (
    <ScrollableSection<TeamSubscriptionRow>
      title='My subscription history'
      items={rows}
      loading={!!loading}
      fields={teamSubscriptionFields}
      getItemKey={(r) => r.idx}
      searchKeys={['subscription_type']} // used only in client mode
      serverSearch={serverSearch}
      onSearchChange={onSearchChange}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
    />
  );
}
