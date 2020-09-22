import { Res_utils } from '../utils';
import { General_queries, Admin_corp_queries, Admin_dealers_queries } from '../queries';

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


const { newDealersRequest, handleNewDealers } = Admin_dealers_queries;

/**
*@class Admin_dealers_controllers
*@description Controllers for handling creation and management of corporate members
*@exports Admin_dealers_controllers
*/
class Admin_dealers_controllers {
  
  /**
   * @name newDealersPage
   * @description renders the page showing a list of all approved corporate members
   */
  static async newDealersPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const new_dealers_request = await newDealersRequest();
      return res.render('fmda_admin/dealers/newDealersPage', { data: new_dealers_request, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleNewDealers
   * @description renders the page for verifying a single corporate member
   */
  static async handleNewDealers(req, res) {

    const adminId = req.session.officialEmail;
    const requestId = req.query.id;
    
    if (req.query.action == "publish") {
        var status = true;
    } else if(req.query.action == "decline"){
        var status = false;
    }

    try {
      const publishNewDealer = await handleNewDealers(requestId, adminId, status);
      if (publishNewDealer.statusCode === 200) {
        return resPopupRedirect(res, publishNewDealer.message, '/admin/dealers/newDealers');
      }
    } catch (error) {
      return resError(res, error);
    }


  }


  /**
   * @name dealerList
   * @description renders the page showing a list of all approved corporate members
   */
  static async dealerList(req, res) {
    try {
      const { capabilityIds } = req.session;
      const new_dealers_request = await newDealersRequest();
      return res.render('fmda_admin/dealers/dealerList', { data: new_dealers_request, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }



}

export default Admin_dealers_controllers;
