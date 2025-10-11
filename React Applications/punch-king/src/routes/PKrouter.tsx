import { Box, CircularProgress } from '@mui/material';
import { lazy, Suspense, type ComponentType } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import ROUTES from './routePath';

// import SubscriptionDetailsPage from '../pages/admin/Subscription/SubscriptionDetailsPage';
// import AdminPasswordChangePage from '../pages/forgot-password/AdminPasswordChange';

// ---------- Reusable Suspense wrapper ----------
function PageFallback() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: '#0A0A0A',
      }}
    >
      <CircularProgress />
    </Box>
  );
}

function Loadable<T extends object>(Comp: ComponentType<T>) {
  return function LoadableComponent(props: T) {
    return (
      <Suspense fallback={<PageFallback />}>
        <Comp {...props} />
      </Suspense>
    );
  };
}

// ---------- Lazy imports (one chunk per page/layout) ----------
const Adminlayout = Loadable(lazy(() => import('../layouts/Adminlayout')));
const UserLayout = Loadable(lazy(() => import('../layouts/UserLayout')));

const TeamLayout = Loadable(lazy(() => import('../layouts/TeamLayout')));

const AdminPage = Loadable(lazy(() => import('../pages/admin/AdminPage')));
const DashboardPage = Loadable(
  lazy(() => import('../pages/admin/Dashboard/DashboardPage'))
);
const LicensingPage = Loadable(
  lazy(() => import('../pages/admin/Licensing/LicensingPage'))
);
const SponsorshipPage = Loadable(
  lazy(() => import('../pages/admin/Sponsorship/SponsorshipPage'))
);
const SubscriptionPage = Loadable(
  lazy(() => import('../pages/admin/Subscription/SubscriptionPage'))
);
const TeamsPage = Loadable(
  lazy(() => import('../pages/admin/Teams/TeamsPage'))
);
const UsersPage = Loadable(
  lazy(() => import('../pages/admin/Users/UsersPage'))
);
const AdminPasswordChangePage = Loadable(
  lazy(() => import('../pages/forgot-password/AdminPasswordChange'))
);
const ForgotPasswordPage = Loadable(
  lazy(() => import('../pages/forgot-password/ForgotPassword'))
);
const LandingPage = Loadable(
  lazy(() => import('../pages/landing/LandingPage'))
);
const SignInPage = Loadable(lazy(() => import('../pages/sign-in/SignInPage')));
const TeamsDetailsPage = Loadable(
  lazy(() => import('../pages/admin/Teams/TeamsDetailsPage'))
);
const UsersDetailsPage = Loadable(
  lazy(() => import('../pages/admin/Users/UsersDetailsPage'))
);
const LicensingDetailsPage = Loadable(
  lazy(() => import('../pages/admin/Licensing/LicensingDetailsPage'))
);
const SubscriptionDetailsPage = Loadable(
  lazy(() => import('../pages/admin/Subscription/SubscriptionDetailsPage'))
);
const SponsorshipDetailsPage = Loadable(
  lazy(() => import('../pages/admin/Sponsorship/SponsorshipDetailsPage'))
);

const ContinueSignup = Loadable(
  lazy(() => import('../pages/sign-up/ContinueSignup'))
);
const SignupGuard = Loadable(
  lazy(() => import('../pages/sign-up/SignupGuard'))
);
const Step1 = Loadable(lazy(() => import('../pages/sign-up/steps/Step1')));
const Step2 = Loadable(lazy(() => import('../pages/sign-up/steps/Step2')));
const Step3 = Loadable(lazy(() => import('../pages/sign-up/steps/Step3')));
const Step4 = Loadable(lazy(() => import('../pages/sign-up/steps/Step4')));
const Preview = Loadable(lazy(() => import('../pages/sign-up/steps/Preview')));
const Welcome = Loadable(lazy(() => import('../pages/sign-up/Welcome')));
// const UserDashboard = Loadable(lazy(() => import('../pages/user/Dashboard')));
const TeamDashboard = Loadable(
  lazy(() => import('../pages/team/Dashboard/DashboardPage'))
);
const TeamCataloguePage = Loadable(
  lazy(() => import('../pages/team/Catalogue/CataloguePage'))
);
const TeamMySubsPage = Loadable(
  lazy(() => import('../pages/team/MySubscriptions/MySubscriptionsPage'))
);
const TeamMyLicensingPage = Loadable(
  lazy(() => import('../pages/team/MyLicensing/MyLicensingPage'))
);
const TeamMySponsorshipPage = Loadable(
  lazy(() => import('../pages/team/MySponsorship/MySponsorshipPage'))
);
const TeamInboxPage = Loadable(
  lazy(() => import('../pages/team/Inbox/InboxPage'))
);
const UploadMediaPage = Loadable(
  lazy(() => import('../pages/team/Catalogue/UploadMediaPage'))
);
const UserDashboardPage = Loadable(
  lazy(() => import('../pages/user/Dashboard/DashboardPage'))
);
const UserMySponsorshipsPage = Loadable(
  lazy(() => import('../pages/user/MySponsorships/MySponsorshipsPage'))
);

