import { Res_utils } from '../utils';
import { General_queries, Admin_corp_queries } from '../queries';

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
  handle_push_for_review
} = Admin_corp_queries;

/**
*@class Admin_corp_controller
*@description Controllers for handling creation and management of corporate members
*@exports Admin_corp_controller
*/
class Admin_corp_controller {
  /**
   * @name renderCpMemberRequestsPage
   * @description renders the page containing all the corporate membership requests
   */
  static async renderCpMemberRequestsPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      let corporateRequests = await getCorporateRequests();
      // corporateRequests = corporateRequests
      //   .filter((item) => item.hasBeenCreated === false);
      return res.render('fmda_admin/cp_member/corp_requests', { data: corporateRequests, action: 'create', capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }



  
  /** 
   * @name renderCorp_request_details
   * @description renders the page for vshowing corporate member details
   */
  static async renderCorp_request_details(req, res) {
    try {
      const { capabilityIds } = req.session;
      const corporate = await lookUpCpMember(req.query.id);
      
      console.log(corporate);
      return res.render('fmda_admin/cp_member/corp_request_details', { corporate, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }



  /**
   * @name renderCreateCpMemberPage
   * @description renders the page for creation of corporate member
   */
  static async renderCreateCpMemberPage(req, res) {
    const { id } = req.query;


    try {
      const { capabilityIds } = req.session;
      const [
        corporate, organisations, financialInstitutions, memberTypes,
      ] = await Promise.all([
        lookUpCpMember(id),
        getOrganisations(),
        getFinancialInstitutions(),
        getMemberTypes(),
      ]);
      return res.render('fmda_admin/cp_member/create_corporate_member', {
        corporate, financialInstitutions, memberTypes, organisations, capabilityIds,
      });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name createNewOrganisaion
   * @description renders a section to allow an admin create an organisation on the fly
   */
  static async createNewOrganisaion(req, res) {
    try {
      const addOrganisation = await createOrganisation(req.body);
      const organisations = await getOrganisations();
      if (addOrganisation.statusCode === 200) {
        return res.render('fmda_admin/includes/snippets/organisations', { data: organisations });
      }
      return false;
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleCreateCpMember
   * @description handles the creation of a corporate member
   */
  static async handleCreateCpMember(req, res) {
    
    try {
      const { id } = req.params;
      // destructure the organisation info which comes as a concatenated string
      const [organisationName, organisationId] = req.body.organisation.split(',');
      delete req.body.organisation;
      const { bankers } = req.body;
      const variables = {
        organisationName,
        organisationId,
        ...req.body,
        bankers: typeof bankers === 'string' ? [bankers] : [...bankers], // convert the list of bankers to an array
      };
      const addCorporateMember = await createCpMember(variables, id);
      if (addCorporateMember.statusCode === 200) {
        return resPopupRedirect(res, addCorporateMember.message, '/admin/corporate_member/membership_requests');
      }
      return resPopupRedirect(res, addCorporateMember.message, '/admin/corporate_member/membership_requests');
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderVerifyCpRequestsPage
   * @description renders the page showing corporate members awaiting verification requests
   */
  static async renderVerifyCpRequestsPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      let corporateRequests = await getCorporateRequests();
      console.log(corporateRequests);
      // filter to show pending verification, failed verification and failed approval 
      // corporateRequests = corporateRequests
      //   .filter((item) => item.hasBeenCreated === true || item.hasBeenVerified !== 1 || item.has);
      return res.render('fmda_admin/cp_member/requests', { data: corporateRequests, action: 'verify', capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /** 
   * @name renderVerifyCpMemberPage
   * @description renders the page for verifying a single corporate member
   */
  static async renderVerifyCpMemberPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const corporate = await lookUpCpMember(req.query.id);
      
      console.log(corporate);
      return res.render('fmda_admin/cp_member/verify_corporate_member', { corporate, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleVerifyCpMember
   * @description handles the verification of a corporate member
   */
  static async handleVerifyCpMember(req, res) { 

    // console.log(req.session.adminDetailsInSession.adminLogin.data.officialEmail);

    var loggedInAdminEmail = req.session.adminDetailsInSession.adminLogin.data.officialEmail;
    try {
      // const variables = {
      //   ...req.params,
      //   ...req.body,
      //   verificationStatus: req.body.verificationStatus === 'verify',
      // };

      const variables = {
        "userId": req.params.userId,
        "verifierId": loggedInAdminEmail,
        "verifierComment": req.body.verifierComment,
        "verificationStatus": true
      
      };
      const verifyCorporateMember = await verifyCpMember(variables);

      console.log(verifyCorporateMember);

      if (verifyCorporateMember.statusCode === 200) {
        return resPopupRedirect(res, verifyCorporateMember.message, '/admin/corporate_member/verification_request');
      }
      return resPopupRedirect(res, verifyCorporateMember.message, '/admin/corporate_member/verification_request');
    } catch (error) {
      return resError(res, error);
    }


  }

  /**
   * @name renderApproveCpRequestsPage
   * @description renders the page showing corporate members awaiting approval requests
   */
  static async renderApproveCpRequestsPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      // const verifiedCorporateMembers = await getApproveCpRequests();
      const verifiedCorporateMembers = await getApproveCpRequests();
      // console.log(verifiedCorporateMembers);
      return res.render('fmda_admin/cp_member/requests2', { data: verifiedCorporateMembers, action: 'approve', capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderApproveCpMemberPage
   * @description renders the page for approving a single corporate member
   */
  static async renderApproveCpMemberPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const corporate = await lookUpCpMember(req.query.id);
      return res.render('fmda_admin/cp_member/approve_corporate_member', { corporate, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleApproveCpMember
   * @description renders the page for approving a single corporate member
   */
  static async handleApproveCpMember(req, res) {
    try {
      const variables = {
        ...req.params,
        ...req.body,
        approvalStatus: req.body.approvalStatus === 'approve',
      };
      const approveCorporateMember = await approveCpMember(variables);
      return resPopupRedirect(res, approveCorporateMember.message, '/admin/corporate_member/approval_request');
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderCpMembersPage
   * @description renders the page showing a list of all approved corporate members
   */
  static async renderCpMembersPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const corporateMembers = await getApprovedCpMembers();
      return res.render('fmda_admin/cp_member/approved_requests', { data: corporateMembers, action: 'view', capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderCpMemberDetailsPage
   * @description renders the page for verifying a single corporate member
   */
  static async renderCpMemberDetailsPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const corporate = await lookUpCpMember(req.query.id);
      return res.render('fmda_admin/cp_member/details', { corporate, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }




  
  static async handle_viewObjectionsMade(req, res) {
    // console.log(req.query.id);
    try {
      const { capabilityIds } = req.session;
      const get_corporateMemberObjection = await getApproveCpRequests();
      // console.log(JSON.stringify(get_corporateMemberObjection));

      var memberObjection = get_corporateMemberObjection.filter((getObjectionDetails)=>{
        return getObjectionDetails.id == req.query.id;
      });

      console.log("contactOfficialEmail: " + memberObjection[0].contactOfficialEmail)

      console.log("memberObjection: ", memberObjection[0].objections);

      return res.render('fmda_admin/cp_member/viewMemberObjections', { data: memberObjection[0].objections, contactOfficialEmail: memberObjection[0].contactOfficialEmail, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }



  
  static async handle_push_for_review(req, res) {
    // var loggedInAdminEmail = req.session.adminDetailsInSession.adminLogin.data.officialEmail;
    var newCorpRequestContactOfficialEmail = req.query.contactOfficialEmail;
    try {
      const { capabilityIds } = req.session;
      const raiseDeligince = await handle_push_for_review(newCorpRequestContactOfficialEmail, req.query.member_id, req.query.reason);

      // console.log(raiseDeligince);
      
     if (raiseDeligince.statusCode == 200) {
        res.send(" '<script> alert(' Pushed for review. Thank You. '); </script>' " + 
        "<script> window.location.href='/admin/corporate_member/approval_request'; </script>");
        return;
     } else {
        res.send(" '<script> alert(' Unable to pushed for review. Contact the admin. '); </script>' " + 
        "<script> window.location.href='/admin/corporate_member/approval_request'; </script>");
        return;
     };
    } catch (error) {
      return resError(res, error);
    }
  }




  
  static async viewDetailAndObjectionsCount(req, res) {
    // console.log(req.query.id);
    try {
      const { capabilityIds } = req.session;
      const get_corporateMemberObjection = await getApproveCpRequests();
      // console.log(JSON.stringify(get_corporateMemberObjection));

      var memberObjection = get_corporateMemberObjection.filter((getObjectionDetails)=>{
        return getObjectionDetails.id == req.query.id;
      });

      // console.log("memberObjection: ", memberObjection);

      return res.render('fmda_admin/cp_member/viewDetailAndObjectionsCount', { data: memberObjection, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }




  
  static async approveTheCorporateRequest(req, res) {
    var loggedInAdminEmail = req.session.adminDetailsInSession.adminLogin.data.officialEmail;

    console.log(req.body);

    if (req.body.action == "approve") {
        var approvalStatus = true;
    } else {
      var approvalStatus = false;
    }

    var variablesToPass = {
                            "userId": req.body.userId,
                            "approvalId": loggedInAdminEmail,
                            "approvalStatus": approvalStatus,
                            "ApprovalComment": req.body.approverComment
                        };

    // console.log(variablesToPass);

    try {
      const { capabilityIds } = req.session;
      const approveCorporateMember = await approveCpMember(variablesToPass);

      // console.log(approveCorporateMember);
      
     if (approveCorporateMember.statusCode == 200) {

          if (approveCorporateMember.message == 'approval successful. ') {
            res.send(" '<script> alert(' Corporate Request Approved. Thank You. '); </script>' " + 
            "<script> window.location.href='/admin/corporate_member/approval_request'; </script>");
            return;
          } else {
            res.send(" '<script> alert(' Corporate Request Rejected. Thank You. '); </script>' " + 
            "<script> window.location.href='/admin/corporate_member/approval_request'; </script>");
            return;
          }
          
     } else {
        res.send(" '<script> alert(' Unable to approve corporate request. Contact the admin. '); </script>' " + 
        "<script> window.location.href='/admin/corporate_member/approval_request'; </script>");
        return;
     };
    } catch (error) {
      return resError(res, error);
    }
  }




  static async approveTheCorporateRequestAjax(req, res) {
    var loggedInAdminEmail = req.session.adminDetailsInSession.adminLogin.data.officialEmail;

    console.log(req.body);

    if (req.body.action == "approve") {
        var approvalStatus = true;
    } else {
      var approvalStatus = false;
    }

    var variablesToPass = {
                            "userId": req.body.userId,
                            "approverId": loggedInAdminEmail,
                            "approvalStatus": approvalStatus,
                            "approverComment": req.body.approverComment
                        };

    console.log(variablesToPass);

    try {
      const { capabilityIds } = req.session;
      const approveCorporateMember = await approveCpMember(variablesToPass);

      console.log(approveCorporateMember);
      
     if (approveCorporateMember.statusCode == 200) {
          if (approveCorporateMember.message == 'Approval Completed !') {
            res.send("Corporate Request Approved. Thank You");
            return;
          } else {
            res.send(approveCorporateMember.message);
            return;
          }          
     } else {
        res.send("Unable to approve corporate request. Contact the admin.");
        return;
     };
    } catch (error) {
      return resError(res, error);
    }
  }






}

export default Admin_corp_controller;
