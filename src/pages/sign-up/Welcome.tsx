
// src/pages/welcome/Welcome.tsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

// ⬇️ Your real images (adjust paths as needed)
import { img1, img2, img3, img4, img5, teamImg1, teamImg2, teamImg3, teamImg4, teamImg5 } from '../../assets';

const GOLD = '#EFAF00';
const CREAM = '#FFFCF4';
const INK = '#000';
const MUTED = '#CFCFCF';

const STORAGE_KEYS = {
  draft: 'pk_registration_draft',
  seenTeam: 'pk_seen_onboarding_team',
  seenSponsor: 'pk_seen_onboarding_sponsor',
};

type Role = 'team' | 'sponsor';

type Slide = {
  title: string;
  subtitle?: string;
  img?: string; // image src (preferred)
  imgAlt?: string; // alt text
  imgFit?: 'cover' | 'contain';
  emoji?: string; // fallback if no image
};

/* ---------------- Slides ---------------- */
const TEAM_SLIDES: Slide[] = [
  {
    title: 'BOXING LICENSE',
    subtitle: 'Get your team licensed',
    img: teamImg1,
    imgAlt: 'Get your team licensed',
    imgFit: 'cover',
  },
  {
    title: 'SPONSORSHIPS',
    subtitle: 'Get sponsorships from your fans',
    img: teamImg2,
    imgAlt: 'Sponsor teams',
    imgFit: 'cover',
  },
  {
    title: 'SHOWCASE',
    subtitle: 'Showcase your talents to the world',
    img: teamImg3,
    imgAlt: 'Team ranking',
    imgFit: 'contain',
  },
  {
    title: 'COMPETE',
    subtitle: 'Get selected to compete for the crown by your sponsorships',
    img: teamImg4,
    imgAlt: 'Make champions',
    imgFit: 'cover',
  },
  {
    title: 'WIN',
    subtitle: 'Be the winner and unlock all the money you need',
    img: teamImg5,
    imgAlt: 'Make champions',
    imgFit: 'cover',
  },
];

const SPONSOR_SLIDES: Slide[] = [
  {
    title: 'WATCH FEEDS',
    subtitle: 'watch feeds from teams and their talents',
    img: img2,
    imgAlt: 'Watch team feeds',
    imgFit: 'cover',
  },
  {
    title: 'SPONSOR YOUR TEAMS',
    subtitle: 'Sponsor teams you want to see as champions',
    img: img3,
    imgAlt: 'Sponsor teams',
    imgFit: 'cover',
  },
  {
    title: 'VIEW RANKING',
    subtitle: 'See how your favourite teams are performing',
    img: img4,
    imgAlt: 'Team ranking',
    imgFit: 'contain',
  },
  {
    title: 'MAKE YOUR CHAMPIONS',
    subtitle: 'Support teams until they become Punch Kings',
    img: img5,
    imgAlt: 'Make champions',
    imgFit: 'cover',
  },
];

// const SPONSOR_SLIDES: Slide[] = [
//   {
//     title: 'DISCOVER TEAMS',
//     subtitle: 'Find promising talents and follow their journeys',
//     img: img2,
//     imgAlt: 'Discover teams',
//     imgFit: 'cover',
//   },
//   {
//     title: 'BUY SPONSOR UNITS',
//     subtitle: 'Support teams with units and grow their ranking',
//     img: img3,
//     imgAlt: 'Buy sponsor units',
//     imgFit: 'cover',
//   },
//   {
//     title: 'TRACK IMPACT',
//     subtitle: 'See how your support boosts teams on the leaderboard',
//     img: img4,
//     imgAlt: 'Track impact',
//     imgFit: 'contain',
//   },
//   {
//     title: 'BUILD LEGENDS',
//     subtitle: 'Help turn raw potential into champions',
//     img: img5,
//     imgAlt: 'Build legends',
//     imgFit: 'cover',
//   },
// ];

/* ---------------- JWT helpers ---------------- */
type JwtPayload = {
  email?: string;
  name?: string;
  role?: string; // 'team' | 'sponsor' | ...
  sub?: number;
  exp?: number; // seconds
};

