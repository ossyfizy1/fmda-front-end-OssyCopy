import { Query_utils } from '../utils';

const { getResponse } = Query_utils;

/**
*@class Admin_corp_queries
*@description class for sending graphql queries related to fmda corporate members
*@exports Admin_corp_queries
*/

class Admin_corp_queries {
  /**
   * @name getCorporateRequests
   * @type graphl query
   * @description gets a list of all corporate membership requests 
   * @memberof Admin_corp_queries
   */
  static async getCorporateRequests() {
    const query = {
      query: '{ corporateRequests { id contactPersonName hasBeenVerified hasBeenApproved organisationName hasBeenCreated contactOfficialEmail organisationLetterOfRequest membershipRequestDate status registrationFeePaid objectionPeriodElapsed } }',
    };
    const { corporateRequests } = await getResponse(query);
    return corporateRequests;
  }

  /**
   * @name lookUpCpMember
   * @type graphl query
   * @description gets detailed information about a corporate member
   * @param { number } id
   * @memberof Admin_corp_queries
   */
  static async lookUpCpMember(id) {
    const query = { query: `{ lookupMember (userID: \"${id}\" userType: "Corporate") { statusCode corporate{id  objectionPeriodElapsed organisationAddress verifierComment registrationFeeVerificationDate objections{memberId reasons datePosted} organisationName organisationType treasuryOfficeAddress managingDirectorOrCEO treasurerEmail treasuryUnitPhoneNumber status hasBeenVerified bankers hasBeenApproved approvalComment dateApproved isEnabled isActive registrationFeePaid contactPersonName contactOfficialEmail contactPersonAddress contactPersonMobileNumber organisationLetterOfRequest membershipRequestDate lastLoginDate } } }` };
    const { lookupMember: { corporate } } = await getResponse(query);
    return corporate;
  }

  /**
   * @name createCpMember
   * @type graphl mutation
   * @description gets detailed information about a corporate member
   * @param { object } variables
   * @param { number } id
   * @memberof Admin_corp_queries
   */
  static async createCpMember(variables, id) {
    const query = {
      operationName: 'addCorporateMemberMutation',
      query: `mutation addCorporateMemberMutation { addCorporateMember(requestId: \"${id}\"){statusCode message} }`,
      variables,
    };
    const { addCorporateMember } = await getResponse(query);
    return addCorporateMember;
  }

  /**
   * @name createOrganisation
   * @type graphl mutation
   * @description create a new FMDA organisation attached to a specific corporate member
   * @param { object } variables
   * @memberof Admin_corp_queries
   */
  static async createOrganisation(variables) {
    const query = {
      operationName: 'addOrganisationMutation',
      query: 'mutation addOrganisationMutation { addOrganisation {statusCode message } }',
      variables,
    };
    const { addOrganisation } = await getResponse(query);
    return addOrganisation;
  }

  /**
   * @name verifyCpMember
   * @type graphl mutation
   * @description verifies a corporate member
   * @param { object } variables
   * @returns { object } verifyCorporateMember
   * @memberof Admin_corp_queries
   */
  static async verifyCpMember(variables) {
    // const query = {
    //   operationName: 'verifyCorporateMemberMutation',
    //   query: 'mutation verifyCorporateMemberMutation { verifyCorporateMember{statusCode message} }',
    //   variables,
    // };

    const query = {
      "operationName": "approveCoperateLetterMutation",
      "query": "mutation approveCoperateLetterMutation { approveCoperateLetter{statusCode message} }",
      "variables": {
          "userId": variables.userId,
          "verifierId": variables.verifierId,
          "verifierComment": variables.verifierComment,
          "verificationStatus": true
        
      }
    };

    console.log(query);

    const { approveCoperateLetter } = await getResponse(query);
    return approveCoperateLetter;
    // const { verifyCorporateMember } = await getResponse(query);
    // return verifyCorporateMember;
  }

  /**
   * @name getApproveCpRequests
   * @type graphl query
   * @description gets a list of all corporate members who have made
   * payment and are awaiting approval and objection period elasped
   * @returns { object } verifiedCorporateMembers
   * @memberof Admin_corp_queries
   */
  static async getApproveCpRequests() {
    const query = {
      "query": "{ corporateMemberObjection {id organisationName contactPersonName contactOfficialEmail contactPersonAddress contactPersonMobileNumber organisationLetterOfRequest membershipRequestDate hasBeenVerified hasBeenApproved objections {memberId reasons datePosted review { memberId reasons datePosted }}} }"
  };
    const { corporateMemberObjection } = await getResponse(query);
    console.log(corporateMemberObjection)
    return corporateMemberObjection;
  }

  /**
   * @name approveCpMember
   * @type graphl mutation
   * @description approves a corporate member
   * @param { object } variables
   * @returns { object } approveCorporateMember
   * @memberof Admin_corp_queries
   */
  static async approveCpMember(variables) {
    const query = {
      operationName: "approveCorporateMemberMutation",
      query: "mutation approveCorporateMemberMutation { approveCorporateMember{statusCode message} }",
      variables: {
                    "userId": variables.userId,
                    "approvalId": variables.approvalId,
                    "approvalStatus": variables.approvalStatus,
                    "ApprovalComment": variables.ApprovalComment
                  }
    };
    console.log(query);
    const { approveCorporateMember } = await getResponse(query);
    return approveCorporateMember;
  }

  /**
   * @name getApprovedCpMembers
   * @type graphl query
   * @description gets a list of all approved corporate members
   * @returns { array } getApprovedCpMembers
   * @memberof Admin_corp_queries
   */
  static async getApprovedCpMembers() {
    const query = {
      query: '{ corporateMembers{id  organisationName treasuryOfficeAddress managingDirectorOrCEO treasurerEmail organisationType treasuryUnitPhoneNumber bankers hasBeenApproved approvalComment approverId dateApproved isEnabled isActive registrationFeePaid contactPersonName contactOfficialEmail contactPersonAddress contactPersonMobileNumber organisationLetterOfRequest membershipRequestDate lastLoginDate } }',
    };
    const { corporateMembers } = await getResponse(query);
    return corporateMembers;
  }


  
  static async handle_push_for_review(newCorpRequestContactOfficialEmail, memberId, reason) {
    const query = {
      "operationName": "raiseDeliginceMutation",
      "query": `mutation raiseDeliginceMutation { raiseDeligince(userId: \"${newCorpRequestContactOfficialEmail}\", treasurerId: \"${memberId}\") {statusCode message} }`,
      "variables": {
          "reason": reason
          
      }
  };
    // console.log(query);

    const { raiseDeligince } = await getResponse(query);
    return raiseDeligince;
  }






}

export default Admin_corp_queries;
