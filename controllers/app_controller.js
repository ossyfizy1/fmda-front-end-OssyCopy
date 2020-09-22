
// require baseUrl
var baseUrl = require("../baseUrl");

// require request
var request = require("request");

// require the path module
var path = require("path");

// require Reuseables
var Reuseables = require("../reuseables/reuseables");

// require fmda_corp_reuseables
var fmda_corp_reuseables = require("../reuseables/fmda_corp_reuseables");




var app_controller = {

    // method homePage
    homePage : function (req, res) {

        // when this route is used for attestation put the details into the session
        if (req.query.action === 'attestation') {
            req.session.query = req.query;
        }

        // check if the member wants to make objection
        if (req.query.action === 'corporatemembershipobjection') {

            req.session.corporatemembershipobjection = {
                                                        "action" : req.query.action,
                                                        "companyName" : req.query.companyName.replace(/\"/g, ""),
                                                        "token" : req.query.token.replace(/\"/g, ""),
                                                        "email" : req.query.email
                                                        };
                
                console.log(req.session.corporatemembershipobjection);

                return res.redirect("/make_objection");
        }
        else if (req.query.action === 'diligence') {

            req.session.corporatemembershipobjection = {
                                                        "action" : req.query.action,
                                                        "companyName" : req.query.companyName.replace(/\"/g, ""),
                                                        "token" : req.query.token.replace(/\"/g, ""),
                                                        "email" : req.query.email,
                                                        "rejector": req.query.rejector
                                                        };
                
                console.log(req.session.corporatemembershipobjection);

                return res.redirect("/review_objection");
        };


        res.render("index");
        return;
    },
    // seperate each function by ","



    // method registration
    registration : function (req, res) {
        res.render("register");
        return;
    },
    // seperate each function by ","


    // individual_toKnow
    individual_toKnow : function (req, res) {
        res.render("individual_toKnow");
        return;
    },
    // seperate each function by ","



    // corperate_toKnow
    corperate_toKnow : function (req, res) {
        res.render("corperate_toKnow");
        return;
    },
    // seperate each function by ","



    // method homePage
    login : function(req, res){

        // console.log(req.body);
    
        // set userDetails into session
        req.session.userDetails = req.body;

        // call Reuseables.login()
        var result = Reuseables.login(req.body.userID, req.body.password)
        result.then(
            (result) => {
                // console.log( result );

                // to know the member type logged in.
                var loginUserType = result.signIn.userType;
                req.session.theLoginUserType = loginUserType;



                if (result.signIn.message === "Successful" && result.signIn.userType === "Member") {
    
                    var theUserID = '"' + req.body.userID + '"';
                    var theMemberType = '"' + result.signIn.userType + '"';
        
                    // member lookup
                    async function the_member_look_up() {
                        var memberLookUpDetails = await Reuseables.member_look_up(theUserID, theMemberType);
                        // console.log("member details: " + JSON.stringify(memberLookUpDetails));
                        return memberLookUpDetails;
                    }
        
                    // call out asyn and await function "the_member_look_up"
                    the_member_look_up()
                    .then(
                        (body) => 
                            {
                                req.session.memberCompleteDetails = body;
                                // console.log("member details: " + JSON.stringify(req.session.memberCompleteDetails));
        
                                // check if security question is set
                                if (body.lookupMember.member.emailVerified === false) {
                                    res.send(
                                        " '<script> alert('you need to verify your email from the link sent to you.'); </script>' "
                                        + "<script> window.location.href='/'; </script>"
                                        );
                                    return;
                                }
                                else if (body.lookupMember.member.securityQuestionSet === false) {
                                    // res.render('fmda_ind/securityQuestion');
                                    res.redirect("/securityQuestion");
                                    return;
                                } 
                                else if (body.lookupMember.member.emailVerified === true && body.lookupMember.member.securityQuestionSet === true) {
        
                                    if (body.lookupMember.member.memberType == "" || body.lookupMember.member.certificationType == "") {
                                        res.redirect("/confirmatory_update");
                                        return;
                                    }
                                    else if(body.lookupMember.member.memberType != "" || body.lookupMember.member.certificationType != "" && body.lookupMember.member.gender === "") {
                                        res.redirect("/onboarding_ind");
                                        return;
                                    }

                                    // res.redirect('/confirmatory_update');
                                    // return;
                                }  
                                else if (body.lookupMember.member.emailVerified === true && body.lookupMember.member.securityQuestionSet === true && body.lookupMember.member.memberType != "" && body.lookupMember.member.certificationType != "" && body.lookupMember.member.gender === "" && body.lookupMember.member.attestationComplete === null) {
        
                                    res.redirect('/onboarding_ind');
                                    return;
                                }
                                else if (body.lookupMember.member.emailVerified === true && body.lookupMember.member.securityQuestionSet === true && body.lookupMember.member.memberType != "" && body.lookupMember.member.certificationType != "" && body.lookupMember.member.gender != "" && body.lookupMember.member.employmentHistory.length === 0 && body.lookupMember.member.attestationComplete === null) {
        
                                    res.redirect('/ind_professionalInformation');
                                    return;
                                }
                                else if (body.lookupMember.member.emailVerified === true && body.lookupMember.member.securityQuestionSet === true && body.lookupMember.member.memberType != "" && body.lookupMember.member.certificationType != "" && body.lookupMember.member.gender != "" && body.lookupMember.member.employmentHistory.length != 0 && body.lookupMember.member.qualifications.length === 0 && body.lookupMember.member.attestationComplete === null) {
        
                                    res.redirect('/ind_qualifications');
                                    return;
                                }
                                else if (body.lookupMember.member.emailVerified === true && body.lookupMember.member.securityQuestionSet === true && body.lookupMember.member.memberType != "" && body.lookupMember.member.certificationType != "" && body.lookupMember.member.gender != "" && body.lookupMember.member.employmentHistory.length != 0 && body.lookupMember.member.otherProfessionalQualifications.length === 0 && body.lookupMember.member.attestationComplete === null) {
        
                                    res.redirect('/ind_other_proffessional_qualifications');
                                    return;
                                }
                                // check that attestation has been done, if not direct to attestation page
                                else if (body.lookupMember.member.emailVerified === true && body.lookupMember.member.securityQuestionSet === true && body.lookupMember.member.memberType != "" && body.lookupMember.member.certificationType != "" && body.lookupMember.member.gender != "" && body.lookupMember.member.employmentHistory.length != 0 && body.lookupMember.member.qualifications.length != 0 && body.lookupMember.member.attestationComplete === null) {
        
                                    res.redirect('/ind_attestation');
                                    return;
                                }
                                // if attestaion has been done but pending, direct to the profile page
                                else if (body.lookupMember.member.emailVerified === true && body.lookupMember.member.securityQuestionSet === true && body.lookupMember.member.memberType != "" && body.lookupMember.member.certificationType != "" && body.lookupMember.member.attestationComplete === 0) {
                                    res.redirect('/ind_profile_page_for_member');
                                    return;
                                }
                                // if attestaion has been done but but has been rejected, direct to the attestation page
                                else if (body.lookupMember.member.emailVerified === true && body.lookupMember.member.securityQuestionSet === true && body.lookupMember.member.memberType != "" && body.lookupMember.member.certificationType != "" && body.lookupMember.member.attestationComplete === -1) {
                                    res.send(
                                        " '<script> alert('Your attestation was denied, please provide a new attestor ID'); </script>' "
                                        + "<script> window.location.href='/ind_attestation'; </script>"
                                        );
                                    // res.redirect('/ind_attestation');
                                    return;
                                }
                                // if the attestation has been approved but the user has not been verified direct to the profile page
                                else if (body.lookupMember.member.emailVerified === true && body.lookupMember.member.securityQuestionSet === true && body.lookupMember.member.memberType != "" && body.lookupMember.member.certificationType != "" && body.lookupMember.member.attestationComplete === 1 && body.lookupMember.member.hasBeenVerified !== 1) {
                                    res.redirect('/ind_profile_page_for_member');
                                    return;
                                }
                                // if the member has been verified, direct to the payment page
                                else if (body.lookupMember.member.emailVerified === true && body.lookupMember.member.securityQuestionSet === true && body.lookupMember.member.memberType != "" && body.lookupMember.member.certificationType != "" && body.lookupMember.member.attestationComplete === 1 && body.lookupMember.member.hasBeenVerified === 1 && body.lookupMember.member.registrationFeePaid === null) {
                                    res.redirect('/ind_payment_for_member');
                                    return;
                                }  
                                // if payment has been made, but pending approval direct to the profile page
                                else if (body.lookupMember.member.emailVerified === true && body.lookupMember.member.securityQuestionSet === true && body.lookupMember.member.memberType != "" && body.lookupMember.member.certificationType != "" && body.lookupMember.member.attestationComplete === 1 && body.lookupMember.member.hasBeenVerified === 1 && body.lookupMember.member.registrationFeePaid === 0){
        
                                    res.redirect('/ind_profile_page_for_member');
                                    return;
                                }
                                // if payment has been made, but has been rejected direct to the payment page
                                else if (body.lookupMember.member.emailVerified === true && body.lookupMember.member.securityQuestionSet === true && body.lookupMember.member.memberType != "" && body.lookupMember.member.certificationType != "" && body.lookupMember.member.attestationComplete === 1 && body.lookupMember.member.hasBeenVerified === 1 && body.lookupMember.member.registrationFeePaid === -1){
                                    res.send(
                                        " '<script> alert('Previous payment details rejected, please provide new details'); </script>' "
                                        + "<script> window.location.href='/ind_payment_for_member'; </script>"
                                        );
                                    return;
                                }
                                // if payment has been approved and member has been approved direct to dashboard
                                else if (body.lookupMember.member.emailVerified === true && body.lookupMember.member.securityQuestionSet === true && body.lookupMember.member.memberType != "" && body.lookupMember.member.certificationType != "" && body.lookupMember.member.attestationComplete === 1 && body.lookupMember.member.registrationFeePaid === 1 && body.lookupMember.member.hasBeenVerified === 1){
                                    
                                    
                                    // if the person is coming from the  attestation redirection route
                                    if (req.session.query && req.session.query.action === 'attestation') {
                                        const { firstName, lastName, organisation, token } = req.session.query;
                                        return res.redirect(`/ind_member_attestation?firstName=${firstName}&lastName=${lastName}&organisation=${organisation}&token=${token}`);
                                    }


                                    // send ind member to objection page
                                    if (req.session.corporatemembershipobjection) {
                                        console.log(req.session.memberCompleteDetails.lookupMember.member.memberUUID);
                                        console.log(req.session.corporatemembershipobjection);
                                        return res.redirect("/ind_member_objection");
                                    }


                                    // fetch resources directories, membership fee, event fee
                                    async function getDashBoardFields(){


                                        var resourcesDirectories = await Reuseables.getResources(req.session.memberCompleteDetails.lookupMember.member.memberUUID);

                                        var { lookupMemberInvoices } = await Reuseables.pending_payment(req.session.memberCompleteDetails.lookupMember.member.memberUUID);

                                        var upcomingEvents = await Reuseables.memberUpcomingEvents(req.session.memberCompleteDetails.lookupMember.member.memberUUID);
                                        

                                        var get_memberShipRenewalFeeInvoices = 0;

                                        // var the_get_EventUnpaidInvoices = 0;
                                        for (let index = 0; index < lookupMemberInvoices.length; index++) {
                                            
                                            if (lookupMemberInvoices[index].paymentPurpose == 'Membership renewal') {
                                                get_memberShipRenewalFeeInvoices += parseInt(lookupMemberInvoices[index].amount)
                                                    }
                                        }

                                        var the_get_EventUnpaidInvoices = 0;
                                        for (let index = 0; index < lookupMemberInvoices.length; index++) {
                                            
                                            if (lookupMemberInvoices[index].paymentPurpose == 'Event registration') {
                                                the_get_EventUnpaidInvoices += parseInt(lookupMemberInvoices[index].amount)
                                                    }
                                        }



                                        var getDashBoardFields = {
                                            resourcesDirectories: resourcesDirectories,
                                            number_of_resourcesDirectories : resourcesDirectories.lookupMemberDirectories.length,
                                            get_memberShipRenewalFeeInvoices: get_memberShipRenewalFeeInvoices,
                                            the_get_EventUnpaidInvoices: the_get_EventUnpaidInvoices,
                                            upcomingEvents: upcomingEvents
                                        };

                                        return getDashBoardFields;
                                    }

                                    getDashBoardFields()
                                    .then(
                                        (getDashBoardFields) => {
                                            // console.log(getDashBoardFields);

                                            // save to session
                                            req.session.getDashBoardFields = getDashBoardFields;

                                            res.redirect('/ind_main_dashboard_for_member');
                                            return;
                                        },
                                        (onrejected) => {
                                            console.log(onrejected);
                                        }
                                    );
                                    

                                    

                                    
                                }
                                else {
                                    res.send(
                                        " '<script> alert(' no record of you found, check your login credentials '); </script>' "
                                        + "<script> window.location.href='/'; </script>"
                                        );
                                    return;
                                }
        
        
        
                            },
                        (error) => {
                            console.log(error)
                            return;
                        },
                    );
                    
                }
                else if(result.signIn.message === "Successful" && result.signIn.userType === "Corporate"){
        
                    // member lookup
                    async function the_member_look_up() {
                        var memberLookUpDetails = await Reuseables.cp_member_look_up(req.body.userID);
                        // console.log("member details: " + JSON.stringify(memberLookUpDetails));
                        return memberLookUpDetails;
                    }
    
                    // call out asyn and await function "the_member_look_up"
                    the_member_look_up()
                    .then(
                            (body) => 
                                {
                                    req.session.memberCompleteDetails = body;
                                    // console.log("member details: " + JSON.stringify(req.session.memberCompleteDetails));
                                    // console.log(body.lookupMember.member.securityQuestionSet);
                                    // console.log(body)
                                    if (body.lookupMember.corporate.securityQuestionSet === false) {
                                            res.redirect("/corp_securityQuestion");
                                            return;
                                    }
                                    else if (body.lookupMember.corporate.registrationFeePaid === null) {
                                        res.redirect("/corp_payment");
                                        return;
                                    }
                                    else if (body.lookupMember.corporate.registrationFeePaid === 0) {
                                        res.send(
                                            " '<script> alert(' your payment awaits verification, afterwards you can proceed. Kindly check back later, thank you. '); </script>' "
                                            + "<script> window.location.href='/'; </script>"
                                            );
                                        return;
                                    }
                                    else if ( body.lookupMember.corporate.securityQuestionSet === true && body.lookupMember.corporate.registrationFeePaid === 1 && body.lookupMember.corporate.hasBeenVerified === 1 && body.lookupMember.corporate.status === "Final Payment Pending"){
                                        return res.redirect("/annual_corp_payment?type=firstAnnualPayment");
                                    }
                                    else if ( body.lookupMember.corporate.securityQuestionSet === true && body.lookupMember.corporate.registrationFeePaid === 1 && body.lookupMember.corporate.hasBeenVerified === 0 && body.lookupMember.corporate.hasBeenApproved === null){
                                        return res.redirect("/corp_profile");
                                    }
                                    else if (body.lookupMember.corporate.securityQuestionSet === true && body.lookupMember.corporate.registrationFeePaid === 1 && body.lookupMember.corporate.hasBeenVerified === 1 && body.lookupMember.corporate.hasBeenApproved === null){
                                        return res.redirect("/corp_profile");
                                    }
                                    else if (body.lookupMember.corporate.securityQuestionSet === true && body.lookupMember.corporate.registrationFeePaid === 1 && body.lookupMember.corporate.hasBeenVerified === 1 && body.lookupMember.corporate.hasBeenApproved === 0){
                                        return res.redirect("/corp_profile");
                                    }
                                    else if (body.lookupMember.corporate.securityQuestionSet === true &&  body.lookupMember.corporate.registrationFeePaid === 1 && body.lookupMember.corporate.hasBeenVerified === 1 && body.lookupMember.corporate.hasBeenApproved === 1){


                                        // send corp member to objection page
                                        if (req.session.corporatemembershipobjection) {
                                            console.log(req.session.memberCompleteDetails.lookupMember.corporate.memberUUID);
                                            console.log(req.session.corporatemembershipobjection);
                                            return res.redirect("/corp_member_objection");
                                        }else{




                                    // fetch resources directories, membership fee, event fee
                                    async function getDashBoardFields(){


                                        var userID_email = req.session.userDetails.userID;

                                        var corp_member_list = await fmda_corp_reuseables.list_of_its_members(userID_email);

                                        // console.log(corp_member_list);

                                        var resourcesDirectories = await Reuseables.getResources(req.session.memberCompleteDetails.lookupMember.corporate.memberUUID);

                                        var { lookupMemberInvoices } = await Reuseables.corp_pending_payment(req.session.memberCompleteDetails.lookupMember.corporate.memberUUID);

                                        var upcomingEvents = await Reuseables.memberUpcomingEvents(req.session.memberCompleteDetails.lookupMember.corporate.memberUUID);
                                        

                                        var get_memberShipRenewalFeeInvoices = 0;

                                        // var the_get_EventUnpaidInvoices = 0;
                                        for (let index = 0; index < lookupMemberInvoices.length; index++) {
                                            
                                            if (lookupMemberInvoices[index].paymentPurpose == 'Corporate membership renewal') {
                                                get_memberShipRenewalFeeInvoices += parseInt(lookupMemberInvoices[index].amount)
                                                    }
                                        }

                                        var the_get_EventUnpaidInvoices = 0;
                                        for (let index = 0; index < lookupMemberInvoices.length; index++) {
                                            
                                            if (lookupMemberInvoices[index].paymentPurpose == 'Event registration') {
                                                the_get_EventUnpaidInvoices += parseInt(lookupMemberInvoices[index].amount)
                                                    }
                                        }



                                        var getDashBoardFields = {
                                            resourcesDirectories: resourcesDirectories,
                                            number_of_resourcesDirectories : resourcesDirectories.lookupMemberDirectories.length,
                                            get_memberShipRenewalFeeInvoices: get_memberShipRenewalFeeInvoices,
                                            the_get_EventUnpaidInvoices: the_get_EventUnpaidInvoices,
                                            upcomingEvents: upcomingEvents,
                                            corp_member_list:corp_member_list.organisationMembersLookup.length
                                        };

                                        return getDashBoardFields;
                                    }

                                    getDashBoardFields()
                                    .then(
                                        (getDashBoardFields) => {
                                            // console.log(getDashBoardFields);

                                            // save to session
                                            req.session.getDashBoardFields = getDashBoardFields;

                                            return res.redirect("/corp_main_dashboard");
                                        },
                                        (onrejected) => {
                                            console.log(onrejected);
                                        }
                                    );




                                            // return res.redirect("/corp_main_dashboard");
                                        }

                                        
                                    }
                                    else {
                                        res.send(
                                            // " '<script> alert(' " + body.lookupMember.message + " '); </script>' "
                                            " '<script> alert(' no corporate record of you found, check your login credentials or contact the admin.'); </script>' "
                                            + "<script> window.location.href='/'; </script>"
                                            );
                                        return;
                                    }
    
                                
                                },
                            (error) => 
                                {
                                    console.log(error)
                                    return;
                                },
                        );
                            
                }
                else{
                    res.send(
                        " '<script> alert(' " + result.signIn.message + " '); </script>' "
                        + "<script> window.location.href='/'; </script>"
                        );
            
                    return;
                }


            },
            (onrejected) => {
                console.log( onrejected );
                return;
            }
        )
        
        
    
    },
    // seperate each function by ","



    // method passwordReset_initiated
    passwordReset_initiated : function (req, res) {
        res.render("resetPassword");
        return;
    },
    // seperate each function by ","


    // method passwordReset_done
    passwordReset_done : function (req, res) {

        var userID = req.body.userID;

        // call Reuseables.passwordReset()
        var result = Reuseables.passwordReset(userID);

        result.then(
            (result) => {
                // the security question gotten
                var securityQuestionGotten = result.fetchUserQuestion
        
                if (securityQuestionGotten) {
                    // render the page to display annd get the security answer
                    res.render("getSecurityQuestion", {"userID" : userID, "securityQuestionGotten" : securityQuestionGotten});
                    return;
                } else {
                    res.send(" '<script> alert(' issues retrieving security question, contact the admin. '); </script>' "
                    + "<script> window.location.href='/passwordReset'; </script>"
                    );
                    return;
                }
            },
            (onrejected) => {
                console.log(onrejected);
                return;
            }
        );
    
    },
    // seperate each function by ","


    // method validateSecurityAnswer
    validateSecurityAnswer : function(req, res){

         // call Reuseables.validateSecurityAnswer()
        var result = Reuseables.validateSecurityAnswer(req.body.userID, req.body.answer);
 
        result.then(
            (result) => {
                if (result.confirmSecurityAnswer.statusCode === 200) 
                {
                    res.render("provideNewPassword",  {"userID" : req.body.userID});
                    return;
                } 
                else if (result.confirmSecurityAnswer.statusCode != 200) 
                {
                    res.send(" '<script> alert(' " + result.confirmSecurityAnswer.message + " '); </script>' "
                    + "<script> window.location.href='/passwordReset'; </script>"
                    );
    
                    return;
                }
            },
            (onrejected) => {
                console.log(onrejected);
                return;
            }
        )
 
    },
    // seperate each function by ","
    


    // method newPasswordReset
    newPasswordReset : function (req, res) {

         // call Reuseables.newPasswordReset()
         var result = Reuseables.newPasswordReset(req.body.userID, req.body.password);
 
         result.then(
             (result) => {
                // the security question gotten
                var resetResult = result
                if (resetResult.updatePassword.statusCode == 200) {
                    res.send(" '<script> alert(' Your password reset was successful, kindly login. '); </script>' "
                    + "<script> window.location.href='/'; </script>"
                    );
                    return;
                } else if (resetResult.updatePassword.statusCode != 200){
                    res.send(" '<script> alert(' issues retrieving security question, contact the admin. '); </script>' "
                    + "<script> window.location.href='/passwordReset'; </script>"
                    );
                    return;
                }
             },
             (onrejected) => {
                console.log(onrejected);
                return;
            }
         );
    
    },
    // seperate each function by ","



    // method industriesTypesList
    industriesTypesList : function(req, res){
    
        // industry selection made 
        var industryCategorySelection = req.body.mySelection;

         // call Reuseables.newPasswordReset()
         var result = Reuseables.industriesTypesList();
 
         result.then(
             (result) => {
                var industriesCategory = result.industries;
                
                for (let index = 0; index < industriesCategory.length; index++) {
                    const element = industriesCategory[index];
        
                    if (industryCategorySelection === element.industryName) {
                        // console.log(element.types)
                        res.json({"response" : element.types})
                        return;
                    }
        
        
                }
             },
             (onrejected) => {
                console.log(onrejected);
                return;
            }
         );
    
    },
    // seperate each function by ","





    // method general_objection_post
    general_objection_post : function(req, res){

        var userID_email = req.session.userDetails.userID;

        var objection_writeUp = req.body.objection;

        console.log(req.session.memberCompleteDetails.lookupMember);

        if (req.session.theLoginUserType === "Member") {
            var member_id = req.session.memberCompleteDetails.lookupMember.member.memberUUID;
        } 
        else if(req.session.theLoginUserType === "Corporate"){
            var member_id = req.session.memberCompleteDetails.lookupMember.corporate.memberUUID;
        }

        var objection_token = req.session.corporatemembershipobjection.token;

        console.log(objection_writeUp, member_id, objection_token);

        // call Reuseables.general_objection_post()
        var result = Reuseables.general_objection_post(member_id, objection_writeUp, objection_token);
 
        result.then(
            (result) => {

                // empty the req.session.corporatemembershipobjection
                req.session.corporatemembershipobjection = "";
                console.log(result);

                // redirect upon success
                if (req.session.theLoginUserType === "Member") {
                    res.send(" '<script> alert(' Successfully submitted. Thank You. '); </script>' " + "<script> window.location.href='/ind_main_dashboard_for_member'; </script>");
                    return;
                } 
                else if(req.session.theLoginUserType === "Corporate"){
                    res.send(" '<script> alert(' Successfully submitted. Thank You. '); </script>' " + "<script> window.location.href='/corp_main_dashboard'; </script>");
                    return;
                }

            },
            (onrejected) => {
                console.log(onrejected);
                res.send(result.postObjection.message);
                return;
           }
        );

    },
    // seperate each function by ","



    // method make_objection
    make_objection : function (req, res) {

        var companyName = req.session.corporatemembershipobjection.companyName;
        var email = req.session.corporatemembershipobjection.email;

        res.render("make_objection", {companyName:companyName, email:email});
        return;
    },
    // seperate each function by ","



    // handle_make_objection
    handle_make_objection : function(req, res){

        var objection_writeUp = req.body.objection;
        var member_id = req.body.email;
        var objection_token = req.session.corporatemembershipobjection.token;

        console.log(objection_writeUp, member_id, objection_token);

        // call Reuseables.general_objection_post()
        var result = Reuseables.general_objection_post(member_id, objection_writeUp, objection_token);
 
        result.then(
            (result) => {

                // empty the req.session.corporatemembershipobjection
                req.session.corporatemembershipobjection = "";
                console.log(result);

                // { postObjection: { message: 'Successful!', statusCode: 200 } }

                if (result.postObjection.statusCode == 200) {
                    res.send({result: result.postObjection.message});
                    return;
                } else {
                    res.send({result: "Not Successful"});
                    return;
                }
                

            },
            (onrejected) => {
                console.log(onrejected);
                res.send(result.postObjection.message);
                return;
           }
        );

    },
    // seperate each function by ","





     // method review_objection
     review_objection : function (req, res) {

        var companyName = req.session.corporatemembershipobjection.companyName;
        var email = req.session.corporatemembershipobjection.email;

        res.render("review_objection", {companyName:companyName, email:email});
        return;
    },
    // seperate each function by ","






    // method handle_review_objection
    handle_review_objection : function (req, res) {

        // console.log(req.body);

        var objection_writeUp = req.body.objection;
        var member_id = req.body.email;
        var objection_token = req.session.corporatemembershipobjection.token;
        var rejector = req.session.corporatemembershipobjection.rejector;

        console.log(objection_writeUp, member_id, objection_token, rejector);

        // call Reuseables.handle_review_objection()
        var result = Reuseables.handle_review_objection(member_id, objection_writeUp, objection_token, rejector);
 
        result.then(
            (result) => {

                // empty the req.session.corporatemembershipobjection
                req.session.corporatemembershipobjection = "";
                console.log(result);

                // { postReview: { message: 'Successful!', statusCode: 200 } }

                if (result.postReview.statusCode == 200) {
                    res.send({result: result.postReview.message});
                    return;
                } else {
                    res.send({result: "Not Successful"});
                    return;
                }
                

            },
            (onrejected) => {
                console.log(onrejected);
                res.send(result.postObjection.message);
                return;
           }
        );

        
    },
    // seperate each function by ","






    // method logout
    logout : function(req, res){
        console.log("before destroying session: " + req.session.userDetails)
        var sessValue = req.session;
        sessValue.destroy( (error, result) => {
            if(error) {
                throw error.message;
            }else{
                console.log("session destroyed: " + req.session);
                // then redirect
                res.redirect("/");
                return;
            }
        });
    },
    // seperate each function by ","






}





module.exports = app_controller;