import { Res_utils } from '../utils';
import { General_queries, Admin_corp_queries, Admin_ind_queries, admin_generate_invoices_queries } from '../queries';

const {
  resError, resPopupRedirect, resRedirect,
} = Res_utils;

const {
  getOrganisations,
  getFinancialInstitutions,
  getMemberTypes,
} = General_queries;

const {
  lookUpCpMember,
  getCorporateRequests,
  createCpMember,
  createOrganisation,
  verifyCpMember,
  getApproveCpRequests,
  approveCpMember,
  getApprovedCpMembers,
} = Admin_corp_queries;


const {
    lookUpMember,
    getMembershipRequestsList,
    getMembershipRequests,
    verifyMemberMutation,
    approveMemberMutation,
    getMemberApproveRequests,
    addOrganisation,
    getApprovedMembers,
    disable_or_enable_member,
  } = Admin_ind_queries;





const {
    annualInvoice_ind,
    annualInvoice_corp
} = admin_generate_invoices_queries;



/**
*@class admin_generate_invoices_controller
*@description Controllers for handling admin creation of invoices
*@exports admin_generate_invoices_controller
*/
class admin_generate_invoices_controller {
  
  /**
   * @name annualInvoice
   * @description renders the page showing a list of all approved corporate members
   */
  static async annualInvoice(req, res) {

    // console.log("about to generate invoice...");

    try {
      const { capabilityIds } = req.session;
      return res.render('fmda_admin/invoices/annual_invoice', { capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }



  /**
   * @name annualInvoiceFromManageMemberMenu
   * @description renders the page for verifying a single corporate member
   */
  static async annualInvoiceFromManageMemberMenu(req, res) {

    // console.log(req.query.type);
    // console.log(req.query.memberID);

    try {

      if (req.query.type == "individual") {
        var annualInvoice = await annualInvoice_ind(req.query.memberID);
      } 
      else if (req.query.type == "corporate"){
        var annualInvoice = await annualInvoice_corp(req.query.memberID);
      }

      if (annualInvoice.message == "Successful!") {
        res.send(
          " '<script> alert('Annual invoice generated successfully.'); </script>' "
          + "<script> window.location.href='/admin/dashboard'; </script>"
          );

          return;
      } else {
        res.send(
          " '<script> alert('Unable to generate annual invoice, try again OR contact the admin.'); </script>' "
          + "<script> window.location.href='/admin/dashboard'; </script>"
          );

          return;
      }      
    } catch (error) {
      return resError(res, error);
    }
  }




  /**
   * @name handleAnnualInvoice
   * @description renders the page for verifying a single corporate member
   */
  static async handleAnnualInvoice(req, res) {

    try {

      if (req.body.type == "individual") {
        var annualInvoice = await annualInvoice_ind(req.body.memberID);
      } 
      else if (req.body.type == "corporate"){
        var annualInvoice = await annualInvoice_corp(req.body.memberID);
      }

      if (annualInvoice.message == "Successful!") {
        res.send(
          " '<script> alert('Annual invoice generated successfully.'); </script>' "
          + "<script> window.location.href='/admin/generateInvoice/annualInvoice'; </script>"
          );

          return;
      } else {
        res.send(
          " '<script> alert('Unable to generate annual invoice, try again OR contact the admin.'); </script>' "
          + "<script> window.location.href='/admin/generateInvoice/annualInvoice'; </script>"
          );

          return;
      }      
    } catch (error) {
      return resError(res, error);
    }
  }



}

export default admin_generate_invoices_controller;
