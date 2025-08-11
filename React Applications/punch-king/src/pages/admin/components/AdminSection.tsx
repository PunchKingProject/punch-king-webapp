import { Box, Typography } from '@mui/material';
import SideBar from './SideBar';
import type { ReactNode } from 'react';
import type { MetricCard } from './CardGrid';
import CardGrid from './CardGrid';

interface AdminSectionProps {
  title: string;
  toolbar?: ReactNode;
  children?: ReactNode;
  cards?: MetricCard[];
}
const AdminSection = ({
  title,
  toolbar,
  cards,
  children,
}: AdminSectionProps) => {
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '356px 1fr',
          gap: 3,
          mt: 3,
          // border:'2px solid red',
          '@media (min-width:900px) and (max-width:1100px)': {
            // height: '200px',
            // paddingLeft: '2em', // override between 900px and 1000px
            border: '2px solid yellow',
             gridTemplateColumns: 'max-content 1fr',
          },
        }}
      >
        {/* Left Sidebar */}
        <SideBar />

        {/* Right Content */}
        <Box>
          {/* Page Header */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography>{title}</Typography>
            {toolbar}
          </Box>

          <CardGrid metricCards={cards} />

          {/* page body (tables, section) */}
          {children}
        </Box>
      </Box>
    </>
  );
};
export default AdminSection;
