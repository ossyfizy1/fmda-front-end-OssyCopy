import request from 'request';
import baseUrl from '../../baseUrl';

/**
*@class Query_utils
*@description Controller for handling all the admin login methods
*@exports Query_utils
*/
class Query_utils {
  /**
   * @name getResponse
   * @description renders the admin login page
   * @param { object } query
   * @memberof Query_utils
   */
  static getResponse(query) {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(query);
      const options = {
        method: 'POST',
        url: `${baseUrl.baseUrl}graphql`,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      };
      request(options, (error, _response, resBody) => {
        if (error) reject(error);
        resolve(JSON.parse(resBody));
      });
    });
  }
}

export default Query_utils;
