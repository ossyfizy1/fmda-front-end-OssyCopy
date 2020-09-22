
// require consumeAPIs
var consumeAPIs = require("./consumeAPIs");





var fmda_corp_reuseables = {

    // getMemberTypes
    getMemberTypes : () => {

        var query = JSON.stringify( {"query":"{ memberTypes {id type}  }" } );

        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","

     // corporate member lookup
     corp_member_look_up : (theUserID, theMemberType) => {
        var member_lookup = { query: '{ lookupMember (userID: '+theUserID +' userType: ' + theMemberType + ' ) { statusCode corporate{id memberUUID status organisationName treasuryOfficeAddress managingDirectorOrCEO treasurerEmail treasuryUnitPhoneNumber bankers hasBeenVerified hasBeenApproved hasBeenCreated approvalComment organisationId dateApproved isEnabled isActive registrationFeePaid contactPersonName contactOfficialEmail organisationType contactPersonAddress  organisationAddress headOfficeAddress contactPersonMobileNumber organisationLetterOfRequest organisationId membershipRequestDate lastLoginDate } } }' };

        var query = JSON.stringify(member_lookup);
        return consumeAPIs.api_call(query);
    },
    // seperate each function by ","


    // register_corperate
    register_corperate : (theRequest) => {


        if (theRequest.proposedOrganisationName == "")
        {
               var variables =     {
                                        organisationName: theRequest.organisationName,
                                        // proposedOrganisationName: '',
                                        organisationId: theRequest.organisationId,
                                        organisationAddress: theRequest.organisationAddress,
                                        contactPersonMobileNumber: theRequest.contactPersonMobileNumber,
                                        organisationType: theRequest.organisationType,
                                        headOfficeAddress: theRequest.headOfficeAddress,
                                        managingDirectorOrCEO: theRequest.managingDirectorOrCEO,
                                        contactPersonName: theRequest.contactPersonName,
                                        contactOfficialEmail: theRequest.contactOfficialEmail,
                                        contactPersonAddress: theRequest.contactPersonAddress,
                                        bankers: typeof theRequest.bankers === 'string' ? [theRequest.bankers,] : [...theRequest.bankers,], // convert the list of bankers to an array
                                        treasurerName: theRequest.treasurerName,
                                        treasurerEmail: theRequest.treasurerEmail,
                                        treasuryOfficeAddress: theRequest.treasuryOfficeAddress,
                                        treasuryUnitPhoneNumber: theRequest.treasuryUnitPhoneNumber,
                                        treasuryGroupEmail: theRequest.treasuryGroupEmail,
                                        chiefDealerEmail: theRequest.chiefDealerEmail,
                                        organisationLetterOfRequest: theRequest.organisationLetterOfRequest
                                    }
        }
        else 
        {
            var variables =     {
                                    organisationName: theRequest.proposedOrganisationName,
                                    // proposedOrganisationName: '',
                                    organisationId: "",
                                    organisationAddress: theRequest.organisationAddress,
                                    contactPersonMobileNumber: theRequest.contactPersonMobileNumber,
                                    organisationType: theRequest.organisationType,
                                    headOfficeAddress: theRequest.headOfficeAddress,
                                    managingDirectorOrCEO: theRequest.managingDirectorOrCEO,
                                    contactPersonName: theRequest.contactPersonName,
                                    contactOfficialEmail: theRequest.contactOfficialEmail,
                                    contactPersonAddress: theRequest.contactPersonAddress,
                                    bankers: theRequest.bankers,
                                    // treasurerName: theRequest.treasurerName,
                                    // treasurerEmail: theRequest.treasurerEmail,
                                    // treasuryOfficeAddress: theRequest.treasuryOfficeAddress,
                                    // treasuryUnitPhoneNumber: theRequest.treasuryUnitPhoneNumber,
                                    // treasuryGroupEmail: theRequest.treasuryGroupEmail,
                                    // chiefDealerEmail: theRequest.chiefDealerEmail,
                                    organisationLetterOfRequest: theRequest.organisationLetterOfRequest,
                                    certificateOfIncorp: theRequest.certificateOfIncorp,
                                    memorandumAndArticleOfAssociation: theRequest.memorandumAndArticleOfAssociation,
                                    referenceLetterFromOneOfTheApplicantBankers: theRequest.referenceLetterFromOneOfTheApplicantBankers,        
                                    approvalFromTheRegulators: theRequest.approvalFromTheRegulators,
                                    corporateBrochure: theRequest.corporateBrochure
                                }
        }

        // console.log(variables);

        var query = JSON.stringify({
            "operationName": "newCorporateSignUpMutation",
            "query": "mutation newCorporateSignUpMutation { newCorporateSignUp {statusCode,message} }",
            "variables": variables
            });

        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","



    // get security questions
    get_security_questions : () => {

        var query = JSON.stringify({
                        "query":"{ securityQuestions {id question} }"
                    });

        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","




    // set_security_questions
    set_security_questions : (questionID, userID, answer) => {

        var query = JSON.stringify({
                                    "operationName":"setSecurityAnswerMutation",
                                    "query":"mutation setSecurityAnswerMutation { setSecurityAnswer{statusCode message} }",
                                    "variables":{"questionID": questionID, "userID": userID, "answer": answer}
                                });

        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","




    // corp_payment
    corp_payment : (details_to_pay) => {

        var query = JSON.stringify({
            "operationName": "submitPaymentMutation",
            "query": "mutation submitPaymentMutation { submitPayment{statusCode message} }",
            "variables": details_to_pay
            });
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","



     // corp_annual_renewal_payment
     corp_annual_renewal_payment : (details_to_pay) => {

        var query = JSON.stringify({
            "operationName": "submitPaymentMutation",
            "query": "mutation submitPaymentMutation { submitPayment{statusCode message} }",
            "variables": details_to_pay
            });
        // console.log(query);
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","



    // change password for a corporate member
    change_password : (userID, newPassword) => {
        var query = JSON.stringify({
          "operationName":"updatePasswordMutation",
          "query":"mutation updatePasswordMutation { updatePassword {statusCode message} }",
          "variables": { userID, newPassword }
        });
        return consumeAPIs.api_call(query);
    },  


    // add new fmda dealer
    new_fmda_dealer : (memberUUID, fmdaDealer) => {
        var query = JSON.stringify({
            "operationName": "submitNewDealerRequestMutation",
            "query": "mutation submitNewDealerRequestMutation { submitNewDealerRequest(memberId:"+memberUUID+") {statusCode message} }",
            "variables":{
                            "fullName" : fmdaDealer.fullName,
                            "email" : fmdaDealer.email,
                            "designation" : fmdaDealer.designation,
                            "desk" : fmdaDealer.desk,
                            "bank" : fmdaDealer.bank,
                        }
            });
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","




    // list of its members
    list_of_its_members : (userID_email) => {
        var query = JSON.stringify({
            "query": `{ organisationMembersLookup(corporateMemberId: \"${userID_email}\"){id memberUUID firstName lastName gender personalEmail address memberType yearsOfPostNyscExperience yearsOfTreasuryExperience officeNumber mobileNumber officialEmail emailVerified memberType profilePhoto privilegeId role membershipCategory securityAnswer certificationType state treasuryCertification industryCategory memberType industryType membershipRequestDate attestationComplete securityQuestionId securityAnswer securityQuestionSet hasBeenVerified verifierId verifierComment dateVerified hasBeenApproved approverMemberId approverComment approvalDate refereeMemberId annualDuePaid registrationFeePaid isEnabled isActive  currentOrganisation currentOrganisationId proposedOrganisationName lastLoginDate qualifications {institutionName degreeOptained from to} employmentHistory {organisationName positionHeld startDate endDate responsibilities} } }`
        });
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","



    // corp generate invoice number
    corp_generate_invoice_number : (userID_email) => {
        var query = JSON.stringify({
            "operationName": "generateCorporateMemberAnnualFeeInvoiceMutation",
            "query": `mutation generateCorporateMemberAnnualFeeInvoiceMutation { generateCorporateMemberAnnualFeeInvoice(userId:\"${userID_email}\"){statusCode message} }`
        });
        console.log(query);
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","




    // corp generate annual group member invoice number
    corp_generate_annual_group_member_invoice_number : (userID_email, memberUUIDs) => {
        var query = JSON.stringify({
            "operationName": "generateCorporateMemberMembersAnnualFeeInvoiceMutation",
            "query": "mutation generateCorporateMemberMembersAnnualFeeInvoiceMutation { generateCorporateMemberMembersAnnualFeeInvoice {statusCode message} }",
            "variables": {
                "userId": userID_email,
                "memberUUIDs": memberUUIDs
            }
        });
        // console.log(query);
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","



    // corp_generate_group_member_event_invoice_number
    corp_generate_group_member_event_invoice_number : (userId, eventId, memberUUIDs) => {
        var query = JSON.stringify({
            "operationName": "generateCorporateMemberEventInvoiceMutation",
            "query": "mutation generateCorporateMemberEventInvoiceMutation { generateCorporateMemberEventInvoice{statusCode message} }",
            "variables": {
                "userId": userId,
                "eventId": eventId,
                "memberUUIDs": JSON.parse(memberUUIDs)
            }
        });
        // console.log(query);
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","



    // corp_get_invoice_details 
    corp_get_invoice_details : (invoiceNumber) => {
        var query = JSON.stringify({
                "query": `{ lookupInvoice(invoiceNumber: \"${invoiceNumber}\") {id invoiceNumber date membershipCategory memberId description fullname amount status invoiceItems{staffName category membershipId amount} paymentPurpose } }`
            });
        // console.log(query);
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","



    // corp_list_of_all_fmda_individual_member
    corp_list_of_all_fmda_individual_member : () => {
        var query = JSON.stringify({
            "query": "{ members{id memberUUID firstName lastName gender address memberType yearsOfPostNyscExperience yearsOfTreasuryExperience officeNumber mobileNumber officialEmail emailVerified memberType profilePhoto privilegeId role membershipCategory securityAnswer certificationType treasuryCertification industryCategory memberType industryType membershipRequestDate attestationComplete securityQuestionId securityAnswer securityQuestionSet hasBeenVerified verifierId verifierComment dateVerified hasBeenApproved approverMemberId approverComment approvalDate refereeMemberId annualDuePaid registrationFeePaid isEnabled isActive  currentOrganisation currentOrganisationId proposedOrganisationName lastLoginDate qualifications {institutionName degreeOptained from to} employmentHistory {organisationName positionHeld startDate endDate responsibilities} } }"
        });
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","




}






module.exports = fmda_corp_reuseables;