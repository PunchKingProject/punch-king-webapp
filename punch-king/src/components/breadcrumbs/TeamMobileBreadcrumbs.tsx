import { Box, Link as MLink, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Crumb = { label: string; to?: string };

type Props = {
  items: Crumb[]; // last item is the current page (no link)
};

const sepSx = { mx: 0.75, color: '#A2A2A2', fontWeight: 700 } as const;

export default function TeamMobileBreadcrumbs({ items }: Props) {
  const navigate = useNavigate();
  const gold = '#EFAF00';

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      {items.map((c, i) => {
        const isLast = i === items.length - 1;
        return (
          <Box
            key={`${c.label}-${i}`}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {c.to && !isLast ? (
              <MLink
                component='button'
                onClick={() => navigate(c.to!)}
                underline='hover'
                sx={{
                  color: gold,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: 0.2,
                }}
              >
                {c.label}
              </MLink>
            ) : (
              <Typography
                sx={{
                  color: isLast ? '#FFF' : '#A2A2A2',
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: 0.2,
                }}
              >
                {c.label}
              </Typography>
            )}
            {!isLast && <Typography sx={sepSx}>/</Typography>}
          </Box>
        );
      })}
    </Box>
  );
}
