import { Query_utils } from '../utils';

const { getResponse } = Query_utils;

/**
*@class Admin_payment_queries
*@description class for sending graphql queries related to payments
*@exports Admin_payment_queries
*/

class Admin_payment_queries {
  /**
   * @name getPaymentHistory
   * @type graphl query
   * @description gets a list of all payments made
   * @returns { object } paymentHistory
   * @memberof Admin_payment_queries
   */
  static async getPaymentHistory() {
    const query = {
      query: '{ paymentHistory(status: 3) { userId depositorName status paymentReferenceNo amount paymentDate purpose invoiceNumber } }',
    };
    const { paymentHistory } = await getResponse(query);
    return paymentHistory;
  }

  /**
   * @name getUnprocessedPaymentHistory
   * @type graphl query
   * @description gets a list of all payments made
   * @returns { object } paymentHistory
   * @memberof Admin_payment_queries
   */
  static async getUnprocessedPaymentHistory() {
    const query = {
      query: '{ paymentHistory(status: 0) { userId depositorName status paymentReferenceNo amount paymentDate purpose invoiceNumber } }',
    };
    const { paymentHistory } = await getResponse(query);
    // console.log(paymentHistory);
    return paymentHistory;
  }

  /**
   * @name getApprovedPaymentHistory
   * @type graphl query
   * @description gets a list of all payments made
   * @returns { object } paymentHistory
   * @memberof Admin_payment_queries
   */
  static async getApprovedPaymentHistory() {
    const query = {
      query: '{ paymentHistory(status: 1) { userId depositorName status paymentReferenceNo amount paymentDate purpose invoiceNumber } }',
    };
    const { paymentHistory } = await getResponse(query);
    return paymentHistory;
  }

  /**
   * @name getDeclinedPaymentHistory
   * @type graphl query
   * @description gets a list of all payments made
   * @returns { object } paymentHistory
   * @memberof Admin_payment_queries
   */
  static async getDeclinedPaymentHistory() {
    const query = {
      query: '{ paymentHistory(status: -1) { userId depositorName status paymentReferenceNo amount paymentDate purpose invoiceNumber } }',
    };
    const { paymentHistory } = await getResponse(query);
    return paymentHistory;
  }

  /**
   * @name lookUpPayment
   * @type graphl query
   * @description gets detailed information about a single payment
   * @param { number } ref the reference number
   * @returns { object } lookupPaymentDetails
   * @memberof Admin_payment_queries
   */
  static async lookUpPayment(ref) {
    const query = {
      query: `{ lookupPaymentDetails(ref: \"${ref}\") {id userId depositorName paymentReferenceNo amount paymentDate bank status accountName accountNumber }  }`,
    };
    const { lookupPaymentDetails } = await getResponse(query);
    return lookupPaymentDetails;
  }


  /**
   * @name approvePaymentForPaidEvent
   * @type graphl mutation
   * @description approve a payment record for paid event
   * @param { object } variables
   * @returns { object } verifyMember
   * @memberof Admin_payment_queries
   */
  static async approvePaymentForPaidEvent(variables) {
    const query = {
      "operationName": "validateEventPaymentMutation",
      "query": "mutation validateEventPaymentMutation { validateEventPayment{statusCode message} }",
      "variables" : variables,
    };
    const { validateEventPayment } = await getResponse(query);
    // console.log(validateEventPayment);
    return validateEventPayment;
  }


  /**
   * @name approvePayment
   * @type graphl mutation
   * @description approve a payment record
   * @param { object } variables
   * @returns { object } verifyMember
   * @memberof Admin_payment_queries
   */
  static async approvePayment(variables) {
    const query = {
      operationName: 'validatePaymentMutation',
      query: 'mutation validatePaymentMutation { validatePayment{statusCode message} }',
      "variables" : variables,
    };
    console.log(query);
    const { validatePayment } = await getResponse(query);
    console.log(validatePayment);
    return validatePayment;
  }



}

export default Admin_payment_queries;
