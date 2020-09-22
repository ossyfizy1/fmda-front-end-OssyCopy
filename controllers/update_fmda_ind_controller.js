// require baseUrl
var baseUrl = require("../baseUrl");

// require request
var request = require("request");

// require the path module
var path = require("path");

// require Reuseables
var Reuseables = require("../reuseables/reuseables");
var fmda_ind_reuseables = require("../reuseables/fmda_ind_reuseables");

// employment history list 
var employmentHistoryList = [];

// qualification list
var qualificationsList = [];

// other professional list
var other_proessional_qualificationsList = [];




var update_fmda_ind_controller = {

    // method update_onboarding_ind
    update_onboarding_ind : function(req, res){
        // the userID (email)
        var userID_email = req.session.userDetails.userID;
        // gett member complete detail set in session upon login in index.js
        var memberCompleteDetails = req.session.memberCompleteDetails;

        // call fmda_ind_reuseables.list_of_organisation();
        var result = fmda_ind_reuseables.list_of_organisation();

        result.then(
            (result) => {
                var orgList_for_ind = result.organisations;
                res.render("fmda_ind/updateProfile/onboarding_ind", { userID_email : userID_email, memberCompleteDetails : memberCompleteDetails, orgList_for_ind : orgList_for_ind })
                return;  
            },
            (onrejected) => {
                console.log(onrejected);
                return;
            }
        );
    
        

    },
    // seperate each function by ","



    // method update_ind_personalInformation
    update_ind_personalInformation : function (req, res) {

        // console.log(req.file);
        // console.log(req.body);
    
        // get the picture extension
        var fileExt = path.extname( path.join(__dirname) + "/public/ind_passport/" + req.file.originalname );
        // console.log(fileExt);
    
        var imagePlusPath = "ind_passport/" + req.file.filename;
    
        // consume the webservice for personal Information
        if (fileExt === '.jpg' ||  fileExt === '.png' || fileExt === '.JPG' ||  fileExt === '.PNG' ||  fileExt === '.JPEG') {
           
                //   get userID from the session
                var theUserID = '"' + req.session.userDetails.userID + '"';
    
            
                // if member chose Others and provided their current organisation name
                // console.log("org name supplied: " + req.body.proposedOrganisationName);
    
                if (req.body.proposedOrganisationName != "") {
    
                    var orgNameOfMember = req.body.proposedOrganisationName
    
                    var ind_personalInformation_upload = {
                        "operationName":"addPersonalInfoMutation",
                        "query":"mutation addPersonalInfoMutation { addPersonalInfo(userId: " + theUserID + ") {statusCode message} }",
                        "variables":{
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
                        "operationName":"addPersonalInfoMutation",
                        "query":"mutation addPersonalInfoMutation { addPersonalInfo(userId: " + theUserID + ") {statusCode message} }",
                        "variables":{
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
    
    
                // call fmda_ind_reuseables.ind_personalInformation_upload();
                var result = fmda_ind_reuseables.ind_personalInformation_upload(ind_personalInformation_upload);
                
                result.then(
                    (result) => {
                        if ( result.addPersonalInfo.message == "Successful !") {
                            res.send(
                                " '<script> alert('changes saved successfully, will reflect on next login. '); </script>' "
                                + "<script> window.location.href='/ind_profile_page_for_member'; </script>"
                                );
            
                            return;
                        }else{
                            res.send(
                                " '<script> alert(' Unable to save your personal information, kindly contact the admin. Thank You. '); </script>' "
                                + "<script> window.location.href='/ind_profile_page_for_member'; </script>"
                                );
                    
                            return;
                        }
                    },
                    (onrejected) => {
                        console.log(onrejected);
                        return;
                    }
                );
    
        }
        else{
    
            res.send(
                " '<script> alert('invalid type, jpg or png required'); </script>' "
                + "<script> window.location.href='/ind_profile_page_for_member'; </script>"
                );
    
            return;
     
        }
    
       
    },
    // seperate each function by ","



    // method update_ind_get_organization_ID_by_my_selection
    update_ind_get_organization_ID_by_my_selection : function (req, res) {

        // get my selection
        var mySelection = req.body.mySelection;
        console.log("my selection: " + mySelection);

        // call fmda_ind_reuseables.ind_get_organization_ID_by_my_selection();
        var result = fmda_ind_reuseables.ind_get_organization_ID_by_my_selection();

        result.then(
            (result) => {
                var orgList_for_ind = result.organisations;
                for (let index = 0; index < orgList_for_ind.length; index++) {

                        if (orgList_for_ind[index].organisationName === mySelection) {
                            console.log("it's id is: " + orgList_for_ind[index].id);
                            res.send({response : orgList_for_ind[index].id});
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



    // method update_ind_professionalInformation_initiated
    update_ind_professionalInformation_initiated : function(req, res){
        res.render("fmda_ind/updateProfile/onboarding_ind2");
    },
    // seperate each function by ","



    // method update_ind_professionalInformation_done
    update_ind_professionalInformation_done : function(req, res){

        // console.log(req.file);
        // console.log(req.body);

        // get the picture extension
        // var fileExt = path.extname( path.join(__dirname) + "/public/treasuryCertificate_uploads/" + req.file.originalname );
        // console.log(fileExt);

        // var filePlusPath = "treasuryCertificate_uploads/"+ req.file.filename;

        //   get userID from the session
        var theUserID = '"' + req.session.userDetails.userID + '"';

        // call fmda_ind_reuseables.ind_professionalInformation();
        var result = fmda_ind_reuseables.ind_professionalInformation(theUserID, employmentHistoryList);
        
        result.then(
            (result) => {
                if ( result.addProfessionalInfo.message  == "Successful !") {
                    res.send(
                        " '<script> alert('changes saved successfully, will reflect on next login. '); </script>' "
                        + "<script> window.location.href='/ind_profile_page_for_member'; </script>"
                        );
    
                    return;
                }else{
                    res.send(
                        " '<script> alert(' Unable to save your professional information, kindly contact the admin. Thank You. '); </script>' "
                        + "<script> window.location.href='/ind_profile_page_for_member'; </script>"
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



    // method update_ind_qualifications_initiated
    update_ind_qualifications_initiated : function(req, res){
        res.render("fmda_ind/updateProfile/onboarding_ind3");
    },
    // seperate each function by ","




    // method update_ind_qualifications_done
    update_ind_qualifications_done : function(req, res){
        // console.log(req.body);
        //   get userID from the session
        var theUserID = '"' + req.session.userDetails.userID + '"';

        // call fmda_ind_reuseables.ind_qualifications_upload();
        var result = fmda_ind_reuseables.ind_qualifications_upload(theUserID, qualificationsList);

        result.then(
            (result) => {
                if ( result.addQualifications.message  == "Successful !") {
                    res.send(
                        " '<script> alert('changes saved successfully, will reflect on next login. '); </script>' "
                        + "<script> window.location.href='/ind_profile_page_for_member'; </script>"
                        );
    
                    return;
                }else{
                    res.send(
                        " '<script> alert(' Unable to save your qualification information, kindly contact the admin. Thank You. '); </script>' "
                        + "<script> window.location.href='/ind_profile_page_for_member'; </script>"
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





    // method update_qualificationList_individual_initiated
    update_qualificationList_individual_initiated: function(req, res) {
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
        res.render("fmda_ind/updateProfile/qualificationsObtained", { qualificationsList: qualificationsList });
    },
    // seperate each function by ","



    // method update_remove_qualification_individual_initiated
    update_remove_qualification_individual_initiated: function(req, res) {
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
        res.render("fmda_ind/updateProfile/qualificationsObtained", { qualificationsList: qualificationsList });
    },
    // seperate each function by ","




    // method update_ind_other_professional_qualifications_initiated
    update_ind_other_professional_qualifications_initiated : function(req, res){
        // the userID (email)
        var userID_email = req.session.userDetails.userID;
        res.render("fmda_ind/updateProfile/onboarding_ind_other_qualifications3", {userID_email : userID_email, memberCompleteDetails : req.session.memberCompleteDetails});
    },
    // seperate each function by ","


    // method update_ind_other_professional_qualifications_done
    update_ind_other_professional_qualifications_done: function(req, res) {
        // console.log(req.body);
        //   get userID from the session
        var theUserID = '"' + req.session.userDetails.userID + '"';
        var result = fmda_ind_reuseables.ind_other_proffessional_qualifications_upload(theUserID, other_proessional_qualificationsList);
        result.then(
            (result) => {
                
            console.log(result);
            
                if (result.addOtherProfessionalInfo.message == "Successful !") {
                    res.send(
                        " '<script> alert('changes saved successfully, will reflect on next login. '); </script>' "
                        + "<script> window.location.href='/ind_profile_page_for_member'; </script>"
                        );

                    return;
                } else {
                    res.send(" '<script> alert(' Unable to save your other qualification information, kindly contact the admin. Thank You. '); </script>' " + "<script> window.location.href='/ind_profile_page_for_member'; </script>");
                    return;
                }
            }, (onrejected) => {
                console.log(onrejected);
                return;
            });
    },
    // seperate each function by ","



    // method update_other_professional_qualificationList_individual_initiated
    update_other_professional_qualificationList_individual_initiated: function(req, res) {
        var addAsObject = {
                institutionName: req.body.institutionName,
                qualification: req.body.qualification,
                yearAttained: req.body.yearAttained,
                certificateURL: req.body.certificateURL
            }
            // add other_proessional_qualifications to List
            other_proessional_qualificationsList.push(addAsObject);
        console.log(other_proessional_qualificationsList);
        res.render("fmda_ind/updateProfile/otherPrefessionalQualificationsObtained", { qualificationsList: other_proessional_qualificationsList });
    },
    // seperate each function by ","


    // method update_remove_other_professional_Qualification_individual_initiated
    update_remove_other_professional_Qualification_individual_initiated: function(req, res) {
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
        res.render("fmda_ind/updateProfile/otherPrefessionalQualificationsObtained", { qualificationsList: other_proessional_qualificationsList });
    },
    // seperate each function by ","



    // method update_ind_attestation_initiated
    update_ind_attestation_initiated : function(req, res){
        // the userID (email)
        var userID_email = req.session.userDetails.userID;
        res.render("fmda_ind/updateProfile/onboarding_ind4", {userID_email : userID_email, memberCompleteDetails : req.session.memberCompleteDetails});
    },
    // seperate each function by ","



    // method update_ind_attestation_done
    update_ind_attestation_done : function(req, res){    

        // get userID from the session
        var theUserID = req.session.userDetails.userID;
        var referenceMemberId = req.body.referenceMemberId;
    
        // call fmda_ind_reuseables.ind_attestations_upload();
       var result = fmda_ind_reuseables.ind_attestations_upload(theUserID, referenceMemberId);

       result.then(
           (result) => {
                if ( result.submitAttestation.message  == "Successful !") {
                    res.send(
                        " '<script> alert('changes saved successfully, will reflect on next login. '); </script>' "
                        + "<script> window.location.href='/ind_profile_page_for_member'; </script>"
                        );
        
                    return;
                }else{
                    res.send(
                        " '<script> alert(' Unable to save your attestation, kindly contact the admin. Thank You. '); </script>' "
                        + "<script> window.location.href='/ind_profile_page_for_member'; </script>"
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



    // method update_ind_payment_for_member_initiated
    update_ind_payment_for_member_initiated : function(req, res){

        // get list of banks and pass alongside
        async function the_list_of_banks() {
            var listOfBanks = await Reuseables.list_of_banks();
            // console.log("list of banks: " + listOfBanks);
            var List_of_payment_purposes = await Reuseables.List_of_payment_purposes();
            return {listOfBanks,List_of_payment_purposes};
        }
    
        // call out asyn and await function "the_list_of_banks"
        the_list_of_banks()
        .then(
               
                (banks)=>{
                    console.log(banks);
                    // console.log("Our list of banks: " + JSON.stringify(banks) )
                    // the userID (email)
                    var userID_email = req.session.userDetails.userID;
                    res.render("fmda_ind/updateProfile/onboarding_ind5", {userID_email : userID_email,  "banks" : banks.listOfBanks, "purpose" : banks.List_of_payment_purposes});
                    return;
                },
                (error)=>{
                    console.log(error)
                    return;
                },
        );
    
        
    },
    // seperate each function by ","



    // method update_ind_payment_for_member_done
    update_ind_payment_for_member_done : function(req, res){

        // console.log(req.body);
        // res.send("payment details is under review, you will be contacted shortly. Thank You.");
    
        //   get userID from the session
        var theUserID = req.session.userDetails.userID;
        var depositorName = req.body.depositorName;
        var paymentReferenceNo = req.body.paymentReferenceNo;
        // var amount = '"' + req.body.amount + '"';
        var paymentDate = req.body.paymentDate;
        var bank = req.body.bank;
        var purpose = req.body.purpose;
    
        // call fmda_ind_reuseables.ind_payment_for_member();
        var result = fmda_ind_reuseables.ind_payment_for_member(theUserID, depositorName, paymentReferenceNo, req.body.amount, paymentDate, bank, purpose);
    
        result.then(
            (result) => {
                if ( result.submitPayment.message  == "Successful !") {
                    res.send("payment records saved.");
        
                    return;
                }
                else if ( result.submitPayment.message  == "Payment already exists.") {
                    res.send("Payment already exists, wait for admin verification");
        
                    return;
                }else{
                    res.send("Unable to save your payment record, kindly contact the admin. Thank You.");
            
                    return;
                }
            },
            (onrejected) => {
                console.log(onrejected);
                return
            }
        );
    },
    // seperate each function by ","



     // method update_employmentHistoryList_individual
     update_employmentHistoryList_individual : function(req, res){

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
        res.render("fmda_ind/updateProfile/emplomentHistory", { employmentHistoryList : employmentHistoryList });
    },
    // seperate each function by ","



     // method update_removeEmplomentHistory_individual
     update_removeEmplomentHistory_individual : function(req, res){

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
    
        console.log(employmentHistoryList);
        res.render("fmda_ind/updateProfile/emplomentHistory", { employmentHistoryList : employmentHistoryList });
    },
    // seperate each function by ","


     // method update_qualificationList_individual
     update_qualificationList_individual :  function(req, res){

        var addAsObject = {
                            institutionName: req.body.institutionName,
                            degreeOptained: req.body.degreeOptained,
                            from: req.body.from,
                            to: req.body.to,
                        }
        
        // add employment History to List
        qualificationsList.push(addAsObject);
        console.log(qualificationsList);
        res.render("fmda_ind/updateProfile/qualificationsObtained", { qualificationsList : qualificationsList });
    
    
    },
    // seperate each function by ","


    // method update_removeQualification_individual
    update_removeQualification_individual : function(req, res){

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
        res.render("fmda_ind/updateProfile/qualificationsObtained", { qualificationsList : qualificationsList });
    
    
    },
    // seperate each function by ","


}








module.exports = update_fmda_ind_controller;