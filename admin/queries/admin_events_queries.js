import { Query_utils } from '../utils';

const { getResponse } = Query_utils;

/**
*@class Admin_events_queries
*@description class for sending graphql queries related to creation and management of FMDA events
*@exports Admin_events_queries
*/

class Admin_events_queries {
  /**
   * @name getAllEvents
   * @type graphl query
   * @description gets a list of all fmda events
   */
  static async getAllEvents() {
    const query = {
      query: '{ events {id title images startDate endDate eventTime type description participantCategory obtainablePoints{pointName pointValue} discounts{discountName percentage} datePosted eventUploaderId flatFee feeType customFee{name amount} isFree hasDiscount hasPoints maxNumberOfPaticipants requiresAttendeeConfirmation status} }',
    };
    const { events } = await getResponse(query);
    return events;
  }

  /**
   * @name createEvent
   * @type graphl mutation
   * @description allows an admin create a new event
   * @param { object } variables
   * @param { number } adminId the id of the admin creating the event
   */
  static async createEvent(variables, adminId) {
    const query = {
      operationName: 'setupNewEventMutation',
      query: `mutation setupNewEventMutation { setupNewEvent(adminId:  \"${adminId}\"){statusCode message} }`,
      variables,
    };
    const { setupNewEvent } = await getResponse(query);
    return setupNewEvent;
  }

    /**
   * @name createEvent
   * @type graphl mutation
   * @description allows an admin update a new event
   * @param { object } variables
   * @param { number } adminId the id of the admin updating the event
   */
  static async updateEvent(variables, adminId, eventId) {
    const query = {
      operationName: 'updateEventMutation',
      query: `mutation updateEventMutation { updateEvent(adminId: \"${adminId}\", eventId: \"${eventId}\"){statusCode message} }`,
      variables,
    };
    const { updateEvent } = await getResponse(query);
    return updateEvent;
  }

  /**
   * @name publishEvent
   * @type graphl mutation
   * @description Allows an admin to publish an already created event
   * @param { object } variables
   */
  static async publishEvent(variables) {
    const query = {
      operationName: 'publishEventMutation',
      query: 'mutation publishEventMutation { publishEvent{statusCode message} }',
      variables,
    };
    const { publishEvent } = await getResponse(query);
    return publishEvent;
  }

  /**
   * @name getEventAttendees
   * @type graphl query
   * @description returns a list of all the people who have registered for an event
   * @param { number } adminId the id of the admin creating the event
   */
  static async getEventAttendees(eventId) {
    const query = {
      query: `{ lookupAttendees (eventId: \"${eventId}\") {firstName lastName gender memberUUID mobileNumber memberType membershipCategory currentOrganisation profilePhoto certificationType industryCategory industryType accruedPoints }}`,
    };
    const { lookupAttendees } = await getResponse(query);
    return lookupAttendees;
  }

  /**
   * @name getEventDetails
   * @type graphl query
   * @description returns the details of a particular event ( incomplete !!!)
   * @param { number } adminId the id of the admin creating the event
   */
  static async getEventDetails(eventId) {
    const query = {
      query: `{ lookupEvent(eventId: \"${eventId}\") {id title images startDate endDate eventTime type description participantCategory obtainablePoints{pointName pointValue} discounts{discountName percentage} datePosted eventUploaderId flatFee feeType customFee{name amount} isFree hasDiscount hasPoints maxNumberOfPaticipants requiresAttendeeConfirmation status} }`,
    };
    const { lookupEvent } = await getResponse(query);
    return lookupEvent;
  }


  /**
   * @name participantCategory
   * @type graphl query
   */
  static async participantCategory() {
    const query = {
                      "query": "{ participants { name } }"
                  };
    const { participants } = await getResponse(query);
    return participants;
  }

  
  static async deleteAdminEvent(eventId) {
    const query = {
      operationName: 'deleteEventMutation',
      query: `mutation deleteEventMutation { deleteEvent(eventId: \"${eventId}\") {statusCode message } }`
  }
    const { deleteEvent } = await getResponse(query);
    return deleteEvent;
  }

   /**
   * @name show_payment_history
   * @type graphl query
   */
  static async show_payment_history() {
    // (status : 0) UnProcessed payment
    const query = {
      "query": "{ paymentHistory(status: 0) {id userId depositorName paymentReferenceNo amount paymentDate transactionDate eventId eventName bank accountName accountNumber status purpose } }"
  };
    const { paymentHistory } = await getResponse(query);
    return paymentHistory;
  }




   /**
   * @name validate_member_event_paymentNow
   * @type graphl query
   */
  static async validate_member_event_paymentNow(userId, paymentRef, adminId, status) {
    const query = {
      "operationName": "validateEventPaymentMutation",
      "query": "mutation validateEventPaymentMutation { validateEventPayment{statusCode message} }",
      "variables": {
          "userId": userId,
          "paymentRef": paymentRef,
          "adminId": adminId,
          "status": status
      }
  };
   
    console.log(query);

    const { validateEventPayment } = await getResponse(query);

    console.log(validateEventPayment);

    return validateEventPayment;
  }




}

export default Admin_events_queries;
