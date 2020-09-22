import { Router } from 'express';
import { admin_generate_invoices_controller } from '../controllers';

const {
    annualInvoice,
    annualInvoiceFromManageMemberMenu,
    handleAnnualInvoice,
} = admin_generate_invoices_controller;

const router = Router();

// from Genenrate invoice menu
router.get('/annualInvoice', annualInvoice);
// from generate annual invoice from individual or corporate ---> "member manage member menu"
router.get('/annualInvoiceFromManageMemberMenu', annualInvoiceFromManageMemberMenu);
router.post('/handleAnnualInvoice', handleAnnualInvoice);

export default router;
