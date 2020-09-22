// require request
var request = require("request");

// require baseUrl
var baseUrl = require("../baseUrl");

// bluebird promises
var Promise = require("bluebird");


// require consumeAPIs
var consumeAPIs = require("./consumeAPIs");



// objects of Reuseables
var Reuseables = { 

        // list of financial institutes
        list_of_banks : () => {

            var query = JSON.stringify({"query": "{ financialInstitutions {id name type country countryCode } }"});
            return consumeAPIs.api_call(query);
        },  
        // seperate each function by ","


        // list of fmda banks accounts
        list_of_fmda_bank_accounts : () => {
            var query = JSON.stringify({"query": "{ lookupBankAccounts {id bank accounts{accountNumber accountName type} } }"});
            return consumeAPIs.api_call(query);
        }, 



        // list of organizations
        list_of_organizations : () => {
            var query = JSON.stringify({"query": "{ organisations {id organisationName membershipId} }"});
            return consumeAPIs.api_call(query);
        }, 


        // List of payment purposes
        List_of_payment_purposes : () => {

            var query = JSON.stringify({"query": "{ paymentPurposes {id description amount } }"});
            return consumeAPIs.api_call(query);
        },  
        // seperate each function by ","
        

        get_payment_amount : (paymentPurposeId, treasuryExperience) => {
            var data = {
                "query": "{ paymentAmount }",
                "variables": {
                    "paymentPurposeId": paymentPurposeId,
                    "treasuryExperience": treasuryExperience,
                }
            };
            var query = JSON.stringify(data);
            return consumeAPIs.api_call(query);
        },




        // member lookup
        member_look_up : (theUserID, theMemberType) => {
            var member_lookup = { query: '{ lookupMember (userID: '+theUserID +' userType: ' + theMemberType + ' ) { statusCode member{id memberUUID firstName lastName gender address memberType yearsOfPostNyscExperience yearsOfTreasuryExperience officeNumber mobileNumber officialEmail designation emailVerified personalEmail memberType profilePhoto privilegeId role membershipCategory securityAnswer dateOfBirth certificationType treasuryCertification industryCategory memberType industryType membershipRequestDate attestationComplete securityQuestionId securityAnswer securityQuestionSet state hasBeenVerified verifierId verifierComment dateVerified hasBeenApproved approverMemberId approverComment approvalDate refereeMemberId annualDuePaid registrationFeePaid isEnabled isActive  currentOrganisation currentOrganisationId proposedOrganisationName lastLoginDate qualifications {institutionName degreeOptained from to certificateURL} employmentHistory {organisationName positionHeld startDate endDate responsibilities } otherProfessionalQualifications{institutionName qualification yearAttained certificateURL} certificateNumber } message } }' };

            var query = JSON.stringify(member_lookup);
            return consumeAPIs.api_call(query);
        },
        // seperate each function by ","

        cp_member_look_up : (userID) => {
            var member_lookup = { query: `{ lookupMember (userID: "${userID}" userType: "Corporate" ) { statusCode corporate{id status organisationName organisationType treasuryOfficeAddress managingDirectorOrCEO treasurerEmail treasuryUnitPhoneNumber hasBeenVerified bankers hasBeenApproved approvalComment dateApproved isEnabled isActive registrationFeePaid contactPersonName contactOfficialEmail contactPersonAddress contactPersonMobileNumber organisationLetterOfRequest membershipRequestDate lastLoginDate securityQuestionSet memberUUID hasBeenApproved hasBeenVerified registrationFeePaid } } }` };

            var query = JSON.stringify(member_lookup);
            // console.log(member_lookup);
            return consumeAPIs.api_call(query);
        },

        // login
        login : (userID, password) => {
            
            var login = {
                "operationName":"signInMutation",
                "query":"mutation signInMutation { signIn{statusCode, userType, message} }",
                "variables":{
                                "userID": userID,
                                "password": password
                            }
            };

            var query = JSON.stringify(login);
            return consumeAPIs.api_call(query);
        },
        // seperate each function by ","




        // passwordReset
        passwordReset : (userID) => {
            
            var passwordReset = {
                "query":"{ fetchUserQuestion(userId:" + '"' + userID + '"' + ") {id question} }"
              };

            var query = JSON.stringify(passwordReset);
            return consumeAPIs.api_call(query);
        },
        // seperate each function by ","



        // validateSecurityAnswer
        validateSecurityAnswer : (userID, answer) => {
            
            var validateSecurityAnswer = {
                 "operationName":"confirmSecurityAnswerMutation",
                 "query":"mutation confirmSecurityAnswerMutation { confirmSecurityAnswer{statusCode message} }",
                 "variables":{"userID": userID, "answer": answer }
             };

            var query = JSON.stringify(validateSecurityAnswer);
            return consumeAPIs.api_call(query);
        },
        // seperate each function by ","



        // newPasswordReset
        newPasswordReset : (userID, password) => {
            
            var newPasswordReset = {
                "operationName":"updatePasswordMutation",
                "query":"mutation updatePasswordMutation { updatePassword{statusCode message} }",
                "variables":{"userID": userID, "newPassword": password}
              };

            var query = JSON.stringify(newPasswordReset);
            return consumeAPIs.api_call(query);
        },
        // seperate each function by ","




        // industriesTypesList
        industriesTypesList : () => {
            
            var industriesTypesList = {
                "query":"{ industries {industryName types}  }" 
            };

            var query = JSON.stringify(industriesTypesList);
            return consumeAPIs.api_call(query);

        },


         // newPasswordReset
         memberPaymentHistory : (email, memberUUid, status) => {
            
            var newPasswordReset = {
                "query": `{ memberPaymentHistory(email: "${email}", memberUUid: "${memberUUid}", status: ${status}) {id userId depositorName paymentReferenceNo amount paymentDate transactionDate eventId eventName bank accountName accountNumber status purpose } }`,
            };

            var query = JSON.stringify(newPasswordReset);
            return consumeAPIs.api_call(query);
        },
        // seperate each function by ","



        // corp_member_objection_post
        general_objection_post : (member_id, objection_writeUp, objection_token) => {

            console.log("inside reuseables for objection", member_id, objection_writeUp, objection_token);

            console.log(typeof(member_id));
            console.log(typeof(objection_writeUp));
            console.log(typeof(objection_token));

            var query = JSON.stringify({
                "operationName": "postObjectionMutation",
                "query": "mutation postObjectionMutation { postObjection{statusCode message} }",
                "variables":{
                                "memberId": member_id,
                                "reason":  objection_writeUp,
                                "token":  objection_token 
                            }
                });

            console.log(query);

            return consumeAPIs.api_call(query);
        },  
        // seperate each function by ","


        // handle_review_objection
        handle_review_objection : (member_id, objection_writeUp, objection_token, rejector) => {

            var query = JSON.stringify({
                "operationName": "postReviewMutation",
                "query": "mutation postReviewMutation { postReview{statusCode message} }",
                "variables": {
                    "token": objection_token,
                    "userId": member_id,
                    "memberId": rejector,
                    "reason": objection_writeUp
                }
            });

            console.log(query);

            return consumeAPIs.api_call(query);
        },






        // memberUpcomingEvents
        memberUpcomingEvents : (memberUUid) => {
            
            var upcomingEvents = {
                "query": `{ upcomingEvents(userId: "${memberUUid}") {id title images startDate endDate eventTime venue type description participantCategory obtainablePoints{pointName pointValue} discounts{discountName percentage} datePosted eventUploaderId flatFee feeType customFee{name amount} isFree hasDiscount hasPoints maxNumberOfPaticipants requiresAttendeeConfirmation status} }`,
            };

            var query = JSON.stringify(upcomingEvents);
            return consumeAPIs.api_call(query);
        },


        // eventDetails
        eventDetails : (eventId) => {
            
            var upcomingEvents = {
                "query": `{ lookupEvent(eventId: "${eventId}") {id title images startDate endDate eventTime type description participantCategory obtainablePoints{pointName pointValue} discounts{discountName percentage} datePosted eventUploaderId flatFee feeType customFee{name amount} isFree hasDiscount hasPoints maxNumberOfPaticipants requiresAttendeeConfirmation status} }`,
            };

            var query = JSON.stringify(upcomingEvents);
            return consumeAPIs.api_call(query);
        },

        // eventDetails
        eventAttendees : (eventId) => {
            
            var lookupAttendees = {
                "query": `{ lookupAttendees (eventId: "${eventId}") {firstName lastName gender memberUUID mobileNumber memberType membershipCategory currentOrganisation profilePhoto certificationType industryCategory industryType accruedPoints }}`,
            };

            var query = JSON.stringify(lookupAttendees);
            return consumeAPIs.api_call(query);
        },

        // eventDetails
        checkEventRegistration : (eventId, memberUUID) => {
            
            var checkEventRegistration = {
                "query": `{ checkEventRegistration (eventId: "${eventId}", memberUUID: "${memberUUID}") {statusCode message } }`,
            };

            var query = JSON.stringify(checkEventRegistration);
            return consumeAPIs.api_call(query);
        },

        // eventDetails
        checkEventAmount : (eventId, memberUUID) => {
            
            var lookupEventAmount = {
                "query": `{ lookupEventAmount (eventId: "${eventId}", memberUUId: "${memberUUID}") }`,
            };

            var query = JSON.stringify(lookupEventAmount);
            return consumeAPIs.api_call(query);
        },


        // event payment Details
        checkEventPaymentStatus : (eventId, memberUUID) => {
            var lookupEventPaymentStatus = {
                "query": `{ lookupEventPaymentStatus (eventId: "${eventId}", memberUUID: "${memberUUID}") {id status  } }`,
            };
            var query = JSON.stringify(lookupEventPaymentStatus);
            return consumeAPIs.api_call(query);
        },      
        
        
        // registerMemberFreeEvent
        registerMemberFreeEvent : (eventId, type, memberUUID) => {
            
            var memberFreeEventRegistrationMutation = {
                "operationName": "memberFreeEventRegistrationMutation",
                "query": "mutation memberFreeEventRegistrationMutation{ memberFreeEventRegistration {statusCode message} }",
                "variables": {
                                "memberUUId": memberUUID,
                                "eventId": eventId,
                                "type": type
                            }
            }
            var query = JSON.stringify(memberFreeEventRegistrationMutation);
            return consumeAPIs.api_call(query);
        }, 




        // registerMemberPaidEvent
        registerMemberPaidEvent : (paidEventParams) => {
            
            var memberPaidEventRegistrationMutation = {
                "operationName": "memberPaidEventRegistrationMutation",
                "query": `mutation memberPaidEventRegistrationMutation { memberPaidEventRegistration(eventId: \"${paidEventParams.eventId}\"){statusCode message} }`,
                "variables": {
                    "userId": paidEventParams.userId,
                    "depositorName": paidEventParams.depositorName,
                    "paymentReferenceNo" : paidEventParams.paymentReferenceNo,
                    "amount": paidEventParams.amount,
                    "paymentDate": paidEventParams.paymentDate,
                    "bank": paidEventParams.bank,
                    "accountNumber": paidEventParams.accountNumber,
                    "accountName": paidEventParams.accountName,
                    "eventId": paidEventParams.eventId,
                    "eventName": paidEventParams.eventName,
                    "purpose": paidEventParams.purpose,
                    "invoiceNumber": paidEventParams.invoiceNumber
                }
            };
            // console.log(memberPaidEventRegistrationMutation);
            var query = JSON.stringify(memberPaidEventRegistrationMutation);
            return consumeAPIs.api_call(query);
        }, 



        // Get corporate member's members
        get_corporate_member_members : (theUserID) => {
            
            var organisationMembersLookup = {
                "query": `{ organisationMembersLookup(corporateMemberId: \"${theUserID}\"){id memberUUID firstName lastName gender address memberType yearsOfPostNyscExperience yearsOfTreasuryExperience officeNumber mobileNumber officialEmail emailVerified memberType profilePhoto privilegeId role membershipCategory securityAnswer certificationType treasuryCertification industryCategory memberType industryType membershipRequestDate attestationComplete securityQuestionId securityAnswer securityQuestionSet hasBeenVerified verifierId verifierComment dateVerified hasBeenApproved approverMemberId approverComment approvalDate refereeMemberId annualDuePaid registrationFeePaid isEnabled isActive  currentOrganisation currentOrganisationId proposedOrganisationName lastLoginDate qualifications {institutionName degreeOptained from to} employmentHistory {organisationName positionHeld startDate endDate responsibilities} } }`
            };

            var query = JSON.stringify(organisationMembersLookup);
            return consumeAPIs.api_call(query);
        },




        // registerCorporateMembersForFreeEvent
        registerCorporateMembersForFreeEvent : (eventId, delegates, memberUUID) => {
            
            var corpFreeEventRegistrationMutation = {
                "operationName": "corporateMemberEventRegistrationMutation",
                "query": "mutation corporateMemberEventRegistrationMutation { corporateMemberEventRegistration {statusCode message } }",
                "variables": {
                    "memberUUId": memberUUID,
                    "eventId": eventId,
                    "delegates": JSON.parse(delegates)
                }
            };
            var query = JSON.stringify(corpFreeEventRegistrationMutation);
            return consumeAPIs.api_call(query);
        }, 



        // registerCorporateMembersForPaidEvent
        registerCorporateMembersForPaidEvent : (paidEventParams) => {
            
            var memberPaidEventRegistrationMutation = {
                "operationName": "corporateMemberPaidEventRegistrationMutation",
                "query": "mutation corporateMemberPaidEventRegistrationMutation { corporateMemberPaidEventRegistration{statusCode message} }",
                "variables": {
                    "userId": paidEventParams.userId,
                    "depositorName": paidEventParams.depositorName,
                    "paymentReferenceNo" : paidEventParams.paymentReferenceNo,
                    "amount": paidEventParams.amount,
                    "paymentDate": paidEventParams.paymentDate,
                    "bank": paidEventParams.bank,
                    "accountNumber": paidEventParams.accountNumber,
                    "accountName": paidEventParams.accountName,
                    "eventId": paidEventParams.eventId,
                    "eventName": paidEventParams.eventName,
                    "purpose": paidEventParams.purpose,
                    "delegates": JSON.parse(paidEventParams.delegates),
                    "invoiceNumber": paidEventParams.invoiceNumber
                }
            };
            var query = JSON.stringify(memberPaidEventRegistrationMutation);
            // console.log(query);
            return consumeAPIs.api_call(query);
        }, 





        // delete_emp_history
        delete_emp_history : (theUserID, startDate, endDate) => {
            
            var removeSingleEmploymentHistory = {
                "operationName": "removeSingleEmploymentHistoryMutation",
                "query": `mutation removeSingleEmploymentHistoryMutation { removeSingleEmploymentHistory(userId: \"${theUserID}\", startDate: \"${startDate}\", endDate: \"${endDate}\") {statusCode message } }`
            };

            var query = JSON.stringify(removeSingleEmploymentHistory);
            return consumeAPIs.api_call(query);
        }, 




        // delete_ind_qualifications
        delete_ind_qualifications : (theUserID, certUrl) => {
            
            var removeSingleQualification = {
                "operationName": "removeSingleQualificationMutation",
                "query": `mutation removeSingleQualificationMutation { removeSingleQualification(userId: \"${theUserID}\", certUrl: \"${certUrl}\") {statusCode message } }`
            };

            var query = JSON.stringify(removeSingleQualification);
            return consumeAPIs.api_call(query);
        }, 




        // delete_other_professional_qualifications
        delete_other_professional_qualifications : (theUserID, certUrl) => {
            
            var removeSingleOtherQualification = {
                "operationName": "removeSingleOtherQualificationMutation",
                "query": `mutation removeSingleOtherQualificationMutation { removeSingleOtherQualification(userId: \"${theUserID}\", certUrl: \"${certUrl}\") {statusCode message } }`
            };

            var query = JSON.stringify(removeSingleOtherQualification);
            return consumeAPIs.api_call(query);
        }, 




        // pending_payment
        pending_payment : (memberUUid) => {
            
            var pendingPayment = {
                "query": `{ lookupMemberInvoices(memberUUID: \"${memberUUid}\") {id eventId eventTitle invoiceNumber date membershipCategory memberId description fullname amount status invoiceItems{staffName category membershipId amount } paymentPurpose } }`
            };

            var query = JSON.stringify(pendingPayment);
            return consumeAPIs.api_call(query);
        },
        // seperate each function by ","


        

        // corp_pending_payment
        corp_pending_payment : (memberUUid) => {
            
            var corp_pending_payment = {
                "query": `{ lookupMemberInvoices(memberUUID: \"${memberUUid}\") {id eventId eventTitle invoiceNumber date membershipCategory memberId description fullname amount status invoiceItems{staffName category membershipId amount } paymentPurpose } }`
            };

            var query = JSON.stringify(corp_pending_payment);
            return consumeAPIs.api_call(query);
        },
        // seperate each function by ","



        // get_member_search_result
        get_member_search_result : (search_by) => {
            
            var searchMembers = {
                "query": `{ searchMembers(text: \"${search_by}\") {id firstName lastName memberUUID personalEmail} }`
            };

            var query = JSON.stringify(searchMembers);
            return consumeAPIs.api_call(query);
        },
        // seperate each function by ","

        getResources: (memberuuid) => {
            const resourceList  = {
                "query":`{ lookupMemberDirectories(memberUUID: \"${memberuuid}\") {id directoryName accessors description dateCreated createdBy}  }` 
              };

              var query = JSON.stringify(resourceList);
              return consumeAPIs.api_call(query);
              
        },

        searchResourceDetails: (memberuuid, id) => {
            const directoryResourceList  = {
                "query": `{ lookupMemberDirectoryResources(memberUUID: \"${memberuuid}\" directoryId: \"${id}\") {id name url format directoryId accessors createdBy dateCreated}  }`
            };

              var query = JSON.stringify(directoryResourceList);
              return consumeAPIs.api_call(query);
              
        },




}




module.exports = Reuseables;
