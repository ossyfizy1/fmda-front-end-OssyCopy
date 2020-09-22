import { Router } from 'express';
import { Admin_controllers } from '../controllers';

const router = Router();

const {
  renderCreateAdminPage,
  renderCapabilitiesList,
  handleCreateAdmin,
  renderManageAdminPage,
  renderAdminDetailsPage,

  renderManageDeptPage,
  handleCreateDepartment,
  handleRemoveDepartment,

  renderManageRolePage,
  handleCreateRole,
  renderManageCapabilitiesPage,
  handleAddCapability,
  handleUpdateAdminCapability,

  renderAllCapabilitiesPage,
  handleCreateCapability,

  renderAddBankAccountPage,
  handleAddBankAccount,
  renderChangeAdminType,
  handleChangeAdminType,
  look_up_role_capabilities,
  handle_delete_admin,
  // renderManageBankAccountPage,
  // handleDeleteSingleBankAccount,
} = Admin_controllers;

// Admin Users
router.get('/create_admin', renderCreateAdminPage);
router.post('/get_apabilities_list', renderCapabilitiesList);
router.post('/create_admin', handleCreateAdmin);
router.get('/manage_admin', renderManageAdminPage);
router.get('/admin_details', renderAdminDetailsPage);
router.get('/change_admin_type', renderChangeAdminType);
router.post('/change_admin_type', handleChangeAdminType);
router.post('/lookup_role_capabilities', look_up_role_capabilities);
router.get('/delete_admin', handle_delete_admin);


// Departments
router.get('/departments/manage', renderManageDeptPage);
router.post('/departments/create', handleCreateDepartment);
router.get('/departments/remove', handleRemoveDepartment);

// Roles
router.get('/roles/manage_roles', renderManageRolePage);
router.post('/roles/add_role', handleCreateRole);
router.get('/roles/manage_capabilities', renderManageCapabilitiesPage);
router.post('/roles/add_capabilities/:roleId/:roleName', handleAddCapability);

// Capabilities
router.get('/capabilities/manage_capabilities', renderAllCapabilitiesPage);
router.post('/capabilities/add_capabilities', handleCreateCapability);
router.post('/capabilities/update_capabilities/:adminId', handleUpdateAdminCapability);

// Bank accounts
router.get('/bank_accounts/add', renderAddBankAccountPage);
router.post('/bank_accounts/add', handleAddBankAccount);
// router.get('/bank_accounts/manage', renderManageBankAccountPage);
// router.post('/banks/manage_bank_account', handleDeleteSingleBankAccount);

export default router;
