import { Query_utils } from '../utils';

const { getResponse } = Query_utils;

/**
*@class Admin_queries
*@description class for sending graphql queries related to creation and management of FMDA admins
*@exports Admin_queries
*/

class Admin_queries {
  /**
   * @name createNewAdmin
   * @type mutation
   * @description graphql mutation for creation of an FMDA admin
   * @param { object } variables
   */
  static async createNewAdmin(variables) {
    const query = {
      operationName: 'createAdminMutation',
      query: 'mutation createAdminMutation { createAdmin {statusCode message} }',
      variables,
    };
    const { createAdmin } = await getResponse(query);
    return createAdmin;
  }

  /**
   * @name changePassword
   * @type mutation
   * @description graphql mutation for creation of an FMDA admin
   * @param { object } variables
   */
  static async changePassword(variables) {
    const query = {
      operationName: 'updatePasswordMutation',
      query: 'mutation updatePasswordMutation { updatePassword {statusCode message} }',
      variables,
    };
    const { updatePassword } = await getResponse(query);
    return updatePassword;
  }

  /**
   * @name getAdmins
   * @type graphql query
   * @description gets the list of all FMDA admininstrators
   */
  static async getAdmins() {
    const query = { query: '{ administrators {id firstName lastName username gender type address department phoneNumber officialEmail password capabilityIds profilePhoto dateCreated isActive lastLoginDate } }' };
    const { administrators } = await getResponse(query);
    return administrators;
  }

  /**
   * @name getAdminDetails
   * @type graphql query
   * @description gets the list of all FMDA admininstrators
   */
  static async getAdminDetails(adminId) {
    const query = { query: `{ lookupAdmin(adminId: \"${adminId}\") {id firstName lastName username gender type address department phoneNumber officialEmail password capabilityIds profilePhoto dateCreated isActive lastLoginDate } }` };
    const { lookupAdmin } = await getResponse(query);
    return lookupAdmin;
  }



  /**
   * @name changeAdminRole
   * @type graphql query
   * @description change admin role
   */
  static async changeAdminRole(adminId, roleId, capabilityIds) {
    const query = {
                    "operationName": "updateAdminRoleMutation",
                    "query": "mutation updateAdminRoleMutation { updateAdminRole{statusCode message} }",
                    "variables": {
                                    "adminId": adminId,
                                    "roleId": roleId,
                                    "capabilityIds": capabilityIds
                                },
                };
    const { updateAdminRole } = await getResponse(query);
    return updateAdminRole;
  }



}

export default Admin_queries;
