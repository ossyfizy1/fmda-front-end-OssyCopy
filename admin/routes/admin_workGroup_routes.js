import { Router } from 'express';
import { Admin_workGroup_controllers } from '../controllers';

// for file upload
var multer  = require('multer');
var upload = multer({ dest: "public" + "/events_pics_uploads" });

const {

    renderWorkGroupPage,
    detailsUpload,
    getListOfworkGroups,
    renderMemberAddPage,
    memberAddDetails,
    renderLookUpMemberPage,
    LookUpMemberAddDetails,
    addMemberToGroup,
    viewParticipants 

}   = Admin_workGroup_controllers;

const router = Router();

 router.get('/create_work_group', renderWorkGroupPage);
 router.post('/create_work_group', detailsUpload);
 router.get('/add_member_to_work_group', getListOfworkGroups);
 router.get('/view_groupMemberAddPage', renderMemberAddPage);
 router.post('/addMember_work_group', memberAddDetails); 
 router.get('/lookup_member_work_group', renderLookUpMemberPage);
 router.post('/lookup_member_work_group', LookUpMemberAddDetails);
 router.post('/view_groupMemberAddPage', addMemberToGroup);
 router.get('/view_grouParticipantsPage', viewParticipants);
 
 

export default router;