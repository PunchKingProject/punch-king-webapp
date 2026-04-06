// components/HeroImageWithLoader.tsx
import { Box, CircularProgress } from '@mui/material';
import { useState } from 'react';

interface HeroImageWithLoaderProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  sx?: object;
  objectFit?: 'cover' | 'contain';
}

const HeroImageWithLoader = ({
  src,
  alt,
  aspectRatio = '16/9',
  sx = {},
  objectFit = 'contain',
}: HeroImageWithLoaderProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        ...sx,
      }}
    >
      {!loaded && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        component='img'
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        sx={{
          objectFit,
          width: '100%',
          height: '100%',
          display: loaded ? 'block' : 'none',
          ...sx,
        }}
      />
    </Box>
  );
};

export default HeroImageWithLoader;
