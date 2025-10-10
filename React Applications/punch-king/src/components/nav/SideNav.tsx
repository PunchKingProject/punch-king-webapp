// pages/admin/components/SideNav.tsx
import { Box, Button, type SxProps, type Theme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { colors } from '../../theme/colors';

export type SideNavItem = {
  label: string;
  to: string;
  icon?: React.ReactNode;
  /** If true, only exact path matches are active; otherwise prefix matches are active */
  exact?: boolean;
  /** Optional custom matcher if you need full control */
  isActive?(pathname: string): boolean;
};

type Props = {
  items: SideNavItem[];
  /** Width of each button (default 200px to match current UI) */
  itemWidth?: number | string;
  /** Overrides for the outer container */
  sx?: SxProps<Theme>;
  /** Overrides for each button */
  buttonSx?: SxProps<Theme>;
};

export default function SideNav({
  items,
  itemWidth = 200,
  sx,
  buttonSx,
}: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const computeActive = (it: SideNavItem) => {
    if (it.isActive) return it.isActive(pathname);
    if (it.exact) return pathname === it.to;
    return pathname === it.to || pathname.startsWith(it.to + '/');
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.Card,
        paddingLeft: '6.98em',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        '@media (min-width:900px) and (max-width:1000px)': {
          px: '3em',
          paddingLeft: '3em',
        },
        '@media (min-width:1000px) and (max-width:1100px)': {
          px: '2rem',
          paddingLeft: '2em',
        },
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
          zIndex: 1,
          py: 3,
        }}
      >
        {items.map((item) => {
          const active = computeActive(item);
          return (
            <Button
              key={item.label}
              variant='outlined'
              onClick={() => navigate(item.to)}
              startIcon={item.icon}
              sx={{
                color: active ? '#fff' : '#f0c040',
                borderColor: active ? '#fff' : '#f0c040',
                width: itemWidth,
                py: 1,
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: '#222',
                  borderColor: '#fff',
                },
                ...buttonSx,
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
