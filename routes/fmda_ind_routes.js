var express = require("express");
var router = express.Router();

// for file upload and preserve it name and extension
var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public" + "/ind_uploads")
    },
    filename: function (req, file, cb) {
        // console.log(file)
      cb(null, Date.now() + "-" + file.originalname)
    }
});

var upload = multer({ storage: storage });

var ind_finalize_bulk_upload = multer({ storage: storage });

var picture = multer({ dest: "public" + "/ind_passport" });
var treasuryCertificate =  multer({ dest: "public" + "/treasuryCertificate_uploads" });

// controllers
var fmda_ind_controller = require("../controllers/fmda_ind_controller");

// require sessionMiddleWare 
var logOutMiddleWare = require("../middleware/sessionMiddleWare");



// individual pre-registration
router.get('/register_individual', fmda_ind_controller.registration_page_individual)

// individual post registration
router.post('/register_individual', fmda_ind_controller.register_individual);

// get secuirty question
router.get("/securityQuestion", logOutMiddleWare, fmda_ind_controller.set_security_question);

// set answer to question
router.post("/securityQuestion", logOutMiddleWare, fmda_ind_controller.set_security_question_done);

// confirmatory update page
router.get('/confirmatory_update', logOutMiddleWare, fmda_ind_controller.confirmatory_update_initiated);

// confirmatory update post registration
router.post('/confirmatory_update', logOutMiddleWare, upload.array('treasuryCertification'), fmda_ind_controller.confirmatory_update_done);

// onboarding for individual registration
router.get('/onboarding_ind', logOutMiddleWare, fmda_ind_controller.onboarding_ind_initiated);

router.post('/ind_personalInformation', logOutMiddleWare, picture.single('profilePhoto'), fmda_ind_controller.ind_personalInformation);

// get ind_get_organization_ID_by_my_selection route
router.post('/ind_get_organization_ID_by_my_selection', logOutMiddleWare, fmda_ind_controller.ind_get_organization_ID_by_my_selection);

// ind_professionalInformation get route (also called Employment History)
router.get("/ind_professionalInformation", logOutMiddleWare, fmda_ind_controller.ind_professionalInformation_initiated);

// ind_professionalInformation post route (also called Employment History)
// router.post("/ind_professionalInformation", logOutMiddleWare, treasuryCertificate.single('treasuryCertificate'), fmda_ind_controller.ind_professionalInformation_done);
router.post("/ind_professionalInformation", logOutMiddleWare, fmda_ind_controller.ind_professionalInformation_done);

// ind_qualifications get route (also called Academic Qualification)
router.get("/ind_qualifications", logOutMiddleWare, fmda_ind_controller.ind_qualifications_initiated);

// ind_qualifications post route (also called Academic Qualification)
router.post("/ind_qualifications", logOutMiddleWare, fmda_ind_controller.ind_qualifications_done);

// ind_other_proffessional_qualifications get route (also called Other Professional Qualification)
router.get("/ind_other_proffessional_qualifications", logOutMiddleWare, fmda_ind_controller.ind_other_proffessional_qualifications_initiated);

// ind_other_proffessional_qualifications post route (also called Other Professional Qualification)
router.post("/ind_other_proffessional_qualifications", logOutMiddleWare, fmda_ind_controller.ind_other_proffessional_qualifications_done);

// ind_attestation get route
router.get("/ind_attestation", logOutMiddleWare, fmda_ind_controller.ind_attestation_initiated);

// ind_attestation post route
router.post("/ind_attestation", logOutMiddleWare, fmda_ind_controller.ind_attestation_done);

// ind_payment_for_member get route
router.get("/ind_payment_for_member", logOutMiddleWare, fmda_ind_controller.ind_payment_for_member_initiated);

// ind_payment_for_member post route
router.post("/ind_payment_for_member", logOutMiddleWare, fmda_ind_controller.ind_payment_for_member_done);

// ind_profile_page_for_member get route for view their profile for cases of re-editng profile
router.get("/ind_profile_page_for_member", logOutMiddleWare, fmda_ind_controller.ind_profile_page_for_member_initiated);

// ind_main_dashboard_for_member get route
router.get("/ind_main_dashboard_for_member", logOutMiddleWare, fmda_ind_controller.ind_main_dashboard_for_member_initiated);

// ind member objection 
router.get('/ind_member_objection', logOutMiddleWare, fmda_ind_controller.ind_member_objection);

// employmentHistoryList_individual get route
router.post("/employmentHistoryList_individual", logOutMiddleWare, fmda_ind_controller.employmentHistoryList_individual_initiated);

// removeEmplomentHistory_individual get route
router.post("/removeEmplomentHistory_individual", logOutMiddleWare, fmda_ind_controller.removeEmplomentHistory_individual_initiated);

