import { Box } from '@mui/material';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import { useRef, useState } from 'react';

// Utility to check file type
function isVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

type Props = {
  url: string | null;
  title?: string;
  width: number | string;
  height: number | string;
};

export default function FeedThumbnail({ url, title, width, height }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const containerSx = {
    width,
    height,
    flex: '0 0 auto',
    borderRadius: 2,
    bgcolor: '#000', // Solid black for letterboxing
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  } as const;

  if (!url) return <Box sx={containerSx} />;

  // SHARED TOGGLE LOGIC
  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents clicking the video from triggering card-level actions
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  if (isVideo(url)) {
    return (
      <Box
        sx={{ ...containerSx, cursor: 'pointer' }}
        onClick={handleTogglePlay} // Clicking the container toggles play
      >
        <video
          ref={videoRef}
          src={url}
          playsInline
          loop
          muted // Required for reliable play behavior in most browsers
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain', // Shows ALL content
            display: 'block',
          }}
        />

        {/* Play overlay — only when paused */}
        {!playing && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'rgba(0,0,0,0.3)',
              pointerEvents: 'none', // Lets the click "fall through" to the Box
            }}
          >
            <PlayCircleOutlineRoundedIcon
              sx={{ fontSize: 48, color: '#EFAF00' }}
            />
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={containerSx}>
      <img
        src={url}
        alt={title || 'post media'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain', // Shows ALL content
          display: 'block',
        }}
      />
    </Box>
  );
}