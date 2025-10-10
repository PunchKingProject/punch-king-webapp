import { Box, Grid, Typography } from '@mui/material';
import {
  rankingBoxer,
  rankingSmallbox1,
  rankingSmallbox2,
  rankingSmallbox3,
} from '../../../assets';
import { colors } from '../../../theme/colors';
import { gridWidth } from '../../../utils/helpers';

const data = [
  {
    title: 'Spns',
    position: '60',
    image: rankingSmallbox1,
  },
  { title: 'Pst', position: '12th', image: rankingSmallbox2 },
  { title: 'Cnt', position: '30', image: rankingSmallbox3 },
];
const TeamRanking = () => {
  return (
    <>
      <Box
      // sx={{
      //   padding: '1.56em 5.38em',
      //   '@media (min-width:910px) and (max-width:1000px)': {
      //     padding: '1.56em 2em', // override between 900px and 1000px
      //   },
      //   '@media (min-width:1000px) and (max-width:1100px)': {
      //     // height: '200px',
      //     paddingX: '1em', // override between 900px and 1000px
      //   },
      //   '@media (min-width:910px)': {
      //     // padding: '1.56em 2em', // override between 900px and 1000px
      //     display: 'flex',
      //     flexDirection: 'row',
      //     marginTop: '1em',
      //     gap: '1.5em',
      //     alignItems: 'baseline',
      //   },
      // }}
      >
        <Box id='ranking' sx={{}}>
          {/* Team Ranking */}
          <Typography
            component={'h1'}
            sx={{
              textTransform: 'uppercase',
              fontSize: '5.625rem',
              fontWeight: 900,
              textAlign: 'center',
              lineHeight: 1,
            }}
          >
            Team
          </Typography>
          <Typography
            component={'h2'}
            sx={{
              textTransform: 'uppercase',
              fontSize: '2.5rem',
              fontWeight: 600,
              textAlign: 'center',
              color: colors.Accent,
            }}
          >
            Ranking
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          '@media (min-width:910px)': {
            display: 'none',
          },
        }}
      >
        {[1, 2].map((_, index) => {
          return (
            <Box key={index} mb={'5em'}>
              <Box
                component={'img'}
                src={rankingBoxer}
                sx={{
                  display: 'block',
                  width: '193px',
                  margin: '0 auto',
                  marginTop: '1.5em',
                }}
              />
              <Box my={2}>
                <Typography
                  variant='mediumHeaderBold'
                  component={'p'}
                  sx={{
                    color: colors.Accent,
                    textAlign: 'center',
                  }}
                >
                  Team name
                </Typography>
                <Typography
                  variant='bodyTextMilkDefault'
                  component={'p'}
                  textAlign={'center'}
                >
                  King of the jungle boxing academy
                </Typography>
              </Box>
              <Box my={2}>
                <Typography
                  variant='mediumHeaderBold'
                  component={'p'}
                  sx={{
                    color: colors.Accent,
                    textAlign: 'center',
                  }}
                >
                  LC No:
                </Typography>
                <Typography
                  variant='bodyTextMilkDefault'
                  component={'p'}
                  textAlign={'center'}
                >
                  NBBofC/30/30{' '}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 8vw',
                  textAlign: 'center',
                }}
              >
                {data.map((item, index) => {
                  return (
                    <Box key={index}>
                      <Box
                        component={'img'}
                        src={rankingSmallbox1}
                        sx={{
                          objectFit: 'cover',
                          width: '53px',
                        }}
                      />
                      <Typography variant='headerBold' component={'p'}>
                        {item.position}
                      </Typography>
                      <Typography variant='bodyTextMilkDefault'>
                        {item.title}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          padding: '1.56em 5.38em',
          display: 'none',
          '@media (min-width:910px)': {
            display: 'block',
          },
          '@media (min-width:910px) and (max-width:1000px)': {
            padding: '1.56em 2em', // override between 900px and 1000px
          },
          '@media (min-width:1000px) and (max-width:1100px)': {
            // height: '200px',
            paddingX: '1em', // override between 900px and 1000px
          },
        }}
      >
        <Grid container>
          <Grid size={4}>
            <Box
              sx={{
                pr: 8,
              }}
            >
              <Typography
                variant='bodyTextMilkDefault'
                component={'p'}
                sx={{
                  wordBreak: 'break-word',
                }}
              >
                All teams on the Punch King are treated equally. Team
                sponsorship activities, verification and subscription are used
                to determine team ranking.
              </Typography>

              <Typography
                my={3}
                variant='bodyTextMilkDefault'
                component={'p'}
                sx={{
                  wordBreak: 'break-word',
                }}
              >
                Subscribe a plan, engage sponsors and increase your team update
                regularly to improve your team ranking.
              </Typography>
            </Box>
          </Grid>
          <Grid size={8} container columnSpacing={2}>
            {[1, 2].map(() => {
              return (
                <>
                  <Grid size={4} mb={5}>
                    <Box sx={{}}>
                      <Box
                        component={'img'}
                        src={rankingBoxer}
                        sx={{
                          display: 'block',
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                          // margin: '0 auto',
                          // marginTop: '1.5em',
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid size={8}>
                    <Box
                      sx={{
                        pt: 5,
                      }}
                    >
                      <Grid
                        container
                        alignItems='center'
                        columnSpacing={0}
                        rowSpacing={1.5}
                      >
                        <Grid
                          sx={{
                            '@media (min-width:910px)': {
                              width: gridWidth(4),
                            },
                            '@media (min-width:1100px)': {
                              width: gridWidth(3.5),
                            },
                          }}
                        >
                          <Box sx={{}}>
                            <Typography
                              variant='mediumHeaderBold'
                              component={'p'}
                              sx={{
                                color: colors.Accent,
                                // textAlign: 'center',
                              }}
                            >
                              Team name:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          sx={{
                            '@media (min-width:910px)': {
                              width: gridWidth(7),
                            },
                            '@media (min-width:1100px)': {
                              width: gridWidth(7.5),
                            },
                          }}
                        >
                          <Box sx={{}}>
                            <Typography
                              variant='bodyTextMilkDefault'
                              component={'p'}
                              // textAlign={'center'}
                            >
                              King of the jungle boxing academy
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          sx={{
                            '@media (min-width:910px)': {
                              width: gridWidth(4),
                            },
                            '@media (min-width:1100px)': {
                              width: gridWidth(3.5),
                            },
                          }}
                        >
                          <Box sx={{}}>
                            <Typography
                              variant='mediumHeaderBold'
                              component={'p'}
                              sx={{
                                color: colors.Accent,
                                // textAlign: 'center',
                              }}
                            >
                              LC No:
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid
                          sx={{
                            '@media (min-width:910px)': {
                              width: gridWidth(7),
                            },
                            '@media (min-width:1100px)': {
                              width: gridWidth(7.5),
                            },
                          }}
                        >
                          <Box
                            sx={
                              {
                                // border: '2px solid green',
                              }
                            }
                          >
                            <Typography
                              variant='bodyTextMilkDefault'
                              component={'p'}
                              // textAlign={'center'}
                            >
                              NBBofC/30/30{' '}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={4}>
                          <Box>
                            <Box
                              component={'img'}
                              src={rankingSmallbox1}
                              sx={{
                                objectFit: 'cover',
                                width: '53px',
                              }}
                            />
                            <Typography variant='headerBold' component={'p'}>
                              60
                            </Typography>
                            <Typography variant='bodyTextMilkDefault'>
                              Sponsorships
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={4}>
                          <Box>
                            <Box
                              component={'img'}
                              src={rankingSmallbox1}
                              sx={{
                                objectFit: 'cover',
                                width: '53px',
                              }}
                            />
                            <Typography variant='headerBold' component={'p'}>
                              1st
                            </Typography>
                            <Typography variant='bodyTextMilkDefault'>
                              Position
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={4}>
                          <Box>
                            <Box
                              component={'img'}
                              src={rankingSmallbox1}
                              sx={{
                                objectFit: 'cover',
                                width: '53px',
                              }}
                            />
                            <Typography variant='headerBold' component={'p'}>
                              20
                            </Typography>
                            <Typography variant='bodyTextMilkDefault'>
                              Sponsors
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </>
              );
            })}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default TeamRanking;
