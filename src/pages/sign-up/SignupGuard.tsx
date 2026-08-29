import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import CustomButton from '../../components/buttons/CustomButton.tsx';
import { useAppDispatch } from '../../hooks.ts';
import { setFlow } from '../../store/registration.slice.ts';
import { colors } from '../../theme/colors.ts';
import Footer from '../landing/components/Footer.tsx';

const STEP_LABELS: Record<number, string> = {
  1: 'Email verification',
  2: 'Password creation',
  3: 'Complete your profile',
  4: 'Upload profile picture 2mb or below',
  5: 'Fighter details & debut video upload (max 10MB)',
};

const TOTAL_STEPS = Object.keys(STEP_LABELS).length;

function useCurrentStep(): number {
  const { pathname } = useLocation();
  // Matches: /step/2  | /step2  | /step-2  | /step_2  (case-insensitive)
  const m = pathname.match(/\/step(?:[-_/]?)(\d+)/i);
  const step = m ? Number(m[1]) : 1;
  return Math.min(Math.max(step, 1), TOTAL_STEPS);
}

function SignupGuard() {
  const [sp] = useSearchParams();
  const token = sp.get('token') || localStorage.getItem('token') || '';
  const flow = (sp.get('flow') as 'sponsor' | 'team') || 'sponsor';
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const step = useCurrentStep();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!token && pathname.includes('/sign-up/step') && !pathname.includes('/sign-up/step1')) {
      console.log(token);
      dispatch(setFlow({ flow: flow || 'sponsor' }));
      // Optional: uncomment if token guard is strictly required across steps
      // navigate(`/sign-up?flow=${flow}`, { replace: true });
    }
  }, [dispatch, flow, navigate, token, pathname]);

  const isCompletePage = pathname.includes('/sign-up/complete'); 

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      {/* Navbar */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          paddingRight: '24px',
          paddingTop: '24px',
        }}
      >
        <CustomButton
          variant='text'
          color='primary'
          onClick={() => navigate('/sign-in')}
        >
          Sign In
        </CustomButton>
      </Box>

      {/* Stepper */}
      <Box>
        {!isCompletePage && (
          <Box
            textAlign='center'
            mt={2}
          >
            <Typography
              variant='bodyTextMilkDefault'
              sx={{ color: 'white', fontWeight: 700, textTransform: 'capitalize' }}
            >
              {flow} signup steps
            </Typography>
            <StepDots total={5} active={step} />
            <Typography variant='body2' sx={{ mt: 1, color: '#C9C9C9' }}>
              {STEP_LABELS[step]}
            </Typography>
          </Box>
        )}
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        sx={{
          width: '100%',
          marginTop: 'auto',
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
}

export default SignupGuard;

/** Small, circular step indicator to match your mockups */
function StepDots({ total, active }: { total: number; active: number }) {
  return (
    <Box display='flex' justifyContent='center' gap={2} mt={1} px={2} flexWrap='wrap'>
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
        const status =
          n < active ? 'complete' : n === active ? 'current' : 'upcoming';
        const isFilled = n <= active; 
        return (
          <Box
            key={n}
            aria-label={`step-${n} ${status}`}
            sx={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              border: '2px solid',
              borderColor: colors.Milk,
              bgcolor: isFilled ? colors.Milk : 'transparent',
              color: isFilled ? '#0A0A0A' : colors.Milk,
              fontWeight: 500,
              fontSize: 14,
              transition: 'all .2s ease',
              transform: status === 'current' ? 'scale(1.05)' : 'none',
            }}
          >
            {n}
          </Box>
        );
      })}
    </Box>
  );
}