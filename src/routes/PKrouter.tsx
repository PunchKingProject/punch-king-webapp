import { Box, CircularProgress } from '@mui/material';
import { lazy, Suspense, type ComponentType } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import ROUTES from './routePath.ts';

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
const Adminlayout = Loadable(lazy(() => import('../layouts/Adminlayout.tsx')));
const UserLayout = Loadable(lazy(() => import('../layouts/UserLayout.tsx')));

const TeamLayout = Loadable(lazy(() => import('../layouts/TeamLayout.tsx')));

const AdminPage = Loadable(lazy(() => import('../pages/admin/AdminPage.tsx')));
const DashboardPage = Loadable(
  lazy(() => import('../pages/admin/Dashboard/DashboardPage.tsx'))
);
const LicensingPage = Loadable(
  lazy(() => import('../pages/admin/Licensing/LicensingPage.tsx'))
);
const SponsorshipPage = Loadable(
  lazy(() => import('../pages/admin/Sponsorship/SponsorshipPage.tsx'))
);
const SubscriptionPage = Loadable(
  lazy(() => import('../pages/admin/Subscription/SubscriptionPage.tsx'))
);
const TeamsPage = Loadable(
  lazy(() => import('../pages/admin/Teams/TeamsPage.tsx'))
);
const UsersPage = Loadable(
  lazy(() => import('../pages/admin/Users/UsersPage.tsx'))
);
const AdminPasswordChangePage = Loadable(
  lazy(() => import('../pages/forgot-password/AdminPasswordChange.tsx'))
);
const ForgotPasswordPage = Loadable(
  lazy(() => import('../pages/forgot-password/ForgotPassword.tsx'))
);
const LandingPage = Loadable(
  lazy(() => import('../pages/landing/LandingPage.tsx'))
);
const SignInPage = Loadable(lazy(() => import('../pages/sign-in/SignInPage.tsx')));
const TeamsDetailsPage = Loadable(
  lazy(() => import('../pages/admin/Teams/TeamsDetailsPage.tsx'))
);
const UsersDetailsPage = Loadable(
  lazy(() => import('../pages/admin/Users/UsersDetailsPage.tsx'))
);
const LicensingDetailsPage = Loadable(
  lazy(() => import('../pages/admin/Licensing/LicensingDetailsPage.tsx'))
);
const SubscriptionDetailsPage = Loadable(
  lazy(() => import('../pages/admin/Subscription/SubscriptionDetailsPage.tsx'))
);
const SponsorshipDetailsPage = Loadable(
  lazy(() => import('../pages/admin/Sponsorship/SponsorshipDetailsPage.tsx'))
);

const ContinueSignup = Loadable(
  lazy(() => import('../pages/sign-up/ContinueSignup.tsx'))
);
const SignupGuard = Loadable(
  lazy(() => import('../pages/sign-up/SignupGuard.tsx'))
);
const Step1 = Loadable(lazy(() => import('../pages/sign-up/steps/Step1.tsx')));
const Step2 = Loadable(lazy(() => import('../pages/sign-up/steps/Step2.tsx')));
const Step3 = Loadable(lazy(() => import('../pages/sign-up/steps/Step3.tsx')));
const Step4 = Loadable(lazy(() => import('../pages/sign-up/steps/Step4.tsx')));
const Preview = Loadable(lazy(() => import('../pages/sign-up/steps/Preview.tsx')));
const Welcome = Loadable(lazy(() => import('../pages/sign-up/Welcome.tsx')));
// const UserDashboard = Loadable(lazy(() => import('../pages/user/Dashboard')));
const TeamDashboard = Loadable(
  lazy(() => import('../pages/team/Dashboard/DashboardPage.tsx'))
);
const TeamCataloguePage = Loadable(
  lazy(() => import('../pages/team/Catalogue/CataloguePage.tsx'))
);
const TeamMySubsPage = Loadable(
  lazy(() => import('../pages/team/MySubscriptions/MySubscriptionsPage.tsx'))
);
const TeamMyLicensingPage = Loadable(
  lazy(() => import('../pages/team/MyLicensing/MyLicensingPage.tsx'))
);
const TeamMySponsorshipPage = Loadable(
  lazy(() => import('../pages/team/MySponsorship/MySponsorshipPage.tsx'))
);
const TeamInboxPage = Loadable(
  lazy(() => import('../pages/team/Inbox/InboxPage.tsx'))
);
const UploadMediaPage = Loadable(
  lazy(() => import('../pages/team/Catalogue/UploadMediaPage.tsx'))
);
const UserDashboardPage = Loadable(
  lazy(() => import('../pages/user/Dashboard/DashboardPage.tsx'))
);
const UserMySponsorshipsPage = Loadable(
  lazy(() => import('../pages/user/MySponsorships/MySponsorshipsPage.tsx'))
);

const UserInboxPage = Loadable(
  lazy(() => import('../pages/user/Inbox/InboxPage.tsx'))
);
const UserFeedViewPage = Loadable(
  lazy(() => import('../pages/user/Dashboard/FeedViewPage.tsx'))
);
const UserSponsorshipPage = Loadable(
  lazy(() => import('../pages/user/Dashboard/SponsorshipPage.tsx'))
);
const BuySponsorsPage = Loadable(
  lazy(() => import('../pages/user/MySponsorships/BuySponsorsPage.tsx'))
);
const LicensePaymentPage = Loadable(
  lazy(() => import('../pages/team/MyLicensing/LicensePaymentPage.tsx'))
);
const BuySubscriptionPage = Loadable(
  lazy(() => import('../pages/team/MySubscriptions/BuySubscriptionPage.tsx'))
);
const TeamMySponsorshipsDetailsPage = Loadable(
  lazy(() => import('../pages/team/MySponsorship/MySponsorshipDetailsPage.tsx'))
);
const TermsPage = Loadable(lazy(() => import('../pages/legal/TermsPage.tsx')));


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
