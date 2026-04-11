import { Box, Skeleton, type SxProps } from '@mui/material';
import type { ReactNode } from 'react';
import type { MetricCard } from '../../pages/admin/components/CardGrid.tsx';
import CardGrid from '../../pages/admin/components/CardGrid.tsx';
import SideNav, { type SideNavItem } from '../nav/SideNav.tsx';

interface DashboardSectionProps {
  title: ReactNode;
  toolbar?: ReactNode;
  children?: ReactNode;
  cards?: MetricCard[];
  loading?: boolean;
  sx?: SxProps;
  sidebar?: ReactNode;
  sidebarItems?: SideNavItem[] | undefined;
  noSidebar?: boolean;
  contentSx?: SxProps;
}
const DashboardSection = ({
  title,
  toolbar,
  cards,
  children,
  loading = false,
  sx,
  sidebar,
  sidebarItems,
  contentSx,
  noSidebar = false,
}: DashboardSectionProps) => {
  const hasSidebar =
    !noSidebar && Array.isArray(sidebarItems) && sidebarItems.length > 0;

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          // gridTemplateColumns: '356px 1fr',
          gridTemplateColumns: hasSidebar ? '356px 1fr' : '1fr', // ← use flag

          // gap: 3,
          gap: hasSidebar ? 3 : 0, // ← no gutter when no sidebar

          mt: 3,
          // border: '2px solid red',
          paddingRight: '5.38em',
          alignItems: 'start',

          '@media (min-width:910px) and (max-width:1000px)': {
            // height: '200px',
            // paddingLeft: '2em', // override between 900px and 1000px
            paddingRight: '2em',
            // border: '2px solid yellow',
            gridTemplateColumns: 'max-content 1fr',
          },
          '@media (min-width:1000px) and (max-width:1100px)': {
            // height: '200px',
            // paddingLeft: '2em', // override between 900px and 1000px
            paddingRight: '1em',
            // border: '2px solid green',
          },
          ...sx,
        }}
      >
        {/* Left Sidebar */}
        {hasSidebar && (sidebar ?? <SideNav items={sidebarItems!} />)}{' '}
        {/* ← only render when present */}
        {/* Right Content */}
        <Box
          sx={{
            ...contentSx,
          }}
        >
          {/* Page Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          ><Box>{title}</Box>
            {toolbar}
          </Box>

          {/* Cards (or skeletons) */}
          {loading ? (
            <CardSkeletons count={cards?.length ?? 5} />
          ) : (
            cards && <CardGrid metricCards={cards} />
          )}

          {/* page body (tables, section) */}
          {children}
        </Box>
      </Box>
    </>
  );
};
export default DashboardSection;

function CardSkeletons({ count = 5 }: { count?: number }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <Box
            key={i}
            sx={{
              bgcolor: '#1b1b1b',
              border: '1px solid #3B3B3B',
              borderRadius: '10px',
              p: 2,
              minHeight: 120,
            }}
          >
            <Skeleton variant='text' width='60%' />
            <Skeleton variant='text' width='30%' />
            <Skeleton variant='rectangular' height={48} sx={{ mt: 1 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
