import { Query_utils } from '../utils';

const { getResponse } = Query_utils;

/**
*@class Admin_auth_queries
*@description class for sending graphql queries related to admin authenthication
*@exports Admin_auth_queries
*/

class Admin_auth_queries {
  /**
   * @name adminLogin
   * @type mutation
   * @description sends a login mutation to the server
   * @param { object } variables
   * @memberof Admin_auth_queries
   */
  static async adminLogin(variables) {
    const query = {
      operationName: 'adminLoginMutation',
      query: 'mutation adminLoginMutation { adminLogin { statusCode, message data{firstName, capabilityIds, officialEmail, lastName, department, username, type} } }',
      variables,
    };
    const result = await getResponse(query);
    return result;
  }



  
}

export default Admin_auth_queries;