/** base64url-safe JSON decode */
function decodeJwt(token?: string | null): JwtPayload | null {
 

  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    // base64url -> base64
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** pick role with robust fallback */
function resolveRoleFromAnywhere(
  sp: URLSearchParams,
  payload: JwtPayload | null
): Role {
  const fromToken = (payload?.role || '').toLowerCase();
  if (fromToken === 'team' || fromToken === 'sponsor') return fromToken as Role;

  const fromFlow = (localStorage.getItem('flow') || '').toLowerCase();
  if (fromFlow === 'team' || fromFlow === 'sponsor') return fromFlow as Role;

  const fromQuery = (sp.get('role') || '').toLowerCase();
  if (fromQuery === 'team' || fromQuery === 'sponsor') return fromQuery as Role;

  return 'team';
}

export default function Welcome() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  // keep token; only clear any registration draft
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEYS.draft);
  }, []);

  const token = localStorage.getItem('token');
  const payload = useMemo(() => decodeJwt(token), [token]);
  const role: Role = useMemo(
    () => resolveRoleFromAnywhere(sp, payload),
    [sp, payload]
  );

  // prevent showing onboarding when token is missing/expired
  useEffect(() => {
    if (!token) {
      navigate('/sign-in', { replace: true });
    } else if (payload?.exp && payload.exp * 1000 < Date.now()) {
      navigate('/sign-in', { replace: true });
    }
  }, [token, payload?.exp, navigate]);

  const slides = role === 'sponsor' ? SPONSOR_SLIDES : TEAM_SLIDES;

  // Preload current role slides
  useEffect(() => {
    const urls = slides.map((s) => s.img).filter(Boolean) as string[];
    urls.forEach((src) => {
      const i = new Image();
      i.src = src;
    });
  }, [slides]);

  const [mode, setMode] = useState<'hero' | 'slides'>('hero');
  const [step, setStep] = useState(0);

  const finish = useCallback(() => {
    const seenKey =
      role === 'sponsor' ? STORAGE_KEYS.seenSponsor : STORAGE_KEYS.seenTeam;
    localStorage.setItem(seenKey, '1');
    navigate(role === 'sponsor' ? '/user' : '/team', { replace: true });
  }, [navigate, role]);

  // Auto-skip if they’ve already seen onboarding for this role
  useEffect(() => {
    const seenKey =
      role === 'sponsor' ? STORAGE_KEYS.seenSponsor : STORAGE_KEYS.seenTeam;
    if (localStorage.getItem(seenKey)) {
      finish();
    }
  }, [role, finish]);

  // Keyboard arrows when on slides
  useEffect(() => {
    if (mode !== 'slides') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight')
        setStep((s) => Math.min(s + 1, slides.length - 1));
      if (e.key === 'ArrowLeft') setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, slides.length]);

  const displayName =
    payload?.name || (role === 'team' ? 'TEAM NAME' : 'SPONSOR NAME');

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: INK,
        color: CREAM,
        display: 'grid',
        placeItems: 'center',
        p: { xs: 2, md: 4 },
      }}
    >
      {mode === 'hero' ? (
        <HeroScreen
          displayName={displayName}
          onTakeTour={() => {
            setMode('slides');
            setStep(0);
          }}
          onSkip={finish}
        />
      ) : (
        <SlidesScreen
          slides={slides}
          step={step}
          setStep={setStep}
          onSkip={finish}
          onFinish={finish}
        />
      )}
    </Box>
  );
}

/* ===========================
   HERO SCREEN
=========================== */
function HeroScreen({
  displayName,
  onTakeTour,
  onSkip,
}: {
  displayName: string;
  onTakeTour: () => void;
  onSkip: () => void;
}) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        width: '100%',
        maxWidth: 900,
        display: 'grid',
        gap: 3,
        justifyItems: 'center',
      }}
    >
      <Typography sx={{ fontSize: 14, color: MUTED, letterSpacing: 1 }}>
        [{displayName}]
      </Typography>
      <Typography sx={{ fontSize: 16, color: MUTED }}>Welcome to</Typography>
      <Box
        aria-label='Punch King glove'
        sx={{
          width: { xs: 220, md: 320 },
          height: { xs: 220, md: 320 },
          borderRadius: '50%',
          // background: `radial-gradient(60% 60% at 50% 50%, ${GOLD} 0%, #7a5a00 90%)`,
          display: 'grid',
          placeItems: 'center',
          userSelect: 'none',
          overflow: 'hidden', // ensure the image respects the circle
          p: { xs: 2, md: 3 }, // optional: inner padding
        }}
      >
        <Box
          component='img'
          src={img1}
          alt='Punch glove'
          loading='eager'
          decoding='async'
          draggable={false}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain', // or 'cover' if you want it to fill fully
            display: 'block',
            filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))',
          }}
        />
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
        Home of champions
      </Typography>
      <Typography sx={{ fontSize: 13, color: MUTED }}>
        take a tour to get familiar with your new home
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, mt: 1 }}>
        <LinkLike onClick={onTakeTour} color={GOLD}>
          Take tour
        </LinkLike>
        <LinkLike onClick={onSkip} color={MUTED}>
          Skip tour
        </LinkLike>
      </Box>
    </Box>
  );
}

