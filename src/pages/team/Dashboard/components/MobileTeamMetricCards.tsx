import * as React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

export type MobileMetric = {
  title: string;
  total: number | string;
  percentage?: number;
  climbed?: boolean; // true = climbed, false = dip
};

type Props = {
  loading?: boolean;
  metrics: MobileMetric[];
};

const cardSx = {
  background: '#1A1A1A',
  minWidth: '230px',
  width: '110vw',
  maxWidth: '489px',
  border: '1px solid #3B3B3B',
  height: '135px',
  borderRadius: '10px',
  boxShadow: '2px 2px 10px 2px #2B2B2BB0',
  p: '20px 10px',
  gap: '25px',
  display: 'flex',
  flexDirection: 'column' as const,
};

// export default function MobileTeamMetricCards({ loading, metrics }: Props) {
//   const containerRef = React.useRef<HTMLDivElement | null>(null);
//   const secondRef = React.useRef<HTMLDivElement | null>(null);
//
//   React.useEffect(() => {
//     secondRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
//   }, []);
//
//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: 'flex',
//           overflow: 'auto',
//           flexDirection: 'row',
//           width: '100%',
//           gap: '40px',
//           px: 2,
//           py: 1,
//         }}
//       >
//         {[0, 1, 2].map((i) => (
//           <Box key={i} sx={{ ...cardSx, opacity: 0.6 }}>
//             <Skeleton variant='text' width='60%' />
//             <Skeleton variant='text' width='40%' />
//             <Skeleton variant='text' width='30%' sx={{ ml: 'auto' }} />
//           </Box>
//         ))}
//       </Box>
//     );
//   }
//
//   return (
//     <Box
//       ref={containerRef}
//       sx={{
//         display: 'flex',
//         overflow: 'auto',
//         flexDirection: 'row',
//         width: '100%',
//         gap: '40px',
//         px: 2,
//         py: 1,
//       }}
//     >
//       {metrics.map((m, idx) => (
//         <Box key={m.title} ref={idx === 1 ? secondRef : null} sx={cardSx}>
//           <Typography
//             sx={{
//               textTransform: 'uppercase',
//               color: '#FFFCF4',
//               fontWeight: 800,
//             }}
//           >
//             {m.title}
//           </Typography>
//           <Typography sx={{ color: '#FFFCF4', fontWeight: 700, fontSize: 18 }}>
//             {m.total}
//           </Typography>
//           <Box sx={{ width: '100%', textAlign: 'right' }}>
//             {/* <Typography
//               sx={{
//                 color: m.climbed ?? true ? '#9ED27B' : '#EFAF00',
//                 fontWeight: 600,
//                 fontSize: 12,
//               }}
//             >
//               {`you have ${m.percentage ?? 0}% ${
//                 m.climbed ?? true ? 'climbed' : 'dip'
//               }`}
//             </Typography> */}
//           </Box>
//         </Box>
//       ))}
//     </Box>
//   );
// }

export default function MobileTeamMetricCards({ loading, metrics }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const secondRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // Adding a small delay ensures the layout is painted before the scroll happens
    const timer = setTimeout(() => {
      secondRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }, 100);
    return () => clearTimeout(timer);
  }, [loading]); // Re-run if loading finishes

  if (loading) {
    return (
      <Box
        sx={{
          // display: 'flex',
          // overflow: 'auto',
          // flexDirection: 'row',
          // width: '100%',
          // gap: '40px',
          // px: 2,
          // py: 1,
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          gap: '20px', // Reduced slightly for better "peek" at the next card
          px: 3, // Side padding so cards don't hit the screen edge
          py: 2,

          // --- THE MODERN SCROLL LOGIC ---
          overflowX: 'auto',
          flexWrap: 'nowrap',
          scrollSnapType: 'x mandatory', // Forces the "lock-in" effect
          WebkitOverflowScrolling: 'touch', // Smooth momentum on iOS

          // Hide clunky scrollbars
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box key={i} sx={{ ...cardSx, opacity: 0.6 }}>
            <Skeleton variant='text' width='60%' />
            <Skeleton variant='text' width='40%' />
            <Skeleton variant='text' width='30%' sx={{ ml: 'auto' }} />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        gap: '20px', // Reduced slightly for better "peek" at the next card
        px: 3, // Side padding so cards don't hit the screen edge
        py: 2,

        // --- THE MODERN SCROLL LOGIC ---
        overflowX: 'auto',
        flexWrap: 'nowrap',
        scrollSnapType: 'x mandatory', // Forces the "lock-in" effect
        WebkitOverflowScrolling: 'touch', // Smooth momentum on iOS

        // Hide clunky scrollbars
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {metrics.map((m, idx) => (
        <Box
          key={m.title}
          ref={idx === 1 ? secondRef : null}
          sx={{
            ...cardSx, // Use your existing styles

            // --- CRITICAL ADAPTATIONS ---
            flex: '0 0 85%', // 85% width lets the next card "peek" in
            scrollSnapAlign: 'center', // Centers the card in view when snapped
            scrollSnapStop: 'always', // Prevents skipping multiple cards on a fast flick
          }}
        >
          <Typography
            sx={{
              textTransform: 'uppercase',
              color: '#FFFCF4',
              fontWeight: 800,
            }}
          >
            {m.title}
          </Typography>
          <Typography sx={{ color: '#FFFCF4', fontWeight: 700, fontSize: 18 }}>
            {m.total}
          </Typography>

          <Box sx={{ width: '100%', textAlign: 'right' }}>
            {/* Legend/Delta logic here */}
          </Box>
        </Box>
      ))}
    </Box>
  );
}