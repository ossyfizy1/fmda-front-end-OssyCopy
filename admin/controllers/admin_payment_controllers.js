import { Res_utils } from '../utils';
import { Admin_payment_queries } from '../queries';

const {
  resError, resPopupRedirect, resRedirect, resRedirectBack,
} = Res_utils;

const {
  getPaymentHistory,
  lookUpPayment,
  getApprovedPaymentHistory,
  getDeclinedPaymentHistory,
  getUnprocessedPaymentHistory,
  approvePaymentForPaidEvent,
  approvePayment
} = Admin_payment_queries;

/**
*@class Admin_payment_controller
*@description Controllers for handling verification and approval of payments
*@exports Admin_payment_controller
*/
class Admin_payment_controller {
  /**
   * @name renderPaymentsHistoryPage
   * @description renders the page containing all the payments that have been made
   * @param { object } req
   * @param { object } res
   * @memberof Admin_payment_controller
   */
  static async renderPaymentsHistoryPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const paymentHistory = await getPaymentHistory();
      return res.render('fmda_admin/payment/payments', { paymentHistory, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderUnprocessedPaymentsPage
   * @description renders the page containing all unprocessed payment history
   * @param { object } req
   * @param { object } res
   * @memberof Admin_payment_controller
   */
  static async renderUnprocessedPaymentsPage(req, res) { 
    try {
      const { capabilityIds } = req.session;
      const paymentHistory = await getUnprocessedPaymentHistory();
      return res.render('fmda_admin/payment/payments', { paymentHistory, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderDeclinedPaymentsPage
   * @description renders the page containing all declined payment history
   * @param { object } req
   * @param { object } res
   * @memberof Admin_payment_controller
   */
  static async renderDeclinedPaymentsPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const paymentHistory = await getDeclinedPaymentHistory();
      return res.render('fmda_admin/payment/payments', { paymentHistory, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderApprovedPaymentsPage
   * @description renders the page containing all approved payment history
   * @param { object } req
   * @param { object } res
   * @memberof Admin_payment_controller
   */
  static async renderApprovedPaymentsPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const paymentHistory = await getApprovedPaymentHistory();
      return res.render('fmda_admin/payment/payments', { paymentHistory, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderPaymentDetailsPage
   * @description renders the page for displaying the payment details of a single payment
   * @param { object } _req
   * @param { object } res
   * @memberof Admin_payment_controller
   */
  static async renderPaymentDetailsPage(req, res) {
    try {
      var purpose = req.query.purpose;
      var invoiceNumber = req.query.invoiceNumber;
      const { capabilityIds, officialEmail } = req.session;
      const lookupPaymentDetails = await lookUpPayment(req.query.refNo);
      return res.render('fmda_admin/payment/verify_payment', { purpose, invoiceNumber, lookupPaymentDetails, capabilityIds, officialEmail });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleValidatePayment
   * @description handles the validation of payments made to fmda
   * @param { object } _req
   * @param { object } res
   * @memberof Admin_payment_controller
   */
  static async handleValidatePayment(req, res) {
    try {
      const variables = {
        "userId": req.params.userId,
        "paymentRef": req.params.paymentRef,
        "adminId": req.params.adminId,
        "invoiceNumber":  req.params.invoiceNumber,
        "status": parseInt(req.body.status)
      };

      // console.log(variables);
      // console.log("purpose: ", req.params.purpose);

      // for paid event
      if ( req.params.purpose == "Event registration" ) {
          // console.log("found")
          const validateEventPayment = await approvePaymentForPaidEvent(variables);
          if (validateEventPayment.statusCode == 200) {
              // return resRedirectBack(res);
            return resPopupRedirect(res, validateEventPayment.message, '/admin/payments/details?refNo='+req.params.paymentRef+"&purpose="+req.params.purpose+"&invoiceNumber="+req.params.invoiceNumber);
          }
      }
      else{
        // console.log("not found")
        // for other forms of payments
        const validatePayment = await approvePayment(variables); 
        if (validatePayment.statusCode == 200) {
            // return resRedirectBack(res);
            return resPopupRedirect(res, validatePayment.message, '/admin/payments/details?refNo='+req.params.paymentRef+"&purpose="+req.params.purpose+"&invoiceNumber="+req.params.invoiceNumber);
        }
        
      }
      
    } catch (error) {
      return resError(res, error);
    }
  }

  

}

export default Admin_payment_controller;