/* ===========================
   SLIDES SCREEN
=========================== */
function SlidesScreen({
  slides,
  step,
  setStep,
  onSkip,
  onFinish,
}: {
  slides: Slide[];
  step: number;
  setStep: (i: number) => void;
  onSkip: () => void;
  onFinish: () => void;
}) {
  const s = slides[step];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 960,
        mx: 'auto',
        display: 'grid',
        gridTemplateRows: '1fr auto',
        minHeight: { xs: 520, md: 640 },
      }}
    >
      {/* Slide content */}
      <Box
        sx={{
          textAlign: 'center',
          display: 'grid',
          justifyItems: 'center',
          alignContent: 'center',
          gap: 2,
          px: { xs: 2, md: 6 },
        }}
      >
        <Typography
          sx={{
            fontWeight: 900,
            letterSpacing: 1,
            fontSize: { xs: 22, md: 28 },
          }}
        >
          {s.title}
        </Typography>
        {s.subtitle && (
          <Typography sx={{ color: MUTED, fontSize: 13 }}>
            {s.subtitle}
          </Typography>
        )}

        {/* Illustration */}
        <Box
          sx={{
            width: { xs: 180, md: 260 },
            height: { xs: 180, md: 260 },
            borderRadius: '24px',
            mt: 2,
            display: 'grid',
            placeItems: 'center',
            background:
              'linear-gradient(145deg, rgba(239,175,0,0.22) 0%, rgba(239,175,0,0.05) 100%)',
            border: '1px solid rgba(239,175,0,0.2)',
            overflow: 'hidden', // keep image clipped to rounded corners
          }}
        >
          {s.img ? (
            <Box
              component='img'
              src={s.img}
              alt={s.imgAlt ?? s.title}
              loading='lazy'
              decoding='async'
              draggable={false}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: s.imgFit ?? 'contain', // cover/contain per slide
                display: 'block',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          ) : (
            <Typography
              component='span'
              sx={{ fontSize: { xs: 80, md: 110 }, userSelect: 'none' }}
            >
              {s.emoji ?? '⭐️'}
            </Typography>
          )}
        </Box>
      </Box>
      {/* Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: { xs: 1, md: 2 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            onClick={() => setStep(Math.max(step - 1, 0))}
            disabled={step === 0}
            sx={navBtnSx}
            startIcon={<span style={{ fontSize: 18 }}>◀</span>}
          >Prev</Button>

          <Dots total={slides.length} index={step} />
          {step < slides.length - 1 ? (
            <Button
              onClick={() => setStep(Math.min(step + 1, slides.length - 1))}
              sx={navBtnSx}
              endIcon={<span style={{ fontSize: 18 }}>▶</span>}
            >Next</Button>
          ) : (
            <Button onClick={onFinish} sx={navBtnSx}>Finish</Button>
          )}
        </Box>

        <LinkLike onClick={onSkip} color={MUTED}>Skip</LinkLike>
      </Box>
    </Box>
  );
}

/* ===========================
   Small building blocks
=========================== */
function Dots({ total, index }: { total: number; index: number }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.25 }}>
      {Array.from({ length: total }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: i === index ? GOLD : 'transparent',
            border: `1px solid ${
              i === index ? GOLD : 'rgba(255,255,255,0.35)'
            }`,
          }}
        />
      ))}
    </Box>
  );
}

function LinkLike({
  children,
  onClick,
  color = GOLD,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color?: string;
}) {
  return (
    <Button
      onClick={onClick}
      sx={{
        textTransform: 'none',
        fontWeight: 700,
        px: 0,
        minWidth: 0,
        color,
        '&:hover': { color },
      }}
    >
      {children}
    </Button>
  );
}

const navBtnSx = {
  textTransform: 'none',
  fontWeight: 700,
  color: CREAM,
  px: 1.5,
  '&:hover': { color: CREAM, background: 'rgba(255,255,255,0.06)' },
};
