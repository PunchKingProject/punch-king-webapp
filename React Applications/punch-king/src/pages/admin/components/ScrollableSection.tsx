import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import {
  Box,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';

type PrimitiveRenderable =
  | string
  | number
  | boolean
  | null
  | undefined
  | React.ReactNode;

export type Field<T> = {
  /** Must be a key on T that resolves to something renderable */
  key: Extract<keyof T, string>;
  label: string;
};

type ScrollableSectionProps<T extends Record<string, PrimitiveRenderable>> = {
  title: string;
  items: T[];
  fields: Field<T>[];
  /** Which keys are searchable (case-insensitive) */
  searchKeys?: Array<Extract<keyof T, string>>;
  /** Optional placeholder for the search input */
  searchPlaceholder?: string;

  // NEW for server integration:
  serverSearch?: boolean; // if true, don't locally filter
  loading?: boolean; // controls skeleton/loader row
  hasMore?: boolean; // show "Load more" affordance
  onSearchChange?: (q: string) => void; // bubble query up
  onLoadMore?: () => void; // trigger next page
};

export const ScrollableSection = <
  T extends Record<string, PrimitiveRenderable>
>({
  title,
  items,
  fields,
  searchKeys,
  searchPlaceholder = 'Search...',
  serverSearch = false,
  loading = false,
  hasMore = false,
  onSearchChange,
  onLoadMore,
}: ScrollableSectionProps<T>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowUp(el.scrollTop > 0);
    setShowDown(el.scrollHeight - el.scrollTop > el.clientHeight + 5);
  };

  useEffect(() => {
    checkScroll();
  }, [items]);

  // Toggle search; closing clears the query and notifies parent (server mode)
  const toggleSearch = () => {
    setSearchOpen((prev) => {
      const next = !prev;

      if (!next) {
        setQuery('');
        if (serverSearch && onSearchChange) onSearchChange('');
      }
      return next;
    });
  };

  const listToRender = useMemo(() => {
    if (serverSearch) return items;
    if (!query.trim() || !searchKeys?.length) return items;

    const q = query.trim().toLowerCase();
    return items.filter((it) =>
      searchKeys.some((k) => {
        const value = it[k];
        if (value == null) return false;
        const text = String(value).toLowerCase();
        return text.includes(q);
      })
    );
  }, [items, query, searchKeys, serverSearch]);

  // Lightweight skeleton card for first-load state
  const SkeletonCard = () => (
    <Box
      mb={3}
      sx={{
        backgroundColor: '#222',
        borderRadius: 2,
        p: 2,
        color: 'white',
      }}
    >
      <Skeleton width='40%' />
      <Skeleton width='70%' />
      <Skeleton width='55%' />
      <Skeleton width='30%' />
    </Box>
  );

  return (
    <Box mb={4} px={2}>
      {/* Header */}
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        mb={1}
      >
        <Typography fontWeight={700} color='white'>
          {title}
        </Typography>
        {searchKeys?.length ? (
          <IconButton
            size='small'
            onClick={toggleSearch}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
          >
            {searchOpen ? (
              <CloseIcon sx={{ color: 'yellow' }} />
            ) : (
              <SearchIcon sx={{ color: 'yellow' }} />
            )}
          </IconButton>
        ) : null}
      </Box>

      {/* Search bar (collapsible) */}
      {searchOpen && (
        <Box mb={1}>
          <TextField
            size='small'
            fullWidth
            value={query}
            onChange={(e) => {
              const next = e.target.value;
              setQuery(next);
              if (serverSearch && onSearchChange) onSearchChange(next);
            }}
            placeholder={searchPlaceholder}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#1f1f1f',
                color: 'white',
              },
            }}
          />
        </Box>
      )}

      {/* Scroll container + up/down affordances
       */}
      <Box
        sx={{
          position: 'relative',
        }}
      >
        {showUp && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: '8px',
              color: 'yellow',
              fontSize: '24px',
              zIndex: 1,
            }}
          >
            ▲
          </Box>
        )}

        <Box
          ref={scrollRef}
          onScroll={checkScroll}
          sx={{
            maxHeight: 300,
            overflowY: 'auto',
            pr: 1,
          }}
        >
          {/* First-load skeletons (only when no items yet) */}

          {loading && items.length === 0 ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {/* Cards */}
              {listToRender.map((item, idx) => (
                <Box
                  key={idx}
                  mb={3}
                  sx={{
                    backgroundColor: '#222',
                    borderRadius: 2,
                    p: 2,
                    color: 'white',
                  }}
                >
                  {fields.map((field) => (
                    <Box key={field.key} mb={1}>
                      <Typography fontWeight={700} color='gray'>
                        {field.label}
                      </Typography>
                      <Typography>{item[field.key]}</Typography>
                    </Box>
                  ))}
                </Box>
              ))}

              {/* Empty state (client-mode only; server mode should control items) */}

              {!serverSearch && listToRender.length === 0 && (
                <Box py={4} textAlign='center' color='#bbb'>
                  <Typography>No results</Typography>
                </Box>
              )}

              {/* Load more (server mode) */}
              {serverSearch && hasMore && !loading && onLoadMore && (
                <Box py={1} textAlign='center'>
                  <Typography
                    sx={{ cursor: 'pointer', color: 'yellow' }}
                    onClick={onLoadMore}
                  >
                    Load more
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>

        {showDown && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: '8px',
              color: 'yellow',
              fontSize: '24px',
              zIndex: 1,
            }}
          >
            ▼
          </Box>
        )}
      </Box>
    </Box>
  );
};
