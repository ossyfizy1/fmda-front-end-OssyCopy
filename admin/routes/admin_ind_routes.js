import { Router } from 'express';
import { Admin_ind_controllers } from '../controllers';

const {
  renderMemberRequestsListPage,
  renderVerifyMemberRequestsPage,
  renderMemberApproveRequestsPage,
  renderVerifyMemberPage,
  renderApproveMemberPage,
  renderMembersPage,
  renderMemberDetailsPage,
  renderMembershipRequestInformationPage,
  handle_disable_or_enable_member,
  ind_bulk_upload,
  display_ind_bulk_upload,
  handle_submit_bulk_upload,

  addOrganisationMember,

  handleVerifyMember,
  handleApproveMember,

} = Admin_ind_controllers;

const router = Router();


// for file upload for ind_bulk_member_upload and preserve it name and extension
var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public" + "/ind_bulk_upload")
    },
    filename: function (req, file, cb) {
        // console.log(file)
      cb(null, Date.now() + "-" + file.originalname)
    }
});

var ind_bulk_member_upload = multer({ storage: storage });


router.get('/membership_request_list', renderMemberRequestsListPage);
router.get('/verification_request', renderVerifyMemberRequestsPage);
router.post('/create_organisation', addOrganisationMember);
router.get('/verify_member', renderVerifyMemberPage);
router.post('/verify_member', handleVerifyMember);
router.get('/approval_request', renderMemberApproveRequestsPage);
router.get('/approve_member', renderApproveMemberPage);
router.post('/approve_member/:userId/:approverId', handleApproveMember);
router.get('/approved_members', renderMembersPage);
router.get('/view_member', renderMemberDetailsPage);
router.get('/view_membershipRequestPage', renderMembershipRequestInformationPage);
router.get('/disable_or_enable_member', handle_disable_or_enable_member);
router.get('/ind_bulk_upload', ind_bulk_upload);
router.post('/ind_bulk_upload', ind_bulk_member_upload.single('ind_bulk_upload'), display_ind_bulk_upload);
router.post('/submit_bulk_upload', handle_submit_bulk_upload);

export default router;
