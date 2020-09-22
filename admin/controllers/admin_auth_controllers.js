import { Res_utils } from '../utils';
import { Admin_auth_queries, Admin_queries, General_queries } from '../queries';

const {
  resError, resPopupRedirect, resRedirect,
} = Res_utils;

const { adminLogin } = Admin_auth_queries;
const { changePassword } = Admin_queries;



/**
*@class Admin_auth_controller
*@description Controller for handling all the admin login methods
*@exports Admin_auth_controller
*/
class Admin_auth_controller {
  /**
   * @name renderLoginPage
   * @description renders the admin login page
   */
  static renderLoginPage(_req, res) {
    res.render('fmda_admin/auth/login');
  }

  /**
   * @name handleLogin
   * @description handles the admin login request
   */
  static async handleLogin(req, res) {

    console.log();

    try {
      const result = await adminLogin(req.body);
      const approvedIndMember = await General_queries.approvedIndMember();
      const approvedCorpMember = await General_queries.approvedCorpMember();
      const listOfAllEventsOnThePlatform = await General_queries.listOfAllEventsOnThePlatform();
      const listOfAllResourcesDirectories = await General_queries.listOfAllResourcesDirectories();
      // console.log(approvedIndMember);
      // console.log(approvedCorpMember);
      // console.log(listOfAllEventsOnThePlatform);
      // console.log(listOfAllResourcesDirectories);

      // put into session 
      req.session.approvedIndMemberLists = approvedIndMember;
      req.session.approvedCorpMembers = approvedCorpMember;
      req.session.listOfAllEventsOnThePlatform = listOfAllEventsOnThePlatform;
      req.session.listOfAllResourcesDirectories = listOfAllResourcesDirectories;


      // put the Admin Details into the session
      req.session.adminDetailsInSession = result;

      if (result.adminLogin.statusCode === 200) {
        const { capabilityIds, officialEmail } = result.adminLogin.data;
        req.session.capabilityIds = capabilityIds;
        req.session.officialEmail = officialEmail;
        return resRedirect(res, '/admin/dashboard');
      }
      return resPopupRedirect(res, result.adminLogin.message, '/admin/login');
    } catch (error) {
      return resError(res, error);
    }
  }


  /**
   * @name theAdminDetailsInSession
   * @description the Admin Details In Session
   */
  static theAdminDetailsInSession(req, res) {
    // console.log(req.body.getAminDetails);
    var theAdminDetailsInSession = req.session.adminDetailsInSession;
    // console.log(theAdminDetailsInSession.adminLogin.data.firstName);

    var fullname = theAdminDetailsInSession.adminLogin.data.firstName + " " + theAdminDetailsInSession.adminLogin.data.lastName;
    return res.send(fullname);
  }

  /**
   * @name handleLogout
   * @description handles the admin loout request
   */
  static async handleLogout(req, res) {
    try {
      req.session.destroy();
      return resRedirect(res, '/admin/login');
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name renderDashboard
   * @description renders the dashboard page
   */
  static async renderDashboard(req, res) {
    const { capabilityIds } = req.session;

    var approvedIndMember = req.session.approvedIndMemberLists;
    var approvedCorpMember = req.session.approvedCorpMembers;
    var listOfAllEventsOnThePlatform = req.session.listOfAllEventsOnThePlatform;
    var listOfAllResourcesDirectories = req.session.listOfAllResourcesDirectories;

    res.render('fmda_admin/auth/dashboard', { capabilityIds, approvedIndMember:approvedIndMember, approvedCorpMember:approvedCorpMember, listOfAllEventsOnThePlatform:listOfAllEventsOnThePlatform, listOfAllResourcesDirectories:listOfAllResourcesDirectories});
  }

  /**
   * @name renderChangePasswordPage
   * @description renders the page allowing an admin change his personal password
   */
  static async renderChangePasswordPage(req, res) {
    try {
      const { capabilityIds } = req.session;
      return res.render('fmda_admin/admin/change_password', { capabilityIds });
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * @name handleChangePassword (incomplete)
   * @description handles the changing of an admin's password
   */
  static async handleChangePassword(req, res) {
    try {
      const { newPassword, oldPassword } = req.body;
      const userID = req.session.officialEmail;

      // check the oldpassword is correct
      const result = await adminLogin({ userID, password: oldPassword });
      // if the password is wrong
      if (result.adminLogin.statusCode !== 200) {
        return resPopupRedirect(res, 'Wrong password', '/admin/change_password');
      }
      // else update the password
      const updatePassword = await changePassword({ userID, newPassword });
      if (updatePassword.statusCode === 200) {
        return resPopupRedirect(res, updatePassword.message, '/admin/change_password');
      }
      return resPopupRedirect(res, updatePassword.message, '/admin/change_password');
    } catch (error) {
      return resError(res, error);
    }
  }
}






export default Admin_auth_controller;
