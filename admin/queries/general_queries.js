import { Query_utils } from '../utils';

const { getResponse } = Query_utils;

/**
*@class General_queries
*@description class for sending general graphql queries
*@exports General_queries
*/

class General_queries {
  /**
   * @name getDepartments
   * @type graphql query
   * @description gets the list of all FMDA departments
   * @memberof General_queries
   */
  static async getDepartments() {
    const query = { query: '{ departments {id name } }' };
    const { departments } = await getResponse(query);
    return departments;
  }

  /**
   * @name createDepartment
   * @type graphql query
   * @description adds a new fmda department
   * @memberof General_queries
   */
  static async createDepartment(name) {
    const query = {
      operationName: 'addDepartmentMutation',
      query: `mutation addDepartmentMutation{ addDepartment(name: \"${name}\"){statusCode message} }`,
    };
    const { addDepartment } = await getResponse(query);
    return addDepartment;
  }

  /**
   * @name removeDepartment
   * @type graphql query
   * @description adds a new fmda department
   * @memberof General_queries
   */
  static async deleteDepartment(departmentId) {
    const query = {
      operationName: 'removeDepartmentMutation',
      query: `mutation removeDepartmentMutation { removeDepartment(departmentId: \"${departmentId}\") {statusCode message } }`,
    };
    const { removeDepartment } = await getResponse(query);
    return removeDepartment;
  }

  /**
   * @name getRoles
   * @type graphql query
   * @description gets the list of all FMDA Admin Roles
   * @memberof General_queries
   */
  static async getRoles() {
    const query = { query: '{ lookUpRoles {id, name} }' };
    const { lookUpRoles } = await getResponse(query);
    return lookUpRoles;
  }

  /**
   * @name createRole
   * @type graphql query
   * @description create a new fmda role
   * @memberof General_queries
   */
  static async createRole(variables) {
    const query = {
      operationName: 'addRoleMutation',
      query: 'mutation addRoleMutation { addRole{statusCode message} }',
      variables,
    };
    const { addRole } = await getResponse(query);
    return addRole;
  }

  /**
   * @name assignRole
   * @type graphql query
   * @description add a new capability to an existing fmda role
   * @memberof General_queries
   */
  static async assignRole(variables) {
    const query = {
      operationName: 'addCapabilitiesToRoleMutation',
      query: 'mutation addCapabilitiesToRoleMutation { addCapabilitiesToRole { statusCode message } }',
      variables,
    };
    const { addCapabilitiesToRole } = await getResponse(query);
    return addCapabilitiesToRole;
  }

  /**
   * @name getCapabilities
   * @type graphql query
   * @description gets the list of all capabilities for a given FMDA role
   * @memberof General_queries
   */
  static async getCapabilities(roleId) {
    const query = { query: `{ lookUpRoleCapabilities(roleId:\"${roleId}\"){ capabilityId capability id} }` };
    const { lookUpRoleCapabilities } = await getResponse(query);
    return lookUpRoleCapabilities;
  }

  /**
   * @name getAllCapabilities
   * @type graphql query
   * @description gets the list of all capabilities that have been created (assigned or unassigned)
   * @memberof General_queries
   */
  static async getAllCapabilities() {
    const query = { query: '{ capabilities {id capability capabilityId } }' };
    const { capabilities } = await getResponse(query);
    return capabilities;
  }

  /**
   * @name createCapability
   * @type graphql query
   * @description creates a new capability
   * @memberof General_queries
   */
  static async createCapability({ name }) {
    const query = {
      operationName: 'addCapabilityMutation',
      query: `mutation addCapabilityMutation { addCapability(name:\"${name}\") {statusCode message} }`,
    };
    const { addCapability } = await getResponse(query);
    return addCapability;
  }

  /**
   * @name getOrganisations
   * @type graphql query
   * @description gets the list of all registered organisations with or without attached members
   * @memberof General_queries
   */
  static async getOrganisations() {
    const query = { query: '{ organisations {id organisationName membershipId} }' };
    const { organisations } = await getResponse(query);
    return organisations;
  }

  /**
   * @name getFinancialInstitutions
   * @type graphql query
   * @description gets the list of all Financial Institutions
   * @memberof General_queries
   */
  static async getFinancialInstitutions() {
    const query = { query: '{ financialInstitutions {id name type country countryCode } }' };
    const { financialInstitutions } = await getResponse(query);
    return financialInstitutions;
  }

  /**
   * @name getMemberTypes
   * @type graphql query
   * @description gets the list of all the member types
   * @memberof General_queries
   */
  static async getMemberTypes() {
    const query = { query: '{ memberTypes {id type}  }' };
    const { memberTypes } = await getResponse(query);
    return memberTypes;
  }

