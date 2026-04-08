import { Box, Typography } from '@mui/material';
import { colors } from '../../../theme/colors';

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
const CardGrid = ({ metricCards: data = [] }: CardGridProps) => {
  return (
    <>
      <Box
        sx={{
          // border: '2px solid yellow',

          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        {data.map((item) => {
          return (
            <Box
              key={item.title}
              sx={{
                background: colors.Card,
                // minWidth: '230px',
                // width: '10vw',

                // maxWidth: '489px',
                border: '1px solid #3B3B3B',
                // height: '135px',
                borderRadius: '10px',
                boxShadow: '2px 2px 10px 2px #2B2B2BB0',
                padding: '20px 10px',
                gap: '25px',
                display: 'flex',
                flexDirection: 'column',
                width: '40vw',
                // flexGrow:  1,
                flexBasis: '30%',
                flexGrow: 1,
                maxWidth: '300px',
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
                  // border: '2px solid red',
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
    </>
  );
};
export default CardGrid;
