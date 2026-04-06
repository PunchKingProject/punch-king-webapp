// src/pages/admin/Teams/components/catalogue/TeamPostCard.tsx
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, IconButton, Typography } from '@mui/material';
import RankingIcon from '../../../../../../assets/rankingSmallbox1.svg?react';
import NeutronIcon from '../../../../../../assets/rankingSmallBox3.svg?react';
import { isVideo } from '../../../../../../utils/helpers.ts';
import type { TeamPost } from '../../../api/teams.types.ts';

type Props = { item: TeamPost; onOpen: (item: TeamPost) => void };

export default function TeamPostCard({ item, onOpen }: Props) {
  const video = isVideo(item.file_url);

  return (
    <>
      {/* <Box
        sx={{
          minWidth: 300,
          maxWidth: 360,
          scrollSnapAlign: 'center',
          border: '2px solid #EFAF00',
          borderRadius: 2,
          p: 1.25,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          background: '#111',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: 180,
            borderRadius: 1.5,
            overflow: 'hidden',
            bgcolor: '#000',
          }}
        >
          <img
            src={item.file_url}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {video && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <PlayArrowRounded sx={{ fontSize: 52, color: '#FFC107' }} />
            </Box>
          )}
          <IconButton
            aria-label='View'
            onClick={() => onOpen(item)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.55)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.4)',
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 1 }}>
          <Box>
            <Typography
              variant='body2'
              sx={{ color: '#EFAF00', fontWeight: 700 }}
            >
              Title:
            </Typography>
            <Typography
              variant='body2'
              sx={{ color: '#fff' }}
              noWrap
              title={item.title}
            >
              {item.title}
            </Typography>

            Your designs show "Views". API has "comments". Use comments for now.
            <Typography
              variant='body2'
              sx={{ color: '#EFAF00', fontWeight: 700, mt: 0.5 }}
            >
              Views:
            </Typography>
            <Typography variant='body2' sx={{ color: '#fff' }}>
              {item.comments}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gap: 1 }}>
            <MetricPill label='Sponsorships' value={item.sponsorships} />
            <MetricPill label='Sponsors' value={item.sponsors} />
          </Box>
        </Box>
      </Box> */}

      <Box
        sx={{
          border: '2px solid orange',
          // minWidth: 400,
          width: 450,
          scrollSnapAlign: 'center',
          borderRadius: 2,
          p: 1.25,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          justifyContent: 'space-between',
          background: '#111',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: 180,
            borderRadius: 1.5,
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            columnGap: '10px',
          }}
        >
          <Box
            sx={{
              width: '300px',
              position: 'relative',
            }}
          >
            <img
              src={item.file_url}
              alt={item.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '5px',
              }}
            />
            {video && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <PlayArrowRounded sx={{ fontSize: 52, color: '#FFC107' }} />
              </Box>
            )}
            <IconButton
              aria-label='View'
              onClick={() => onOpen(item)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.55)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.4)',
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              width: 100,
              display: 'flex',
              flexDirection: 'column',
              // border: '2px solid red',
              justifyContent: 'space-evenly',
              gap: 1,
              // alignItems: 'center',
            }}
          >
            <Box>
              <RankingIcon />
              <Typography variant='headerBold' component={'p'}>
                {item.sponsorships}
              </Typography>
              <Typography variant='bodyTextMilkDefault' component={'p'}>
                Sponsorships
              </Typography>
            </Box>

            <Box>
              <NeutronIcon />
              <Typography variant='headerBold' component={'p'}>
                {item.sponsors}
              </Typography>
              <Typography variant='bodyTextMilkDefault' component={'p'}>
                Sponsors
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <Typography
            variant='body2'
            sx={{ color: '#EFAF00', fontWeight: 700,  }}
          >
            Title:
          </Typography>
          <Typography
            variant='body2'
            sx={{ color: '#fff' }}
            noWrap
            title={item.title}
          >
            {item.title}
          </Typography>
          <Typography
            variant='body2'
            sx={{ color: '#EFAF00', fontWeight: 700 }}
          >
            Comments:
          </Typography>
          <Typography variant='body2' sx={{ color: '#fff' }}>
            {item.comments_count}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
