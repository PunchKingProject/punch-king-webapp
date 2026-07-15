import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';

type PostMediaProps = {
  src?: string | null;
  alt?: string;
  title?: string;
  height?: number | string;
  maxHeight?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill';
  borderRadius?: number | string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
};

const VIDEO_EXTENSIONS =
  /\.(mp4|webm|mov|m4v|ogg|ogv|avi)(\?.*)?$/i;

const IMAGE_EXTENSIONS =
  /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)(\?.*)?$/i;

export function isVideoMedia(url?: string | null): boolean {
  if (!url) return false;

  const cleanUrl = url.toLowerCase();

  return (
    VIDEO_EXTENSIONS.test(cleanUrl) ||
    cleanUrl.includes('/video/') ||
    cleanUrl.includes('video%2f')
  );
}

export function isImageMedia(url?: string | null): boolean {
  if (!url) return false;

  const cleanUrl = url.toLowerCase();

  return (
    IMAGE_EXTENSIONS.test(cleanUrl) ||
    cleanUrl.includes('/image/') ||
    cleanUrl.includes('image%2f')
  );
}

export default function PostMedia({
  src,
  alt = 'Post media',
  title,
  height = 320,
  maxHeight = 520,
  objectFit = 'cover',
  borderRadius = 2,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  poster,
  onClick,
}: PostMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isLoading, setIsLoading] = useState(Boolean(src));
  const [hasError, setHasError] = useState(false);

  const mediaType = useMemo(() => {
    if (!src) return 'empty';
    if (isVideoMedia(src)) return 'video';
    if (isImageMedia(src)) return 'image';

    // Most older posts are images, so use image as the safe fallback.
    return 'image';
  }, [src]);

  useEffect(() => {
    setIsLoading(Boolean(src));
    setHasError(false);
  }, [src]);

  const sharedStyles = {
    width: '100%',
    height,
    maxHeight,
    display: 'block',
    objectFit,
    borderRadius,
    bgcolor: '#000',
  };

  if (!src || mediaType === 'empty') {
    return (
      <Box
        sx={{
          ...sharedStyles,
          minHeight: 220,
          display: 'grid',
          placeItems: 'center',
          color: 'rgba(255,255,255,0.45)',
          bgcolor: '#161616',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <BrokenImageOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />

          <Typography sx={{ fontSize: '0.85rem' }}>
            No media available
          </Typography>
        </Box>
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box
        sx={{
          ...sharedStyles,
          minHeight: 220,
          display: 'grid',
          placeItems: 'center',
          color: 'rgba(255,255,255,0.55)',
          bgcolor: '#161616',
        }}
      >
        <Box sx={{ textAlign: 'center', px: 2 }}>
          <BrokenImageOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />

          <Typography sx={{ fontWeight: 800 }}>
            Media failed to load
          </Typography>

          <Typography
            sx={{
              fontSize: '0.78rem',
              mt: 0.5,
              color: 'rgba(255,255,255,0.42)',
            }}
          >
            The file may be unavailable or unsupported.
          </Typography>
        </Box>
      </Box>
    );
  }

  if (mediaType === 'video') {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          borderRadius,
          overflow: 'hidden',
          bgcolor: '#000',
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
      >
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'rgba(0,0,0,0.7)',
            }}
          >
            <CircularProgress size={34} sx={{ color: '#f0c040' }} />
          </Box>
        )}

        {!controls && (
          <PlayCircleOutlineIcon
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 1,
              transform: 'translate(-50%, -50%)',
              color: '#f0c040',
              fontSize: 64,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 5px 14px rgba(0,0,0,0.8))',
            }}
          />
        )}

        <Box
          ref={videoRef}
          component='video'
          src={src}
          title={title || alt}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          preload='metadata'
          poster={poster}
          onLoadedMetadata={() => setIsLoading(false)}
          onCanPlay={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          onClick={(event) => {
            if (controls) {
              event.stopPropagation();
            }
          }}
          sx={sharedStyles}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        borderRadius,
        overflow: 'hidden',
        bgcolor: '#000',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'rgba(0,0,0,0.65)',
          }}
        >
          <CircularProgress size={34} sx={{ color: '#f0c040' }} />
        </Box>
      )}

      <Box
        component='img'
        src={src}
        alt={alt}
        loading='lazy'
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        sx={sharedStyles}
      />
    </Box>
  );
}