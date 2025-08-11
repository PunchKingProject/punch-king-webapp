import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import Adminlayout from '../layouts/Adminlayout';
import AdminPage from '../pages/admin/AdminPage';
import DashboardPage from '../pages/admin/DashboardPage';
import LicensingPage from '../pages/admin/LicensingPage';
import SponsorshipPage from '../pages/admin/SponsorshipPage';
import SubscriptionPage from '../pages/admin/SubscriptionPage';
import TeamsPage from '../pages/admin/TeamsPage';
import UsersPage from '../pages/admin/UsersPage';
import AdminPasswordChangePage from '../pages/forgot-password/AdminPasswordChange';
import ForgotPasswordPage from '../pages/forgot-password/ForgotPassword';
import LandingPage from '../pages/landing/LandingPage';
import SignInPage from '../pages/sign-in/SignInPage';
import SignUpPage from '../pages/sign-up/SignUpPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<LandingPage />} />
      <Route path='/sign-in' element={<SignInPage />} />
      <Route path='/sign-up' element={<SignUpPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/password-change' element={<AdminPasswordChangePage />} />
      <Route path='/admin' element={< Adminlayout/>}>
        <Route index element={<DashboardPage />} />
        <Route path='teams' element={<TeamsPage />} />
        <Route path='users' element={<UsersPage  />} />
        <Route path='licensing' element={<LicensingPage />}/>
        <Route path='subscription' element={<SubscriptionPage />} />
        <Route path='sponsorship' element={<SponsorshipPage />} />

        

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
