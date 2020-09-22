import { Router } from 'express';
import { Admin_dealers_controllers } from '../controllers';

const {
    newDealersPage,
    handleNewDealers,
    dealerList,
} = Admin_dealers_controllers;

const router = Router();

router.get('/newDealers', newDealersPage);
router.get('/handleNewDealers', handleNewDealers);
router.get('/dealerList', dealerList);

export default router;
