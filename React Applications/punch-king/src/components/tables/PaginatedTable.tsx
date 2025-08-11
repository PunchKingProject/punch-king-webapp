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
  searchFields?: Array<keyof Row | string>;
  searchPlaceholder?: string;
  getRowKey?: (row: Row, index: number) => string | number;
  maxBodyHeight?: number;
  initialRowsPerPage?: number;
  rowsPerPageOptions?: number[];
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
}: PaginatedTableProps<Row>) {
  const [query, setQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;

    const fields =
      searchFields && searchFields.length > 0
        ? searchFields
        : (columns.map((c) => c.field) as Array<keyof Row | string>);

    return rows.filter((row) =>
      fields.some((f) => toSearchable(readField(row, f)).includes(q))
    );
  }, [query, rows, columns, searchFields]);

  const pagedRows = useMemo(() => {
    const start = pageIndex * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, pageIndex, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) =>
    setPageIndex(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = parseInt(e.target.value, 10);
    setRowsPerPage(next);
    setPageIndex(0);
  };

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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
              {columns.map((col) => (
                <TableCell
                  key={String(col.field)}
                  align={col.align ?? 'left'}
                  sx={{ width: col.width }}
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {pagedRows.map((row, i) => {
              const absoluteIndex = pageIndex * rowsPerPage + i;
              const rowKey = getRowKey
                ? getRowKey(row, absoluteIndex)
                : `${absoluteIndex}`;

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
                  <TableCell>{absoluteIndex + 1}.</TableCell>
                  {columns.map((col) => {
                    const cellValue = readField(row, col.field);
                    return (
                      <TableCell
                        key={String(col.field)}
                        align={col.align ?? 'left'}
                      >
                        {col.render
                          ? col.render(cellValue, row, absoluteIndex)
                          : displayValue(cellValue)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}

            {pagedRows.length === 0 && (
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
        count={filteredRows.length}
        page={pageIndex}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
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
