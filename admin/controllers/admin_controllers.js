import { Res_utils } from '../utils';
import { Admin_queries, General_queries } from '../queries';

const {
  resError,
  resPopupRedirect,
  resRedirect,
} = Res_utils;

const {
  createNewAdmin,
  getAdmins,
  getAdminDetails,
  changeAdminRole,
} = Admin_queries;

const {
  getDepartments,
  getRoles,
  createRole,
  getCapabilities,
  updateCapabilities,
  createDepartment,
  assignRole,
  getAllCapabilities,
  createCapability,
  getGenders,
  getFinancialInstitutions,
  addBankAccounts,
  deleteDepartment,
  getCapabilitiesByRoleId,
  deleteAnAdmin,
} = General_queries;

/**
*@class Admin_controller
*@description Controller for handling admin management requests
*@exports Admin_controller
*/
class Admin_controller {
  /**
   * @name renderCreateAdminPage
   * @description renders the admin login page
   */
  static async renderCreateAdminPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const [departments, lookUpRoles, gender] = await Promise.all([
        getDepartments(),
        getRoles(),
        getGenders(),
      ]);
      return res.render('fmda_admin/admin/create_admin', {
        capabilityIds, departments, lookUpRoles, gender,
      });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderCapabilitiesList
   * @description renders a section containing the capabilites list for a given FMDA role
   */
  static async renderCapabilitiesList(req, res) {
    try {
      const { id } = req.body;
      const lookUpCapabilities = await getCapabilities(id);
      return res.render('fmda_admin/includes/snippets/capabilities', { data: lookUpCapabilities });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleCreateAdmin
   * @description handles the admin login request
   */
  static async handleCreateAdmin(req, res) {
    try {
      let { capabilityIds } = req.body;
      (() => {
        if (!capabilityIds) capabilityIds = [];
        capabilityIds = capabilityIds.map((elem) => (+elem));
      })();

      // console.log(req.body);
      var newPropertyWithPassword = req.body;

      // add a new field to the object
      var randomGeneratedPassword = Math.random().toString(13).replace('0.', '');
      newPropertyWithPassword["password"] = randomGeneratedPassword;

      // console.log(newPropertyWithPassword);

      const variables = {
        ...newPropertyWithPassword,
        capabilityIds,
      };
      const createAdmin = await createNewAdmin(variables);
      if (createAdmin.statusCode === 200) {
        return resRedirect(res, '/admin/dashboard');
      }
      return resPopupRedirect(res, createAdmin.message, '/admin/create_admin');
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderManageAdminPage
   * @description renders a page showing all the fmda admins
   */
  static async renderManageAdminPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const administrators = await getAdmins();
      return res.render('fmda_admin/admin/manage_admin', { capabilityIds, administrators });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderAdminDetailsPage
   * @description renders a page showing the details of an FMDA admin
   */
  static async renderAdminDetailsPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const { adminId } = req.query;
      const admin = await getAdminDetails(adminId);
      const lookUpRoles = await getRoles();
      let adminRoleId;
      lookUpRoles.forEach((item) => {
        if (item.name === admin.type) adminRoleId = item.id;
      });
      const lookUpCapabilities = await getCapabilities(adminRoleId);
      return res.render('fmda_admin/admin/admin_details', { capabilityIds, lookUpCapabilities, admin });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderManageDeptPage
   * @description renders a page showing all the departments
   */
  static async renderManageDeptPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const departments = await getDepartments();
      return res.render('fmda_admin/admin/manage_departments', { capabilityIds, departments });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleCreateDepartment
   * @description handles the creation of a new fmda department
   */
  static async handleCreateDepartment(req, res) {
    try {
      const addDepartment = await createDepartment(req.body.name);
      if (addDepartment.statusCode === 200) {
        return resPopupRedirect(res, addDepartment.message, '/admin/departments/manage');
      }
      return resPopupRedirect(res, addDepartment.message, '/admin/departments/manage');
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleRemoveDepartment
   * @description handles the creation of a new fmda department
   */
  static async handleRemoveDepartment(req, res) {
    try {
      const removeDepartment = await deleteDepartment(req.query.departmentId);
      if (removeDepartment.statusCode === 200) {
        return resPopupRedirect(res, removeDepartment.message, '/admin/departments/manage');
      }
      return resPopupRedirect(res, removeDepartment.message, '/admin/departments/manage');
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderManageRolePage
   * @description renders a page showing all the fmda roles and option to create a new role
   */
  static async renderManageRolePage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const lookUpRoles = await getRoles();
      return res.render('fmda_admin/admin/manage_roles', { capabilityIds, lookUpRoles });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleCreateRole
   * @description handles the creation of a new fmda role
   */
  static async handleCreateRole(req, res) {
    try {
      const addRole = await createRole(req.body);
      if (addRole.statusCode === 200) {
        return resPopupRedirect(res, addRole.message, '/admin/roles/manage_roles');
      }
      return resPopupRedirect(res, addRole.message, '/admin/roles/manage_roles');
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderManageCapabilitiesPage
   * @description renders a page showing all the capabilities for a given role and options to add
   */
  static async renderManageCapabilitiesPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const { roleId, roleName } = req.query;
      const [lookUpRoleCapabilities, capabilities] = await Promise.all([
        getCapabilities(roleId),
        getAllCapabilities(),
      ]);
      return res.render('fmda_admin/admin/manage_role_capabilities ', {
        lookUpRoleCapabilities, roleName, roleId, capabilities, capabilityIds,
      });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleAddCapability
   * @description handles the addition of a new capability to an admin
   */
  static async handleAddCapability(req, res) {
    try {
      const { roleId, roleName } = req.params;
      const { capabilityIds } = req.body;
      const variables = {
        roleId,
        // convert the list of capabilityIds to an array if it is not already
        capabilityIds: typeof capabilityIds === 'string' ? [capabilityIds] : [...capabilityIds],
      };
      const addCapabilitiesToRole = await assignRole(variables);
      if (addCapabilitiesToRole.statusCode === 200) {
        return resPopupRedirect(res, addCapabilitiesToRole.message, `/admin/roles/manage_capabilities?roleId=${roleId}&roleName=${roleName}`);
      }
      return resPopupRedirect(res, addCapabilitiesToRole.message, `/admin/roles/manage_capabilities?roleId=${roleId}&roleName=${roleName}`);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleUpdateAdminCapability
   * @description handles the addition of a new capability to a specific admin
   */
  static async handleUpdateAdminCapability(req, res) {
    try {
      const { adminId } = req.params;
      const { capabilityIds } = req.body;
      const numifyArray = (arr) => [...arr].map((item) => +item);
      const variables = {
        adminId,
        // convert the list of capabilityIds to an array if it is not already
        capabilityIds: typeof capabilityIds === 'string' ? [capabilityIds] : numifyArray(capabilityIds),
      };
      const updateAdminCapabilities = await updateCapabilities(variables);
      if (updateAdminCapabilities.statusCode === 200) {
        return resPopupRedirect(res, updateAdminCapabilities.message, `/admin/admin_details?adminId=${adminId}`);
      }
      return resPopupRedirect(res, updateAdminCapabilities.message, `/admin/admin_details?adminId=${adminId}`);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderManageCapabilityPage
   * @description renders a page showing all the capabilities available
   */
  static async renderAllCapabilitiesPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const capabilities = await getAllCapabilities();
      return res.render('fmda_admin/admin/manage_capabilities', { capabilityIds, capabilities });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleCreateCapability
   * @description handles the creation of a new fmda role
   */
  static async handleCreateCapability(req, res) {
    try {
      const addCapabilityMutation = await createCapability(req.body);
      if (addCapabilityMutation.statusCode === 200) {
        return resPopupRedirect(res, addCapabilityMutation.message, '/admin/capabilities/manage_capabilities');
      }
      return resPopupRedirect(res, addCapabilityMutation.message, '/admin/capabilities/manage_capabilities');
    } catch (error) {
      return resError(res, error);
    }
  }


  /**
   * @name renderAddBankAccountPage
   * @description renders a page that allows an admin add a new bank account
   */
  static async renderAddBankAccountPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      const financialInstitutions = await getFinancialInstitutions();
      return res.render('fmda_admin/admin/create_bank_account', { capabilityIds, financialInstitutions });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleAddBankAccount
   * @description handles the addition of a new bank account
   */
  static async handleAddBankAccount(req, res) {
    try {
      const {
        bank, accountName, accountNumber, type,
      } = req.body;
      const accounts = [];
      // if only a single account was sent, create the object and put it in the array
      if (typeof accountName === 'string') {
        accounts.push({ accountName, accountNumber, type });
      } else {
        accountName.forEach((item, i) => {
          accounts.push({
            accountName: item,
            accountNumber: accountNumber[i],
            type: type[i],
          });
        });
      }

      const variables = { bank, accounts };
      const addBankAccount = await addBankAccounts(variables);

      if (addBankAccount.statusCode === 200) {
        return resPopupRedirect(res, addBankAccount.message, '/admin/bank_accounts/add');
      }
      return resPopupRedirect(res, addBankAccount.message, '/admin/bank_accounts/add');
    } catch (error) {
      return resError(res, error);
    }
  }




  /**
   * @name renderChangeAdminType
   * @description renders a page that allows an admin to change admin role & capabilities
   */
  static async renderChangeAdminType(req, res) {

    var fullname = req.query.fullname;
    var roleType = req.query.roleType; // admin initial role type
    var adminId_to_change = req.query.adminId; // email of adminId_to_change

    var lookUpRoles = [];

    try {
      const { capabilityIds } = req.session;
      const look_up_roles = await getRoles();
      const capabilities = await getAllCapabilities();

      // get other roles excludig admin initial role
      for (let index = 0; index < look_up_roles.length; index++) {
        if (look_up_roles[index].name != roleType) {
            lookUpRoles.push(look_up_roles[index]);
        }        
      }
      return res.render('fmda_admin/admin/change_admin_type', { capabilityIds, adminId_to_change, fullname, roleType, lookUpRoles, capabilities });
    } catch (error) {
      return resError(res, error);
    }
  }




   /**
   * @name look_up_role_capabilities
   * @description get the capabilities attached to specified roles
   */
  static async look_up_role_capabilities(req, res) {

    const roleId = req.body.roleId;

    try {
      const lookUpRoleCapabilities = await getCapabilitiesByRoleId(roleId);
      return res.send(lookUpRoleCapabilities);
    } catch (error) {
      return resError(res, error);
    }

  }


  

  /**
   * @name handleChangeAdminType
   * @description handles the functionality to change admin role & capabilities
   */
  static async handleChangeAdminType(req, res) {
    var adminId = req.body.adminId_to_change;
    var roleId = req.body.roleId;
    var capabilityIds = [];
    // console.log("type of: ", typeof(req.body.capabilityIds));
    if (typeof(req.body.capabilityIds) == "string") {
            capabilityIds.push(parseInt(req.body.capabilityIds));
    } else if(typeof(req.body.capabilityIds) == "object") {
            var capabilityId_gotten = req.body.capabilityIds;
            capabilityId_gotten.forEach(element => {
                capabilityIds.push(parseInt(element));
            });
    }
    try {
          const updateAdminRole = await changeAdminRole(adminId, roleId, capabilityIds);
          if (updateAdminRole.statusCode === 200) {
              return resPopupRedirect(res, updateAdminRole.message, '/admin/manage_admin');
          }
          return resPopupRedirect(res, updateAdminRole.message, '/admin/manage_admin');
      } catch (error) {
          return resError(res, error);
      }
  }




  /**
   * @name handle_delete_admin
   * @description delete an admin
   */
  static async handle_delete_admin(req, res) {
    var admin_id_to_delete = req.query.adminId;
    try {
      const deleteAdmin = await deleteAnAdmin(admin_id_to_delete);
      if (deleteAdmin.statusCode === 200) {
        return resPopupRedirect(res, deleteAdmin.message, '/admin/manage_admin');
      }
      return resPopupRedirect(res, deleteAdmin.message, '/admin/manage_admin');
    } catch (error) {
      return resError(res, error);
    }
  }




}

export default Admin_controller;
