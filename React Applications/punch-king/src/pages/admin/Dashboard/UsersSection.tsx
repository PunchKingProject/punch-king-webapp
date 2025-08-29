import PaginatedTable, {
  type TableColumn,
} from '../../../components/tables/PaginatedTable';

export type UserRow = {
  name: string;
  email: string;
  phone_number: string;
  total_points_purchased: number;
  total_amount_sponsored: number;
};

type UsersSectionProps = {
  columns: TableColumn<UserRow>[];
  mode: 'client' | 'server';
  loading?: boolean;

  rows: UserRow[];
  totalCount: number;

  pageIndex: number; // 0-based for UI
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRpp: number) => void;

  searchValue: string;
  onSearchChange: (value: string) => void;
};

export default function UsersSection(props: UsersSectionProps) {
  const {
    columns,
    mode,
    loading,
    rows,
    totalCount,
    pageIndex,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    searchValue,
    onSearchChange,
  } = props;

  return (
    <PaginatedTable<UserRow>
      title='USERS by sponsorships'
      columns={columns}
      rows={rows}
      mode={mode}
      loading={loading}
      totalCount={totalCount}
      pageIndex={pageIndex}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder='Search by name, email or phone…'
      getRowKey={(r, i) => `${r.email}-${i}`}
      maxBodyHeight={420}
      initialRowsPerPage={rowsPerPage}
    />
  );
}
