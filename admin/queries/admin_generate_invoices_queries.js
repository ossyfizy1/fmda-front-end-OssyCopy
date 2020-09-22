import { Query_utils } from '../utils';

const { getResponse } = Query_utils;

/**
*@class admin_generate_invoices_queries
*@description class for sending graphql queries related to creation and management of FMDA events
*@exports admin_generate_invoices_queries
*/

class admin_generate_invoices_queries {
  /**
   * @name annualInvoice
   */
  static async annualInvoice_ind(memberUUID) {
    const query = {
        "operationName": "generateMemberAnnualFeeInvoiceMutation",
        "query": `mutation generateMemberAnnualFeeInvoiceMutation { generateMemberAnnualFeeInvoice(memberUUID:\"${memberUUID}\"){statusCode message} }`
    };
    const { generateMemberAnnualFeeInvoice } = await getResponse(query);
    return generateMemberAnnualFeeInvoice;
  }

  static async annualInvoice_corp(email) {
    const query = {
        "operationName": "generateCorporateMemberAnnualFeeInvoiceMutation",
        "query": `mutation generateCorporateMemberAnnualFeeInvoiceMutation { generateCorporateMemberAnnualFeeInvoice(userId:\"${email}\"){statusCode message} }`
    };
    const { generateCorporateMemberAnnualFeeInvoice } = await getResponse(query);
    return generateCorporateMemberAnnualFeeInvoice;
  }


  

}

export default admin_generate_invoices_queries;
