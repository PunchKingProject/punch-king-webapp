import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Adminlayout from '../layouts/Adminlayout';
import AdminPage from '../pages/admin/AdminPage';
import DashboardPage from '../pages/admin/Dashboard/DashboardPage';
import LicensingPage from '../pages/admin/Licensing/LicensingPage';
import SponsorshipPage from '../pages/admin/Sponsorship/SponsorshipPage';
import SubscriptionPage from '../pages/admin/Subscription/SubscriptionPage';
import TeamsPage from '../pages/admin/Teams/TeamsPage';
import UsersPage from '../pages/admin/Users/UsersPage';
import AdminPasswordChangePage from '../pages/forgot-password/AdminPasswordChange';
import ForgotPasswordPage from '../pages/forgot-password/ForgotPassword';
import LandingPage from '../pages/landing/LandingPage';
import SignInPage from '../pages/sign-in/SignInPage';
import SignUpPage from '../pages/sign-up/SignUpPage';
import TeamsDetailsPage from '../pages/admin/Teams/TeamsDetailsPage';
import UsersDetailsPage from '../pages/admin/Users/UsersDetailsPage';
import LicensingDetailsPage from '../pages/admin/Licensing/LicensingDetailsPage';
import SubscriptionDetailsPage from '../pages/admin/Subscription/SubscriptionDetailsPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<LandingPage />} />
      <Route path='/sign-in' element={<SignInPage />} />
      <Route path='/sign-up' element={<SignUpPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/password-change' element={<AdminPasswordChangePage />} />
      <Route path='/admin' element={<Adminlayout />}>
        <Route index element={<DashboardPage />} />
        <Route path='teams' element={<TeamsPage />} />
        <Route path='teams/details' element={<TeamsDetailsPage />} />
        <Route path='users' element={<UsersPage />} />
        <Route path='users/details' element={<UsersDetailsPage />}/>
        <Route path='licensing' element={<LicensingPage />} />
        <Route path='licensing/details' element={<LicensingDetailsPage />} />
        <Route path='subscription' element={<SubscriptionPage />} />
        <Route path='subscription/details' element={<SubscriptionDetailsPage />}/>
        <Route path='sponsorship' element={<SponsorshipPage />} />
        <Route path='sponsorship/details' element={<SubscriptionDetailsPage />} />
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
