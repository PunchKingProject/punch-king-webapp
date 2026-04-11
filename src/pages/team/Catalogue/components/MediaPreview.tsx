// components/MediaPreview.tsx
import { Box } from '@mui/material';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import { useRef, useState } from 'react';

function isVideo(url: string): boolean {
  return /\.(mp4|mov|webm|ogg|avi)(\?.*)?$/i.test(url);
}

// type Props = {
//   url: string | null;
//   height?: number | string;
// };

// MediaPreview.tsx
export default function MediaPreview({ url }: { url: string | null }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  if (!url) {
    return (
      <Box
        sx={{
          width: '100%',
          aspectRatio: '16/9', // neutral fallback only for the empty state
          display: 'grid',
          placeItems: 'center',
          color: '#A2A2A2',
          fontSize: 14,
          bgcolor: '#111',
          borderRadius: '6px',
        }}
      >
        No media
      </Box>
    );
  }

  if (isVideo(url)) {
    return (
      <Box sx={{ position: 'relative', width: '100%', bgcolor: '#000', borderRadius: '6px', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src={url}
          // No fixed height — video renders at its natural aspect ratio
          style={{ width: '100%', display: 'block' }}
          playsInline
          loop
          controls  // use native controls so the user can seek, fullscreen etc
          onClick={() => {
            if (!videoRef.current) return;
            if (videoRef.current.paused) {
              videoRef.current.play();
              setPlaying(true);
            } else {
              videoRef.current.pause();
              setPlaying(false);
            }
          }}
        />

        {!playing && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'rgba(0,0,0,0.35)',
              cursor: 'pointer',
              pointerEvents: 'none',
            }}
          >
            <PlayCircleOutlineRoundedIcon
              sx={{ fontSize: 52, color: '#f0c040', opacity: 0.9 }}
            />
          </Box>
        )}
      </Box>
    );
  }

  // Image — also flows to natural height
  return (
    <Box sx={{ width: '100%', bgcolor: '#000', borderRadius: '6px', overflow: 'hidden' }}>
      <img
        src={url}
        alt='post media'
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </Box>
  );
}