
import { Res_utils } from '../utils';
import { Admin_ind_queries, General_queries } from '../queries';
var xlsx = require('node-xlsx').default;
// require the path module
var path = require("path");

const {
  resError, resPopupRedirect, resRedirect,
} = Res_utils;

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
  submit_bulk_upload,
} = Admin_ind_queries;

const {
  getOrganisations,
  getMemberCategories,
  getRoles,
  getMemberTypes,
} = General_queries;

/**
*@class Admin_ind_controller
*@description Controllers for handling creation and management of fmda members
*@exports Admin_ind_controller
*/
class Admin_ind_controller {
   /**
   * @name renderMemberRequestsListPage
   * @description renders the page showing all members on the system still undergoing onboarding
   * @param { object } req
   * @param { object } res
   * @memberof Admin_ind_controller
   */
  static async renderMemberRequestsListPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      let membershipRequests = await getMembershipRequestsList();
      console.log(membershipRequests)
      return res.render('fmda_admin/ind_member/membership_requests_list', { data: membershipRequests, action: 'view', capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderVerifyMemberRequestsPage
   * @description renders the page showing al members awaiting verification requests
   * @param { object } req
   * @param { object } res
   * @memberof Admin_ind_controller
   */
  static async renderVerifyMemberRequestsPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      let membershipRequests = await getMembershipRequests();
      // membershipRequests = membershipRequests
      //   .filter((item) => item.hasBeenVerified === 0 || item.hasBeenApproved === -1);
      return res.render('fmda_admin/ind_member/requests', { data: membershipRequests, action: 'verify', capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderVerifyMemberPage
   * @description renders the page for verifying a single Individual member
   * @param { object } _req
   * @param { object } res
   * @memberof Admin_ind_controller
   */
  static async renderVerifyMemberPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const [
        member, membershipCategories, lookUpRoles, memberTypes, organisations,
      ] = await Promise.all([
        lookUpMember(req.query.id),
        getMemberCategories(),
        getRoles(),
        getMemberTypes(),
        getOrganisations(),
      ]);
      return res.render('fmda_admin/ind_member/verify_member', {
        member, membershipCategories, lookUpRoles, memberTypes, organisations, capabilityIds,
      });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name addOrganisationMember
   * @description renders a section to allow an admin create an organisation on the fly
   * @param { object } req
   * @param { object } res
   * @memberof Admin_ind_controller
   */
  static async addOrganisationMember(req, res) {
    try {
      const addOrganisationForMember = await addOrganisation(req.body);
      const organisations = await getOrganisations();
      if (addOrganisationForMember.statusCode === 200) {
        return res.render('fmda_admin/includes/snippets/organisations', { data: organisations });
      }
      return false;
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleVerifyMember
   * @description handles the verification of an Individual member
   * @param { object } _req
   * @param { object } res
   * @memberof Admin_ind_controller
   */
  static async handleVerifyMember(req, res) {
    try {
      const variables = {
        ...req.query,
        ...req.body,
        verificationStatus: req.body.verificationStatus === 'verify',
      };
      const verifyMember = await verifyMemberMutation(variables);
      if (verifyMember.statusCode === 200) {
        return resRedirect(res, '/admin/individual_member/verification_request');
      }
      return resPopupRedirect(res, verifyMember.message, '/admin/individual_member/verification_request');
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderMemberApproveRequestsPage
   * @description renders the page showing all individual members awaiting approval
   * @param { object } req
   * @param { object } res
   * @memberof Admin_ind_controller
   */
  static async renderMemberApproveRequestsPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const verifiedMembers = await getMemberApproveRequests();
      return res.render('fmda_admin/ind_member/requests', { data: verifiedMembers, action: 'approve', capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderApproveMemberPage
   * @description renders the page for approving a single member
   * @param { object } req
   * @param { object } res
   * @memberof Admin_ind_controller
   */
  static async renderApproveMemberPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const member = await lookUpMember(req.query.id);
      return res.render('fmda_admin/ind_member/approve_member', { member, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleApproveMember
   * @description renders the page for approving a single member
   * @param { object } _req
   * @param { object } res
   * @memberof Admin_ind_controller
   */
  static async handleApproveMember(req, res) {
    try {
      const variables = {
        ...req.params,
        ...req.body,
        approvalStatus: req.body.approvalStatus === 'approve',
      };
      const approveMember = await approveMemberMutation(variables);
      return resPopupRedirect(res, approveMember.message, '/admin/individual_member/approval_request');
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderMembersPage
   * @description renders the page showing a list of all approved individual members
   */
  static async renderMembersPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const members = await getApprovedMembers();
      return res.render('fmda_admin/ind_member/requests', { data: members, action: 'view', capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderMemberDetailsPage
   * @description renders the page showing the details of an individual member
   */
  static async renderMemberDetailsPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const member = await lookUpMember(req.query.id);
      return res.render('fmda_admin/ind_member/details', { member, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }


  static async renderMembershipRequestInformationPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      let members = await getMembershipRequestsList();
      
      var member =  members.filter(function(member) {
        return member.id == req.query.id;
        
      });
      console.log(member)
      member = member[0]

      console.log(req.query.id);
      return res.render('fmda_admin/ind_member/RequestDetails', { member, capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  
  }


  
  static async handle_disable_or_enable_member(req, res) {

    // console.log(req.query.memberUUID);
    // console.log(req.query.status);
    // console.log(req.query.email);

    var email = req.query.email;

    try {
      const { capabilityIds } = req.session;
      const disable_or_enable = await disable_or_enable_member(req.query.memberUUID, req.query.status);
      return res.redirect('/admin/individual_member/view_member?id='+req.query.email);

    } catch (error) {
      return resError(res, error);
    }
  }


  
  static async ind_bulk_upload(req, res) {
    try {
      const { capabilityIds } = req.session;
      
      return res.render('fmda_admin/ind_member/ind_bulk_upload', { capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }




  
  static async display_ind_bulk_upload(req, res) {

      console.log(req.body);
      console.log(req.file);

      try {
            const { capabilityIds } = req.session;

            if (req.file) 
            {
                // check the file extension for pdf type
                if (path.extname(path.join(__dirname) + "/public/ind_bulk_upload/" + req.file.originalname) !== '.xlsx') {
                    res.send(" '<script> alert('invalid file type, excel with xlsx extention required'); </script>' " 
                    + "<script> window.location.href='/ind_bulk_upload'; </script>");

                    return;
                }
                else{

                    // convert to an array
                    var theParsedExcelFile = [];

                    // Parse a file OR read the excel file
                    const workSheetsFromFile = xlsx.parse("public/ind_bulk_upload/" + req.file.filename);
                    // console.log(workSheetsFromFile);

                    // console.log("rows/length of the array: ", JSON.stringify(workSheetsFromFile[0].data.length) );
                    // console.log(JSON.stringify(workSheetsFromFile[0].data));

                    var rowsReturned = workSheetsFromFile[0].data;

                    // rowsReturned.forEach(rowsReturned => {
                    //   theParsedExcelFile.push(rowsReturned);
                    // });


                    // using shift to remove the first element in the array, which is the excel sheet header
                    workSheetsFromFile[0].data.shift(); 


                    for (let index = 0; index < rowsReturned.length; index++) {

                          if(rowsReturned[index].length > 0){

                                  var excel_row = {
                                                // serial_number : rowsReturned[index][0],
                                                memberUUID : rowsReturned[index][1].toString(),
                                                certificateNumber : rowsReturned[index][2].toString(),
                                                firstName : rowsReturned[index][3].toString(),
                                                lastName : rowsReturned[index][4].toString(),
                                                membershipCategory : rowsReturned[index][5].toString(),
                                                currentOrganisation : rowsReturned[index][6].toString(),
                                                currentOrganisationId : rowsReturned[index][7].toString(),
                                                address : rowsReturned[index][8].toString(),
                                                yearsOfPostNyscExperience : rowsReturned[index][9].toString(),
                                                // exemptionStatus : rowsReturned[index][10],
                                                personalEmail : rowsReturned[index][11].toString(),
                                                yearsOfTreasuryExperience : rowsReturned[index][12].toString(),
                                                // year_of_registration : rowsReturned[index][13],
                                                membershipRequestDate : rowsReturned[index][13].toString() + "T12:42:31Z",
                                                dateVerified : rowsReturned[index][13].toString() + "T12:42:31Z",
                                                approvalDate : rowsReturned[index][13].toString() + "T12:42:31Z",
                                                mobileNumber : rowsReturned[index][14].toString(),
                                                officeNumber : rowsReturned[index][15].toString(),
                                                registrationFeePaid : 1,
                                                verifierComment :  "good",
                                                verifierId : "adedejiabisola@gmail.com",
                                                hasBeenVerified : 1,
                                                approverComment : "approved",
                                                approverMemberId : "adedejiabisola@gmail.com",
                                                hasBeenApproved : 1,
                                                attestationComplete : 1,
                                                refereeMemberId : "AAD20"
                                              };


                                  // put into an array
                                  theParsedExcelFile.push(excel_row);
                          };

                          
                    }


                    console.log("theParsedExcelFile: ", theParsedExcelFile); 


                };
            }
        
        return res.render('fmda_admin/ind_member/ind_bulk_upload_display', { theParsedExcelFile : theParsedExcelFile, capabilityIds });
      } catch (error) {
        return resError(res, error);
      }
  }




  
  static async handle_submit_bulk_upload(req, res) {

    console.log(req.body.data);

    try {
      const { capabilityIds } = req.session;
      const bulkUploadMember = await submit_bulk_upload(req.body.data);

      console.log(bulkUploadMember);

      return res.send({"resilt":bulkUploadMember});
    } catch (error) {
      return resError(res, error);
    }
  }





}

export default Admin_ind_controller;
