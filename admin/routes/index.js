import { Router } from 'express';
import admin_corp_routes from './admin_corp_routes';
import admin_ind_routes from './admin_ind_routes';
import admin_payment_routes from './admin_payment_routes';
import admin_auth_routes from './admin_auth_routes';
import admin_routes from './admin_routes';
import admin_events_routes from './admin_events_routes';
import Admin_dealers_routes from './admin_dealer_route';
import admin_workGroup_routes from './admin_workGroup_routes';
import admin_generate_invoice from './admin_generate_invoice.js';
import admin_resource_management from './admin_resource_management_routes.js';

import Middlewares from '../middlewares';

const router = Router(); 

router.use(Middlewares.checkAdminLogin);
router.use('/corporate_member', admin_corp_routes);
router.use('/individual_member', admin_ind_routes);
router.use('/payments', admin_payment_routes);
router.use('/events', admin_events_routes);
router.use('/dealers', Admin_dealers_routes);
router.use('/workGroup', admin_workGroup_routes);
router.use('/generateInvoice', admin_generate_invoice);
router.use('/resource_management', admin_resource_management);
router.use(admin_auth_routes);
router.use(admin_routes);


module.exports = router;
