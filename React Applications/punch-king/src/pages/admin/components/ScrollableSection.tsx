import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import {
  Box,
  IconButton,
  InputAdornment,
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

type Field<T> = {
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
};

export const ScrollableSection = <
  T extends Record<string, PrimitiveRenderable>
>({
  title,
  items,
  fields,
  searchKeys,
  searchPlaceholder = 'Search...',
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

  const filtered = useMemo(() => {
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
  }, [items, query, searchKeys]);

  // Close search resets query
  const toggleSearch = () => {
    setSearchOpen((prev) => {
      const next = !prev;
      if (!next) setQuery('');
      return next;
    });
  };

  return (
    <Box mb={4} px={2}>
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

      {searchOpen && (
        <Box mb={1}>
          <TextField
            size='small'
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
          {filtered.map((item, idx) => (
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

          {/* Empty state when search yields nothing */}
          {filtered.length === 0 && (
            <Box py={4} textAlign='center' color='#bbb'>
              <Typography>No results</Typography>
            </Box>
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
