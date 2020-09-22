
// require consumeAPIs
var consumeAPIs = require("./consumeAPIs");





var fmda_ind_reuseables = {

    // list of banks
    register_individual : (firstName, lastName, personalEmail, mobileNumber, password) => {

        var query = JSON.stringify({
                                    "operationName":"signUpMutation",
                                    "query":"mutation signUpMutation { signUp{statusCode message} }",
                                    "variables":{
                                                    "firstName":firstName, 
                                                    "lastName":lastName, 
                                                    "personalEmail":personalEmail, 
                                                    "mobileNumber":mobileNumber, 
                                                    "password":password
                                                }
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



    // getMemberTypes
    getMemberTypes : () => {

        var query = JSON.stringify( {"query":"{ memberTypes {id type}  }" } );

        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","



    // getTreasureCertificationType
    getTreasureCertificationType : () => {

        var query = JSON.stringify({"query":"{ treasuryCertificationTypes{id name} }" });

        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","



    // confirmatory_update_details
    confirmatory_update_details : (theUserID, memberType, certificationType, credential1, credential2, credential3, credential4, comprehensiveCv, industryCategory, industryType) => {

        var query = JSON.stringify({"operationName":"memberTypeDetailsMutation",
                                    "query":"mutation memberTypeDetailsMutation { memberTypeDetails(userID: " + theUserID + "){statusCode message} }",
                                    "variables":{
                                                    "memberType":memberType, 
                                                    "certificationType":certificationType, 
                                                    // "treasuryCertification":treasuryCertification, 
                                                    "credential1": credential1,
                                                    "credential2": credential2,
                                                    "credential3": credential3,
                                                    "credential4": credential4,
                                                    "comprehensiveCv": comprehensiveCv,
                                                    "industryCategory":industryCategory, 
                                                    "industryType":industryType
                                                }});

        console.log(query);
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","



    // list of organisation
    list_of_organisation : () => {

        var query = JSON.stringify({"query":"{ industries {industryName types} organisations {id organisationName membershipId category}  }"});

        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","



    // ind_personalInformation_upload
    ind_personalInformation_upload : (objectParam) => {

        console.log(objectParam);

        var query = JSON.stringify(objectParam); 

        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","




    // ind_get_organization_ID_by_my_selection
    ind_get_organization_ID_by_my_selection : () => {

        var query = JSON.stringify({
            "query":"{ industries {industryName types} organisations {id organisationName membershipId category}  }"
        });
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","




    // ind_professionalInformation_done 
    ind_professionalInformation : (theUserID, employmentHistoryList) => {

        var query = JSON.stringify({
            "operationName":"addProfessionalInfoMutation",
            "query":"mutation addProfessionalInfoMutation { addProfessionalInfo(userId: " + theUserID + "){statusCode message} }",
            "variables":{
                            // "employmentHistory": [
                            //                         {
                            //                             "organisationName": "Telnet1 Nig Ltd", 
                            //                             "positionHeld":"Software Engineer2", 
                            //                             "startDate": "1st Jul 2016", 
                            //                             "endDate": "1st Sept 2019", 
                            //                             "commaResponsibilities": "Bond", "Treasury"
                            //                         }
                            //                     ]

                            "employmentHistory": employmentHistoryList
                        }
          });
        // console.log(query);
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","




    // ind_qualifications_upload
    ind_qualifications_upload : (theUserID, qualificationsList) => {

        var query = JSON.stringify({
                                        "operationName":"addQualificationsMutation",
                                        "query":"mutation addQualificationsMutation { addQualifications(userId: " + theUserID + ") {statusCode message} }",
                                        "variables":{"qualifications": qualificationsList}
                                    });
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","




     // ind_other_proffessional_qualifications_upload
     ind_other_proffessional_qualifications_upload : (theUserID, other_proessional_qualificationsList) => {

        var query = JSON.stringify({
                                        "operationName": "addOtherProfessionalInfoMutation",
                                        "query": "mutation addOtherProfessionalInfoMutation { addOtherProfessionalInfo(userId: " + theUserID + ") {statusCode message} }",
                                        "variables":{"otherQualifications": other_proessional_qualificationsList}
                                    });
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","



    // ind_attestations_upload
    ind_attestations_upload : (theUserID, referenceMemberId) => {

        var query = JSON.stringify({
            "operationName":"submitAttestationMutation",
            "query":"mutation submitAttestationMutation { submitAttestation {statusCode message} }",
            "variables": {"userId": theUserID, "setAttestation": true, "referenceMemberId": referenceMemberId}
          });
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","




    // ind_payment_for_member
    ind_payment_for_member : (theUserID, depositorName, paymentReferenceNo, invoiceNumber, amount, paymentDate, bank, purpose, accountName, accountNumber) => {

        var query = JSON.stringify({
            "operationName": "submitPaymentMutation",
            "query": "mutation submitPaymentMutation { submitPayment{statusCode message} }",
            "variables": {
                "userId": theUserID,
                "depositorName": depositorName,
                "paymentReferenceNo": paymentReferenceNo,
                "invoiceNumber": invoiceNumber,
                "amount": parseInt(amount),
                "paymentDate": paymentDate,
                "bank": bank,
                "purpose": purpose,
                "accountName": accountName,
                "accountNumber": accountNumber,
                }
            });

            // console.log(query);

        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","

    // change password for individual
    change_password : (userID, newPassword) => {

        var query = JSON.stringify({
          "operationName":"updatePasswordMutation",
          "query":"mutation updatePasswordMutation { updatePassword {statusCode message} }",
          "variables": { userID, newPassword }
        });
        return consumeAPIs.api_call(query);
    },  

    // get list of membershipt categories for members
    membership_category : () => {

        var query = JSON.stringify({
            "query": "{ membershipCategories {id category yearsOfTreasuryExperience registrationFee annualDue } }"
        });
        return consumeAPIs.api_call(query);
    },  

    // confirm member attestation
    confirm_attestation : (id, status) => {
        var query = JSON.stringify({
          "operationName": "confirmAttestationMutation",
          "query": "mutation confirmAttestationMutation { confirmAttestation {statusCode message} }",
          "variables": { id, status }
        });
        console.log(query);
        return consumeAPIs.api_call(query);
    },  


    // ind_generate_invoice_number
    ind_generate_invoice_number : (memberUUID) => {
            
        var ind_generate_invoice_number = {
            "operationName": "generateMemberAnnualFeeInvoiceMutation",
            "query": `mutation generateMemberAnnualFeeInvoiceMutation { generateMemberAnnualFeeInvoice(memberUUID:\"${memberUUID}\"){statusCode message} }`
        };

        var query = JSON.stringify(ind_generate_invoice_number);
        return consumeAPIs.api_call(query);
    }, 



    // ind_generate_event_invoice_number
    ind_generate_event_invoice_number : (eventId, memberUUID) => {
            
        var ind_generate_event_invoice_number = {
            "operationName": "generateEventInvoiceMutation",
            "query": `mutation generateEventInvoiceMutation { generateEventInvoice(eventId: \"${eventId}\", memberUUID:\"${memberUUID}\"){statusCode message} }`
        };

        var query = JSON.stringify(ind_generate_event_invoice_number);
        return consumeAPIs.api_call(query);
    },





    // handle_ind_concludeRegistrationFromBulkUpload
    handle_ind_concludeRegistrationFromBulkUpload : (theRequest) => {

        var handle_ind_concludeRegistrationFromBulkUpload = {
                        "operationName": "finalSignUpMutation",
                        "query": "mutation finalSignUpMutation { finalSignUp{statusCode message } }",
                        "variables": {
                            "personalEmail": theRequest.email,
                            "securityAnswer": theRequest.answer,
                            "profilePhoto": theRequest.profilePhoto,
                            "password": theRequest.newPassword,
                            "SecurityQuestionID": theRequest.questionID,
                            "Credential2": theRequest.credential2,
                            "Credential1": theRequest.credential1,
                            "Credential3": theRequest.credential3,
                            "comprehensiveCv": theRequest.comprehensiveCv,
                            "OtherProfessionalQualifications": theRequest.OtherProfessionalQualifications,
                            "CertificationType": theRequest.certificationType
                        }
                    
        };

        

        var query = JSON.stringify(handle_ind_concludeRegistrationFromBulkUpload);
        console.log(query);
        return consumeAPIs.api_call(query);
    },  
    // seperate each function by ","




}



module.exports = fmda_ind_reuseables;


