import { Query_utils } from '../utils';

const { getResponse } = Query_utils;

/**
*@class Admin_dealers_queries
*@description class for sending graphql queries related to creation and management of FMDA events
*@exports Admin_dealers_queries
*/

class Admin_dealers_queries {
  /**
   * @name newDealersRequest
   */
  static async newDealersRequest() {
    const query = {
      query: '{ pendingDealerRequests(status: 3) {id fullName email designation desk bank isPublished publisherID datePublished dateRequested}  }',
    };
    const { pendingDealerRequests } = await getResponse(query);
    return pendingDealerRequests;
  }

  /**
   * @name handleNewDealers
   */
  static async handleNewDealers(requestId, adminId, status) {
    const query = {
        "operationName": "publishNewDealerMutation",
        "query": `mutation publishNewDealerMutation { publishNewDealer(requestId:\"${requestId}\", adminId:\"${adminId}\", status: ${status}) {statusCode message} }`
      };
    const { publishNewDealer } = await getResponse(query);
    return publishNewDealer;
  }

  

}

export default Admin_dealers_queries;
