var express = require("express");
var router = express.Router();

// for file upload
var multer  = require('multer');
var upload = multer({ dest: "public" + "/ind_uploads" });
var picture = multer({ dest: "public" + "/ind_passport" });
var treasuryCertificate =  multer({ dest: "public" + "/treasuryCertificate_uploads" });

// require controller 
var update_fmda_ind_controller = require("../controllers/update_fmda_ind_controller");

// require sessionMiddleWare 
var logOutMiddleWare = require("../middleware/sessionMiddleWare");



// onboarding for individual registration
router.get('/update_onboarding_ind', logOutMiddleWare, update_fmda_ind_controller.update_onboarding_ind);

// get update_ind_personalInformation
router.post('/update_ind_personalInformation', logOutMiddleWare,  picture.single('profilePhoto'), update_fmda_ind_controller.update_ind_personalInformation);

// get ind_get_organization_ID_by_my_selection route
router.post('/update_ind_get_organization_ID_by_my_selection', logOutMiddleWare,  update_fmda_ind_controller.update_ind_get_organization_ID_by_my_selection);

// ind_professionalInformation get route (also called Employment History)
router.get("/update_ind_professionalInformation", logOutMiddleWare, update_fmda_ind_controller.update_ind_professionalInformation_initiated);

// ind_professionalInformation post route (also called Employment History)
router.post("/update_ind_professionalInformation", logOutMiddleWare, update_fmda_ind_controller.update_ind_professionalInformation_done);

// ind_qualifications get route (also called Academic Qualification)
router.get("/update_ind_qualifications", logOutMiddleWare, update_fmda_ind_controller.update_ind_qualifications_initiated);

// ind_qualifications post route (also called Academic Qualification)
router.post("/update_ind_qualifications", logOutMiddleWare, update_fmda_ind_controller.update_ind_qualifications_done);

// update_ind_other_professional_qualifications get route
router.get("/update_ind_other_professional_qualifications", logOutMiddleWare, update_fmda_ind_controller.update_ind_other_professional_qualifications_initiated);

// update_ind_other_professional_qualifications post route
router.post("/update_ind_other_professional_qualifications", logOutMiddleWare, update_fmda_ind_controller.update_ind_other_professional_qualifications_done);

// update_qualificationList_individual add route
router.post("/update_qualificationList_individual", logOutMiddleWare, update_fmda_ind_controller.update_qualificationList_individual_initiated);

// update_remove_qualification_individual_initiated get route
router.post("/update_remove_qualification_individual_initiated", logOutMiddleWare, update_fmda_ind_controller.update_remove_qualification_individual_initiated);

// update_other_professional_qualificationList_individual add route
router.post("/update_other_professional_qualificationList_individual", logOutMiddleWare, update_fmda_ind_controller.update_other_professional_qualificationList_individual_initiated);

// update_remove_other_professional_Qualification_individual get route
router.post("/update_remove_other_professional_Qualification_individual", logOutMiddleWare, update_fmda_ind_controller.update_remove_other_professional_Qualification_individual_initiated);

// ind_attestation get route
router.get("/update_ind_attestation", logOutMiddleWare, update_fmda_ind_controller.update_ind_attestation_initiated);

// ind_attestation post route
router.post("/update_ind_attestation", logOutMiddleWare, update_fmda_ind_controller.update_ind_attestation_done);

// ind_payment_for_member get route
router.get("/update_ind_payment_for_member", logOutMiddleWare,  update_fmda_ind_controller.update_ind_payment_for_member_initiated);

// ind_payment_for_member post route
router.post("/update_ind_payment_for_member", logOutMiddleWare, update_fmda_ind_controller.update_ind_payment_for_member_done);

// employmentHistoryList_individual get route
router.post("/update_employmentHistoryList_individual", logOutMiddleWare, update_fmda_ind_controller.update_employmentHistoryList_individual);

// removeEmplomentHistory_individual get route
router.post("/update_removeEmplomentHistory_individual", logOutMiddleWare, update_fmda_ind_controller.update_removeEmplomentHistory_individual);

// qualificationList_individual add route
router.post("/update_qualificationList_individual", logOutMiddleWare, update_fmda_ind_controller.update_qualificationList_individual);

// removeQualification_individual get route
router.post("/update_removeQualification_individual", logOutMiddleWare, update_fmda_ind_controller.update_removeQualification_individual);







module.exports = router;