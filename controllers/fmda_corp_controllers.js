
// require baseUrl
var baseUrl = require("../baseUrl");

// require request
var request = require("request");

// require the path module
var path = require("path");

// require Reuseables
var Reuseables = require("../reuseables/reuseables");
var fmda_corp_reuseables = require("../reuseables/fmda_corp_reuseables");



// to hold list of corporate members ID for Annual Group Payment
var annual_list_group_payment;




var fmda_corp_controller = {

    // method register_corperate_initiated
    register_corperate_initiated : async function(req, res){

        // call fmda_corp_reuseables.getMemberTypes()
        var { memberTypes } = await fmda_corp_reuseables.getMemberTypes();
        var { financialInstitutions } = await Reuseables.list_of_banks();
        var { organisations } = await Reuseables.list_of_organizations();

        // console.log(memberTypes)
        // console.log(financialInstitutions)
        // console.log(organisations)

        res.render("fmda_corp/register_corp", { "memberTypes" : memberTypes, "financialInstitutions" : financialInstitutions, organisations:organisations });
        return;

    },
    // seperate each function by ","



    // method register_corperate_done
    register_corperate_done : function(req, res){
    
        // console.log(req.body);
        // console.log(typeof(JSON.parse(req.body.bankers)));
        // console.log(JSON.parse(req.body.bankers));
        // console.log(req.files);

        var bankers = [];
        var theBankerList = JSON.parse(req.body.bankers); // get the list of bankers as JSON from the front-end form field
        theBankerList.forEach(element => {
            bankers.push(element.bankerName);
        });


        console.log("bankers: ", bankers);

        // update the body request with the new bankers array

        var updateTheRequestWithNewBankerArray = req.body;
        updateTheRequestWithNewBankerArray["bankers"] = bankers;

        var theRequest = updateTheRequestWithNewBankerArray;

        req.files.forEach( (element,index) => {
            console.log(element.originalname);
            console.log("index: " + index);

            // check the file extension for pdf type
            if(path.extname( path.join(__dirname) + "/public/corp_uploads/" + element.originalname )  !== '.pdf'){
                res.send(
                    " '<script> alert('invalid file type, pdf required'); </script>' "
                    + "<script> window.location.href='/register_corperate'; </script>"
                    );
            
                return;
            }
            else{
                if(index == 0){
                    theRequest["organisationLetterOfRequest"] = element.originalname;
                }else if(index == 1){
                    theRequest["certificateOfIncorp"] = element.originalname;
                }else if(index == 2){
                    theRequest["memorandumAndArticleOfAssociation"] = element.originalname;
                }else if(index == 3){
                    theRequest["referenceLetterFromOneOfTheApplicantBankers"] = element.originalname;
                }else if(index == 4){
                    theRequest["approvalFromTheRegulators"] = element.originalname;
                }else if(index == 5){
                    theRequest["corporateBrochure"] = element.originalname;
                }

            }
        });
        
        console.log("uploads passed");

        console.log(theRequest);
        
        // call fmda_corp_reuseables.register_corperate()
        var result = fmda_corp_reuseables.register_corperate(theRequest);

        result.then(
            (result) => {

                // console.log(result);

                if (result.newCorporateSignUp.statusCode == 200) {
                    res.send(
                        " '<script> alert(' " + result.newCorporateSignUp.message + " '); </script>' "
                        + "<script> window.location.href='/'; </script>"
                        );
                
                    return;
                }
                else if(result.newCorporateSignUp.statusCode == 404) {
                    res.send(
                        " '<script> alert(' " + result.newCorporateSignUp.message + " '); </script>' "
                        + "<script> window.location.href='/'; </script>"
                        );
                
                    return;
                }
                else {
                    res.send(
                        " '<script> alert(' Registration Failed, Kindly Contact The Admin. Thank You! '); </script>' "
                        + "<script> window.location.href='/'; </script>"
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




    // method set_security_question
    set_security_question : function(req, res){

        // call fmda_corp_reuseables.get_security_questions()
        var result = fmda_corp_reuseables.get_security_questions();
    
        result.then(
            (result) => {
                var securityQuestionsGotten = result.securityQuestions;
                res.render('fmda_corp/securityQuestion', {"securityQuestionsGotten" : securityQuestionsGotten});
                return;
            },
            (onrejected) => {
                console.log(onrejected);
                return;
            }
        );
    },
    // seperate each function by ","




    // method set_security_question_done
    set_security_question_done : function(req, res){

        var questionID = req.body.questionID;
        var answer = req.body.answer;
        var userID = req.session.userDetails.userID; // userID from session

        // call fmda_corp_reuseables.set_security_questions()
        var result = fmda_corp_reuseables.set_security_questions(questionID, userID, answer);

        result.then(
            (result) => {
                // var responseGotten = result.setSecurityAnswer.message;
                if (result.setSecurityAnswer.statusCode === 200) {
                    res.send(
                        "<script> window.location.href='/corp_payment'; </script>"
                        );
            
                    return;
                }else{
                    res.send(
                        " '<script> alert(' Unable to set security answer, kindly contact the admin. Thank You. '); </script>' "
                        + "<script> window.location.href='/corp_securityQuestion'; </script>"
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



    // method corp_payment_initiated
    corp_payment_initiated : function(req, res){

        // checking if payment is for pending invoices payment
        if (req.query.type == "pendingPayment") {
            
            // const action = req.query.action === 'update' ? 'update' : 'initial';
            const action = 'corporate';
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
                Reuseables.member_look_up(`"${userID_email}"`, '"Corporate"'),
            ]).then(
                ([
                    { lookupBankAccounts },
                    memberCompleteDetails
                ]) => {
                    // we are using the same onboarding payment page
                    res.render("fmda_corp/corp_payment", { userID_email, "banks": lookupBankAccounts, "banksString": JSON.stringify(lookupBankAccounts), paymentInfo, PaymentFor, action });
                    return;

                    

                }, (error) => {
                    console.log(error)
                    return;
                }, );

        } 
        else if(req.query.type == "firstAnnualPayment"){

            // const action = req.query.action === 'update' ? 'update' : 'initial';
            const action = 'corporate'
            var userID_email = req.session.userDetails.userID;

            // Payment For onboarding payment
            var PaymentFor = "first annual payment";

            

            Promise.all([
                // assemble all promises
                Reuseables.List_of_payment_purposes(),
                Reuseables.list_of_fmda_bank_accounts(),
                Reuseables.member_look_up(`"${userID_email}"`, '"Corporate"'),
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
                        if (item.description === "Corporate membership renewal") paymentInfo = item;
                    });
                    // destructure member complete details to get treasury experience
                    const { lookupMember: { member: { yearsOfTreasuryExperience } } } = memberCompleteDetails;
                    // get the payment amount for that particular range of treasury experience
                    Reuseables.get_payment_amount(paymentInfo.id, yearsOfTreasuryExperience).then(
                        ({paymentAmount}) => {
                        // console.log("amount returned: "+paymentAmount);
                        paymentInfo.amount = paymentAmount;
                        res.render("fmda_corp/corp_payment", { userID_email, "banks": lookupBankAccounts, "banksString": JSON.stringify(lookupBankAccounts), paymentInfo, PaymentFor, action });
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
        // or if it's for initial payment upon registration
        else 
        {
            // const action = req.query.action === 'update' ? 'update' : 'initial';
            const action = 'corporate'
            var userID_email = req.session.userDetails.userID;

            // Payment For onboarding payment
            var PaymentFor = "onboarding payment";

            Promise.all([
                // assemble all promises
                Reuseables.List_of_payment_purposes(),
                Reuseables.list_of_fmda_bank_accounts(),
                Reuseables.member_look_up(`"${userID_email}"`, '"Corporate"'),
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
                        if (item.description === "Corporate membership registration fee") paymentInfo = item;
                    });
                    // destructure member complete details to get treasury experience
                    const { lookupMember: { member: { yearsOfTreasuryExperience } } } = memberCompleteDetails;
                    // get the payment amount for that particular range of treasury experience
                    Reuseables.get_payment_amount(paymentInfo.id, yearsOfTreasuryExperience).then(
                        ({paymentAmount}) => {
                        paymentInfo.amount = paymentAmount;
                        res.render("fmda_corp/corp_payment", { userID_email, "banks": lookupBankAccounts, "banksString": JSON.stringify(lookupBankAccounts), paymentInfo, PaymentFor, action });
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


    // method corp_payment
    corp_payment : function(req, res){

        // console.log(req.body);
        
        //   get userID from the session
        var details_to_pay = {
                                userId :  req.session.userDetails.userID,
                                depositorName : req.body.depositorName,
                                paymentReferenceNo : req.body.paymentReferenceNo,
                                invoiceNumber : req.body.invoiceNumber,
                                amount : parseInt(req.body.amount),
                                paymentDate : req.body.paymentDate,
                                bank : req.body.bank,
                                accountNumber : req.body.accountNumber,
                                accountName : req.body.accountName,
                                purpose : req.body.purpose
                            }
        

        // call fmda_corp_reuseables.corp_payment()
        var result = fmda_corp_reuseables.corp_payment(details_to_pay);
    
        result.then(
            (result) => {
                
                console.log("payment result: "+result);

                if ( result.submitPayment.message  == "Successful !") {
                    res.send("payment records saved, await verification");
        
                    return;
                }
                else if ( result.submitPayment.message  == "Payment already exists.") {
                    res.send("Payment already exists, await verification");
        
                    return;
                }else{
                    res.send("Unable to save your payment record, kindly contact the admin. Thank You.");
            
                    return;
                } 
            },
            (onrejected) => {
                console.log(onrejected);
                return;
            }
        );

    },

    // method corp_main_dashboard
    corp_main_dashboard : function(req, res){
        // console.log(req.session.memberCompleteDetails);
        // var userID_email = req.session.userDetails.userID;
        // var member_completeDetails = req.session.memberCompleteDetails;
        const { memberCompleteDetails } = req.session;
        // console.log(memberCompleteDetails);
        res.render("fmda_corp/corp_main_dashboard", { memberCompleteDetails, getDashBoardFields:req.session.getDashBoardFields } );
    },
    // seperate each function by ","



    // method corp_member_objection
    corp_member_objection : function(req, res){
        const { memberCompleteDetails } = req.session;
        res.render("fmda_corp/corp_member_objection", { memberCompleteDetails } ); 
    },
    // seperate each function by ","




    // method corp_profile_page
    corp_profile_page : function(req, res){
        var userID_email = req.session.userDetails.userID;

        fmda_corp_reuseables.corp_member_look_up(`"${userID_email}"`, '"Corporate"').then(memberCompleteDetails => {
            // update the memberCompleteDetails currently stored in session
            req.session.memberCompleteDetails = memberCompleteDetails
            return res.render("fmda_corp/corp_profile_page", { userID_email, memberCompleteDetails });
        });
    },
    // seperate each function by ","

    render_change_password_page: function(req, res) {
        try {
          const { memberCompleteDetails } = req.session;
          return res.render('fmda_corp/change_password', { memberCompleteDetails });
        } catch (error) {
          return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },

    handle_change_password: async function(req, res) {
        try {
          const { userDetails: { userID } } = req.session;
          const { newPassword, oldPassword } = req.body;

          // check the oldpassword is correct
          const result = await Reuseables.login(userID, oldPassword );
          // if the old password is wrong 
          const { signIn: { statusCode } } = await Reuseables.login(userID, oldPassword );
            if (statusCode !== 200) {
              return res.send(`<script> alert('Incorrect old password');window.location.href='/corp_change_password';</script>`);
            }
          const { updatePassword: { message } } = await fmda_corp_reuseables.change_password(userID, newPassword);
          return res.send(`<script> alert('${message}');window.location.href='/corp_change_password';</script>`);       
        } catch (error) {
          return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },


    render_payment_history_page: async function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            
            const { lookupMember : {corporate : { contactOfficialEmail, memberUUID } } } = memberCompleteDetails;

            const {memberPaymentHistory}  = await Reuseables.memberPaymentHistory(contactOfficialEmail, memberUUID, 3);
            return res.render('fmda_corp/payment/paymentHistory', { memberCompleteDetails, memberPaymentHistory });
        } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },

    render_upcoming_events_page: async function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;

            const { lookupMember : {corporate : { memberUUID } } } = memberCompleteDetails;

            const { upcomingEvents }  = await Reuseables.memberUpcomingEvents(memberUUID);
            return res.render('fmda_corp/events/upcoming_events', { memberCompleteDetails, events: upcomingEvents, type: 'corp' });
        } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },



    render_event_details_page: async function(req, res) {
        try {
            var theUserID =  req.session.userDetails.userID;
            const { memberCompleteDetails } = req.session;
            const { lookupMember : {corporate : { memberUUID } } } = memberCompleteDetails;
            const { eventId, type } = req.query;
            var [
                { lookupEvent },
                { checkEventRegistration },
                { lookupEventAmount },
                { lookupAttendees },
                paymentStatus,
                { organisationMembersLookup }
            ] = await Promise.all([
                Reuseables.eventDetails(eventId),
                Reuseables.checkEventRegistration(eventId, memberUUID),
                Reuseables.checkEventAmount(eventId, memberUUID),
                Reuseables.eventAttendees(eventId),
                Reuseables.checkEventPaymentStatus(eventId, memberUUID),
                Reuseables.get_corporate_member_members(theUserID)
            ]);

            // return res.render('fmda_corp/events/event_details', { 
            //     lookupAttendees, memberCompleteDetails, checkEventRegistration, lookupEventAmount, lookupEvent, type: 'corp' 
            // });

            // console.log("type: ", type);
            console.log("paymentStatus: ", paymentStatus);

             if (type == "Free") {
                return res.render('fmda_corp/events/event_details', { 
                    organisationMembersLookup, lookupAttendees, paymentStatusDisplay, memberCompleteDetails, memberUUID,
                    checkEventRegistration, lookupEventAmount, lookupEvent, type: 'corp' 
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

                return res.render('fmda_corp/events/event_details', { 
                    organisationMembersLookup, lookupAttendees, paymentStatus, paymentStatusDisplay, memberCompleteDetails, memberUUID,
                    checkEventRegistration, lookupEventAmount, lookupEvent, type: 'corp' 
                });
             }
             else if (type == "Paid" && paymentStatus.statusCode == 404) {
                console.log("it's a new event that requires a fresh registration");

                // create a new paymentStatus
                var paymentStatus = { lookupEventPaymentStatus : { status : 5 } }; 

                return res.render('fmda_corp/events/event_details', { 
                    organisationMembersLookup, lookupAttendees, paymentStatus, paymentStatusDisplay, memberCompleteDetails, memberUUID,
                    checkEventRegistration, lookupEventAmount, lookupEvent, type: 'corp' 
                });
             }

        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },



    render_new_dealer_page: async function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;

            var { financialInstitutions } = await Reuseables.list_of_banks();

            return res.render('fmda_corp/new_dealer', { memberCompleteDetails, financialInstitutions });
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },



    handle_new_dealer_page: function(req, res) {
        // console.log(JSON.stringify(req.session.memberCompleteDetails.lookupMember.corporate.memberUUID) );
        var memberUUID = JSON.stringify(req.session.memberCompleteDetails.lookupMember.corporate.memberUUID)
        // call fmda_corp_reuseables.new_fmda_dealer(fmdaDealer)
        console.log(req.session.memberCompleteDetails.lookupMember.corporate.organisationName);

        var dealerInfo = req.body;

        // add the corpoarate organization name, which is the organization of their dealer as well
        dealerInfo["bank"] = req.session.memberCompleteDetails.lookupMember.corporate.organisationName;
        // console.log(dealerInfo)

        var result = fmda_corp_reuseables.new_fmda_dealer(memberUUID, req.body);
        result.then(
            (result) => {
                if (result.submitNewDealerRequest.statusCode == 200) {
                    res.send(
                        " '<script> alert(' " + result.submitNewDealerRequest.message + " '); </script>' "
                        + "<script> window.location.href='/corp_new_dealer'; </script>"
                        );
                    return;
                }
                else {
                    res.send(
                        " '<script> alert(' Issues adding new dealer, contact the admin.'); </script>' "
                        + "<script> window.location.href='/corp_new_dealer'; </script>"
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

    

    render_event_registration_page: async function(req, res) {

        // console.log(req.query);

        try {
            const { memberCompleteDetails } = req.session;
            const { lookupMember : {corporate : { memberUUID } } } = memberCompleteDetails;
            var eventId = req.query.eventId;
            var eventName = req.query.eventName;
            var type = req.query.type;
            var amount = req.query.amount;
            var delegates = req.query.delegateArray;

            // if we are coming from pending invoice page
            if (req.query.invoiceNumber) {
                // get deleegates from the invoice details for Paid Event
                var invoiceNumber = req.query.invoiceNumber;
                // console.log("invoiceNumber: ",invoiceNumber);

                // get invoice details
                var { lookupInvoice } = await fmda_corp_reuseables.corp_get_invoice_details(invoiceNumber);
                var invoiceItems =  lookupInvoice.invoiceItems;

                var getTheNeededDelegate = [];

                // console.log("lookupInvoice: ",lookupInvoice.invoiceItems.length);

                // get membershipId from invoiceItems
                invoiceItems.forEach(element => {
                    getTheNeededDelegate.push(element.membershipId);
                });

                // set as object
                var registerWith = {
                    memberUUID : memberUUID,
                    eventId : eventId,
                    eventName : eventName,
                    type : req.query.type,
                    amount : req.query.amount,
                    delegates : JSON.stringify(getTheNeededDelegate),
                    invoiceNumber: req.query.invoiceNumber
                }
            }else{
                // set as object
                var registerWith = {
                    memberUUID : memberUUID,
                    eventId : eventId,
                    eventName : eventName,
                    type : req.query.type,
                    amount : req.query.amount,
                    delegates : req.query.delegateArray,
                }
            }

            

            // free event
            if (type == "Free") {
                var registerMemberFreeEvent = await Reuseables.registerCorporateMembersForFreeEvent(eventId, delegates, memberUUID);
                if (registerMemberFreeEvent.corporateMemberEventRegistration.statusCode == 200) {
                    return res.send(`<script> alert('${registerMemberFreeEvent.corporateMemberEventRegistration.message}');
                    window.location.href='/corp_upcoming_events';</script>`);
                }  
                else {
                    return res.send(`<script> alert('${registerMemberFreeEvent.corporateMemberEventRegistration.message}');
                    window.location.href='/corp_upcoming_events';</script>`);
                }                  
            }
            else{
                // paid event, render the page for payment details
                var { lookupBankAccounts } = await Reuseables.list_of_fmda_bank_accounts();
                // empty getTheNeededDelegate
                getTheNeededDelegate = [];
                return res.render('fmda_corp/events/register', { memberCompleteDetails, registerWith, lookupBankAccounts });
            }
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","


    handle_event_registration: async function(req, res) {

        // console.log(req.body);

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
                                delegates : req.body.delegates,
                                invoiceNumber: req.body.invoiceNumber
                            };
        try {
            var { corporateMemberPaidEventRegistration } = await Reuseables.registerCorporateMembersForPaidEvent(paidEventParams);
            // console.log(corporateMemberPaidEventRegistration:);
            if (corporateMemberPaidEventRegistration.statusCode == 200) {
                return res.send(`<script> alert('${corporateMemberPaidEventRegistration.message}');
                window.location.href='/corp_upcoming_events';</script>`);
            }  
            else {
                return res.send(`<script> alert('${corporateMemberPaidEventRegistration.message}');
                window.location.href='/corp_upcoming_events';</script>`);
            }   
        } catch (error) {
          return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","



    // corp_get_fmda_account_details
    corp_get_fmda_account_details: async function(req, res) {

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



    // corp_member_list_page
    corp_member_list_page: async function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            var userID_email = req.session.userDetails.userID;

            // console.log("userID_email", userID_email);

            var { organisationMembersLookup } = await fmda_corp_reuseables.list_of_its_members(userID_email);
            
            // console.log(organisationMembersLookup);

            return res.render('fmda_corp/corp_member_list', { memberCompleteDetails, organisationMembersLookup : organisationMembersLookup });
        } catch (error) {
            // console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","



    // corp_view_my_member_Details
    corp_view_my_member_Details: async function(req, res) {

        // console.log("member uuid: ", req.query.details);
        var the_member_memberUUID = req.query.details;

        try {
            const { memberCompleteDetails } = req.session;
            var userID_email = req.session.userDetails.userID;

            var { organisationMembersLookup } = await fmda_corp_reuseables.list_of_its_members(userID_email);

            // console.log("the_result: ", organisationMembersLookup);

            var detailsGotten =  organisationMembersLookup.filter(function(details) {
                return details.memberUUID == the_member_memberUUID;
            });

            // console.log(detailsGotten[0]);

            return res.render('fmda_corp/corp_member_details', { memberCompleteDetails, member : detailsGotten[0]});
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","




    // corp_annual_renewal_list
    corp_annual_renewal_list: async function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            var userID_email = req.session.userDetails.userID;

            // console.log("userID_email", userID_email);

            var { organisationMembersLookup } = await fmda_corp_reuseables.list_of_its_members(userID_email);
            
            // console.log(organisationMembersLookup);

            return res.render('fmda_corp/corp_annual_renewal_list', { memberCompleteDetails, organisationMembersLookup : organisationMembersLookup });
        } catch (error) {
            // console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","





    // corp_annual_renewal
    corp_annual_renewal: async function(req, res) {

        // get the members IDs to be paid for and pass them into corp_generate_annual_group_member_invoice_number()
        var memberUUIDs = req.body.memberUUID;

        // console.log("memberUUIDs type of: ", typeof(memberUUIDs) );
        // console.log("memberUUIDs : ", memberUUIDs );

        // if string or an bject
        if (typeof(memberUUIDs) == "string") {
            var the_memberUUIDs = [];
            the_memberUUIDs[0] = memberUUIDs;
            // console.log("result as string: ", the_memberUUIDs);
        } 
        else if (typeof(memberUUIDs) == "object"){
            var the_memberUUIDs = memberUUIDs
            // console.log("result as object: ", the_memberUUIDs);
        }else if (memberUUIDs == undefined){
            res.send(
                " '<script> alert('No selection was made.'); </script>' "
                + "<script> window.location.href='/corp_annual_renewal_list'; </script>"
                );
    
            return;
        }


        // set annual_list_group_payment found at the top of the page
        annual_list_group_payment = the_memberUUIDs;


        // set action = 'Make Payment';
        const action = 'Make Payment';

        var userID_email = req.session.userDetails.userID;
        Promise.all([
            // assemble all promises
            Reuseables.List_of_payment_purposes(),
            Reuseables.list_of_fmda_bank_accounts(),
            Reuseables.member_look_up(`"${userID_email}"`, '"Corporate"'),
            fmda_corp_reuseables.corp_generate_annual_group_member_invoice_number(userID_email, the_memberUUIDs)
        ]).then(
            ([
                // get destructured values from the promises 
                { paymentPurposes },
                { lookupBankAccounts },
                memberCompleteDetails,
                annual_group_member_invoice_number
            ]) => {

                // console.log(paymentPurposes);
                // console.log(annual_group_member_invoice_number);

                if (annual_group_member_invoice_number.generateCorporateMemberMembersAnnualFeeInvoice.statusCode == 200) 
                {   

                    var paymentInfo;
                    // loop through the payment purposes to get the payment id for member registration 
                    paymentPurposes.forEach(item => {
                        if (item.description === "Group membership renewal") paymentInfo = item;                       
                    });

                    // console.log(paymentInfo);

                    // res.render("fmda_corp/corp_payment_annual", { userID_email, "banks": lookupBankAccounts, "banksString": JSON.stringify(lookupBankAccounts), paymentInfo, the_memberUUIDs, action });

                    // return;

                    res.send(
                        " '<script> alert('Invoice Generated Successfully'); </script>' "
                        + "<script> window.location.href='/corp_annual_renewal_list'; </script>"
                        );
            
                    return;


                } else {
                    
                    res.send(
                        " '<script> alert('unable to generate invoice number, try again OR contact the admin. '); </script>' "
                        + "<script> window.location.href='/corp_annual_renewal_list'; </script>"
                        );
            
                    return;
                }

            }, (error) => {
                console.log(error)
                return;
            }, );

    },
    // seperate each function by ","




    // corp_annual_renewal_payment
    corp_annual_renewal_payment : function(req, res){
        
        // console.log(req.body);

        // get annual_list_group_payment already set at the top of the page
        // console.log(annual_list_group_payment);

        //   get userID from the session
        var details_to_pay = {
                        userId :  req.session.userDetails.userID,
                        depositorName : req.body.depositorName,
                        paymentReferenceNo : req.body.paymentReferenceNo,
                        invoiceNumber : req.body.invoiceNumber,
                        amount : parseInt(req.body.amount),
                        paymentDate : req.body.paymentDate,
                        bank : req.body.bank,
                        accountNumber : req.body.accountNumber,
                        accountName : req.body.accountName,
                        purpose : req.body.purpose,
                        delegates : annual_list_group_payment
                    };


        // call fmda_corp_reuseables.corp_annual_renewal_payment()
        var result = fmda_corp_reuseables.corp_annual_renewal_payment(details_to_pay);
    
        result.then(
            (result) => {
                if ( result.submitPayment.message  == "Successful !") {
                    res.send("payment records saved, await verification");
        
                    // empty annual_list_group_payment already set at the top of the page
                    annual_list_group_payment = [];
                    return;
                }
                else if ( result.submitPayment.message  == "Payment already exists.") {
                    res.send("Payment already exists, await verification");
        
                    // empty annual_list_group_payment already set at the top of the page
                    annual_list_group_payment = [];
                    return;
                }else{
                    res.send("Unable to save your payment record, kindly contact the admin. Thank You.");
            
                    // empty annual_list_group_payment already set at the top of the page
                    annual_list_group_payment = [];
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


    
    // corp_generate_invoice_number
    corp_generate_invoice_number: async function(req, res) {
        
        var action = req.body.action;
        // console.log(action);
        var userID_email = req.session.userDetails.userID;

        if ( action == 'generate invoice number' ) {
                try {
                    const { generateCorporateMemberAnnualFeeInvoice } = await fmda_corp_reuseables.corp_generate_invoice_number(userID_email);

                    console.log(generateCorporateMemberAnnualFeeInvoice);
                    
                    if(generateCorporateMemberAnnualFeeInvoice.message == "Successful!"){
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




    // corp_generate_annual_group_member_invoice_number
    corp_generate_annual_group_member_invoice_number: async function(req, res) {
        
        /*
            1. get annual_list_group_payment found at the top of the page, set during;
            2. which was set by method: corp_annual_renewal 
        */ 
        var the_memberUUIDs = annual_list_group_payment;

        var action = req.body.action;
        // console.log(action);
        var userID_email = req.session.userDetails.userID;

        if ( action == 'generate group invoice number' ) {
                try {
                    const { generateCorporateMemberMembersAnnualFeeInvoice } = await fmda_corp_reuseables.corp_generate_annual_group_member_invoice_number(userID_email, the_memberUUIDs);
                    if(generateCorporateMemberMembersAnnualFeeInvoice.message == "Successful!"){
                        
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





    // corp_generate_group_member_event_invoice_number
    corp_generate_group_member_event_invoice_number: async function(req, res) {
        
        // console.log(req.body);
        // console.log(req.body.userId);
        // console.log(req.body.eventId);
        // console.log(JSON.parse(req.body.memberUUIDs));

        var userId = req.body.userId;
        var eventId = req.body.eventId;
        var memberUUIDs = JSON.parse(req.body.memberUUIDs);

        var userID_email = req.session.userDetails.userID;

        var action = req.body.action;
        // console.log(action);
        var userID_email = req.session.userDetails.userID;

        if ( action == 'generate group invoice number' ) {
                try {
                    const { generateCorporateMemberEventInvoice } = await fmda_corp_reuseables.corp_generate_group_member_event_invoice_number(userID_email, eventId, memberUUIDs);
                    if(generateCorporateMemberEventInvoice.message == "Successful!"){
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



    corp_pending_payment: async function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            
            const { lookupMember : {corporate : { contactOfficialEmail, memberUUID } } } = memberCompleteDetails;

            // console.log(memberUUID);
            
            const {lookupMemberInvoices}  = await Reuseables.corp_pending_payment(memberUUID);
            return res.render('fmda_corp/payment/pending_payment', { memberCompleteDetails, lookupMemberInvoices });
        } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },





    corp_member_search: async function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            return res.render('fmda_corp/corp_member_search', { memberCompleteDetails });
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","



    corp_get_member_search_result: async function(req, res) {
        var search_by = req.body.search_by;
        // console.log("search_by: ", search_by);

        try {
            const { searchMembers } = await Reuseables.get_member_search_result(search_by);
            return res.send(searchMembers);
        } catch (error) {
            console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","

    // seperate each function by ","
    corp_member_directories: async function (req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            console.log('supposed 4:', req.session.memberCompleteDetails.lookupMember.corporate.memberUUID)
            return res.render ('fmda_corp/resources/searchDirectories', {  memberCompleteDetails })
          } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
          }
    },

    handle_corp_member_directories: async function (req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            var memberUUID = req.body.id;
            req.session.memberUUID = memberUUID

            return res.redirect('/corp_member_getDirectories')
          } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
          }
    },

    corp_member_getDirectories: async function (req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            var memberuuid = req.session.memberCompleteDetails.lookupMember.corporate.memberUUID;
            
            var resources = await Reuseables.getResources(memberuuid);

            return res.render ('fmda_corp/resources/directoryList', { data: resources.lookupMemberDirectories, memberCompleteDetails })
          } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
          }
    },
 
    corp_member_resource: async function (req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            var id = req.query.id;
            req.session.resource_id = id
            var memberuuid = req.session.memberCompleteDetails.lookupMember.corporate.memberUUID;

      
            var [resources, resource_details] = await Promise.all([Reuseables.getResources(memberuuid), Reuseables.searchResourceDetails(memberuuid, id)])  
            
            var resource =  resources.lookupMemberDirectories.filter(function(resource) {
              return resource.id == req.query.id;
              
            });
      
            
            resource = resource[0]
      
            return res.render ('fmda_corp/resources/resourceList', { data: resource, list: resource_details.lookupMemberDirectoryResources, memberCompleteDetails })
          } catch (error) {
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
          }
    },



    // corp_list_of_all_fmda_individual_member
    corp_list_of_all_fmda_individual_member: async function(req, res) {
        try {
            const { memberCompleteDetails } = req.session;
            var userID_email = req.session.userDetails.userID;


            var members = await fmda_corp_reuseables.corp_list_of_all_fmda_individual_member();
            
            // console.log(members);

            return res.render('fmda_corp/corp_list_of_all_fmda_individual_member', { memberCompleteDetails, members : members });
        } catch (error) {
            // console.log(error)
            return res.send(`Error Message, APIs Service Down: ${error.message}`);
        }
    },
    // seperate each function by ","



}





module.exports = fmda_corp_controller;