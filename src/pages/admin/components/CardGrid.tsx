import { Box, Typography } from '@mui/material';
import { colors } from '../../../theme/colors.ts';

export type MetricCard = {
  title: string;
  total: number | string;
  deltaPct?: number;
  trendingUp?: boolean;
};

// const data = [
//   { title: 'All Users', total: 200, deltaPct: '30', trendingUp: true },
//   { title: 'All Team', total: 200, deltaPct: '30', trendingUp: false },
//   {
//     title: 'Subscription Volume',
//     total: 200,
//     deltaPct: '30',
//     trendingUp: true,
//   },
//   { title: 'Licensing Volume', total: 200, deltaPct: '30', trendingUp: false },
//   { title: 'Sponsorship Volume', total: 200, deltaPct: '30', trendingUp: true },
// ];

interface CardGridProps {
  metricCards?: MetricCard[];
}

// const CardGrid = ({ metricCards: data = [] }: CardGridProps) => {
//   return (
//     <>
//       <Box
//         sx={{
//           // border: '2px solid yellow',
//
//           display: 'flex',
//           flexDirection: 'row',
//           gap: '20px',
//           flexWrap: 'wrap',
//         }}
//       >
//         {data.map((item) => {
//           return (
//             <Box
//               key={item.title}
//               sx={{
//                 background: colors.Card,
//                 // minWidth: '230px',
//                 // width: '10vw',
//
//                 // maxWidth: '489px',
//                 border: '1px solid #3B3B3B',
//                 // height: '135px',
//                 borderRadius: '10px',
//                 boxShadow: '2px 2px 10px 2px #2B2B2BB0',
//                 padding: '20px 10px',
//                 gap: '25px',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 width: '40vw',
//                 // flexGrow:  1,
//                 flexBasis: '30%',
//                 flexGrow: 1,
//                 maxWidth: '300px',
//               }}
//             >
//               <Typography
//                 variant='mediumHeaderBold'
//                 component={'p'}
//                 sx={{
//                   textTransform: 'uppercase',
//                   color: colors.Freeze,
//                 }}
//               >
//                 {item.title}
//               </Typography>
//               <Typography
//                 variant='bodyTextMilkDefault'
//                 component={'p'}
//                 sx={{
//                   fontWeight: 700,
//                   color: colors.Freeze,
//                 }}
//               >
//                 {item.total}
//               </Typography>
//               <Box
//                 sx={{
//                   // border: '2px solid red',
//                   width: '100%',
//                   textAlign: 'right',
//                 }}
//               >
//                 <Typography
//                   variant='bodyTextMilkDefault'
//                   component={'p'}
//                   sx={{
//                     fontWeight: 500,
//                     color: item.trendingUp ? colors.Success : colors.Caution,
//                   }}
//                 >
//                   {`You have ${item.deltaPct}% ${
//                     item.trendingUp ? 'climbed ' : 'dip'
//                   }`}
//                 </Typography>
//               </Box>
//             </Box>
//           );
//         })}
//       </Box>
//     </>
//   );
// };

const CardGrid = ({ metricCards: data = [] }: CardGridProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '20px',
        pb: { xs: 2, md: 0 }, // Add padding at bottom for mobile so shadow isn't cut off

        // --- MOBILE SCROLL LOGIC ---
        flexWrap: { xs: 'nowrap', md: 'wrap' }, // Don't wrap on mobile
        overflowX: { xs: 'auto', md: 'visible' }, // Enable scroll on mobile
        scrollSnapType: { xs: 'x mandatory', md: 'none' }, // Enable snapping
        WebkitOverflowScrolling: 'touch', // Smooth physics for iOS

        // --- MODERN SCROLLBAR STYLING ---
        '&::-webkit-scrollbar': {
          display: 'none', // Hide the "old" scrollbar entirely for a modern look
        },
        msOverflowStyle: 'none',  // IE/Edge
        scrollbarWidth: 'none',  // Firefox
      }}
    >
      {data.map((item) => {
        return (
          <Box
            key={item.title}
            sx={{
              background: colors.Card,
              border: '1px solid #3B3B3B',
              borderRadius: '10px',
              boxShadow: '2px 2px 10px 2px #2B2B2BB0',
              padding: '20px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '25px',

              // --- CARD SIZING ---
              // flex: 'shrink-grow-basis'
              // On mobile: take up 80% width and DO NOT shrink (flex-shrink: 0)
              flex: { xs: '0 0 80%', sm: '0 0 40%', md: '1 1 30%' },
              maxWidth: { xs: '80%', md: '300px' },

              // --- SNAPPING ---
              scrollSnapAlign: 'start', // Card snaps to the left edge
            }}
          >
            <Typography
              variant='mediumHeaderBold'
              component={'p'}
              sx={{
                textTransform: 'uppercase',
                color: colors.Freeze,
              }}
            >
              {item.title}
            </Typography>
            <Typography
              variant='bodyTextMilkDefault'
              component={'p'}
              sx={{
                fontWeight: 700,
                color: colors.Freeze,
              }}
            >
              {item.total}
            </Typography>
            <Box
              sx={{
                width: '100%',
                textAlign: 'right',
              }}
            >
              <Typography
                variant='bodyTextMilkDefault'
                component={'p'}
                sx={{
                  fontWeight: 500,
                  color: item.trendingUp ? colors.Success : colors.Caution,
                }}
              >
                {`You have ${item.deltaPct}% ${
                  item.trendingUp ? 'climbed ' : 'dip'
                }`}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default CardGrid;
