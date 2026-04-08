
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { teamPostImage1, teamPostImage2, teamPostImage3 } from '../../../assets';
import FilterIcon from '../../../assets/filterIcon.svg?react';
import CustomButton from '../../../components/buttons/CustomButton';
import { colors } from '../../../theme/colors';

const images = [
  teamPostImage3,
  teamPostImage2,
  teamPostImage1,
  teamPostImage3,
  teamPostImage3,
];

const TeamPost = () => {


  return (
    <Box
      id='posts'
      sx={{
        width: '100%',
        py: 4,
        backgroundColor: '#000',
        minHeight: '100vh',
      }}
    >
      <Typography
        component={'h1'}
        sx={{
          fontSize: '3.25rem',
          fontWeight: 900,
          textAlign: 'center',
          mb: 4,
          color: 'white',
        }}
      >
        TEAM
        <span
          style={{
            color: colors.Accent,
          }}
        >
          POSTS
        </span>
      </Typography>
      <Box display={'flex'} justifyContent={'center'} mb={6}>
        <CustomButton
          variant='outlined'
          color='primary'
          sx={{
            border: `2px solid ${colors.Accent}`,
            width: '80vw',
            maxWidth: '419px',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              sx={{
                color: '#EFAF00',
                fontWeight: 600,
                fontSize: '0.875rem',
                fontFamily: 'Poppins',
              }}
            >
              filter by team(s)
            </Typography>
            <FilterIcon />
          </Box>
        </CustomButton>
      </Box>
      {/* <OverlappingSliderCarousel /> */}
      <OverlappingCarousel />
    </Box>
  );
};

export default TeamPost;

const OverlappingCarousel = () => {
  const [centerIndex, setCenterIndex] = useState(0);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md')); // >= 900px
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm')); // >= 600px

  const visibleCount = isMdUp ? 5 : isSmUp ? 3 : 2;
  const half = Math.floor(visibleCount / 2);
  const total = images.length;

  const getRelativeIndex = (i: number) => {
    const delta = (i - centerIndex + total) % total;
    return delta <= half ? delta : delta - total;
  };

  const handleNext = useCallback(() => {
    setCenterIndex((prev) => (prev + 1) % total);
  }, [total]);

  // const handlePrev = useCallback(() => {
  //   setCenterIndex((prev) => (prev - 1 + total) % total);
  // }, [total]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        // border:'2px solid red',
        overflow: 'hidden',
        height: { xs: 170, sm: 200, md: 230 }, // 🟡 UPDATED: match Figma sizing
      }}
    >
      <Box
        sx={{
          width: '90vw',
          maxWidth: '1300px',
          position: 'relative',
          height: '100%', // ✅ NEW: height to match image container
        }}
      >
        {images.map((img, i) => {
          const offset = getRelativeIndex(i);
          if (Math.abs(offset) > half) return null;

          const spacing = isMdUp ? 180 : isSmUp ? 170 : 160;
          const translateX = offset * spacing;
          const scale = offset === 0 ? 1 : 0.85;
          const zIndex = 10 - Math.abs(offset);

          // ✨ Depth-based visibility
          let opacity = 1;
          let brightness = 1;

          if (Math.abs(offset) === 1) {
            opacity = 0.7;
            brightness = 0.85;
          } else if (Math.abs(offset) === 2) {
            opacity = 0.4;
            brightness = 0.6;
          }

          return (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: `translateX(${translateX}px) translateX(-50%) scale(${scale})`,
                transition: 'all 0.4s ease',
                zIndex,
                opacity,
                filter: `brightness(${brightness})`,
                backgroundColor: colors.Freeze,
                border:
                  offset === 0
                    ? `4px solid ${colors.Freeze}`
                    : '2px solid rgba(255,255,255,0.2)',
                boxShadow:
                  offset === 0
                    ? '0 0 25px rgba(255,255,255,0.2)'
                    : '0 6px 24px rgba(0, 0, 0, 0.5)',
                borderRadius: 2,
                width: { xs: 160, sm: 210, md: 240 },
                height: { xs: 130, sm: 170, md: 200 },
                overflow: 'hidden',
              }}
            >
              <Box
                component='img'
                src={img}
                alt={`Slide ${i}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
