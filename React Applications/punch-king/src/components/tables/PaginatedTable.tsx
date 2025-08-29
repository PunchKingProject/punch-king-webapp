import { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  InputBase,
  Typography,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { displayValue } from '../../utils/helpers';

/** Generic column config */
export type TableColumn<Row extends Record<string, unknown>> = {
  /** field key; you may also pass a dotted path like "a.b.c" (returns unknown) */
  field: keyof Row | string;
  header: string;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  /** custom renderer for a cell */
  render?: (
    value: unknown,
    row: Row,
    absoluteRowIndex: number
  ) => React.ReactNode;
};

/** Safely read a (possibly dotted) field from an object without using `any`. */
function readField<Row extends Record<string, unknown>>(
  row: Row,
  field: keyof Row | string
): unknown {
  if (typeof field === 'string' && field.includes('.')) {
    return field.split('.').reduce<unknown>((acc, key) => {
      if (
        typeof acc === 'object' &&
        acc !== null &&
        key in (acc as Record<string, unknown>)
      ) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, row);
  }
  return row[field as keyof Row];
}

function toSearchable(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).toLowerCase();
}

export interface PaginatedTableProps<Row extends Record<string, unknown>> {
  title: string;
  rows: Row[];
  columns: TableColumn<Row>[];

  // --- client search (existing)
  searchFields?: Array<keyof Row | string>;
  searchPlaceholder?: string;

  // --- client pagination (existing)
  initialRowsPerPage?: number;
  rowsPerPageOptions?: number[];

  // --- row key (existing)
  getRowKey?: (row: Row, index: number) => string | number;

  // --- layout (existing)
  maxBodyHeight?: number;

  // ---------- NEW: server/controlled mode ----------
  mode?: 'client' | 'server';
  loading?: boolean;

  // Controlled search
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  // Controlled pagination
  pageIndex?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRpp: number) => void;
}

