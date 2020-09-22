import { Query_utils } from '../utils';

const { getResponse } = Query_utils;

/**
*@class Admin_ind_queries
*@description class for sending graphql queries related to fmda members
*@exports Admin_ind_queries
*/

class Admin_ind_queries {
  /**
   * @name getMembershipRequestsList
   * @type graphl query
   * @description gets a list of all membership on the system still undergoing onboarding
   * @returns { object } membershipRequests
   * @memberof Admin_ind_queries
   */
  static async getMembershipRequestsList() {
    const query = {
      "query": "{ membershipRequests {id memberUUID firstName lastName gender address memberType yearsOfPostNyscExperience yearsOfTreasuryExperience mobileNumber personalEmail membershipCategory industryType treasuryCertification industryCategory certificationType membershipRequestDate attestationComplete verifierComment currentOrganisation lastLoginDate qualifications {institutionName degreeOptained from to} employmentHistory {organisationName positionHeld startDate endDate responsibilities} } }"
  };
    const { membershipRequests } = await getResponse(query);
    return membershipRequests;
  }

  /**
   * @name getMembershipRequests
   * @type graphl query
   * @description gets a list of all membership requests
   * @returns { object } membershipRequests
   * @memberof Admin_ind_queries
   */
  static async getMembershipRequests() {
    const query = {
      query: '{ membershipVerificationRequest {id firstName personalEmail lastName hasBeenVerified hasBeenApproved memberType industryType industryCategory certificationType membershipRequestDate } }',
    };
    const { membershipVerificationRequest } = await getResponse(query);
    return membershipVerificationRequest;
  }

  /**
   * @name lookUpMember
   * @type graphl query
   * @description gets detailed information about a member
   * @param { number } userID the user id
   * @returns { object } member
   * @memberof Admin_ind_queries
   */
  static async lookUpMember(userID) {
    const query = { query: `{ lookupMember (userID: \"${userID}\" userType: "Member") { statusCode member{id memberUUID personalEmail firstName lastName personalEmail gender address memberType yearsOfPostNyscExperience yearsOfTreasuryExperience officeNumber mobileNumber officialEmail emailVerified memberType profilePhoto privilegeId role membershipCategory securityAnswer certificationType state treasuryCertification industryCategory memberType industryType membershipRequestDate attestationComplete securityQuestionId securityAnswer securityQuestionSet hasBeenVerified verifierId verifierComment dateVerified hasBeenApproved approverMemberId approverComment approvalDate refereeMemberId annualDuePaid registrationFeePaid isEnabled isActive  currentOrganisation currentOrganisationId proposedOrganisationName lastLoginDate qualifications {institutionName degreeOptained from to} employmentHistory {organisationName positionHeld startDate endDate responsibilities} } message } }` };
    const { lookupMember: { member } } = await getResponse(query);
    return member;
  }

  /**
   * @name verifyMemberMutation
   * @type graphl mutation
   * @description verifies a member
   * @param { object } variables
   * @returns { object } verifyMember
   * @memberof Admin_ind_queries
   */
  static async verifyMemberMutation(variables) {
    const query = {
      operationName: 'verifyMemberMutation',
      query: 'mutation verifyMemberMutation { verifyMember{statusCode message} }',
      variables,
    };
    const { verifyMember } = await getResponse(query);
    return verifyMember;
  }

  /**
   * @name addOrganisation
   * @type graphl mutation
   * @description adds an organisation
   * @param { object } variables
   * @returns { object } Add organisation for member query
   * @memberof Admin_ind_queries
   */
  static async addOrganisation(variables) {
    const query = {
      operationName: 'addOrganisationForMemberMutation',
      query: 'mutation addOrganisationForMemberMutation { addOrganisationForMember {statusCode message } }',
      variables,
    };
    const { addOrganisationForMember } = await getResponse(query);
    return addOrganisationForMember;
  }

  /**
   * @name getMemberApproveRequests
   * @type graphl query
   * @description gets a list of all members who have made
   * payment and are awaiting approval
   * @returns { object } verifiedMembers
   * @memberof Admin_ind_queries
   */
  static async getMemberApproveRequests() {
    const query = {
      query: '{ verifiedMembers {id firstName personalEmail hasBeenVerified hasBeenApproved lastName memberType industryType industryCategory certificationType membershipRequestDate }  }',
    };
    const { verifiedMembers } = await getResponse(query);
    return verifiedMembers;
  }

  /**
   * @name approveMemberMutation
   * @type graphl mutation
   * @description approves a corporate member
   * @param { object } variables
   * @returns { object } approveMember
   * @memberof Admin_ind_queries
   */
  static async approveMemberMutation(variables) {
    const query = {
      operationName: 'approveMemberMutation',
      query: 'mutation approveMemberMutation { approveMember{statusCode message} }',
      variables,
    };
    const { approveMember } = await getResponse(query);
    return approveMember;
  }

  /**
   * @name getApprovedMembers
   * @type graphl query
   * @description gets a list of all approved individual members
   * @returns { array } getApprovedIndMembers
   * @memberof Admin_ind_queries
   */
  static async getApprovedMembers() {
    const query = {
      query: '{ members {id memberUUID firstName lastName gender address memberType yearsOfPostNyscExperience yearsOfTreasuryExperience officeNumber mobileNumber personalEmail officialEmail emailVerified memberType profilePhoto privilegeId role membershipCategory securityAnswer certificationType treasuryCertification industryCategory memberType industryType membershipRequestDate attestationComplete securityQuestionId securityAnswer securityQuestionSet hasBeenVerified verifierId verifierComment dateVerified hasBeenApproved approverMemberId approverComment approvalDate refereeMemberId annualDuePaid registrationFeePaid isEnabled isActive  currentOrganisation currentOrganisationId proposedOrganisationName lastLoginDate qualifications {institutionName degreeOptained from to} employmentHistory {organisationName positionHeld startDate endDate responsibilities}  } }',
    };
    const { members } = await getResponse(query);
    // console.log(members);
    return members;
  }



  /**
   * @name disable_or_enable_member
   * @type graphl query
   * @description disable or enable a member
   * @returns { array } disable_or_enable_member
   * @memberof Admin_ind_queries
   */
  static async disable_or_enable_member(memberUUID, status) {
    const query = {
      "operationName": "changeMemberStatusMutation",
      "query": `mutation changeMemberStatusMutation { changeMemberStatus(memberUUID: \"${memberUUID}\", status: ${status}){statusCode message} }`
  };
    const { changeMemberStatus } = await getResponse(query);
    // console.log(changeMemberStatus);
    return changeMemberStatus;
  }



  
  static async submit_bulk_upload(bulkUpload) {
    const query = 
      { "operationName": "bulkUploadMemberMutation",
        "query": "mutation bulkUploadMemberMutation { bulkUploadMember{statusCode userMessage {message email} } }",
        "variables": { "members": JSON.parse(bulkUpload) }
      };

    console.log(JSON.stringify(query));

    const { bulkUploadMember } = await getResponse(query);
    // console.log(bulkUploadMember);
    return bulkUploadMember;
  }




}

export default Admin_ind_queries;