// qualificationList_individual add route
router.post("/qualificationList_individual", logOutMiddleWare, fmda_ind_controller.qualificationList_individual_initiated);

// removeQualification_individual get route
router.post("/removeQualification_individual", logOutMiddleWare, fmda_ind_controller.removeQualification_individual_initiated);

// other_professional_qualificationList_individual add route
router.post("/other_professional_qualificationList_individual", logOutMiddleWare, fmda_ind_controller.other_professional_qualificationList_individual_initiated);

// remove_other_professional_Qualification_individual get route
router.post("/remove_other_professional_Qualification_individual", logOutMiddleWare, fmda_ind_controller.remove_other_professional_Qualification_individual_initiated);

// show change password page
router.get("/ind_change_password", logOutMiddleWare, fmda_ind_controller.render_change_password_page);

// handle change password 
router.post("/ind_change_password", logOutMiddleWare, fmda_ind_controller.handle_change_password);

// render attestation route page
router.get("/ind_member_attestation", logOutMiddleWare, fmda_ind_controller.render_attestation_page);

// render attestation route page
router.post("/ind_member_attestation/:id", logOutMiddleWare, fmda_ind_controller.handle_member_attestation);

// payment history for members
router.get("/ind_payment_history", logOutMiddleWare, fmda_ind_controller.render_payment_history_page);

// render page for upcoming events
router.get("/ind_upcoming_events", logOutMiddleWare,  fmda_ind_controller.render_upcoming_events_page);

// render page for event details
router.get("/ind_event_details", logOutMiddleWare,  fmda_ind_controller.render_event_details_page);

// render event_registration page
router.get("/ind_event_registration", logOutMiddleWare, fmda_ind_controller.render_event_registration_page);

// handle event_registration
router.post("/ind_event_registration", logOutMiddleWare, fmda_ind_controller.handle_event_registration);

// ind_get_fmda_account_details
router.post("/ind_get_fmda_account_details", logOutMiddleWare, fmda_ind_controller.ind_get_fmda_account_details);

// /ind_view_certicicate
router.get("/ind_view_certicicate", logOutMiddleWare, fmda_ind_controller.ind_view_certicicate);

// ind_academic_certificate_upload
router.post("/ind_academic_certificate_upload", logOutMiddleWare, fmda_ind_controller.handle_academic_certificate_upload);

// ind_other_proffessional_qualifications_cert_upload
router.post("/ind_other_proffessional_qualifications_cert_upload", logOutMiddleWare, fmda_ind_controller.handle_ind_other_proffessional_qualifications_cert_upload);


// ind_finalize_upload
router.post("/ind_finalize_upload", fmda_ind_controller.handle_ind_finalize_upload);

// delete_emp_history
router.get("/ind_delete_emp_history", logOutMiddleWare, fmda_ind_controller.delete_emp_history);

// ind_delete_ind_qualifications
router.get("/ind_delete_qualifications", logOutMiddleWare, fmda_ind_controller.delete_ind_qualifications);

// ind_delete_other_professional_qualifications
router.get("/ind_delete_other_professional_qualifications", logOutMiddleWare, fmda_ind_controller.delete_other_professional_qualifications);

// ind_generate_invoice_number
router.post("/ind_generate_invoice_number", logOutMiddleWare, fmda_ind_controller.ind_generate_invoice_number);

// ind_generate_event_invoice_number
router.post("/ind_generate_event_invoice_number", logOutMiddleWare, fmda_ind_controller.ind_generate_event_invoice_number);

// ind_pending_payment that hamdles Membership renewwal
router.get("/ind_pending_payment", logOutMiddleWare, fmda_ind_controller.render_pending_payment);

// ind_member_search
router.get("/ind_member_search", logOutMiddleWare, fmda_ind_controller.ind_member_search);

// ind_get_member_search_result
router.post("/ind_get_member_search_result", logOutMiddleWare, fmda_ind_controller.ind_get_member_search_result);



// ind_member_directories
router.get("/ind_member_directories", logOutMiddleWare, fmda_ind_controller.ind_member_getDirectories);

// ind_member_resource
router.get("/ind_member_resource", logOutMiddleWare, fmda_ind_controller.ind_member_resource);

// ind_concludeRegistrationFromBulkUpload
router.get("/ind_concludeRegistrationFromBulkUpload", fmda_ind_controller.ind_concludeRegistrationFromBulkUpload);

// ind_concludeRegistrationFromBulkUpload
router.post("/ind_concludeRegistrationFromBulkUpload", ind_finalize_bulk_upload.array('treasuryCertification'), fmda_ind_controller.handle_ind_concludeRegistrationFromBulkUpload);



module.exports = router;