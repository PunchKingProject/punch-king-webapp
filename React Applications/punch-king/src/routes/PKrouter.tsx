import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import LandingPage from '../pages/landing/LandingPage';
import SignInPage from '../pages/sign-in/SignInPage';
import SignUpPage from '../pages/sign-up/SignUpPage';
import ForgotPasswordPage from '../pages/forgot-password/ForgotPassword';
import AdminPasswordChangePage from '../pages/forgot-password/AdminPasswordChange';
import AdminPage from '../pages/admin/AdminPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<LandingPage />} />
      <Route path='/sign-in' element={<SignInPage />} />
      <Route path='/sign-up' element={<SignUpPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/password-change' element={<AdminPasswordChangePage />} />
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
