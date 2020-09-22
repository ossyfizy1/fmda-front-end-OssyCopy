import { Query_utils } from '../utils';

const { getResponse } = Query_utils;

/**
*@class Admin_workGroup_queries
*@description class for sending graphql queries related to creation and management of FMDA events
*@exports Admin_workGroup_queries
*/

class Admin_workGroup_queries {
  /**
   * @name getAllEvents
   * @type graphl query
   * @description gets a list of all fmda events
   */
  static async validateWorkGroup(variables) {
    const query = {
      operationName: 'createWorkGroupMutation',
      query: 'mutation createWorkGroupMutation { createWorkGroup {statusCode message} }',
      variables,
      }

      const { createWorkGroup } = await getResponse(query);
      return createWorkGroup;
  };

  static async addmember(variables) {
    const query = {
      operationName: 'invitePaticipantMutation',
      query: 'mutation invitePaticipantMutation { invitePaticipant {statusCode message} }',
      variables,
      }

      const { createWorkGroup } = await getResponse(query);
      return createWorkGroup;
  };
  
  static async lookUpWorkGroup(memberId) {
    const query = {
      "query": `{ lookupMemberWorkGroups(memberUUID: \"${memberId}\") {id  name subject memberUUID isAdmin onboardingStatus dateJoined } }`
  }

      const { lookupMemberWorkGroups } = await getResponse(query);
      return lookupMemberWorkGroups;
  };

  static async listOfWorkGroups() {
    const query = {
      "query": "{ workGroupsLookup {id name subject dateCreated createdBy participants{memberUUID isAdmin onboardingStatus dateJoined } } }"
  }

      const { workGroupsLookup } = await getResponse(query);
      return workGroupsLookup;
  };
 
  static async  addParticipant(variables) {
    const query = {
      operationName: 'invitePaticipantMutation',
      query: 'mutation invitePaticipantMutation { invitePaticipant {statusCode message} }',
     variables,
  }

      const { invitePaticipant } = await getResponse(query);
      return invitePaticipant;
  };
  
}

export default Admin_workGroup_queries;
