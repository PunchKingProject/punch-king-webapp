import { Box, Typography } from "@mui/material";
import type { TeamPost } from "../../../api/teams.types";
import { isVideo } from "../../../../../../utils/helpers";
import { colors } from "../../../../../../theme/colors";
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import RankingIcon from '../../../../../../assets/rankingSmallbox1.svg?react';
import NeutronIcon from '../../../../../../assets/rankingSmallbox3.svg?react';


type Props = {
  item: TeamPost;
  onOpen: (item: TeamPost) => void;
};

function MobileTeamPostCard({ item, onOpen }: Props) {

  const video = isVideo(item.file_url);

  return (
    <Box
      sx={{
        minWidth: 280,
        maxWidth: 320,
        scrollSnapAlign: 'center',
        borderRadius: 2,
        p: 1.5,
        background: '#0f0f0f',
        border: '2px solid orange',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: 1.5,
          border: `1px solid ${colors.Accent}`,
          overflow: 'hidden',
          height: 180,
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
            <PlayArrowRounded sx={{ fontSize: 48, color: colors.Accent }} />
          </Box>
        )}
        <Box
          onClick={() => onOpen(item)}
          sx={{
            position: 'absolute',
            top: 6,
            right: 8,
            width: 24,
            height: 24,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            color: colors.Accent,
            cursor: 'pointer',
            bgcolor: 'rgba(0,0,0,0.35)',
          }}
          aria-label='View post'
          title='View post'
        >
          <VisibilityRounded fontSize='small' />
        </Box>
      </Box>
      <Box sx={{ mt: 1.25 }}>
        <Typography sx={{ color: colors.Accent, fontWeight: 700 }}>
          Title:
        </Typography>
        <Typography sx={{ color: '#fff' }} noWrap title={item.title}>
          {item.title}
        </Typography>

        <Typography sx={{ color: colors.Accent, fontWeight: 700, mt: 1 }}>
          Comments:
        </Typography>
        <Typography sx={{ color: '#fff' }}>{item.comments_count}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
        <Box>
          <RankingIcon />
          <Typography variant='headerBold' component='p'>
            {item.sponsorships}
          </Typography>
          <Typography variant='bodyTextMilkDefault'>Sponsorships</Typography>
        </Box>
        <Box>
          <NeutronIcon />
          <Typography variant='headerBold' component='p'>
            {item.sponsors}
          </Typography>
          <Typography variant='bodyTextMilkDefault'>Sponsors</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default MobileTeamPostCard