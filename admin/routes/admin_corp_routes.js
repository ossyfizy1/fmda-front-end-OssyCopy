import { Router } from 'express';
import { Admin_corp_controllers } from '../controllers';

const {
  renderCreateCpMemberPage,
  renderCpMemberRequestsPage,
  renderCorp_request_details,
  renderVerifyCpRequestsPage,
  renderVerifyCpMemberPage,
  renderApproveCpRequestsPage,
  renderApproveCpMemberPage,
  renderCpMembersPage,
  renderCpMemberDetailsPage,
  viewDetailAndObjectionsCount,
  approveTheCorporateRequest,
  approveTheCorporateRequestAjax,

  handleCreateCpMember, 
  handleVerifyCpMember,
  handleApproveCpMember,
  handle_viewObjectionsMade,
  handle_push_for_review,


  createNewOrganisaion,
} = Admin_corp_controllers;

const router = Router();

router.get('/membership_requests', renderCpMemberRequestsPage);
router.get('/corp_request_details', renderCorp_request_details)
router.get('/create_member', renderCreateCpMemberPage);
router.post('/create_member/:id', handleCreateCpMember);
router.post('/create_organisation', createNewOrganisaion);
router.get('/verification_request', renderVerifyCpRequestsPage);
router.get('/verify_member', renderVerifyCpMemberPage);
router.post('/verify_member/:userId/:verifierId', handleVerifyCpMember);
router.get('/approval_request', renderApproveCpRequestsPage);
router.get('/approve_member', renderApproveCpMemberPage);
router.post('/approve_member/:userId/:verifierId', handleApproveCpMember);
router.get('/approved_members', renderCpMembersPage);
router.get('/view_member', renderCpMemberDetailsPage);
router.get('/viewObjectionsMade', handle_viewObjectionsMade);
router.get('/push_for_review', handle_push_for_review);
router.get('/viewDetailAndObjectionsCount', viewDetailAndObjectionsCount);
router.post('/approveTheCorporateRequest', approveTheCorporateRequest);
router.post('/approveTheCorporateRequestAjax', approveTheCorporateRequestAjax);



export default router;