const UserInboxPage = Loadable(
  lazy(() => import('../pages/user/Inbox/InboxPage'))
);
const UserFeedViewPage = Loadable(
  lazy(() => import('../pages/user/Dashboard/FeedViewPage'))
);
const UserSponsorshipPage = Loadable(
  lazy(() => import('../pages/user/Dashboard/SponsorshipPage'))
);
const BuySponsorsPage = Loadable(
  lazy(() => import('../pages/user/MySponsorships/BuySponsorsPage'))
);
const LicensePaymentPage = Loadable(
  lazy(() => import('../pages/team/MyLicensing/LicensePaymentPage'))
);
const BuySubscriptionPage = Loadable(
  lazy(() => import('../pages/team/MySubscriptions/BuySubscriptionPage'))
);
const TeamMySponsorshipsDetailsPage = Loadable(
  lazy(() => import('../pages/team/MySponsorship/MySponsorshipDetailsPage'))
);
const TermsPage = Loadable(lazy(() => import('../pages/legal/TermsPage')));


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<LandingPage />} />
      <Route path='/sign-in' element={<SignInPage />} />

      <Route path='/continue-signup' element={<ContinueSignup />} />

      {/* <Route path='/sign-up' element={<SignUpPage />} /> */}
      <Route path='/sign-up' element={<SignupGuard />}>
        <Route
          index
          // path='step1'
          element={<Step1 />}
        />
        <Route path='step2' element={<Step2 />} />
        <Route path='step3' element={<Step3 />} />
        <Route path='step4' element={<Step4 />} />
        <Route path='complete' element={<Preview />} />
      </Route>
      <Route path='welcome' element={<Welcome />} />
      <Route path={ROUTES.TERMS} element={<TermsPage />} />

      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/confirm-password' element={<AdminPasswordChangePage />} />
      <Route path='/admin' element={<Adminlayout />}>
        <Route index element={<DashboardPage />} />
        <Route path='teams' element={<TeamsPage />} />
        <Route path='teams/details/:teamId' element={<TeamsDetailsPage />} />
        <Route path='users' element={<UsersPage />} />
        <Route
          path='users/details/:sponsor_id'
          element={<UsersDetailsPage />}
        />
        <Route path='licensing' element={<LicensingPage />} />
        <Route
          path='licensing/details/:team_id'
          element={<LicensingDetailsPage />}
        />
        <Route path='subscription' element={<SubscriptionPage />} />
        <Route
          path='subscription/details/:team_id'
          element={<SubscriptionDetailsPage />}
        />
        <Route path='sponsorship' element={<SponsorshipPage />} />
        <Route
          path='sponsorship/details/:purchase_id'
          element={<SponsorshipDetailsPage />}
        />
      </Route>
      {/* User */}
      <Route path='/user' element={<UserLayout />}>
        <Route index element={<UserDashboardPage />} />
        <Route path='my-sponsorships' element={<UserMySponsorshipsPage />} />
        <Route
          path='my-sponsorships/buy-sponsors'
          element={<BuySponsorsPage />}
        />
        <Route path='inbox' element={<UserInboxPage />} />
        <Route path='feeds/:postId' element={<UserFeedViewPage />} />{' '}
        {/* NEW */}
        <Route
          path='feeds/:postId/sponsorship'
          element={<UserSponsorshipPage />}
        />
      </Route>

      {/* Team */}
      <Route path='/team' element={<TeamLayout />}>
        <Route index element={<TeamDashboard />} />
        <Route path='catalogue' element={<TeamCataloguePage />} />
        <Route path='catalogue/upload' element={<UploadMediaPage />} />
        <Route path='my-subscriptions' element={<TeamMySubsPage />} />
        <Route
          path={'my-subscriptions/payment'}
          element={<BuySubscriptionPage />}
        />
        <Route path='my-licensing' element={<TeamMyLicensingPage />} />
        <Route path='my-licensing/payments' element={<LicensePaymentPage />} />
        <Route path='my-sponsorship' element={<TeamMySponsorshipPage />} />
        <Route
          path='my-sponsorship/details/:sponsorId'
          element={<TeamMySponsorshipsDetailsPage />}
        />
        <Route path='inbox' element={<TeamInboxPage />} />
      </Route>
      <Route path='/admin' element={<AdminPage />} />
      <Route path='*' element={<Navigate to='/' />} />
    </>
  )
);

const PKroutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
export default PKroutes;
