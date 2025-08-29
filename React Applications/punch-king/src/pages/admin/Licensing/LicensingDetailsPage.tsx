import { Box, Typography, useMediaQuery } from '@mui/material';
import ROUTES from '../../../routes/routePath';
import AdminBreadCrumbs from '../components/AdminBreadcrumbs';
import AdminSection from '../components/AdminSection';

type TeamDetails = {
  teamName?: string;
  teamEmail?: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
};

const fallback = 'complete your profile';

const row = (label: string, value?: string) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>
      {label}:
    </Typography>
    <Typography sx={{ color: '#A2A2A2', mt: 0.75, fontSize: 14 }}>
      {value || fallback}
    </Typography>
  </Box>
);

function LicensingDetailsPage() {
  const isDesktop = useMediaQuery('(min-width:910px)');

  return (
    <>
      <Box
        sx={{
          display: isDesktop ? 'block' : 'none',
        }}
      >
        <DesktopLicensingDetailsPage />
      </Box>
      <Box
        sx={{
          display: isDesktop ? 'none' : 'block',
        }}
      >
        <MobileLicensingDetailsPage />
      </Box>
    </>
  );
}
function MobileLicensingDetailsPage() {
  return <>Mobile Licensing Details Page</>;
}
const DesktopLicensingDetailsPage = () => {
  const details: TeamDetails = {
    teamName: '',
    teamEmail: '',
    phone: '',
    address: '',
    country: '',
    state: '',
  };
  return (
    <>
      <AdminSection
        title={
          <>
            <AdminBreadCrumbs
              rootLabel='LICENSING'
              rootTo={ROUTES.LICENSING}
              currentLabel='LICENSING DETAILS PAGE'
            />
          </>
        }
        toolbar={
          <span style={{ color: '#f0c040', fontWeight: 600 }}>
            Filter by time frame ⚙️
          </span>
        }
      >
        <Box
          sx={{
            border: '2px solid red',
          }}
        >
          <Typography
            component={'h1'}
            variant='h1'
            sx={{
              fontWeight: 900,
            }}
          >
            TEAM DETAILS
          </Typography>

          {/* Two-column detail grid */}
          <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              maxWidth: 880,
              mx: 0, // keep aligned with content column
            }}
          >
            {/* Left column */}
            <Box>
              {row('Team name', details.teamName)}
              {row('Phone number', details.phone)}
              {row('Country', details.country)}
            </Box>

            {/* Right column */}
            <Box>
              {row('Team email', details.teamEmail)}
              {row('Address', details.address)}
              {row('State', details.state)}
            </Box>
          </Box>
        </Box>
      </AdminSection>
    </>
  );
};
export default LicensingDetailsPage;
