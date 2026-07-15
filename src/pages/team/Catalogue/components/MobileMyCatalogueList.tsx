import {
  Box,
  Button,
  Link as MLink,
  Skeleton,
  Typography,
} from '@mui/material';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import type {TeamPost} from "../api/catalogue.types.ts";
import MediaPreview from "./MediaPreview.tsx";

// type Comment = {
//   id: number;
//   commenter?: string | null;
//   content: string;
// };

// type Item = {
//   id: number;
//   file_url: string | null;
//   caption: string;
//   created_at: string; // already formatted
//   comments_count: number;
//   comments: Comment[];
//   sponsors: number;
// };

type Props = {
  posts: TeamPost[];
  loading?: boolean;
  onUpdate?: (p: TeamPost) => void;
  onDelete?: (postId: number) => void;
  onViewSponsors?: (postId: number) => void;
};

const imageFrameSx = {
  width: '100%',
  // aspectRatio: '3 / 2',
  border: '1px solid #F0C040',
  borderRadius: '6px',
  overflow: 'hidden',
  bgcolor: '#111',
};

const labelSx = { fontWeight: 800, fontSize: 13, lineHeight: 1.2 };
const dimSx = { color: '#A2A2A2', fontSize: 13 };

export default function MobileMyCatalogueList({
  posts,
  loading,
  onUpdate,
  onDelete,
  onViewSponsors,
}: Props) {
  if (loading) {
    return (
      <Box>
        {Array.from({ length: 2 }).map((_, i) => (
          <Box key={i} sx={{ mb: 4 }}>
            <Skeleton
              variant='rectangular'
              height={220}
              sx={imageFrameSx}
            />
            <Skeleton variant='text' width='40%' sx={{ mt: 2 }} />
            <Skeleton variant='text' width='80%' />
            <Skeleton
              variant='rectangular'
              height={86}
              sx={{ mt: 2, borderRadius: 1 }}
            />
          </Box>
        ))}
      </Box>
    );
  }

  if (!posts.length) {
  return (
    <Box
      sx={{
        py: 8,
        textAlign: "center",
      }}
    >
      <Typography color="text.secondary">
        No posts uploaded yet.
      </Typography>
    </Box>
  );
}

  return (
    <Box>
      {posts.map((p) => (
        <Box key={p.id} sx={{ mb: 5 }}>
          {/* media */}
          {/*<Box sx={imageFrameSx}>*/}
          {/*  {p.file_url ? (*/}
          {/*    <img*/}
          {/*      src={p.file_url}*/}
          {/*      alt='post'*/}
          {/*      style={{ width: '100%', height: '100%', objectFit: 'cover' }}*/}
          {/*    />*/}
          {/*  ) : (*/}
          {/*    <Box*/}
          {/*      sx={{*/}
          {/*        width: '100%',*/}
          {/*        height: '100%',*/}
          {/*        display: 'grid',*/}
          {/*        placeItems: 'center',*/}
          {/*        color: '#A2A2A2',*/}
          {/*        fontSize: 14,*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      No media*/}
          {/*    </Box>*/}
          {/*  )}*/}
          {/*</Box>*/}
          <Box sx={imageFrameSx}>
            <MediaPreview url={p.file_url} />
          </Box>
          
                  {/* title */}
        <Box sx={{ mt: 1.25 }}>
          <Typography sx={labelSx}>Title:</Typography>

          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              mt: 0.5,
            }}
          >
            {p.title}
          </Typography>
        </Box>

          {/* caption */}
          <Box sx={{ mt: 1.25 }}>
            <Typography sx={labelSx}>Caption:</Typography>
            <Typography sx={{ ...dimSx, mt: 0.5 }}>{p.caption}</Typography>
          </Box>

          <Box sx={{ mt: 1 }}>
          <Typography sx={labelSx}>Boxer</Typography>

          <Typography sx={dimSx}>
            {p.boxer_name}
          </Typography>

          <Typography sx={dimSx}>
            {p.weight_class}
          </Typography>

          <Typography sx={dimSx}>
            {p.boxer_weight_kg} kg
          </Typography>
        </Box>

        <Box sx={{ mt: 1 }}>
  <Typography sx={labelSx}>Opponent</Typography>

  <Typography sx={dimSx}>
    {p.opponent_name}
  </Typography>

  <Typography sx={dimSx}>
    {p.opponent_weight_kg} kg
  </Typography>
</Box>

<Box sx={{ mt: 1 }}>
  <Typography sx={labelSx}>
    Sparring Location
  </Typography>

  <Typography sx={dimSx}>
    {p.sparring_location}
  </Typography>
</Box>

<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    mt: 1,
  }}
>
  <Box>
    <Typography sx={labelSx}>
      Shorts
    </Typography>

    <Typography sx={dimSx}>
      {p.shorts_color}
    </Typography>
  </Box>

  <Box>
    <Typography sx={labelSx}>
      Gloves
    </Typography>

    <Typography sx={dimSx}>
      {p.glove_color}
    </Typography>
  </Box>
</Box>

          {/* posted date */}
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Typography sx={labelSx}>Posted:</Typography>
            <Typography sx={{ color: '#7BEA67', fontSize: 13 }}>
              {new Date(p.created_at).toLocaleDateString()}
            </Typography>
          </Box>

          {/* comments w/ scroll + arrows */}
          <Box sx={{ mt: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography sx={labelSx}>Comments:</Typography>
              <ChatBubbleOutlineRoundedIcon fontSize='small' />
              <Typography sx={{ fontSize: 13 }}>
                {p.comments_count} Comments
              </Typography>
            </Box>

            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  maxHeight: 100,
                  overflowY: 'auto',
                  pr: 4,
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 1,
                }}
              >
                {p.comments.slice(0, 3).map((c) => (
                  <Box
                    key={c.id}
                    sx={{
                      p: 1,
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Typography sx={{ ...dimSx, fontWeight: 700, mb: 0.25 }}>
                      {c.commenter || '[commenter]'}
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>{c.content}</Typography>
                  </Box>
                ))}
              </Box>

              {/* decorative chevrons */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  color: '#f0c040',
                }}
              >
                <KeyboardArrowUpRoundedIcon fontSize='small' />
                <KeyboardArrowDownRoundedIcon fontSize='small' />
              </Box>
            </Box>
          </Box>

          {/* sponsors + actions */}
          <Box
            sx={{
              mt: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              flexWrap: 'wrap',
            }}
          >
            <Typography sx={labelSx}>Sponsors:</Typography>
            <PeopleOutlineRoundedIcon fontSize='small' />
            <Typography sx={{ fontSize: 13 }}>{p.sponsors_count}</Typography>
            <MLink
              component='button'
              underline='hover'
              onClick={() => onViewSponsors?.(p.id)}
              sx={{ color: '#f0c040', fontSize: 13 }}
            >
              View
            </MLink>
          </Box>

          {/* actions */}
          <Box sx={{ mt: 1.5, display: 'grid', gap: 1 }}>
            <Button
              onClick={() => onUpdate?.(p)}
              variant='contained'
              fullWidth
              sx={{
                bgcolor: '#f0c040',
                color: '#000',
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '8px',
                height: 34,
                '&:hover': { bgcolor: '#ffd465' },
              }}
            >
              Update
            </Button>
            <Button
              onClick={() => onDelete?.(p.id)}
              variant='outlined'
              fullWidth
              sx={{
                color: '#fff',
                borderColor: '#fff',
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: '8px',
                height: 34,
                '&:hover': { borderColor: '#f0c040', color: '#f0c040' },
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
