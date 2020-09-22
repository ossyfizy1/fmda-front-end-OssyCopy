import { Res_utils } from '../utils';
import { admin_events_queries } from '../queries';

// require the path module
var path = require("path");



const {
  resError, resPopupRedirect,
} = Res_utils;

const {
  getAllEvents,
  createEvent,
  getEventDetails,
  getEventAttendees,
  publishEvent,
  participantCategory,
  deleteAdminEvent,
  show_payment_history,
  validate_member_event_paymentNow,
  updateEvent
} = admin_events_queries;




/**
*@class Admin_event_controller
*@description Controllers for handling verification and approval of payments
*@exports Admin_event_controller
*/
class Admin_event_controller {
  /**
   * @name renderCreateEventPage
   * @description renders the page allowing an admin to create a new event
   */
  static async renderCreateEventPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const participants = await participantCategory();
      return res.render('fmda_admin/events/create_event', { capabilityIds, participants });
    } catch (error) {
      return resError(res, error);
    }
  }




  static async picture_upload(req, res) {
    
    var event_pics_array = [];
    var picsArray = req.files;

    for (let index = 0; index < picsArray.length; index++) {
            const picture = picsArray[index];

            // check that the event picture was uploaded
            if (picture) {
              // get the picture extension
              var fileExt = path.extname(path.join(__dirname) + "/public/events_pics_uploads/" + picture.originalname.replace("","%20") );
              console.log(fileExt);

              var imagePlusPath = "events_pics_uploads/" + picture.filename;

              // put into array
              event_pics_array.push(imagePlusPath);

              // check the file extension of the image
              if( ['.jpg', '.png', '.jpeg'].find(a => a === fileExt.toLowerCase()) === undefined ) {
                  return res.send(" '<script> alert('invalid type, jpg or png required'); </script>' " + "<script> window.location.href='/admin/events/create'; </script>");
              }
          }
    } // end of forLoop

    // console.log(event_variables_per_type);
    // console.log(event_pics_array);

    // console.log("participantCategory: ", typeof(req.body.participantCategory));

    if (typeof(req.body.participantCategory) == "string") {
        var the_participant_category = [];
        the_participant_category.push(req.body.participantCategory);

          if (event_pics_array) {
                  var event_param1 =  {        
                                        "title" : req.body.title,
                                        "images" : event_pics_array,
                                        "startDate" : Date.parse(req.body.startDate),
                                        "endDate" : Date.parse(req.body.endDate),
                                        "eventTime" : req.body.eventTime,
                                        "venue" : req.body.venue,
                                        "description": req.body.description,
                                        "participantCategory": the_participant_category
                                    }
                  
          }

          // empty the the_participant_category
          the_participant_category = " ";
    }else{

          if (event_pics_array) {
                  var event_param1 =  {        
                                        "title" : req.body.title,
                                        "images" : event_pics_array,
                                        "startDate" : Date.parse(req.body.startDate),
                                        "endDate" : Date.parse(req.body.endDate),
                                        "eventTime" : req.body.eventTime,
                                        "venue" : req.body.venue,
                                        "description": req.body.description,
                                        "participantCategory": req.body.participantCategory
                                    }
                  
          }

    }


    


    // keep event_param1 into session;
    req.session.event_param1 = event_param1;
    console.log("event params 1: ", event_param1);

    
    res.redirect("/admin/events/create_event2");
    
  }





  /**
   * @name event_types
   * @description  handles the creation of a new event
   */
  static async event_types(req, res) {
    try {
      const { capabilityIds } = req.session;
      return res.render('fmda_admin/events/create_event2', { capabilityIds });
    } catch (error) {
      return resError(res, error);
    }

  }





  /**
   * @name handleCreateEvent
   * @description  handles the creation of a new event
   */
  static async handleCreateEvent(req, res) {


    // console.log(req.body);
    // console.log(req.session.event_param1);

    var the_obtainablePoints = [];
    var the_discounts = [];
    var the_customFee = [];


    var the_images = req.session.event_param1.images;


    if (req.body.isFree === "true") {
      var isFree = true;
    }else if(req.body.isFree === "false"){
      var isFree = false;
    }

    if (req.body.hasMaxPaticipants === "true") {
      var hasMaxPaticipants = true;
    }else if(req.body.hasMaxPaticipants === "false"){
      var hasMaxPaticipants = false;
    }

    if (req.body.requiresAttendeeConfirmation === "true") {
      var requiresAttendeeConfirmation = true;
    }else if(req.body.requiresAttendeeConfirmation === "false"){
      var requiresAttendeeConfirmation = false;
    }

    if (req.body.hasPoints === "true") {
      var hasPoints = true;
    }else if(req.body.hasPoints === "false"){
      var hasPoints = false;
    }

    if (req.body.hasDiscount === "true") {
      var hasDiscount = true;
    }else if(req.body.hasDiscount === "false"){
      var hasDiscount = false;
    }


    // obtainablePoints
    if (req.body.obtainablePoints) {
        var obtainable_Points = JSON.parse(req.body.obtainablePoints);
        for (let index = 0; index < obtainable_Points.length; index++) {
              if (obtainable_Points[index].pointValue != null) {
                  the_obtainablePoints.push(obtainable_Points[index]);
              }
        }
    }


    // discount
    if (req.body.discounts) {
        var discounts_percentage = JSON.parse(req.body.discounts);
        for (let index = 0; index < discounts_percentage.length; index++) {
            if (discounts_percentage[index].percentage != null) {
              the_discounts.push(discounts_percentage[index]);
            }
        }
    }

    // customFee
    if (req.body.customFee) {
      var customFee_amount = JSON.parse(req.body.customFee);
      for (let index = 0; index < customFee_amount.length; index++) {
          if (customFee_amount[index].amount != null) {
            the_customFee.push(customFee_amount[index]);
          }
      }
    }
    


    // check type of event
    if (req.body.type == 'Free') {

                                var free_event = {     
                                  "title" : req.session.event_param1.title,
                                  "images" : the_images,
                                  "startDate" : req.session.event_param1.startDate.toString(),
                                  "endDate" : req.session.event_param1.endDate.toString(),
                                  "eventTime" : req.session.event_param1.eventTime,
                                  "venue" : req.session.event_param1.venue,
                                  "type": req.body.type,
                                  "description": req.session.event_param1.description,
                                  "participantCategory": req.session.event_param1.participantCategory,
                                  "isFree": isFree,
                                  // "feeType": req.body.feeType,
                                  // "customFee": JSON.parse(req.body.customFee),
                                  // "flatFee": req.body.flatFee,
                                  // "hasDiscount": req.body.hasDiscount,
                                  "hasMaxPaticipants": hasMaxPaticipants,
                                  "maxNumberOfPaticipants": parseInt(req.body.maxNumberOfPaticipants),
                                  "requiresAttendeeConfirmation": requiresAttendeeConfirmation,
                                  "hasPoints": hasPoints,
                                  "obtainablePoints": the_obtainablePoints,
                                  // "discounts": JSON.parse(req.body.discounts)
                            }

                            console.log("free_event: ", free_event);
                            req.session.event_variables_per_type = free_event;

    } else if (req.body.type == 'Paid') {



        if (req.body.feeType == "flatFee") {
          
                          var flatFee_event = {     
                            "title" : req.session.event_param1.title,
                            "images" : the_images,
                            "startDate" : req.session.event_param1.startDate.toString(),
                            "endDate" : req.session.event_param1.endDate.toString(),
                            "eventTime" : req.session.event_param1.eventTime,
                            "venue" : req.session.event_param1.venue,
                            "type": "Paid",
                            "description": req.session.event_param1.description,
                            "participantCategory": req.session.event_param1.participantCategory,
                            "isFree": isFree,
                            "feeType": "Flat",
                            // "customFee": JSON.parse(req.body.customFee),
                            "flatFee": parseInt(req.body.flatFee),
                            // "hasDiscount": req.body.hasDiscount,
                            "hasMaxPaticipants": hasMaxPaticipants,
                            "maxNumberOfPaticipants": parseInt(req.body.maxNumberOfPaticipants),
                            "requiresAttendeeConfirmation": requiresAttendeeConfirmation,
                            "hasPoints": hasPoints,
                            "obtainablePoints": the_obtainablePoints,
                            // "discounts": JSON.parse(req.body.discounts)
                      }

                      console.log(flatFee_event);
                      req.session.event_variables_per_type = flatFee_event;

        } else if (req.body.feeType == "custom") {
          
                            var Custom_event = {     
                              "title" : req.session.event_param1.title,
                              "images" : the_images,
                              "startDate" : req.session.event_param1.startDate.toString(),
                              "endDate" : req.session.event_param1.endDate.toString(),
                              "eventTime" : req.session.event_param1.eventTime,
                              "venue" : req.session.event_param1.venue,
                              "type": "Paid",
                              "description": req.session.event_param1.description,
                              "participantCategory": req.session.event_param1.participantCategory,
                              "isFree": isFree,
                              "feeType": "Custom",
                              "customFee": the_customFee,
                              // "flatFee": req.body.flatFee,
                              "hasDiscount": hasDiscount,
                              "hasMaxPaticipants": hasMaxPaticipants,
                              "maxNumberOfPaticipants": parseInt(req.body.maxNumberOfPaticipants),
                              "requiresAttendeeConfirmation": requiresAttendeeConfirmation,
                              "hasPoints": hasPoints,
                              "obtainablePoints": the_obtainablePoints,
                              "discounts": the_discounts
                        }

                        console.log(Custom_event);
                        req.session.event_variables_per_type = Custom_event;

        }


        
  }

  // req.session.event_variables_per_type
  // console.log("event_variables_per_type: ", req.session.event_variables_per_type);


    try {
      const adminId = req.session.officialEmail;
      const variables = req.session.event_variables_per_type;
      const setupNewEvent = await createEvent(variables, adminId);
      if (setupNewEvent.statusCode === 200) {
        return resPopupRedirect(res, setupNewEvent.message, '/admin/events/create');
      }
      return resPopupRedirect(res, setupNewEvent.message, '/admin/events/create');
    } catch (error) {
      return resError(res, error);
    }

  }


  /**
   * @name renderManageEventsPage
   * @description renders the page that shows all the registered events
   */
  static async renderManageEventsPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const events = await getAllEvents();
      return res.render('fmda_admin/events/manage_event', { events, capabilityIds, type: 'admin' });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderEventDetailsPage
   * @description renders the page that shows details of a particular event
   */
  static async renderEventDetailsPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const { eventId } = req.query;
      const [lookupEvent, lookupAttendees] = await Promise.all([
        getEventDetails(eventId),
        getEventAttendees(eventId),
      ]);

      console.log("event details: ", lookupEvent);
      console.log("attendies: ", lookupAttendees);

      return res.render('fmda_admin/events/event_details', {
        lookupEvent, lookupAttendees, capabilityIds, type: 'admin',
      });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderEventAttendeesPage
   * @description renders the page that shows all the attendees for a particular event
   */
  static async renderEventAttendeesPage(req, res) {
    // console.log("event id: ", req.query.eventId);

    try {
      const { capabilityIds } = req.session;
      const eventId = req.query.eventId;
      const lookupAttendees = await getEventAttendees(eventId);
      return res.render('fmda_admin/events/attendeesList', { eventId, lookupAttendees, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handlePublisheEvent
   * @description Allows an admin to publish an already created event
   */
  static async handlePublishEvent(req, res) {
    try {
      const adminId = req.session.officialEmail;
      const { eventId } = req.query;
      const variables = {
        eventId,
        adminId,
        status: 1,
      };
      const publishEventRes = await publishEvent(variables);
      if (publishEvent.statusCode === 200) {
        return resPopupRedirect(res, publishEventRes.message, `/admin/events/details?eventId=${eventId}`);
      }
      return resPopupRedirect(res, publishEventRes.message, `/admin/events/details?eventId=${eventId}`);
    } catch (error) {
      return resError(res, error);
    }
  }

  static async handleUnpublishEvent(req, res) {
    try {
      const { capabilityIds } = req.session;
      const { eventId } = req.query;
      const del = await deleteAdminEvent(eventId);
      console.log(del)

      if (del.statusCode === 200) {
        return resPopupRedirect(res, del.message, '/admin/events/manage');
      }
      return resPopupRedirect(res, del.message, '/admin/events/manage');
    } catch (error) {
      return resError(res, error);
    }
  }


  static async renderUnpublishedDetailsPage(req, res) {
    try {
       const { capabilityIds } = req.session;
      const { eventId } = req.query;
      const [lookupEvent, lookupAttendees, participants] = await Promise.all([
        getEventDetails(eventId),
        getEventAttendees(eventId),
        participantCategory(),
      ]);

      req.session.eventId = eventId 
     

      console.log("event details: ", lookupEvent);
      console.log("attendies: ", lookupAttendees);
      return res.render('fmda_admin/events/detailsedit', {
        lookupEvent, lookupAttendees, participants, capabilityIds, type: 'admin',
     });

    } catch (error) {
      return resError(res, error);
    }
  }

  static async updatepictureUpload(req, res) {

      var event_pics_array = [];
      var picsArray = req.files;
  
      for (let index = 0; index < picsArray.length; index++) {
              const picture = picsArray[index];
  
              // check that the event picture was uploaded
              if (picture) {
                // get the picture extension
                var fileExt = path.extname(path.join(__dirname) + "/public/events_pics_uploads/" + picture.originalname.replace("","%20") );
                console.log(fileExt);
  
                var imagePlusPath = "events_pics_uploads/" + picture.filename;
  
                // put into array
                event_pics_array.push(imagePlusPath);
  
                // check the file extension of the image
                if( ['.jpg', '.png', '.jpeg'].find(a => a === fileExt.toLowerCase()) === undefined ) {
                    return res.send(" '<script> alert('invalid type, jpg or png required'); </script>' " + "<script> window.location.href='/admin/events/create'; </script>");
                }
            }
      } // end of forLoop
  
      // console.log(event_variables_per_type);
      // console.log(event_pics_array);
  
      // console.log("participantCategory: ", typeof(req.body.participantCategory));
  
      if (typeof(req.body.participantCategory) == "string") {
          var the_participant_category = [];
          the_participant_category.push(req.body.participantCategory);
  
            if (event_pics_array) {
                    var event_param1 =  {        
                                          "title" : req.body.title,
                                          "images" : event_pics_array,
                                          "startDate" : Date.parse(req.body.startDate),
                                          "endDate" : Date.parse(req.body.endDate),
                                          "eventTime" : req.body.eventTime,
                                          "venue" : req.body.venue,
                                          "description": req.body.description,
                                          "participantCategory": the_participant_category
                                      }
                    
            }
  
            // empty the the_participant_category
            the_participant_category = " ";
      }else{
  
            if (event_pics_array) {
                    var event_param1 =  {        
                                          "title" : req.body.title,
                                          "images" : event_pics_array,
                                          "startDate" : Date.parse(req.body.startDate),
                                          "endDate" : Date.parse(req.body.endDate),
                                          "eventTime" : req.body.eventTime,
                                          "venue" : req.body.venue,
                                          "description": req.body.description,
                                          "participantCategory": req.body.participantCategory
                                      }
                    
            }
  
      }
  
  
      
  
  
      // keep event_param1 into session;
      req.session.event_param1 = event_param1;
      console.log("event params 1: ", event_param1);
  
      
      res.redirect("/admin/events/detailsUpdate2");
      
    }

    static async renderUnpublishedDetailsPagetwo (req, res) {
      try {
        const { capabilityIds } = req.session;
        return res.render('fmda_admin/events/detailsedit2', { capabilityIds });
        // const [lookupEvent, lookupAttendees, ] = await Promise.all([
        //   getEventDetails(eventId),
        //   getEventAttendees(eventId),
        // ]);
        // return res.render('fmda_admin/events/detailsedit2', { lookupEvent, lookupAttendees, capabilityIds, type: 'admin',});
      } catch (error) {
        return resError(res, error);
      }
  
    }

    static async handleUnpublishedDetailsPage (req, res) {


      // console.log(req.body);
      // console.log(req.session.event_param1);
  
      var the_obtainablePoints = [];
      var the_discounts = [];
      var the_customFee = [];
      
  
  
      var the_images = req.session.event_param1.images;
  
  
      if (req.body.isFree === "true") {
        var isFree = true;
      }else if(req.body.isFree === "false"){
        var isFree = false;
      }
  
      if (req.body.hasMaxPaticipants === "true") {
        var hasMaxPaticipants = true;
      }else if(req.body.hasMaxPaticipants === "false"){
        var hasMaxPaticipants = false;
      }
  
      if (req.body.requiresAttendeeConfirmation === "true") {
        var requiresAttendeeConfirmation = true;
      }else if(req.body.requiresAttendeeConfirmation === "false"){
        var requiresAttendeeConfirmation = false;
      }
  
      if (req.body.hasPoints === "true") {
        var hasPoints = true;
      }else if(req.body.hasPoints === "false"){
        var hasPoints = false;
      }
  
      if (req.body.hasDiscount === "true") {
        var hasDiscount = true;
      }else if(req.body.hasDiscount === "false"){
        var hasDiscount = false;
      }
  
  
      // obtainablePoints
      if (req.body.obtainablePoints) {
          var obtainable_Points = JSON.parse(req.body.obtainablePoints);
          for (let index = 0; index < obtainable_Points.length; index++) {
                if (obtainable_Points[index].pointValue != null) {
                    the_obtainablePoints.push(obtainable_Points[index]);
                }
          }
      }
  
  
      // discount
      if (req.body.discounts) {
          var discounts_percentage = JSON.parse(req.body.discounts);
          for (let index = 0; index < discounts_percentage.length; index++) {
              if (discounts_percentage[index].percentage != null) {
                the_discounts.push(discounts_percentage[index]);
              }
          }
      }
  
      // customFee
      if (req.body.customFee) {
        var customFee_amount = JSON.parse(req.body.customFee);
        for (let index = 0; index < customFee_amount.length; index++) {
            if (customFee_amount[index].amount != null) {
              the_customFee.push(customFee_amount[index]);
            }
        }
      }
      
  
  
      // check type of event
      if (req.body.type == 'Free') {
  
                                  var free_event = {     
                                    "title" : req.session.event_param1.title,
                                    "images" : the_images,
                                    "startDate" : req.session.event_param1.startDate.toString(),
                                    "endDate" : req.session.event_param1.endDate.toString(),
                                    "eventTime" : req.session.event_param1.eventTime,
                                    "venue" : req.session.event_param1.venue,
                                    "type": req.body.type,
                                    "description": req.session.event_param1.description,
                                    "participantCategory": req.session.event_param1.participantCategory,
                                    "isFree": isFree,
                                    // "feeType": req.body.feeType,
                                    // "customFee": JSON.parse(req.body.customFee),
                                    // "flatFee": req.body.flatFee,
                                    // "hasDiscount": req.body.hasDiscount,
                                    "hasMaxPaticipants": hasMaxPaticipants,
                                    "maxNumberOfPaticipants": parseInt(req.body.maxNumberOfPaticipants),
                                    "requiresAttendeeConfirmation": requiresAttendeeConfirmation,
                                    "hasPoints": hasPoints,
                                    "obtainablePoints": the_obtainablePoints,
                                    // "discounts": JSON.parse(req.body.discounts)
                              }
  
                              console.log("free_event: ", free_event);
                              req.session.event_variables_per_type = free_event;
  
      } else if (req.body.type == 'Paid') {
  
  
  
          if (req.body.feeType == "flatFee") {
            
                            var flatFee_event = {     
                              "title" : req.session.event_param1.title,
                              "images" : the_images,
                              "startDate" : req.session.event_param1.startDate.toString(),
                              "endDate" : req.session.event_param1.endDate.toString(),
                              "eventTime" : req.session.event_param1.eventTime,
                              "venue" : req.session.event_param1.venue,
                              "type": "Paid",
                              "description": req.session.event_param1.description,
                              "participantCategory": req.session.event_param1.participantCategory,
                              "isFree": isFree,
                              "feeType": "Flat",
                              // "customFee": JSON.parse(req.body.customFee),
                              "flatFee": parseInt(req.body.flatFee),
                              // "hasDiscount": req.body.hasDiscount,
                              "hasMaxPaticipants": hasMaxPaticipants,
                              "maxNumberOfPaticipants": parseInt(req.body.maxNumberOfPaticipants),
                              "requiresAttendeeConfirmation": requiresAttendeeConfirmation,
                              "hasPoints": hasPoints,
                              "obtainablePoints": the_obtainablePoints,
                              // "discounts": JSON.parse(req.body.discounts)
                        }
  
                        console.log(flatFee_event);
                        req.session.event_variables_per_type = flatFee_event;
  
          } else if (req.body.feeType == "custom") {
            
                              var Custom_event = {     
                                "title" : req.session.event_param1.title,
                                "images" : the_images,
                                "startDate" : req.session.event_param1.startDate.toString(),
                                "endDate" : req.session.event_param1.endDate.toString(),
                                "eventTime" : req.session.event_param1.eventTime,
                                "venue" : req.session.event_param1.venue,
                                "type": "Paid",
                                "description": req.session.event_param1.description,
                                "participantCategory": req.session.event_param1.participantCategory,
                                "isFree": isFree,
                                "feeType": "Custom",
                                "customFee": the_customFee,
                                // "flatFee": req.body.flatFee,
                                "hasDiscount": hasDiscount,
                                "hasMaxPaticipants": hasMaxPaticipants,
                                "maxNumberOfPaticipants": parseInt(req.body.maxNumberOfPaticipants),
                                "requiresAttendeeConfirmation": requiresAttendeeConfirmation,
                                "hasPoints": hasPoints,
                                "obtainablePoints": the_obtainablePoints,
                                "discounts": the_discounts
                          }
  
                          console.log(Custom_event);
                          req.session.event_variables_per_type = Custom_event;
  
          }
  
  
          
    }
  
    // req.session.event_variables_per_type
    // console.log("event_variables_per_type: ", req.session.event_variables_per_type);
  
  
      try {
        const adminId = req.session.officialEmail;
        const variables = req.session.event_variables_per_type;
        const  eventId  = req.session.eventId;
        console.log(eventId)
        const setupNewEvent = await updateEvent(variables, adminId, eventId);
        if (setupNewEvent.statusCode === 200) {
          return resPopupRedirect(res, setupNewEvent.message, '/admin/events/manage');
        }
        return resPopupRedirect(res, setupNewEvent.message, '/admin/events/manage');
      } catch (error) {
        return resError(res, error);
      }
  
    }

}

export default Admin_event_controller;