export default function PaginatedTable<Row extends Record<string, unknown>>({
  title,
  rows,
  columns,
  searchFields,
  searchPlaceholder = 'Search',
  getRowKey,
  maxBodyHeight = 520,
  initialRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 20, 50],


  mode='client',
  loading = false,
  searchValue,
  onSearchChange,
  pageIndex: pageIndexProp,
  rowsPerPage: rowsPerPageProp,
  totalCount,
  onPageChange,
  onRowsPerPageChange
}: PaginatedTableProps<Row>) {
  // local state only used in client mode / uncontrolled
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndexLocal, setPageIndexLocal] = useState(0);
  const [rowsPerPageLocal, setRowsPerPageLocal] = useState(initialRowsPerPage);


  // Decide which values are active based on mode
  const effectiveSearchQuery =
    mode === 'server' ? (searchValue ?? '') : searchQuery;
    const effectivePageIndex = mode === 'server' ? (pageIndexProp ?? 0) : pageIndexLocal;
    const effectiveRowsPerPage = mode === 'server' ? (rowsPerPageProp ?? initialRowsPerPage) : rowsPerPageLocal;


      // Search input handler
      const handleSearchChange = (nextQuery:string) => {
        if (mode === 'server') {
          onSearchChange?.(nextQuery)
        } else {
          setSearchQuery(nextQuery);
          // Reset to first page when filtering on the client
         setPageIndexLocal(0)
        }
      }

      // handle pagination
      const handleChangePage = (_: unknown, newPage: number) => {
    if (mode === 'server') onPageChange?.(newPage);
    else setPageIndexLocal(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = parseInt(e.target.value, 10);
    if (mode === 'server') {
      onRowsPerPageChange?.(next);
    } else {
      setRowsPerPageLocal(next);
      setPageIndexLocal(0);
    }
  };


// Client-side filtering + paging (skipped in server mode)
  const filteredRows = useMemo(() => {
    if (mode === 'server') return rows; // already filtered server-side

    const normalizedQuery = effectiveSearchQuery.trim().toLowerCase();
    if (!normalizedQuery) return rows;

    const searchableFields =
      searchFields && searchFields.length > 0
        ? searchFields
        : (columns.map((column) => column.field) as Array<
            keyof Row | string
          >);

    return rows.filter((rowItem) =>
      searchableFields.some((fieldKey) =>
        toSearchable(readField(rowItem, fieldKey)).includes(normalizedQuery)
      )
    );
  }, [mode, effectiveSearchQuery, rows, columns, searchFields]);


 const pagedRows = useMemo(() => {
    if (mode === 'server') return rows; // already paginated server-side
    const sliceStart = effectivePageIndex * effectiveRowsPerPage;
    return filteredRows.slice(sliceStart, sliceStart + effectiveRowsPerPage);
  }, [mode, filteredRows, rows, effectivePageIndex, effectiveRowsPerPage]);

   const totalRowCount =
    mode === 'server' ? totalCount ?? rows.length : filteredRows.length;

  return (
    <Box sx={{ mt: 5 }}>
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant='h5' sx={{ fontWeight: 900, color: '#fff' }}>
          {title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            border: '1px solid #3B3B3B',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            bgcolor: '#1a1a1a',
          }}
        >
          <InputBase
            placeholder={searchPlaceholder}
            value={effectiveSearchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            sx={{ color: '#EDEDED', minWidth: 240 }}
          />
          <IconButton size='small'>
            <SearchIcon fontSize='small' sx={{ color: '#EDEDED' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Scrollable + sticky header */}
      <TableContainer
        component={Paper}
        sx={{
          background: 'transparent',
          boxShadow: 'none',
          borderRadius: 3,
          maxHeight: maxBodyHeight,
          overflow: 'auto',
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  bgcolor: '#2a2a2a',
                  color: '#cfcfcf',
                  fontWeight: 700,
                  borderBottom: 'none',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                },
              }}
            >
              <TableCell sx={{ width: 72 }}>SN</TableCell>
              {columns.map((column) => (
                <TableCell
                  key={String(column.field)}
                  align={column.align ?? 'left'}
                  sx={{ width: column.width }}
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
             {/* Optional loading skeleton rows */}
            {loading &&
              [...Array(5)].map((_, skeletonRowIndex) => (
                <TableRow key={`skeleton-${skeletonRowIndex}`}>
                  {[...Array(columns.length + 1)].map((__, skeletonCellIndex) => (
                    <TableCell key={skeletonCellIndex}>
                      <div
                        style={{
                          height: 14,
                          background: '#2a2a2a',
                          borderRadius: 4,
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            { !loading && pagedRows.map((rowItem, rowIndexOnPage) => {
              const absoluteRowIndex =
                  effectivePageIndex * effectiveRowsPerPage + rowIndexOnPage;
             const rowKey = getRowKey
                  ? getRowKey(rowItem, absoluteRowIndex)
                  : `${absoluteRowIndex}`;

              return (
                <TableRow
                  key={rowKey}
                  sx={{
                    '& td': {
                      bgcolor: '#1a1a1a',
                      color: '#EDEDED',
                      borderBottom: '8px solid #0f0f0f',
                    },
                    '&:last-of-type td': { borderBottom: 'none' },
                  }}
                >
                  <TableCell>{absoluteRowIndex + 1}.</TableCell>
                  {columns.map((column) => {
                    const cellValue = readField(rowItem, column.field);
                    return (
                      <TableCell
                        key={String(column.field)}
                        align={column.align ?? 'left'}
                      >
                        {column.render
                          ? column.render(cellValue, rowItem, absoluteRowIndex)
                          : displayValue(cellValue)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}

            { !loading && pagedRows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  align='center'
                  sx={{ bgcolor: '#1a1a1a', color: '#9a9a9a' }}
                >
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component='div'
        count={totalRowCount}
        page={effectivePageIndex}
        onPageChange={handleChangePage}
        rowsPerPage={effectiveRowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        sx={{
          color: '#cfcfcf',
          '.MuiTablePagination-selectLabel, .MuiTablePagination-input, .MuiTablePagination-displayedRows':
            {
              color: '#cfcfcf',
            },
        }}
      />
    </Box>
  );
}
