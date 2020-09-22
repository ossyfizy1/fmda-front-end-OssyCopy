import { Router } from 'express';
import { Admin_payment_controllers } from '../controllers';

const router = Router();

const {
  renderPaymentsHistoryPage,
  renderApprovedPaymentsPage,
  renderDeclinedPaymentsPage,
  renderUnprocessedPaymentsPage,
  renderPaymentDetailsPage,
  handleValidatePayment,
} = Admin_payment_controllers;

router.get('/all', renderPaymentsHistoryPage);
router.get('/unprocessed', renderUnprocessedPaymentsPage);
router.get('/approved', renderApprovedPaymentsPage);
router.get('/declined', renderDeclinedPaymentsPage);
router.get('/details', renderPaymentDetailsPage);
router.post('/validate/:paymentRef/:userId/:adminId/:purpose/:invoiceNumber', handleValidatePayment);

export default router;
