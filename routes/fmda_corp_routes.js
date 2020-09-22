var express = require("express");
var router = express.Router();

// require request
var request = require("request");

// require the path module
var path = require("path");

// for file upload
var multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public" + "/corp_uploads")
    },
    filename: function (req, file, cb) {
        // console.log(file)
      cb(null, Date.now() + "-" + file.originalname)
    }
});

var upload = multer({ storage: storage })

// var upload = multer({ dest: "public" + "/corp_uploads" });

// require baseUrl
var baseUrl = require("../baseUrl");

// require controller
var corp_controller = require("../controllers/fmda_corp_controllers");

// require sessionMiddleWare 
var logOutMiddleWare = require("../middleware/sessionMiddleWare");



// corperate pre-registration
router.get('/register_corperate', corp_controller.register_corperate_initiated);

// corperate post registration
router.post('/register_corperate', upload.array('organisationLetterOfRequest', 6), corp_controller.register_corperate_done);

// get secuirty question
router.get("/corp_securityQuestion", logOutMiddleWare, corp_controller.set_security_question);

// set answer to question
router.post("/corp_securityQuestion", logOutMiddleWare, corp_controller.set_security_question_done);

// corp_payment get route
router.get("/corp_payment", logOutMiddleWare, corp_controller.corp_payment_initiated);

// corp_payment post route
router.post("/corp_payment", logOutMiddleWare, corp_controller.corp_payment);

// corperate dashboard
router.get('/corp_main_dashboard', logOutMiddleWare, corp_controller.corp_main_dashboard);

// corp member objection 
router.get('/corp_member_objection', logOutMiddleWare, corp_controller.corp_member_objection); 

// corp profile page
router.get('/corp_profile', logOutMiddleWare, corp_controller.corp_profile_page);

// show change password page
router.get("/corp_change_password", logOutMiddleWare, corp_controller.render_change_password_page);

// handle change password 
router.post("/corp_change_password", logOutMiddleWare, corp_controller.handle_change_password);

// payment history for corporate members
router.get("/corp_payment_history", logOutMiddleWare, corp_controller.render_payment_history_page);

// render page for upcoming events
router.get("/corp_upcoming_events", logOutMiddleWare,  corp_controller.render_upcoming_events_page);

// render page for event details
router.get("/corp_event_details", logOutMiddleWare,  corp_controller.render_event_details_page);

// show submit new dealer page
router.get("/corp_new_dealer", logOutMiddleWare, corp_controller.render_new_dealer_page);

// post new dealer page
router.post("/corp_new_dealer", logOutMiddleWare, corp_controller.handle_new_dealer_page);

// render event_registration page
router.get("/corp_event_registration", logOutMiddleWare, corp_controller.render_event_registration_page);

// handle paid event_registration for corp
router.post("/corp_event_registration", logOutMiddleWare, corp_controller.handle_event_registration);

// corp_get_fmda_account_details
router.post("/corp_get_fmda_account_details", logOutMiddleWare, corp_controller.corp_get_fmda_account_details);

// corp_member_list
router.get("/corp_member_list", logOutMiddleWare, corp_controller.corp_member_list_page);

// corp_viewMyMemberDetails
router.get("/corp_viewMyMemberDetails", logOutMiddleWare, corp_controller.corp_view_my_member_Details);

// corp_annual_renewal_list
router.get("/corp_annual_renewal_list", logOutMiddleWare, corp_controller.corp_annual_renewal_list);

// corp_annual_renewal
router.post("/corp_annual_renewal", logOutMiddleWare, corp_controller.corp_annual_renewal);

// corp_annual_renewal_payment
router.post("/corp_annual_renewal_payment", logOutMiddleWare, corp_controller.corp_annual_renewal_payment);

// corp_generate_invoice_number
router.post("/corp_generate_invoice_number", logOutMiddleWare, corp_controller.corp_generate_invoice_number);

// corp_generate_annual_group_member_invoice_number
router.post("/corp_generate_annual_group_member_invoice_number", logOutMiddleWare, corp_controller.corp_generate_annual_group_member_invoice_number);

// corp_generate_group_member_event_invoice_number
router.post("/corp_generate_group_member_event_invoice_number", logOutMiddleWare, corp_controller.corp_generate_group_member_event_invoice_number);

// corp_pending_payment
router.get("/corp_pending_payment", logOutMiddleWare, corp_controller.corp_pending_payment);

// corp_member_search
router.get("/corp_member_search", logOutMiddleWare, corp_controller.corp_member_search);

// corp_get_member_search_result
router.post("/corp_get_member_search_result", logOutMiddleWare, corp_controller.corp_get_member_search_result);

// corp_member_directories
router.get("/corp_member_directories", logOutMiddleWare, corp_controller.corp_member_getDirectories);

// corp_member_resource
router.get("/corp_member_resource", logOutMiddleWare, corp_controller.corp_member_resource);

// corp_list_of_all_fmda_individual_member
router.get("/corp_list_of_all_fmda_individual_member", logOutMiddleWare, corp_controller.corp_list_of_all_fmda_individual_member);

// annual_corp_payment
router.get("/annual_corp_payment", logOutMiddleWare, corp_controller.corp_payment_initiated);



module.exports = router;