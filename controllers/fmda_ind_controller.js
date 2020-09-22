// require the path module
var path = require("path");

const formidable = require('formidable');

// require Reuseables
var Reuseables = require("../reuseables/reuseables");
var fmda_ind_reuseables = require("../reuseables/fmda_ind_reuseables");
// employment history list 
var employmentHistoryList = [];
// qualification list
var qualificationsList = [];
// other professional list
var other_proessional_qualificationsList = [];


var fmda_ind_controller = {

    // method registration_page_individual
    registration_page_individual: function(req, res) {
        // render the individual registration page
        res.render("fmda_ind/register_ind");
        return;
    },
    // seperate each function by ","

    // method register_individual
    register_individual: function(req, res) {
        // call fmda_ind_reuseables.register_individual()
        var result = fmda_ind_reuseables.register_individual(req.body.firstName, req.body.lastName, req.body.personalEmail, req.body.mobileNumber, req.body.password);
        result.then(
            (result) => {
                if (result.signUp.statusCode === 200) {
                    res.send(" '<script> alert(' Registration Successful, Verify Your Email Before Proceeding To Login To Complete Onboarding Process. Thank You! '); </script>' " + "<script> window.location.href='/'; </script>");
                    return;
                } else if (result.signUp.statusCode === 404) {
                    res.send(" '<script> alert(' " + result.signUp.message + " '); </script>' " + "<script> window.location.href='/'; </script>");
                    return;
                } else {
                    res.send(" '<script> alert(' Registration Failed, Kindly Contact The Admin. Thank You! '); </script>' " + "<script> window.location.href='/'; </script>");
                    return;
                }
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },
    // seperate each function by ","

    // method set_security_question
    set_security_question: function(req, res) {
        // call fmda_ind_reuseables.get_security_questions()
        var result = fmda_ind_reuseables.get_security_questions();
        result.then(
            (result) => {
                var securityQuestionsGotten = result.securityQuestions;
                res.render('fmda_ind/securityQuestion', { "securityQuestionsGotten": securityQuestionsGotten });
                return;
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },
    // seperate each function by ","

    // method set_security_question_done
    set_security_question_done: function(req, res) {
        var questionID = req.body.questionID;
        var answer = req.body.answer;
        var userID = req.session.userDetails.userID; // userID from session
        // call fmda_ind_reuseables.set_security_questions()
        var result = fmda_ind_reuseables.set_security_questions(questionID, userID, answer);
        result.then(
            (result) => {
                if (result.setSecurityAnswer.statusCode === 200) {
                    res.send("<script> window.location.href='/confirmatory_update'; </script>");
                    return;
                } else {
                    res.send(" '<script> alert(' Unable to set security answer, kindly contact the admin. Thank You. '); </script>' " + "<script> window.location.href='/securityQuestion'; </script>");
                    return;
                }
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },
    // seperate each function by ","

    // method confirmatory_update_initiated 
    confirmatory_update_initiated: function(req, res) {
        // get for the various categories
        async function getMemberType_treasureCertificationType_industryCategory() {
            var memberType = await fmda_ind_reuseables.getMemberTypes();
            var treasuryCertificateType = await fmda_ind_reuseables.getTreasureCertificationType();
            var industryCategory = await Reuseables.industriesTypesList();
            // console.log(memberType);
            // console.log(treasuryCertificateType);
            // console.log(industryCategory);
            // or using Promise.all()
            // Promise.all([memberType, treasuryCertificateType, industryCategory]).then(function(values) {
            //     console.log("promise all value" + values);
            //  });
            return {
                "memberTypes": memberType.memberTypes,
                "treasuryCertificateType": treasuryCertificateType.treasuryCertificationTypes,
                "industryCategory": industryCategory.industries,
            };
        }
        getMemberType_treasureCertificationType_industryCategory().then(
            (onfulfill) => {
                var result = onfulfill;
                // console.log("the result: " + JSON.stringify(result));
                // render the individual registration page
                res.render("fmda_ind/confirmatory_update", { "memberTypes": result.memberTypes, "treasureCertificationType": result.treasuryCertificateType, "industriesCategory": result.industryCategory });
                return;
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },
    // seperate each function by ","

    // method confirmatory_update_done 
    confirmatory_update_done: function(req, res) {
        console.log(req.body);
        // console.log(req.files.filename);

        // file name multer uploaded
        // console.log(req.files)

        var theRequest = req.body;

        var the_certificationType;

        if(typeof(req.body.certificationType) == "string"){
            the_certificationType = [req.body.certificationType];
        }else{
            the_certificationType = req.body.certificationType;
        }

        req.files.forEach( (element,index) => {
            // check the file extension for pdf type
            if (path.extname(path.join(__dirname) + "/public/ind_uploads/" + element.originalname) !== '.pdf') {
                res.send(" '<script> alert('invalid file type, pdf required'); </script>' " 
                + "<script> window.location.href='/register_individual'; </script>");

                return;
            }
        });


        var the_certificationTypeLength = the_certificationType.length;


        if(the_certificationTypeLength == 1){
            theRequest["credential1"] = "ind_uploads/"+req.files[0].filename;
            theRequest["credential2"] = "";
            theRequest["credential3"] = "";
            theRequest["credential4"] = "";
            theRequest["comprehensiveCv"] = "ind_uploads/"+req.files[1].filename;
        }
        else if(the_certificationTypeLength == 2){
            theRequest["credential1"] = "ind_uploads/"+req.files[0].filename;
            theRequest["credential2"] = "ind_uploads/"+req.files[1].filename;
            theRequest["credential3"] = "";
            theRequest["credential4"] = "";
            theRequest["comprehensiveCv"] = "ind_uploads/"+req.files[2].filename;
        }
        else if(the_certificationTypeLength == 3){
            theRequest["credential1"] = "ind_uploads/"+req.files[0].filename;
            theRequest["credential2"] = "ind_uploads/"+req.files[1].filename;
            theRequest["credential3"] = "ind_uploads/"+req.files[2].filename;
            theRequest["credential4"] = "";
            theRequest["comprehensiveCv"] = "ind_uploads/"+req.files[3].filename;
        }
        else if(the_certificationTypeLength == 4){
            theRequest["credential1"] = "ind_uploads/"+req.files[0].filename;
            theRequest["credential2"] = "ind_uploads/"+req.files[1].filename;
            theRequest["credential3"] = "ind_uploads/"+req.files[2].filename;
            theRequest["credential4"] = "ind_uploads/"+req.files[3].filename;
            theRequest["comprehensiveCv"] = "ind_uploads/"+req.files[4].filename;
        }



        console.log(theRequest);

        //   get userID from the session
        var theUserID = '"' + req.session.userDetails.userID + '"';
        // console.log(theUserID);
        // call fmda_ind_reuseables.confirmatory_update_details()
        // var result = fmda_ind_reuseables.confirmatory_update_details(theUserID, req.body.memberType, req.body.certificationType, req.file.filename, req.body.industryCategory, req.body.industryType);
        var result = fmda_ind_reuseables.confirmatory_update_details(theUserID, req.body.memberType, the_certificationType, req.body.credential1, req.body.credential2, req.body.credential3, req.body.credential4, req.body.comprehensiveCv, req.body.industryCategory, req.body.industryType);
        result.then(
            (result) => {
                // console.log(result);
                if (result.memberTypeDetails.statusCode === 200) {
                    res.send("<script> window.location.href='/onboarding_ind'; </script>");
                    return;
                } else {
                    res.send(" '<script> alert(' " + result.memberTypeDetails.message + " '); </script>' " + "<script> window.location.href='/confirmatory_update'; </script>");
                    return;
                }
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },
    // seperate each function by ","
    
    // Renders the member registration form for the individual to add other personal information
    // method onboarding_ind_initiated
    onboarding_ind_initiated: function(req, res) {
        // the userID (email)
        var userID_email = req.session.userDetails.userID;
        // gett member complete details set in session upon login in index.js
        // destructure just the member object from the member complete details
        // var { lookupMember: { member } } = req.session.memberCompleteDetails;
        

        // determind if the request is coming from the update page or the initial registration page
        // set the action variable to 'update' to be used when rendering the view
        var action = req.query.action === 'update' ? 'update' : 'initial';

        var theMemberType = "Member";

        Promise.all([
            // assemble all promises
            fmda_ind_reuseables.list_of_organisation(),
            fmda_ind_reuseables.membership_category(),
            // get current memberCompleteDetails & pass to next page
            Reuseables.member_look_up('"' + req.session.userDetails.userID + '"', '"' + theMemberType + '"')
        ]).then(
            ([
                // get the values from the promises
                organisations_list,
                membership_category,
                { lookupMember: { member } }
            ]) => {
                var orgList_for_ind = organisations_list.organisations;
                // loop through membership categories to get list of years of experience
                var years_of_experience = membership_category.membershipCategories.map(item => item.yearsOfTreasuryExperience);
                res.render("fmda_ind/onboarding/onboarding_ind", {
                    userID_email, member, orgList_for_ind, years_of_experience, action,
                });
                return;

        }, (error) => {
                console.log(error);
                return;
        });
    },
    // seperate each function by ","


    // method ind_personalInformation
    ind_personalInformation: function(req, res) {

        // check that the profile was uploaded
        if (req.file) {
            // get the picture extension
            var fileExt = path.extname(path.join(__dirname) + "/public/ind_passport/" + req.file.originalname);
            // console.log(fileExt);
            var imagePlusPath = "ind_passport/" + req.file.filename;

            // check the file extension of the image
            if( ['.jpg', '.png', '.jpeg'].find(a => a === fileExt.toLowerCase()) === undefined ) {
                return res.send(" '<script> alert('invalid typo, jpg or png required'); </script>' " + "<script> window.location.href='/onboarding_ind'; </script>");
            }
        } else {
            // if it wasn't, use the image path from the existing user's details information
            imagePlusPath = req.session.memberCompleteDetails.lookupMember.member.profilePhoto;
        }

        //   get userID from the session
        var theUserID = req.session.userDetails.userID;

        // if member chose Others and provided their current organisation name
        // console.log("org name supplied: " + req.body.proposedOrganisationName);
        if (req.body.proposedOrganisationName != "") {
            var orgNameOfMember = req.body.proposedOrganisationName
            var ind_personalInformation_upload = {
                "operationName": "addPersonalInfoMutation",
                "query": `mutation addPersonalInfoMutation { addPersonalInfo(userId: \"${theUserID}\" ) {statusCode message} }`,
                "variables": {
                    "firstName": req.body.firstName,
                    "lastName": req.body.lastName,
                    "gender": req.body.gender,
                    "address": req.body.address,
                    "personalEmail": req.body.theUserID,
                    "mobileNumber": req.body.mobileNumber,
                    "officeNumber": req.body.officeNumber,
                    "dateOfBirth": req.body.dateOfBirth,
                    "currentOrganisation": req.body.currentOrganisation,
                    "currentOrganisationId": req.body.currentOrganisationId,
                    "designation": req.body.designation,
                    "proposedOrganisationName": orgNameOfMember,
                    "state": req.body.state,
                    "yearsOfTreasuryExperience": req.body.yearsOfTreasuryExperience,
                    "yearsOfPostNyscExperience": req.body.yearsOfPostNyscExperience,
                    "profilePhoto": imagePlusPath
                }
            }
        } else {
            var ind_personalInformation_upload = {
                "operationName": "addPersonalInfoMutation",
                "query": `mutation addPersonalInfoMutation { addPersonalInfo(userId: \"${theUserID}\" ) {statusCode message} }`,
                "variables": {
                    "firstName": req.body.firstName,
                    "lastName": req.body.lastName,
                    "gender": req.body.gender,
                    "address": req.body.address,
                    "personalEmail": theUserID,
                    "mobileNumber": req.body.mobileNumber,
                    "officeNumber": req.body.officeNumber,
                    "dateOfBirth": req.body.dateOfBirth,
                    "currentOrganisation": req.body.currentOrganisation,
                    "currentOrganisationId": req.body.currentOrganisationId,
                    "designation": req.body.designation,
                    "state": req.body.state,
                    "yearsOfTreasuryExperience": req.body.yearsOfTreasuryExperience,
                    "yearsOfPostNyscExperience": req.body.yearsOfPostNyscExperience,
                    "profilePhoto": imagePlusPath
                }
            }
        }

        var result = fmda_ind_reuseables.ind_personalInformation_upload(ind_personalInformation_upload);
        
        // console.log(ind_personalInformation_upload);

        result.then(
            (result) => {
                // console.log(result);
                if (result.addPersonalInfo.message === "Successful !") {
                    // redirect the user to the back to the profile page if he is coming from the update section
                    res.send(`<script> window.location.href='/${req.query.action === 'update' ? 'ind_profile_page_for_member': 'ind_professionalInformation' }'; </script>`);
                    return;
                } else {
                    res.send(" '<script> alert(' Unable to save your personal information, kindly contact the admin. Thank You. '); </script>' " + "<script> window.location.href='/onboarding_ind'; </script>");
                    return;
                }
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },
    // seperate each function by ","


    // method ind_get_organization_ID_by_my_selection
    ind_get_organization_ID_by_my_selection: function(req, res) {
        // get my selection
        var mySelection = req.body.mySelection;
        var result = fmda_ind_reuseables.ind_get_organization_ID_by_my_selection();
        result.then(
            (result) => {
                var orgList_for_ind = result.organisations;
                for (let index = 0; index < orgList_for_ind.length; index++) {
                    if (orgList_for_ind[index].organisationName === mySelection) {
                        console.log("it's id is: " + orgList_for_ind[index].id);
                        res.send({ response: orgList_for_ind[index].id });
                        return;
                    }
                }
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },
    // seperate each function by ","


    // method ind_professionalInformation_initiated
    ind_professionalInformation_initiated: function(req, res) {

        // get current memberCompleteDetails & pass to next page
        async function the_member_look_up() {
            var theMemberType = "Member";
            var memberLookUpDetails = await Reuseables.member_look_up('"' + req.session.userDetails.userID + '"', '"' + theMemberType + '"');
            // console.log("new member details: ", JSON.stringify(memberLookUpDetails));
            return memberLookUpDetails;
        };

        the_member_look_up()
        .then(
            (body) =>  {
                res.render("fmda_ind/onboarding_ind2", {"memberDetails":body});
            },
            (error) => { console.log(error)
                    return;}
            );
    },
    // seperate each function by ","


    // method ind_professionalInformation_done
    ind_professionalInformation_done: function(req, res) {

        // console.log(req.body.values);

        //   get userID from the session
        var theUserID = '"' + req.session.userDetails.userID + '"';
        var result = fmda_ind_reuseables.ind_professionalInformation(theUserID, JSON.parse(req.body.values));
        result.then(
            (result) => {
                // console.log(result);
                if (result.addProfessionalInfo.message == "Successful !") {
                    res.send("Successful !");
                    return;
                } else {
                    res.send("failed, kindly contact the admin");
                    return;
                }
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },
    // seperate each function by ","


    // method ind_qualifications_initiated
    ind_qualifications_initiated: function(req, res) {

        // get current memberCompleteDetails & pass to next page
        async function the_member_look_up() {
            var theMemberType = "Member";
            var memberLookUpDetails = await Reuseables.member_look_up('"' + req.session.userDetails.userID + '"', '"' + theMemberType + '"');
            // console.log("new member details: ", JSON.stringify(memberLookUpDetails));
            return memberLookUpDetails;
        };

        the_member_look_up()
        .then(
            (body) =>  {
                res.render("fmda_ind/onboarding_ind3", {"memberDetails":body});
            },
            (error) => { console.log(error)
                    return;}
            );
    },
    // seperate each function by ","


    // method ind_qualifications_done
    ind_qualifications_done: function(req, res) {
        console.log(req.body.values);

        //   get userID from the session
        var theUserID = '"' + req.session.userDetails.userID + '"';
        var result = fmda_ind_reuseables.ind_qualifications_upload(theUserID, JSON.parse(req.body.values));
        result.then(
            (result) => {
                // console.log(result);
                if (result.addQualifications.message == "Successful !") {
                    res.send("Successful !");
                    return;
                } else {
                    res.send("failed, kindly contact the admin");
                    return;
                }
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },
    // seperate each function by ","



    // method ind_other_proffessional_qualifications_initiated
    ind_other_proffessional_qualifications_initiated: function(req, res) {

        // get current memberCompleteDetails & pass to next page
        async function the_member_look_up() {
            var theMemberType = "Member";
            var memberLookUpDetails = await Reuseables.member_look_up('"' + req.session.userDetails.userID + '"', '"' + theMemberType + '"');
            // console.log("new member details: ", JSON.stringify(memberLookUpDetails));
            return memberLookUpDetails;
        };

        the_member_look_up()
        .then(
            (body) =>  {
                res.render("fmda_ind/onboarding_ind_other_qualifications3", {"memberDetails":body});
            },
            (error) => { console.log(error)
                    return;}
            );
    },
    // seperate each function by ","


    // method ind_other_proffessional_qualifications_done
    ind_other_proffessional_qualifications_done: function(req, res) {
        // console.log(req.body.values);

        //   get userID from the session
        var theUserID = '"' + req.session.userDetails.userID + '"';
        var result = fmda_ind_reuseables.ind_other_proffessional_qualifications_upload(theUserID, JSON.parse(req.body.values));
        result.then(
            (result) => {
                if (result.addOtherProfessionalInfo.message == "Successful !") {
                    res.send("Successful !");
                    return;
                } else {
                    res.send("failed, kindly contact the admin");
                    return;
                }
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },
    // seperate each function by ","




    // method ind_attestation_initiated
    ind_attestation_initiated: function(req, res) {
        const action = req.query.action === 'update' ? 'update' : 'initial';
        const { memberCompleteDetails, userDetails : { userID_email } } = req.session
        res.render("fmda_ind/onboarding/onboarding_ind4", { userID_email, memberCompleteDetails, action });
    },
    // seperate each function by ","


    // method ind_attestation_done
    ind_attestation_done: function(req, res) {
        // get userID from the session
        var theUserID = req.session.userDetails.userID;
        var referenceMemberId = req.body.referenceMemberId;
        var result = fmda_ind_reuseables.ind_attestations_upload(theUserID, referenceMemberId);
        result.then(
            (result) => {
                console.log(result);
                if (result.submitAttestation.message == "Successful !") {
                    res.send(`<script> window.location.href='/${req.query.action === 'update' ? 'ind_profile_page_for_member': 'ind_profile_page_for_member' }'; </script>`);
                    return;
                } else {
                    res.send(" '<script> alert(' Unable to save your attestation, kindly contact the admin. Thank You. '); </script>' " + "<script> window.location.href='/ind_attestation'; </script>");
                    return;
                }
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },
    // seperate each function by ","


    // method ind_payment_for_member_initiated
    ind_payment_for_member_initiated: function(req, res) {

        // checking if payment is for pending invoices payment
        if (req.query.type == "pendingPayment") {
            
            const action = req.query.action === 'update' ? 'update' : 'initial';
            var userID_email = req.session.userDetails.userID;
            var paymentInfo = {
                "description": req.query.purpose,
                "amount": req.query.amount,
                "invoiceNumber": req.query.invoiceNumber
            };

            // Payment For pending invoices
            var PaymentFor = "pending invoices";

            Promise.all([
                Reuseables.list_of_fmda_bank_accounts(),
                Reuseables.member_look_up(`"${userID_email}"`, '"Member"'),
            ]).then(
                ([
                    { lookupBankAccounts },
                    memberCompleteDetails
                ]) => {
                    // we are using the same onboarding payment page
                    const { lookupMember: { member: { yearsOfTreasuryExperience } } } = memberCompleteDetails;
                    res.render("fmda_ind/onboarding/onboarding_ind5", { userID_email, "banks": lookupBankAccounts, "banksString": JSON.stringify(lookupBankAccounts), paymentInfo, PaymentFor, action });
                    return;

                    

                }, (error) => {
                    console.log(error)
                    return;
                }, );

        } 
        // or if it's for initial payment upon registration
        else 
        {
            const action = req.query.action === 'update' ? 'update' : 'initial';
            var userID_email = req.session.userDetails.userID;

            // Payment For onboardingType
            var PaymentFor = "onboarding payment";

            Promise.all([
                // assemble all promises
                Reuseables.List_of_payment_purposes(),
                Reuseables.list_of_fmda_bank_accounts(),
                Reuseables.member_look_up(`"${userID_email}"`, '"Member"'),
            ]).then(
                ([
                    // get destructured values from the promises 
                    { paymentPurposes },
                    { lookupBankAccounts },
                    memberCompleteDetails
                ]) => {
                    var paymentInfo;
                    // loop through the payment purposes to get the payment id for member registration 
                    paymentPurposes.forEach(item => {
                        if (item.description === "Membership registration fee") paymentInfo = item;
                    });
                    // destructure member complete details to get treasury experience
                    const { lookupMember: { member: { yearsOfTreasuryExperience } } } = memberCompleteDetails;
                    // get the payment amount for that particular range of treasury experience
                    Reuseables.get_payment_amount(paymentInfo.id, yearsOfTreasuryExperience).then(
                        ({paymentAmount}) => {
                        paymentInfo.amount = paymentAmount;
                        res.render("fmda_ind/onboarding/onboarding_ind5", { userID_email, "banks": lookupBankAccounts, "banksString": JSON.stringify(lookupBankAccounts), paymentInfo, PaymentFor, action });
                        return;
                    }).catch(
                    (err) => {
                            console.log(err);
                        });
                }, (error) => {
                    console.log(error)
                    return;
                }, );
        }

    },
    // seperate each function by ","


    // method ind_payment_for_member_done
    ind_payment_for_member_done: function(req, res) {

        // console.log(req.body);

        //   get userID from the session
        var theUserID = req.session.userDetails.userID;
        var depositorName = req.body.depositorName;
        var paymentReferenceNo = req.body.paymentReferenceNo;
        // var amount = '"' + req.body.amount + '"';
        var invoiceNumber = req.body.invoiceNumber;
        var paymentDate = req.body.paymentDate;
        var bank = req.body.bank;
        var purpose = req.body.purpose;
        var accountNumber = req.body.accountNumber;
        var accountName = req.body.accountName;
        var result = fmda_ind_reuseables.ind_payment_for_member(
            theUserID, depositorName, paymentReferenceNo, invoiceNumber, req.body.amount, paymentDate, bank, purpose, accountName, accountNumber);
        result.then(
            (result) => {
                if (result.submitPayment.message == "Successful !") {
                    res.send("payment records saved.");
                    return;
                } else if (result.submitPayment.message == "Payment already exists.") {
                    res.send("Payment already exists, wait for admin verification");
                    return;
                } else {
                    // console.log(result.submitPayment.message);
                    res.send("Unable to save your payment record, kindly contact the admin. Thank You.");
                    return;
                }
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },
    // seperate each function by ","

    

    // Shows the page showing all the individual's personal information
    ind_profile_page_for_member_initiated: function(req, res) {
        var userID_email = req.session.userDetails.userID;

        Reuseables.member_look_up(`"${userID_email}"`, '"Member"').then(memberCompleteDetails => {
            // update the memberCompleteDetails currently stored in session
            req.session.memberCompleteDetails = memberCompleteDetails
            res.render("fmda_ind/onboarding/ind_profile_page", { userID_email, memberCompleteDetails });
        }); 
        
    },
    // seperate each function by ","

    // method ind_main_dashboard_for_member_initiated
    ind_main_dashboard_for_member_initiated: function(req, res) {
        // the userID (email)

        var userID_email = req.session.userDetails.userID;
        res.render("fmda_ind/ind_main_dashboard", { userID_email: userID_email, memberCompleteDetails: req.session.memberCompleteDetails, getDashBoardFields:req.session.getDashBoardFields });
    },
    // seperate each function by ","


    // method ind_member_objection
    ind_member_objection : function(req, res){
        var userID_email = req.session.userDetails.userID;
        res.render("fmda_ind/ind_member_objection", { userID_email: userID_email, memberCompleteDetails: req.session.memberCompleteDetails });
    },
    // seperate each function by ","
    

    // method employmentHistoryList_individual_initiated
    employmentHistoryList_individual_initiated: function(req, res) {
        var addAsObject = {
                organisationName: req.body.organisationName,
                positionHeld: req.body.positionHeld,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                commaResponsibilities: req.body.commaResponsibilities
            }
            // add employment History to List
        employmentHistoryList.push(addAsObject);
        console.log(employmentHistoryList);
        res.render("fmda_ind/emplomentHistory", { employmentHistoryList: employmentHistoryList });
    },
    // seperate each function by ","

    // method removeEmplomentHistory_individual_initiated
    removeEmplomentHistory_individual_initiated: function(req, res) {
        // console.log(req.body.removeByName);
        var removeByName = req.body.removeByName;
        for (let index = 0; index < employmentHistoryList.length; index++) {
            const element = employmentHistoryList[index];
            if (element.organisationName == removeByName) {
                console.log("we found a connection");
                // create the full object
                var composeObject = {
                        organisationName: element.organisationName,
                        positionHeld: element.positionHeld,
                        startDate: element.startDate,
                        endDate: element.endDate,
                        commaResponsibilities: element.commaResponsibilities
                    }
                    // console.log("composed object" + composeObject);
                var position = employmentHistoryList.map(function(e) { return e.organisationName; }).indexOf(removeByName);
                // console.log(position);
                // where to start delete from
                var startDeleteFrom = position + 1;
                employmentHistoryList.splice(index, startDeleteFrom);
            }
        }
        res.render("fmda_ind/emplomentHistory", { employmentHistoryList: employmentHistoryList });
    },
    // seperate each function by ","


    // method qualificationList_individual_initiated
    qualificationList_individual_initiated: function(req, res) {
        var addAsObject = {
                institutionName: req.body.institutionName,
                degreeOptained: req.body.degreeOptained,
                from: req.body.from,
                to: req.body.to,
                certificateURL: req.body.certificateURL
            }
            // add employment History to List
        qualificationsList.push(addAsObject);
        console.log(qualificationsList);
        res.render("fmda_ind/qualificationsObtained", { qualificationsList: qualificationsList });
    },
    // seperate each function by ","
    

    // method removeQualification_individual_initiated
    removeQualification_individual_initiated: function(req, res) {
        // console.log(req.body.removeByName);
        var removeByName = req.body.removeByName;
        for (let index = 0; index < qualificationsList.length; index++) {
            const element = qualificationsList[index];
            if (element.institutionName == removeByName) {
                console.log("we found a connection");
                // create the full object
                var composeObject = {
                        organisationName: element.institutionName,
                        positionHeld: element.degreeOptained,
                        startDate: element.from,
                        endDate: element.to,
                    }
                    // console.log("composed object" + composeObject);
                var position = qualificationsList.map(function(e) { return e.institutionName; }).indexOf(removeByName);
                // console.log(position);
                // where to start delete from
                var startDeleteFrom = position + 1;
                qualificationsList.splice(index, startDeleteFrom);
            }
        }
        console.log(qualificationsList);
        res.render("fmda_ind/qualificationsObtained", { qualificationsList: qualificationsList });
    },
    // seperate each function by ","



    // method other_professional_qualificationList_individual_initiated
    other_professional_qualificationList_individual_initiated: function(req, res) {
        var addAsObject = {
                institutionName: req.body.institutionName,
                qualification: req.body.qualification,
                yearAttained: req.body.yearAttained,
                certificateURL: req.body.certificateURL
            }
            // add other_proessional_qualifications to List
            other_proessional_qualificationsList.push(addAsObject);
        console.log(other_proessional_qualificationsList);
        res.render("fmda_ind/otherPrefessionalQualificationsObtained", { qualificationsList: other_proessional_qualificationsList });
    },
    // seperate each function by ","


    // method remove_other_professional_Qualification_individual_initiated
    remove_other_professional_Qualification_individual_initiated: function(req, res) {
        // console.log(req.body.removeByName);
        var removeByName = req.body.removeByName;
        for (let index = 0; index < other_proessional_qualificationsList.length; index++) {
            const element = other_proessional_qualificationsList[index];
            if (element.institutionName == removeByName) {
                console.log("we found a connection");
                // create the full object
                var composeObject = {
                        organisationName: element.institutionName,
                        qualification: element.qualification,
                        yearAttained: element.yearAttained,
                        certificateURL: req.body.certificateURL
                    }
                    // console.log("composed object" + composeObject);
                var position = other_proessional_qualificationsList.map(function(e) { return e.institutionName; }).indexOf(removeByName);
                // console.log(position);
                // where to start delete from
                var startDeleteFrom = position + 1;
                other_proessional_qualificationsList.splice(index, startDeleteFrom);
            }
        }
        console.log(other_proessional_qualificationsList);
        res.render("fmda_ind/otherPrefessionalQualificationsObtained", { qualificationsList: other_proessional_qualificationsList });
    },
    // seperate each function by ","



    render_change_password_page: function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            return res.render('fmda_ind/change_password', { memberCompleteDetails });
        } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","


    handle_change_password: async function(req, res) {
        try {
            const { userDetails: { userID } } = req.session;
            const { newPassword, oldPassword } = req.body;
            // check the old password is correct
            const { signIn: { statusCode } } = await Reuseables.login(userID, oldPassword );
            if (statusCode !== 200) {
              return res.send(`<script> alert('Incorrect old password');window.location.href='/ind_change_password';</script>`);
            }
            const { updatePassword: { message } } = await fmda_ind_reuseables.change_password(userID, newPassword);
            return res.send(`<script> alert('${message}');window.location.href='/ind_change_password';</script>`);
        } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","


    render_attestation_page: function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            const { firstName, lastName, organisation, token } = req.query;
            return res.render('fmda_ind/confirm_attestation', { memberCompleteDetails, firstName, lastName, organisation, token });
        } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","


    handle_member_attestation: async function(req, res) {
        try {
            const status = req.body.status === 'approve';
            const { id } = req.params;
            const { confirmAttestation: { message } } = await fmda_ind_reuseables.confirm_attestation(id, status);
            return res.send(`<script> alert('${message}');window.location.href='/logout';</script>`);
        } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","


    render_payment_history_page: async function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            const { lookupMember : { member : {  memberUUID, personalEmail } } } = memberCompleteDetails;
            const { memberPaymentHistory } = await Reuseables.memberPaymentHistory(personalEmail, memberUUID, 3);
            return res.render('fmda_ind/payment/paymentHistory', { memberCompleteDetails, memberPaymentHistory });
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","


    render_upcoming_events_page: async function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            const { lookupMember : { member : {  memberUUID } } } = memberCompleteDetails;
            const { upcomingEvents } = await Reuseables.memberUpcomingEvents(memberUUID);
            return res.render('fmda_ind/events/upcoming_events', { memberCompleteDetails, events: upcomingEvents, type: 'ind' });
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","


    render_event_details_page: async function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            const { lookupMember : { member : {  memberUUID } } } = memberCompleteDetails;
            const { eventId, type } = req.query;
            var [
                { lookupEvent },
                { checkEventRegistration },
                { lookupEventAmount },
                { lookupAttendees },
                paymentStatus
            ] = await Promise.all([
                Reuseables.eventDetails(eventId),
                Reuseables.checkEventRegistration(eventId, memberUUID),
                Reuseables.checkEventAmount(eventId, memberUUID),
                Reuseables.eventAttendees(eventId),
                Reuseables.checkEventPaymentStatus(eventId, memberUUID),
            ]);


            // console.log("type: ", type);
            console.log("paymentStatus: ", paymentStatus);

             if (type == "Free") {
                return res.render('fmda_ind/events/event_details', { 
                    lookupAttendees, paymentStatusDisplay, memberCompleteDetails, memberUUID,
                    checkEventRegistration, lookupEventAmount, lookupEvent, type: 'ind' 
                });
             }
             else if (type == "Paid" && paymentStatus.statusCode != 404) {

                if (paymentStatus.lookupEventPaymentStatus.status == 0) {
                    var paymentStatusDisplay =  "payment awaiting approval";
                } else if (paymentStatus.lookupEventPaymentStatus.status == -1) {
                    var paymentStatusDisplay =  "payment denied";
                } else if (paymentStatus.lookupEventPaymentStatus.status == 1) {
                    var paymentStatusDisplay =  "payment approved";
                }

                return res.render('fmda_ind/events/event_details', { 
                    lookupAttendees, paymentStatus, paymentStatusDisplay, memberCompleteDetails, memberUUID,
                    checkEventRegistration, lookupEventAmount, lookupEvent, type: 'ind' 
                });
             }
             else if (type == "Paid" && paymentStatus.statusCode == 404) {
                console.log("it's a new event that requires a fresh registration");

                // create a new paymentStatus
                var paymentStatus = { lookupEventPaymentStatus : { status : 5 } }; 

                return res.render('fmda_ind/events/event_details', { 
                    lookupAttendees, paymentStatus, paymentStatusDisplay, memberCompleteDetails, memberUUID,
                    checkEventRegistration, lookupEventAmount, lookupEvent, type: 'ind' 
                });
             }

             
            

            
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","



    render_event_registration_page: async function(req, res) {

        // console.log(req.body);

        try {
            const { memberCompleteDetails } = req.session;
            var memberUUID = req.session.memberCompleteDetails.lookupMember.member.memberUUID;
            var eventId = req.query.eventId;
            var eventName = req.query.eventName;
            var type = req.query.type;
            var amount = req.query.amount;

            // if we are coming from pending invoice page
            if (req.query.invoiceNumber) {
                // set as object
                var registerWith = {
                    memberUUID : memberUUID,
                    eventId : eventId,
                    eventName : eventName,
                    type : req.query.type,
                    amount : req.query.amount,
                    invoiceNumber: req.query.invoiceNumber
                }
            } else {
                // set as object
                var registerWith = {
                    memberUUID : memberUUID,
                    eventId : eventId,
                    eventName : eventName,
                    type : req.query.type,
                    amount : req.query.amount
                }
            }

            

            // free event
            if (type == "Free") {
                var registerMemberFreeEvent = await Reuseables.registerMemberFreeEvent(eventId, type, memberUUID);
                if (registerMemberFreeEvent.memberFreeEventRegistration.statusCode == 200) {
                    return res.send(`<script> alert('${registerMemberFreeEvent.memberFreeEventRegistration.message}');
                    window.location.href='/ind_upcoming_events';</script>`);
                }  
                else {
                    return res.send(`<script> alert('${registerMemberFreeEvent.memberFreeEventRegistration.message}');
                    window.location.href='/ind_upcoming_events';</script>`);
                }                  
            }
            else{
                // paid event, render the page for payment details
                var { lookupBankAccounts } = await Reuseables.list_of_fmda_bank_accounts();
                return res.render('fmda_ind/events/register', { memberCompleteDetails, registerWith, lookupBankAccounts });
            }
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","



    handle_event_registration: async function(req, res) {
        

        var paidEventParams = {
                                userId : req.body.userId,
                                depositorName : req.body.depositorName,
                                paymentReferenceNo : req.body.paymentReferenceNo,
                                amount : parseInt(req.body.amount),
                                paymentDate : req.body.paymentDate, 
                                bank : req.body.bank, 
                                accountNumber: req.body.accountNumber, 
                                accountName : req.body.accountName, 
                                eventId : req.body.eventId,
                                eventName : req.body.eventName,
                                purpose : req.body.purpose,
                                invoiceNumber : req.body.invoiceNumber
                            };
        try {
            var { memberPaidEventRegistration } = await Reuseables.registerMemberPaidEvent(paidEventParams);
            if (memberPaidEventRegistration.statusCode == 200) {
                return res.send(`<script> alert('${memberPaidEventRegistration.message}');
                window.location.href='/ind_upcoming_events';</script>`);
            }  
            else {
                return res.send(`<script> alert('${memberPaidEventRegistration.message}');
                window.location.href='/ind_upcoming_events';</script>`);
            }   
        } catch (error) {
          return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","



    ind_get_fmda_account_details: async function(req, res) {

        var bank_name = req.body.bank_name;
        var fmda_account_details = [];

        try {
            const { lookupBankAccounts } = await Reuseables.list_of_fmda_bank_accounts();
            for (let index = 0; index < lookupBankAccounts.length; index++) {
                if (lookupBankAccounts[index].bank == bank_name) {
                    fmda_account_details.push(lookupBankAccounts[index]);
                }
            }
            console.log("fmda account details: ", fmda_account_details[0].accounts);
            res.send(fmda_account_details[0].accounts);
            // empty the array
            fmda_account_details = "";
            return;
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","



    // ind_view_certicicate
    ind_view_certicicate: function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            var userID_email = req.session.userDetails.userID;
            res.render("fmda_ind/onboarding/ind_certificate", { userID_email, memberCompleteDetails });
        } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","



    // handle_academic_certificate_upload
    handle_academic_certificate_upload: function(req, res) {
        
        var form = new formidable.IncomingForm();

        form.parse(req);

        form.on('fileBegin', function (name, file){
            file.path = './public/academic_certificate_upload/' + file.name;
            console.log("file details: ", file);
            console.log("file type: ", file.type);
        });

        form.on('file', function (name, file){
            console.log('Uploaded ' + file.name);
        });

        return res.status(200).send({status : "successfully uploaded."});

    },
    // seperate each function by ","



    // handle_ind_other_proffessional_qualifications_cert_upload
    handle_ind_other_proffessional_qualifications_cert_upload: function(req, res) {
        
        var form = new formidable.IncomingForm();

        form.parse(req);

        form.on('fileBegin', function (name, file){
            file.path = './public/other_professional_certificate_upload/' + file.name;
            console.log("file details: ", file);
            console.log("file type: ", file.type);
        });

        form.on('file', function (name, file){
            console.log('Uploaded ' + file.name);
        });

        return res.status(200).send({status : "successfully uploaded."});

    },
    // seperate each function by ","



    // handle_ind_finalize_upload
    handle_ind_finalize_upload: function(req, res) {
        
        var form = new formidable.IncomingForm();

        form.parse(req);

        form.on('fileBegin', function (name, file){
            file.path = './public/other_professional_certificate_upload/' + file.name;
            console.log("file details: ", file);
            console.log("file type: ", file.type);
        });

        form.on('file', function (name, file){
            console.log('Uploaded ' + file.name);
        });

        return res.status(200).send({status : "successfully uploaded."});

    },
    // seperate each function by ","



    // delete_emp_history
    delete_emp_history: async function(req, res) {

        var userId = req.query.userId;
        var startDate = req.query.startDate;
        var endDate = req.query.endDate;

        try {
            const { removeSingleEmploymentHistory } = await Reuseables.delete_emp_history(userId, startDate, endDate);
            if(removeSingleEmploymentHistory.message == "Successful !"){
                return res.send(`<script> alert('Employment history removed.');window.location.href='/ind_profile_page_for_member';</script>`);
            }else{
                return res.send(`<script> alert('Failed removing employment history.');window.location.href='/ind_profile_page_for_member';</script>`);
            }
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }

    },
    // seperate each function by ","



    // delete_ind_qualifications
    delete_ind_qualifications: async function(req, res) {
        
        var userId = req.query.userId;
        var certUrl = req.query.certUrl;

        try {
            const { removeSingleQualification } = await Reuseables.delete_ind_qualifications(userId, certUrl);
            if(removeSingleQualification.message == "Successful !"){
                return res.send(`<script> alert('Academic qualification removed.');window.location.href='/ind_profile_page_for_member';</script>`);
            }else{
                return res.send(`<script> alert('Failed removing academic qualification.');window.location.href='/ind_profile_page_for_member';</script>`);
            }
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }

    },
    // seperate each function by ","




    // delete_other_professional_qualifications
    delete_other_professional_qualifications: async function(req, res) {
        
        var userId = req.query.userId;
        var certUrl = req.query.certUrl;

        try {
            const { removeSingleOtherQualification } = await Reuseables.delete_other_professional_qualifications(userId, certUrl);
            if(removeSingleOtherQualification.message == "Successful !"){
                return res.send(`<script> alert('Other qualification removed.');window.location.href='/ind_profile_page_for_member';</script>`);
            }else{
                return res.send(`<script> alert('Failed removing Other qualification.');window.location.href='/ind_profile_page_for_member';</script>`);
            }
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }

    },
    // seperate each function by ","



    // ind_generate_invoice_number
    ind_generate_invoice_number: async function(req, res) {
        
        var action = req.body.action;
        var memberUUID = req.session.memberCompleteDetails.lookupMember.member.memberUUID;
        // console.log(action);

        if ( action == 'generate invoice number' ) {
                try {
                    const { generateMemberAnnualFeeInvoice } = await fmda_ind_reuseables.ind_generate_invoice_number(memberUUID);
                    if(generateMemberAnnualFeeInvoice.message == "Successful!"){
                        
                        return res.send("Invoice Number Generated! Check Your Mailbox.");
                    }else{
                        return res.send("Failed Generating Invoice Number. Contact the admin.");
                    }
                } catch (error) {
                    console.log(error)
                    return res.send(`Error Message, APIs Service Down: ${error.message}`);
                }
        }

    },
    // seperate each function by ","




    // ind_generate_event_invoice_number
    ind_generate_event_invoice_number: async function(req, res) {
        
        var action = req.body.action;
        var eventID = req.body.eventID;
        var memberUUID = req.session.memberCompleteDetails.lookupMember.member.memberUUID;
        console.log("action: " + action + " eventID: " +eventID);

        if ( action == 'generate event invoice number' ) {
                try {
                    const { generateEventInvoice } = await fmda_ind_reuseables.ind_generate_event_invoice_number(eventID, memberUUID);
                    if(generateEventInvoice.message == "Successful !"){
                        
                        return res.send("Invoice Number Generated! Check Your Mailbox.");
                    }else{
                        return res.send("Failed Generating Invoice Number. Contact the admin.");
                    }
                } catch (error) {
                    console.log(error)
                    return res.send(`Error Message, APIs Service Down: ${error.message}`);
                }
        }

    },
    // seperate each function by ","



    render_pending_payment: async function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            const { lookupMember : { member : {  memberUUID, personalEmail } } } = memberCompleteDetails;
            const { lookupMemberInvoices } = await Reuseables.pending_payment(memberUUID);
            return res.render('fmda_ind/payment/pending_payment', { memberCompleteDetails, lookupMemberInvoices });
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","



    ind_member_search: async function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            return res.render('fmda_ind/ind_member_search', { memberCompleteDetails });
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","



    ind_get_member_search_result: async function(req, res) {
        var search_by = req.body.search_by;
        // console.log("search_by: ", search_by);

        try {
            const { memberCompleteDetails } = req.session;
            const { searchMembers } = await Reuseables.get_member_search_result(search_by);
            return res.send(searchMembers);
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","
    ind_member_directories: async function (req, res) {
        try {
            const { memberCompleteDetails } = req.session;
      
            return res.render ('fmda_ind/resources/searchDirectory', {  memberCompleteDetails })
          } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
          }
    },

    handle_ind_member_directories: async function (req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            var memberUUID = req.body.id;
            req.session.memberUUID = memberUUID


            return res.redirect('/ind_member_getDirectories')
          } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
          }
    },

    ind_member_getDirectories: async function (req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            var memberuuid = req.session.memberCompleteDetails.lookupMember.member.memberUUID;

      
            var resources = await Reuseables.getResources(memberuuid);
            return res.render ('fmda_ind/resources/directoryList', { data: resources.lookupMemberDirectories, memberCompleteDetails })
            // if (resources.message == "Successful!") {
            //     return res.render ('fmda_ind/resources/directoryList', { data: resources.lookupMemberDirectories, memberCompleteDetails })
            // } else{
            //     return res.send(`<script> alert('Failed looking up member ID.');window.location.href='/ind_member_directories';</script>`);
            // }
          } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
          }
    },
 
    ind_member_resource: async function (req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            var id = req.query.id;
            req.session.resource_id = id
            var memberuuid = req.session.memberCompleteDetails.lookupMember.member.memberUUID;
      
            var [resources, resource_details] = await Promise.all([Reuseables.getResources(memberuuid), Reuseables.searchResourceDetails(memberuuid, id)])  
            
            var resource =  resources.lookupMemberDirectories.filter(function(resource) {
              return resource.id == req.query.id;
              
            });
      
            
            resource = resource[0]
      
            return res.render ('fmda_ind/resources/resourceList', { data: resource, list: resource_details.lookupMemberDirectoryResources, memberCompleteDetails })
          } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
          }
    },




    ind_concludeRegistrationFromBulkUpload: async function (req, res) {

        var email = req.query.email;

        // call fmda_ind_reuseables.get_security_questions()
        var result = fmda_ind_reuseables.get_security_questions();
        var treasuryCertificateType = await fmda_ind_reuseables.getTreasureCertificationType();

        // console.log(treasuryCertificateType);
        
        result.then(
            (result) => {
                var securityQuestionsGotten = result.securityQuestions;
                res.render('fmda_ind/ind_concludeRegistrationFromBulkUpload', { "securityQuestionsGotten": securityQuestionsGotten, "treasuryCertificateType":treasuryCertificateType, "email":email });
                return;
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },


    // handle_ind_concludeRegistrationFromBulkUpload
    handle_ind_concludeRegistrationFromBulkUpload: async function (req, res) {

        // console.log(req.body);
        // console.log(req.files);
        // console.log(req.files[0]);


        var OtherProfessionalQualifications = [];


        var theRequest = req.body;

        // req.body.certificationType ---> must be an array 
        if(typeof(req.body.certificationType) == "string"){
            theRequest[certificationType] = [req.body.certificationType];
        }
        var certTypeLength = req.body.certificationType.length;

        req.files.forEach( (element,index) => {
                if(index == 0){
                    theRequest["profilePhoto"] = "ind_uploads/"+element.filename;
                }else if(index == 1){
                    theRequest["comprehensiveCv"] = "ind_uploads/"+element.filename;
                };
        });


        // req.files.forEach( (element,index) => {
        //         // loop for Certification Type
        //         for (let i = 0; i < certTypeLength; i++) {
        //             // const element = array[index];
                    
        //             if(index == 2){
        //                 theRequest["credential1"] = "ind_uploads/"+element.filename;
        //             }else if(index == 3){
        //                 theRequest["credential2"] = "ind_uploads/"+element.filename;
        //             }else if(index == 4){
        //                 theRequest["credential3"] = "ind_uploads/"+element.filename || ""; //if 3rd not passed, send empty 
        //             }
        //         }
        // });


        if(certTypeLength == 1){
            console.log("certTypeLength is 1 here");

            theRequest["credential1"] = "ind_uploads/"+req.files[2].filename;
            theRequest["credential2"] = "";
            theRequest["credential3"] = "";
        }
        else if(certTypeLength == 2){
            theRequest["credential1"] = "ind_uploads/"+req.files[2].filename;
            theRequest["credential2"] = "ind_uploads/"+req.files[3].filename;
            theRequest["credential3"] = "";
        }else if(certTypeLength == 3){
            theRequest["credential1"] = "ind_uploads/"+req.files[2].filename;
            theRequest["credential2"] = "ind_uploads/"+req.files[3].filename;
            theRequest["credential3"] = "ind_uploads/"+req.files[4].filename;
        }


        // req.files.forEach( (element,index) => {
        //             if(index == 5){
        //                 var otherQualifications = {
        //                                                 "institutionName": req.body.institutionName[0],
        //                                                 "Qualification": req.body.qualificationType[0],
        //                                                 "YearAttained": req.body.yearAttained[0],
        //                                                 "CertificateURL": "other_professional_certificate_upload/"+element.filename
        //                                             };

        //                 OtherProfessionalQualifications.push(otherQualifications);
        //             }else if(index == 6){
        //                 var otherQualifications = {
        //                                                 "institutionName": req.body.institutionName[1],
        //                                                 "Qualification": req.body.qualificationType[1],
        //                                                 "YearAttained": req.body.yearAttained[1],
        //                                                 "CertificateURL": "other_professional_certificate_upload/"+element.filename
        //                                             };

        //                 OtherProfessionalQualifications.push(otherQualifications);
        //             }
        // });


        if(req.body.institutionName[0] != ""){

            if(certTypeLength == 2){
                var CertificateURL = "other_professional_certificate_upload/"+req.files[4].filename;
            }else if(certTypeLength == 3){
                var CertificateURL = "other_professional_certificate_upload/"+req.files[5].filename;
            }

            var otherQualifications = {
                                            "institutionName": req.body.institutionName[0],
                                            "Qualification": req.body.qualificationType[0],
                                            "YearAttained": req.body.yearAttained[0],
                                            "CertificateURL": CertificateURL
                                        };

            OtherProfessionalQualifications.push(otherQualifications);
        }


        if(req.body.institutionName[1] != ""){

            if(certTypeLength == 2){
                var CertificateURL = "other_professional_certificate_upload/"+req.files[5].filename;
            }else if(certTypeLength == 3){
                var CertificateURL = "other_professional_certificate_upload/"+req.files[6].filename;
            }

            var otherQualifications = {
                                            "institutionName": req.body.institutionName[1],
                                            "Qualification": req.body.qualificationType[1],
                                            "YearAttained": req.body.yearAttained[1],
                                            "CertificateURL": CertificateURL
                                        };

            OtherProfessionalQualifications.push(otherQualifications);
        }



        theRequest["OtherProfessionalQualifications"] = OtherProfessionalQualifications;


        console.log(theRequest);

        try {
            var { finalSignUp } = await fmda_ind_reuseables.handle_ind_concludeRegistrationFromBulkUpload(theRequest);
            console.log(finalSignUp);
            if(finalSignUp.statusCode == 200){
                return res.send(`<script> alert('${finalSignUp.message}');window.location.href='/';</script>`);
            }else{
                return res.send(`<script> alert('${finalSignUp.message}');window.location.href='/';</script>`);
            }
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }



    },






}
module.exports = fmda_ind_controller;