import { Query_utils } from '../utils';

const { getResponse } = Query_utils;

/**
*@class admin_resource_management_queries
*@description class for sending graphql queries related to uploading documents to the upload section of the fmda project
*@exports admin_resource_management_queries
*/

class admin_resource_management_queries {

  /**
   * @name publishEvent
   * @type graphl mutation
   * @description Allows an admin to publish an already created event
   * @param { object } variables
   */
  static async createDirectory(variables, adminId) {
    const query = {
        operationName: 'createResourceDirectoryMutation',
        query: `mutation createResourceDirectoryMutation { createResourceDirectory(adminId: \"${adminId}\"){statusCode message} }`,
        variables,
    };
    const { createResourceDirectory } = await getResponse(query);
    return createResourceDirectory;
  };

   /**
   * @name getResources
   * @type graphl query
   * @description gets a list of all the resources
   * @returns { object } lookupdirectories
   * @memberof Admin_ind_queries
   */
  static async getResources() {
    const query = {
        "query":"{ lookupDirectories {id directoryName accessors description dateCreated createdBy}  }" 
      };
    const { lookupDirectories } = await getResponse(query);
    return lookupDirectories;
  };
  
     /**
   * @name addNewResource
   * @type graphl query
   * @description add a resource to a directory
   * @returns { object } uploadResource
   * @memberof Admin_ind_queries
   */

  static async addNewResource(variables, adminId) {
    const query = {
        operationName: 'uploadResourceMutation',
        query: `mutation uploadResourceMutation { uploadResource(adminId: \"${adminId}\"){statusCode message} }`,
        variables,
    };
    const { uploadResource } = await getResponse(query);
    return uploadResource;  

    };

    
    /**
   * @name getResources
   * @type graphl query
   * @description gets a list of all the resources
   * @returns { object } lookupdirectoriesResouces
   * @memberof Admin_ind_queries
   */
  static async searchResourceDetails(id) {
    const query = {
        "query": `{ lookupDirectoryResources(directoryId: \"${id}\") {id name url format directoryId accessors createdBy dateCreated}  }`
    };
    const { lookupDirectoryResources } = await getResponse(query);
    return lookupDirectoryResources;
  };

}
export default admin_resource_management_queries;