  /**
   * @name getMemberCategories
   * @type graphql query
   * @description gets the list of all the fmda member categories
   * @memberof General_queries
   */
  static async getMemberCategories() {
    const query = { query: '{ membershipCategories {id category annualDue } }' };
    const { membershipCategories } = await getResponse(query);
    return membershipCategories;
  }

  /**
   * @name getGenders
   * @type graphql query
   * @description gets the list of all FMDA Admin Roles
   * @memberof General_queries
   */
  static async getGenders() {
    const query = { query: '{ gender { name } }' };
    const { gender } = await getResponse(query);
    return gender;
  }

  /**
   * @name addBankAccount
   * @type graphql mutation
   * @description add a new fmda bank account
   * @memberof General_queries
   */
  static async addBankAccounts(variables) {
    const query = {
      operationName: 'addBankAccountMutation',
      query: 'mutation addBankAccountMutation { addBankAccount {statusCode message } }',
      variables,
    };
    const { addBankAccount } = await getResponse(query);
    return addBankAccount;
  }

  /**
   * @name updateCapabilities
   * @type graphql mutation
   * @description updates capabilities for a specific admin
   */
  static async updateCapabilities(variables) {
    const query = {
      operationName: 'updateAdminCapabilitiesMutation',
      query: 'mutation updateAdminCapabilitiesMutation { updateAdminCapabilities{statusCode message} }',
      variables,
    };
    const { updateAdminCapabilities } = await getResponse(query);
    return updateAdminCapabilities;
  }



  /**
   * @name getCapabilitiesByRoleId
   * @type graphql mutation
   * @description get capabilities by role type ID
   */
  static async getCapabilitiesByRoleId(roleId) {
    const query = {
      "query": `{ lookUpRoleCapabilities(roleId:\"${roleId}\"){ capabilityId capability id} }`
    };
    const { lookUpRoleCapabilities } = await getResponse(query);
    return lookUpRoleCapabilities;
  }



  /**
   * @name deleteAnAdmin
   * @type graphql mutation
   * @description delete admin via admin id
   */
  static async deleteAnAdmin(adminId) {
    const query = {
      "operationName": "deleteAdminMutation",
      "query": `mutation deleteAdminMutation { deleteAdmin(adminId: \"${adminId}\"){statusCode message} }`
    };
    const { deleteAdmin } = await getResponse(query);
    return deleteAdmin;
  }



  static async approvedIndMember() {
    const query = {
      "query": "{ members {id memberUUID firstName lastName gender address memberType yearsOfPostNyscExperience yearsOfTreasuryExperience officeNumber mobileNumber personalEmail officialEmail emailVerified memberType profilePhoto privilegeId role membershipCategory securityAnswer certificationType treasuryCertification industryCategory memberType industryType membershipRequestDate attestationComplete securityQuestionId securityAnswer securityQuestionSet hasBeenVerified verifierId verifierComment dateVerified hasBeenApproved approverMemberId approverComment approvalDate refereeMemberId annualDuePaid registrationFeePaid isEnabled isActive  currentOrganisation currentOrganisationId proposedOrganisationName lastLoginDate qualifications {institutionName degreeOptained from to} employmentHistory {organisationName positionHeld startDate endDate responsibilities}  } }"
    };
    const { members } = await getResponse(query);
    return members;
  }



  static async approvedCorpMember() {
    const query = {
      "query": "{ corporateMembers {id  organisationName treasuryOfficeAddress managingDirectorOrCEO treasurerEmail organisationType treasuryUnitPhoneNumber bankers hasBeenApproved approvalComment approverId dateApproved isEnabled isActive registrationFeePaid contactPersonName contactOfficialEmail contactPersonAddress contactPersonMobileNumber organisationLetterOfRequest membershipRequestDate lastLoginDate} }"
    };
    const { corporateMembers } = await getResponse(query);
    return corporateMembers;
  }



  static async listOfAllEventsOnThePlatform() {
    const query = {
      "query": "{ events {id title images startDate endDate eventTime type description participantCategory obtainablePoints{pointName pointValue} discounts{discountName percentage} datePosted eventUploaderId flatFee feeType customFee{name amount} isFree hasDiscount hasPoints maxNumberOfPaticipants requiresAttendeeConfirmation status} }"
    };
    const { events } = await getResponse(query);
    return events;
  }

  static async listOfAllResourcesDirectories() {
    const query = {
      "query":"{ lookupDirectories {id directoryName accessors description dateCreated createdBy}  }"
    };
    const { lookupDirectories } = await getResponse(query);
    return lookupDirectories;
  }

  



}

export default General_queries;
