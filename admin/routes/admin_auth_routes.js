import { Router } from 'express';
import { Admin_auth_controllers } from '../controllers';

const router = Router();

const {
  renderLoginPage,
  handleLogin,
  theAdminDetailsInSession,
  renderDashboard,
  handleLogout,
  renderChangePasswordPage,
  handleChangePassword,
} = Admin_auth_controllers;

router.get('/login', renderLoginPage);
router.post('/login', handleLogin);
router.post('/theAdminDetailsInSession', theAdminDetailsInSession);
router.get('/logout', handleLogout);
router.get('/dashboard', renderDashboard);
router.get('/change_password', renderChangePasswordPage);
router.post('/change_password', handleChangePassword);


export default router;
